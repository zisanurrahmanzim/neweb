import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, AlertTriangle, Clock, CheckCircle, XCircle, Calendar, Filter } from 'lucide-react';

export function ExpiryTracker() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBank, setSelectedBank] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedFileType, setSelectedFileType] = useState('all');

  const expiryData = [
    {
      id: 1,
      bank: 'DBBL',
      fileType: 'Credit Card',
      fileNo: 'FL567890',
      clientName: 'Rajesh Kumar Sharma',
      clientId: 'CL001234',
      agent: 'Priya Singh',
      allegationDate: '2024-01-15',
      expiryDate: '2024-12-15',
      daysLeft: 45,
      status: 'Active',
      outstanding: 125000,
      lastAction: '2024-07-15'
    },
    {
      id: 2,
      bank: 'One Bank',
      fileType: 'Personal Loan',
      fileNo: 'FL567891',
      clientName: 'Meera Gupta',
      clientId: 'CL001235',
      agent: 'Raj Kumar',
      allegationDate: '2024-02-10',
      expiryDate: '2024-08-10',
      daysLeft: -21, // Expired
      status: 'Expired',
      outstanding: 89000,
      lastAction: '2024-07-20'
    },
    {
      id: 3,
      bank: 'DBBL',
      fileType: 'Write-Off',
      fileNo: 'FL567892',
      clientName: 'Arjun Patel',
      clientId: 'CL001236',
      agent: 'Amit Sharma',
      allegationDate: '2024-03-05',
      expiryDate: '2024-09-05',
      daysLeft: 5,
      status: 'Expiring Soon',
      outstanding: 67000,
      lastAction: '2024-07-25'
    },
    {
      id: 4,
      bank: 'One Bank',
      fileType: 'Credit Card',
      fileNo: 'FL567893',
      clientName: 'Kavya Singh',
      clientId: 'CL001237',
      agent: 'Sneha Patel',
      allegationDate: '2024-01-20',
      expiryDate: '2024-10-20',
      daysLeft: 20,
      status: 'Expiring Soon',
      outstanding: 156000,
      lastAction: '2024-07-28'
    },
    {
      id: 5,
      bank: 'DBBL',
      fileType: 'Agent Banking',
      fileNo: 'FL567894',
      clientName: 'Suresh Reddy',
      clientId: 'CL001238',
      agent: 'Ravi Gupta',
      allegationDate: '2024-04-12',
      expiryDate: '2025-01-12',
      daysLeft: 125,
      status: 'Active',
      outstanding: 78000,
      lastAction: '2024-07-30'
    },
    {
      id: 6,
      bank: 'DBBL',
      fileType: 'Loan Branch',
      fileNo: 'FL567895',
      clientName: 'Neha Agarwal',
      clientId: 'CL001239',
      agent: 'Priya Singh',
      allegationDate: '2023-12-01',
      expiryDate: '2024-06-01',
      daysLeft: -59, // Expired
      status: 'Expired',
      outstanding: 234000,
      lastAction: '2024-05-25'
    }
  ];

  const summaryStats = {
    total: expiryData.length,
    active: expiryData.filter(item => item.status === 'Active').length,
    expiringSoon: expiryData.filter(item => item.status === 'Expiring Soon').length,
    expired: expiryData.filter(item => item.status === 'Expired').length,
    totalOutstanding: expiryData.reduce((sum, item) => sum + item.outstanding, 0)
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
              <h3 className="text-sm font-medium text-gray-600">Outstanding</h3>
            </div>
            <span className="text-xl font-bold text-gray-900">৳{summaryStats.totalOutstanding.toLocaleString()}</span>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}