import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, AlertTriangle, Clock, CheckCircle, XCircle, Calendar, Filter, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

export function ExpiryTracker() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBank, setSelectedBank] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedFileType, setSelectedFileType] = useState('all');
  const [expiryData, setExpiryData] = useState([]);

  // Load data from Bank Files localStorage on component mount
  useEffect(() => {
    const loadBankFilesData = () => {
      try {
        const savedBankFiles = localStorage.getItem('bankFiles');
        if (savedBankFiles) {
          const bankFilesData = JSON.parse(savedBankFiles);
          
          // Transform Bank Files data to Expiry Tracker format
          const transformedData = bankFilesData.map((file, index) => {
            // Calculate days left until expiry
            let daysLeft = 0;
            let status = 'Active';
            
            if (file.expiryDate) {
              const expiryDate = new Date(file.expiryDate);
              const today = new Date();
              const timeDiff = expiryDate.getTime() - today.getTime();
              daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
              
              // Determine status based on days left
              if (daysLeft < 0) {
                status = 'Expired';
              } else if (daysLeft <= 30) {
                status = 'Expiring Soon';
              } else {
                status = 'Active';
              }
            }
            
            return {
              id: index + 1,
              bank: file.bank || '',
              fileType: file.productType || '',
              fileNo: file.fileNo || '',
              clientName: file.clientName || '',
              clientId: file.clientId || '',
              agent: file.assignedAgent || file.agent || '',
              allegationDate: file.allegationDate || '',
              expiryDate: file.expiryDate || '',
              daysLeft: daysLeft,
              status: status,
              outstanding: file.outstanding || 0,
              lastAction: file.lastVisit || ''
            };
          });
          
          setExpiryData(transformedData);
        } else {
          // If no bank files data exists, show empty array
          setExpiryData([]);
        }
      } catch (error) {
        console.error('Error loading bank files data:', error);
        // If there's an error, show empty array
        setExpiryData([]);
      }
    };
    
    loadBankFilesData();
    
    // Listen for changes to localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'bankFiles') {
        loadBankFilesData();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const summaryStats = {
    total: expiryData.length,
    active: expiryData.filter(item => item.status === 'Active').length,
    expiringSoon: expiryData.filter(item => item.status === 'Expiring Soon').length,
    expired: expiryData.filter(item => item.status === 'Expired').length,
    totalOverdue: expiryData
      .filter(item => item.status === 'Expired' || item.daysLeft < 0)
      .reduce((sum, item) => sum + item.outstanding, 0)
  };

  const filteredData = expiryData.filter(item => {
    const matchesSearch = item.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.fileNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.clientId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBank = selectedBank === 'all' || item.bank === selectedBank;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const matchesFileType = selectedFileType === 'all' || item.fileType === selectedFileType;
    
    return matchesSearch && matchesBank && matchesStatus && matchesFileType;
  });

  // Export to Excel function
  const exportToExcel = () => {
    // Prepare data for export
    const exportData = filteredData.map(item => ({
      'File No': item.fileNo,
      'Client Name': item.clientName,
      'Client ID': item.clientId,
      'Bank': item.bank,
      'File Type': item.fileType,
      'Agent': item.agent,
      'Allegation Date': item.allegationDate,
      'Expiry Date': item.expiryDate,
      'Days Left': item.daysLeft,
      'Status': item.status,
      'Outstanding Amount': item.outstanding,
      'Last Action': item.lastAction
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Expiry Tracker');
    
    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    const filename = `expiry-tracker-${date}.xlsx`;
    
    // Export to Excel file
    XLSX.writeFile(workbook, filename);
  };

  const getStatusBadge = (status: string, daysLeft: number) => {
    if (status === 'Expired' || daysLeft < 0) {
      return <Badge variant="destructive" className="flex items-center gap-1">
        <XCircle className="h-3 w-3" />
        Expired
      </Badge>;
    }
    if (status === 'Expiring Soon' || daysLeft <= 30) {
      return <Badge className="bg-orange-100 text-orange-800 flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" />
        Expiring Soon
      </Badge>;
    }
    return <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
      <CheckCircle className="h-3 w-3" />
      Active
    </Badge>;
  };

  const getDaysLeftColor = (daysLeft: number) => {
    if (daysLeft < 0) return 'text-red-600 font-semibold';
    if (daysLeft <= 7) return 'text-red-500 font-semibold';
    if (daysLeft <= 30) return 'text-orange-500 font-medium';
    return 'text-green-600';
  };

  const formatDaysLeft = (daysLeft: number) => {
    if (daysLeft < 0) return `${Math.abs(daysLeft)} days overdue`;
    if (daysLeft === 0) return 'Expires today';
    return `${daysLeft} days left`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Expiry Tracker</h1>
          <p className="text-gray-600 mt-1">Monitor file expiry dates and take timely action</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="border-0 shadow-lg">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600" />
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-100">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Total Files</h3>
            </div>
            <span className="text-2xl font-bold text-gray-900">{summaryStats.total}</span>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <div className="h-2 bg-gradient-to-r from-green-500 to-green-600" />
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Active Files</h3>
            </div>
            <span className="text-2xl font-bold text-gray-900">{summaryStats.active}</span>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-600" />
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-orange-100">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Expiring Soon</h3>
            </div>
            <span className="text-2xl font-bold text-gray-900">{summaryStats.expiringSoon}</span>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <div className="h-2 bg-gradient-to-r from-red-500 to-red-600" />
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-red-100">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Expired Files</h3>
            </div>
            <span className="text-2xl font-bold text-gray-900">{summaryStats.expired}</span>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-600" />
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-100">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Total Overdue</h3>
            </div>
            <span className="text-xl font-bold text-gray-900">৳{summaryStats.totalOverdue.toLocaleString()}</span>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Export */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by client name, file no, or client ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedBank} onValueChange={setSelectedBank}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Banks" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Banks</SelectItem>
                <SelectItem value="DBBL">DBBL</SelectItem>
                <SelectItem value="One Bank">One Bank</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedFileType} onValueChange={setSelectedFileType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All File Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All File Types</SelectItem>
                <SelectItem value="Credit Card">Credit Card</SelectItem>
                <SelectItem value="Personal Loan">Personal Loan</SelectItem>
                <SelectItem value="Write-Off">Write-Off</SelectItem>
                <SelectItem value="Agent Banking">Agent Banking</SelectItem>
                <SelectItem value="Loan Branch">Loan Branch</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Expiring Soon">Expiring Soon</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={exportToExcel} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Expiry Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            File Expiry Details
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Showing {filteredData.length} of {expiryData.length} files
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Details</TableHead>
                  <TableHead>Bank & Type</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Allegation Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Days Left</TableHead>
                  <TableHead>Outstanding</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{item.clientName}</p>
                        <div className="text-sm text-gray-500">
                          <div>ID: {item.clientId}</div>
                          <div>File: {item.fileNo}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Badge variant="outline" className="mb-1">{item.bank}</Badge>
                        <div className="text-sm font-medium text-gray-700">{item.fileType}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-gray-900">{item.agent}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{item.allegationDate}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">{item.expiryDate}</span>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm ${getDaysLeftColor(item.daysLeft)}`}>
                        {formatDaysLeft(item.daysLeft)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-gray-900">
                        ৳{item.outstanding.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(item.status, item.daysLeft)}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{item.lastAction}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {/* Show message when no data is available */}
            {expiryData.length === 0 && (
              <div className="text-center py-10">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No files found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No files are currently available in Bank Files. Add files to see them here.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}