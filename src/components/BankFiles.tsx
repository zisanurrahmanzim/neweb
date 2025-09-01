import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Building2, CreditCard, FileX, Landmark, Banknote, Users, Upload, Settings, FileText, User } from 'lucide-react';
import { useAuth, useIsAdmin } from '../contexts/AuthContext';
import { ExcelUpload } from './ExcelUpload';
import { FileAssignment } from './FileAssignment';

interface CustomerRecord {
  id: string;
  fileNo: string;
  clientId: string;
  clientName: string;
  accountNo?: string;
  cardNo?: string;
  loanNo?: string;
  outstanding: number;
  bankCollector: string;
  assignedAgent?: string;
  status: 'unassigned' | 'assigned';
  bank: string;
  productType: string;
  contactNumber?: string;
  address?: string;
  allegationDate?: string;
  expiryDate?: string;
  // Legacy fields for compatibility
  agent?: string;
  visitStatus?: string;
  lastVisit?: string | null;
  
  // Additional fields for detailed tables
  siNo?: string;
  cy?: string;
  creditLimit?: number;
  minDue?: number;
  overdueMonth?: number;
  dpd?: number;
  empName?: string;
  position?: string;
  mobile?: string;
  rPhone?: string;
  branchDivision?: string;
  division?: string;
  agentNo?: string;
  remarks?: string;
  permAddVisit?: string;
  presAddVisit?: string;
  month?: string;
  slNo?: string;
  writeOffAmount?: number;
  totalRecovery?: number;
  allPayment?: number;
  pendingOutstanding?: number;
  writeOff?: string;
  agentContactNo?: string;
  customerName?: string;
  casa?: string;
  amountDisbursed?: number;
  totalOutstanding?: number;
  overdueAmount?: number;
  installArrear?: number;
  loanStatus?: string;
  outletName?: string;
  outletMobile?: string;
  abOffice?: string;
  regionName?: string;
  officerName?: string;
  mobile1?: string;
  mobile2?: string;
  handOverDate?: string;
  rateOfInterest?: number;
  branchName?: string;
  productName?: string;
  valueDate?: string;
  maturityDate?: string;
  installmentSize?: number;
  totalOverdue?: number;
  customerContact?: string;
  receivedDate?: string;
  dateOfAllocation?: string;
  workOrderExpiryDate?: string;
  rate?: number;
  sl?: string;
  cardHolderName?: string;
  cardStatus?: string;
  overdueIncCommission?: number;
  outstandingIncCommission?: number;
  dealingOfficer?: string;
  product?: string;
  overdue?: number;
  collector?: string;
  emi?: number;
  previousAgent?: string;
  currentAgent?: string;
  clSavingAmount?: number;
}

export function BankFiles() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('files');
  const [importedFiles, setImportedFiles] = useState<CustomerRecord[]>([]);
  const [allFilesData, setAllFilesData] = useState<CustomerRecord[]>([]);
  const { user } = useAuth();
  const isAdmin = useIsAdmin();

  // Available agents for assignment
  const availableAgents = [
    { id: 'priya.singh@company.com', name: 'Priya Singh', email: 'priya.singh@company.com', assignedBanks: ['DBBL', 'One Bank'] },
    { id: 'raj.kumar@company.com', name: 'Raj Kumar', email: 'raj.kumar@company.com', assignedBanks: ['One Bank'] },
    { id: 'amit.sharma@company.com', name: 'Amit Sharma', email: 'amit.sharma@company.com', assignedBanks: ['DBBL'] },
    { id: 'sneha.patel@company.com', name: 'Sneha Patel', email: 'sneha.patel@company.com', assignedBanks: ['One Bank'] },
    { id: 'ravi.gupta@company.com', name: 'Ravi Gupta', email: 'ravi.gupta@company.com', assignedBanks: ['DBBL'] }
  ];

  // Initialize all files data on component mount
  useEffect(() => {
    const initialFiles = [
      // DBBL Credit Card Files
      {
        id: '1',
        fileNo: 'FL567890',
        clientId: 'CL001234',
        clientName: 'Rajesh Kumar Sharma',
        cardNo: '**** **** **** 1234',
        outstanding: 125000,
        bankCollector: 'Sarah Ahmed',
        assignedAgent: 'Priya Singh',
        status: 'assigned' as const,
        bank: 'DBBL',
        productType: 'Credit Card',
        contactNumber: '+8801234567890',
        address: '123 Main Street, Dhaka',
        allegationDate: '2024-01-15',
        expiryDate: '2024-12-15',
        agent: 'Priya Singh',
        visitStatus: 'Visited',
        lastVisit: '2024-07-28'
      },
      {
        id: '2',
        fileNo: 'FL567891',
        clientId: 'CL001235',
        clientName: 'Meera Gupta',
        cardNo: '**** **** **** 5678',
        outstanding: 89000,
        bankCollector: 'Karim Hassan',
        assignedAgent: undefined,
        status: 'unassigned' as const,
        bank: 'DBBL',
        productType: 'Credit Card',
        contactNumber: '+8801234567891',
        address: '456 Garden Road, Chittagong',
        allegationDate: '2024-02-10',
        expiryDate: '2024-08-10',
        agent: undefined,
        visitStatus: 'Not Visited',
        lastVisit: null
      },
      // DBBL Write-Off Files
      {
        id: '3',
        fileNo: 'WO567892',
        clientId: 'CL001236',
        clientName: 'Arjun Patel',
        accountNo: '1234567890',
        outstanding: 67000,
        bankCollector: 'Fatima Khan',
        assignedAgent: 'Amit Sharma',
        status: 'assigned' as const,
        bank: 'DBBL',
        productType: 'Write-Off',
        contactNumber: '+8801234567892',
        address: '789 Business District, Sylhet',
        allegationDate: '2024-03-05',
        expiryDate: '2024-09-05',
        agent: 'Amit Sharma',
        visitStatus: 'Partial',
        lastVisit: '2024-07-25'
      },
      // DBBL Agent Banking Files
      {
        id: '4',
        fileNo: 'AB567893',
        clientId: 'CL001237',
        clientName: 'Kavya Singh',
        accountNo: '9876543210',
        outstanding: 156000,
        bankCollector: 'Mahmud Rahman',
        assignedAgent: undefined,
        status: 'unassigned' as const,
        bank: 'DBBL',
        productType: 'Agent Banking',
        contactNumber: '+8801234567893',
        address: '321 University Road, Rajshahi',
        allegationDate: '2024-01-20',
        expiryDate: '2024-10-20',
        agent: undefined,
        visitStatus: 'Not Visited',
        lastVisit: null
      },
      // DBBL Loan Branch Files
      {
        id: '5',
        fileNo: 'LB567894',
        clientId: 'CL001238',
        clientName: 'Suresh Reddy',
        loanNo: 'LN789012',
        outstanding: 78000,
        bankCollector: 'Nasir Ahmed',
        assignedAgent: 'Ravi Gupta',
        status: 'assigned' as const,
        bank: 'DBBL',
        productType: 'Loan Branch',
        contactNumber: '+8801234567894',
        address: '654 Finance Street, Barisal',
        allegationDate: '2024-04-12',
        expiryDate: '2025-01-12',
        agent: 'Ravi Gupta',
        visitStatus: 'Visited',
        lastVisit: '2024-07-30'
      },
      // One Bank Credit Card Files
      {
        id: '6',
        fileNo: 'OB567895',
        clientId: 'CL001239',
        clientName: 'Neha Agarwal',
        cardNo: '**** **** **** 9012',
        outstanding: 234000,
        bankCollector: 'Rashida Begum',
        assignedAgent: undefined,
        status: 'unassigned' as const,
        bank: 'One Bank',
        productType: 'Credit Card',
        contactNumber: '+8801234567895',
        address: '987 Commercial Area, Khulna',
        allegationDate: '2023-12-01',
        expiryDate: '2024-06-01',
        agent: undefined,
        visitStatus: 'Not Visited',
        lastVisit: null
      },
      // One Bank Loan Files
      {
        id: '7',
        fileNo: 'OL567896',
        clientId: 'CL001240',
        clientName: 'Vikram Joshi',
        loanNo: 'LN345678',
        outstanding: 145000,
        bankCollector: 'Taslima Khatun',
        assignedAgent: 'Raj Kumar',
        status: 'assigned' as const,
        bank: 'One Bank',
        productType: 'Personal Loan',
        contactNumber: '+8801234567896',
        address: '159 Industrial Zone, Comilla',
        allegationDate: '2024-02-28',
        expiryDate: '2024-11-28',
        agent: 'Raj Kumar',
        visitStatus: 'Partial',
        lastVisit: '2024-07-22'
      }
    ];
    setAllFilesData(initialFiles);
  }, []); // Empty dependency array to run only on mount

  // Get files by type for different tabs
  const getFilesByType = (productType: string, bank?: string) => {
    return allFilesData.filter(file => {
      const typeMatch = file.productType === productType;
      const bankMatch = bank ? file.bank === bank : true;
      return typeMatch && bankMatch;
    });
  };

  const dbblCreditCardFiles = getFilesByType('Credit Card', 'DBBL');
  const dbblWriteOffFiles = getFilesByType('Write-Off', 'DBBL');
  const dbblAgentBankingFiles = getFilesByType('Agent Banking', 'DBBL');
  const dbblLoanBranchFiles = getFilesByType('Loan Branch', 'DBBL');
  const oneBankCreditCardFiles = getFilesByType('Credit Card', 'One Bank');
  const oneBankLoanFiles = getFilesByType('Personal Loan', 'One Bank');

  // Handle file import from Excel
  const handleDataImported = (newFiles: CustomerRecord[]) => {
    setAllFilesData(prev => [...prev, ...newFiles]);
    setActiveTab('assignment'); // Switch to assignment tab after import
  };

  // Handle file assignment
  const handleAssignFiles = (fileIds: string[], agentId: string) => {
    const agent = availableAgents.find(a => a.id === agentId);
    if (!agent) return;

    setAllFilesData(prev => prev.map(file => 
      fileIds.includes(file.id) 
        ? { ...file, assignedAgent: agent.name, status: 'assigned' as const, agent: agent.name }
        : file
    ));
  };

  // Handle file unassignment
  const handleUnassignFiles = (fileIds: string[]) => {
    setAllFilesData(prev => prev.map(file => 
      fileIds.includes(file.id) 
        ? { ...file, assignedAgent: undefined, status: 'unassigned' as const, agent: undefined }
        : file
    ));
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'Active': 'default',
      'Expired': 'destructive',
      'Resolved': 'secondary',
    } as const;
    return <Badge variant={variants[status as keyof typeof variants] || 'default'}>{status}</Badge>;
  };

  const getVisitStatusBadge = (visitStatus: string) => {
    switch (visitStatus) {
      case 'Visited':
        return <Badge className="bg-green-100 text-green-800">Visited</Badge>;
      case 'Partial':
        return <Badge className="bg-yellow-100 text-yellow-800">Partial</Badge>;
      case 'Not Visited':
        return <Badge className="bg-red-100 text-red-800">Not Visited</Badge>;
      default:
        return <Badge variant="secondary">{visitStatus}</Badge>;
    }
  };

  // Render specific table based on product type
  const renderTable = (data: CustomerRecord[], type: string) => {
    switch (type) {
      case 'DBBL Credit Card':
        return renderDBBLCreditCardTable(data);
      case 'DBBL Write-Off':
        return renderDBBLWriteOffTable(data);
      case 'DBBL Agent Banking':
        return renderDBBLAgentBankingTable(data);
      case 'DBBL Loan Branch':
        return renderDBBLLoanBranchTable(data);
      case 'One Bank Credit Card':
        return renderOneBankCreditCardTable(data);
      case 'One Bank Loan':
        return renderOneBankLoanTable(data);
      default:
        return <div>Table type not implemented</div>;
    }
  };

  const renderDBBLCreditCardTable = (data: CustomerRecord[]) => {
    const filteredData = data.filter(item => {
      const matchesSearch = item.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.fileNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.clientId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || 
                           (selectedStatus === 'Active' && item.status === 'assigned') ||
                           (selectedStatus === 'Expired' && item.status === 'unassigned');
      return matchesSearch && matchesStatus;
    });

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search DBBL Credit Card files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SI No</TableHead>
                <TableHead>Card</TableHead>
                <TableHead>Client ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>CY</TableHead>
                <TableHead>Credit Limit</TableHead>
                <TableHead>Outstanding</TableHead>
                <TableHead>Min Due</TableHead>
                <TableHead>Overdue Month</TableHead>
                <TableHead>DPD</TableHead>
                <TableHead>EMP Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>RPhone</TableHead>
                <TableHead>Branch/Division</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Division</TableHead>
                <TableHead>Allegation Date</TableHead>
                <TableHead>Expire Date</TableHead>
                <TableHead>Agent Name</TableHead>
                <TableHead>Agent No</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead>Perm. Add. Visit</TableHead>
                <TableHead>Pres. Add. Visit</TableHead>
                <TableHead>Month</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell>{item.siNo || item.id}</TableCell>
                  <TableCell className="font-mono text-sm">{item.cardNo}</TableCell>
                  <TableCell>{item.clientId}</TableCell>
                  <TableCell className="font-medium">{item.clientName}</TableCell>
                  <TableCell>{item.cy}</TableCell>
                  <TableCell>৳{item.creditLimit?.toLocaleString()}</TableCell>
                  <TableCell className="font-medium text-red-600">৳{item.outstanding.toLocaleString()}</TableCell>
                  <TableCell>৳{item.minDue?.toLocaleString()}</TableCell>
                  <TableCell>{item.overdueMonth}</TableCell>
                  <TableCell>{item.dpd}</TableCell>
                  <TableCell>{item.empName}</TableCell>
                  <TableCell>{item.position}</TableCell>
                  <TableCell>{item.mobile}</TableCell>
                  <TableCell>{item.rPhone}</TableCell>
                  <TableCell>{item.branchDivision}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.address}</TableCell>
                  <TableCell>{item.division}</TableCell>
                  <TableCell>{item.allegationDate}</TableCell>
                  <TableCell>{item.expiryDate}</TableCell>
                  <TableCell>{item.assignedAgent || item.agent}</TableCell>
                  <TableCell>{item.agentNo}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.remarks}</TableCell>
                  <TableCell>{item.permAddVisit}</TableCell>
                  <TableCell>{item.presAddVisit}</TableCell>
                  <TableCell>{item.month}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  const renderDBBLWriteOffTable = (data: CustomerRecord[]) => {
    const filteredData = data.filter(item => {
      const matchesSearch = item.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.fileNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.clientId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || 
                           (selectedStatus === 'Active' && item.status === 'assigned') ||
                           (selectedStatus === 'Expired' && item.status === 'unassigned');
      return matchesSearch && matchesStatus;
    });

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search DBBL Write-Off files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SL No</TableHead>
                <TableHead>Client ID</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>Card Number</TableHead>
                <TableHead>Write-Off Amount</TableHead>
                <TableHead>Total Recovery</TableHead>
                <TableHead>All Payment</TableHead>
                <TableHead>Pending Outstanding</TableHead>
                <TableHead>Contact Number</TableHead>
                <TableHead>Write-Off</TableHead>
                <TableHead>EMP Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Allegation Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Agent Name</TableHead>
                <TableHead>Agent Contact No</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead>Perm. Add. Visit</TableHead>
                <TableHead>Pres. Add. Visit</TableHead>
                <TableHead>Month</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell>{item.slNo || item.id}</TableCell>
                  <TableCell>{item.clientId}</TableCell>
                  <TableCell className="font-medium">{item.clientName}</TableCell>
                  <TableCell className="font-mono text-sm">{item.cardNo}</TableCell>
                  <TableCell className="font-medium text-red-600">৳{item.writeOffAmount?.toLocaleString()}</TableCell>
                  <TableCell>৳{item.totalRecovery?.toLocaleString()}</TableCell>
                  <TableCell>৳{item.allPayment?.toLocaleString()}</TableCell>
                  <TableCell className="font-medium text-red-600">৳{item.pendingOutstanding?.toLocaleString()}</TableCell>
                  <TableCell>{item.contactNumber}</TableCell>
                  <TableCell>{item.writeOff}</TableCell>
                  <TableCell>{item.empName}</TableCell>
                  <TableCell>{item.position}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.address}</TableCell>
                  <TableCell>{item.allegationDate}</TableCell>
                  <TableCell>{item.expiryDate}</TableCell>
                  <TableCell>{item.assignedAgent || item.agent}</TableCell>
                  <TableCell>{item.agentContactNo}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.remarks}</TableCell>
                  <TableCell>{item.permAddVisit}</TableCell>
                  <TableCell>{item.presAddVisit}</TableCell>
                  <TableCell>{item.month}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  const renderDBBLAgentBankingTable = (data: CustomerRecord[]) => {
    const filteredData = data.filter(item => {
      const matchesSearch = (item.customerName || item.clientName).toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.fileNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.clientId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || 
                           (selectedStatus === 'Active' && item.status === 'assigned') ||
                           (selectedStatus === 'Expired' && item.status === 'unassigned');
      return matchesSearch && matchesStatus;
    });

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search DBBL Agent Banking files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SL No</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Contact Number</TableHead>
                <TableHead>CASA</TableHead>
                <TableHead>Account Number</TableHead>
                <TableHead>Amount Disbursed</TableHead>
                <TableHead>Total Outstanding</TableHead>
                <TableHead>Overdue Amount</TableHead>
                <TableHead>Install Arrear</TableHead>
                <TableHead>Loan Status</TableHead>
                <TableHead>Outlet Name</TableHead>
                <TableHead>Outlet Mobile</TableHead>
                <TableHead>AB Office</TableHead>
                <TableHead>Region Name</TableHead>
                <TableHead>Officer Name</TableHead>
                <TableHead>Mobile 1</TableHead>
                <TableHead>Mobile 2</TableHead>
                <TableHead>Agent Name</TableHead>
                <TableHead>Agent Number</TableHead>
                <TableHead>Hand Over Date</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead>Allegation Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Rate of Interest</TableHead>
                <TableHead>Branch Name</TableHead>
                <TableHead>Perm. Add. Visit</TableHead>
                <TableHead>Pres. Add. Visit</TableHead>
                <TableHead>Month</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell>{item.slNo || item.id}</TableCell>
                  <TableCell className="font-medium">{item.customerName || item.clientName}</TableCell>
                  <TableCell>{item.contactNumber}</TableCell>
                  <TableCell>{item.casa}</TableCell>
                  <TableCell className="font-mono text-sm">{item.accountNo}</TableCell>
                  <TableCell>৳{item.amountDisbursed?.toLocaleString()}</TableCell>
                  <TableCell className="font-medium text-red-600">৳{item.totalOutstanding?.toLocaleString() || item.outstanding.toLocaleString()}</TableCell>
                  <TableCell className="text-red-600">৳{item.overdueAmount?.toLocaleString()}</TableCell>
                  <TableCell>৳{item.installArrear?.toLocaleString()}</TableCell>
                  <TableCell><Badge variant={item.loanStatus === 'Active' ? 'default' : 'destructive'}>{item.loanStatus}</Badge></TableCell>
                  <TableCell>{item.outletName}</TableCell>
                  <TableCell>{item.outletMobile}</TableCell>
                  <TableCell>{item.abOffice}</TableCell>
                  <TableCell>{item.regionName}</TableCell>
                  <TableCell>{item.officerName}</TableCell>
                  <TableCell>{item.mobile1}</TableCell>
                  <TableCell>{item.mobile2}</TableCell>
                  <TableCell>{item.assignedAgent || item.agent}</TableCell>
                  <TableCell>{item.agentNo}</TableCell>
                  <TableCell>{item.handOverDate}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.remarks}</TableCell>
                  <TableCell>{item.allegationDate}</TableCell>
                  <TableCell>{item.expiryDate}</TableCell>
                  <TableCell>{item.rateOfInterest}%</TableCell>
                  <TableCell>{item.branchName}</TableCell>
                  <TableCell>{item.permAddVisit}</TableCell>
                  <TableCell>{item.presAddVisit}</TableCell>
                  <TableCell>{item.month}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  // Continue with other table implementations...
  const renderDBBLLoanBranchTable = (data: CustomerRecord[]) => {
    const filteredData = data.filter(item => {
      const matchesSearch = item.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.fileNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.clientId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || 
                           (selectedStatus === 'Active' && item.status === 'assigned') ||
                           (selectedStatus === 'Expired' && item.status === 'unassigned');
      return matchesSearch && matchesStatus;
    });

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search DBBL Loan Branch files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SL No</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Account Number</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>CASA</TableHead>
                <TableHead>Value Date</TableHead>
                <TableHead>Maturity Date</TableHead>
                <TableHead>Amount Disbursed</TableHead>
                <TableHead>Total Outstanding</TableHead>
                <TableHead>Overdue Amount</TableHead>
                <TableHead>Installment Size</TableHead>
                <TableHead>Install Arrear</TableHead>
                <TableHead>Total Overdue</TableHead>
                <TableHead>Loan Status</TableHead>
                <TableHead>Customer Contact</TableHead>
                <TableHead>Agent Name</TableHead>
                <TableHead>Agent Number</TableHead>
                <TableHead>Received Date</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead>Date of Allocation</TableHead>
                <TableHead>Work Order Expiry Date</TableHead>
                <TableHead>Branch Name</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Perm. Add. Visit</TableHead>
                <TableHead>Pres. Add. Visit</TableHead>
                <TableHead>Month</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell>{item.slNo || item.id}</TableCell>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell className="font-mono text-sm">{item.accountNo}</TableCell>
                  <TableCell className="font-medium">{item.clientName}</TableCell>
                  <TableCell>{item.casa}</TableCell>
                  <TableCell>{item.valueDate}</TableCell>
                  <TableCell>{item.maturityDate}</TableCell>
                  <TableCell>৳{item.amountDisbursed?.toLocaleString()}</TableCell>
                  <TableCell className="font-medium text-red-600">৳{item.totalOutstanding?.toLocaleString() || item.outstanding.toLocaleString()}</TableCell>
                  <TableCell className="text-red-600">৳{item.overdueAmount?.toLocaleString()}</TableCell>
                  <TableCell>৳{item.installmentSize?.toLocaleString()}</TableCell>
                  <TableCell>৳{item.installArrear?.toLocaleString()}</TableCell>
                  <TableCell className="text-red-600">৳{item.totalOverdue?.toLocaleString()}</TableCell>
                  <TableCell><Badge variant={item.loanStatus === 'Active' ? 'default' : 'destructive'}>{item.loanStatus}</Badge></TableCell>
                  <TableCell>{item.customerContact}</TableCell>
                  <TableCell>{item.assignedAgent || item.agent}</TableCell>
                  <TableCell>{item.agentNo}</TableCell>
                  <TableCell>{item.receivedDate}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.remarks}</TableCell>
                  <TableCell>{item.dateOfAllocation}</TableCell>
                  <TableCell>{item.workOrderExpiryDate}</TableCell>
                  <TableCell>{item.branchName}</TableCell>
                  <TableCell>{item.rate}%</TableCell>
                  <TableCell>{item.permAddVisit}</TableCell>
                  <TableCell>{item.presAddVisit}</TableCell>
                  <TableCell>{item.month}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  const renderOneBankCreditCardTable = (data: CustomerRecord[]) => {
    const filteredData = data.filter(item => {
      const matchesSearch = (item.cardHolderName || item.clientName).toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.fileNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.clientId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || 
                           (selectedStatus === 'Active' && item.status === 'assigned') ||
                           (selectedStatus === 'Expired' && item.status === 'unassigned');
      return matchesSearch && matchesStatus;
    });

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search One Bank Credit Card files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SL</TableHead>
                <TableHead>Client ID</TableHead>
                <TableHead>Card No</TableHead>
                <TableHead>Card Holder Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Overdue (Inc. Commission)</TableHead>
                <TableHead>Outstanding (Inc. Commission)</TableHead>
                <TableHead>Dealing Officer</TableHead>
                <TableHead>Agent Name</TableHead>
                <TableHead>Agent Number</TableHead>
                <TableHead>Received Date</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead>Date of Allocation</TableHead>
                <TableHead>Work Order Expiry Date</TableHead>
                <TableHead>Perm. Add. Visit</TableHead>
                <TableHead>Pres. Add. Visit</TableHead>
                <TableHead>Month</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell>{item.sl || item.id}</TableCell>
                  <TableCell>{item.clientId}</TableCell>
                  <TableCell className="font-mono text-sm">{item.cardNo}</TableCell>
                  <TableCell className="font-medium">{item.cardHolderName || item.clientName}</TableCell>
                  <TableCell><Badge variant={item.cardStatus === 'Active' ? 'default' : 'destructive'}>{item.cardStatus}</Badge></TableCell>
                  <TableCell className="text-red-600">৳{item.overdueIncCommission?.toLocaleString()}</TableCell>
                  <TableCell className="font-medium text-red-600">৳{item.outstandingIncCommission?.toLocaleString() || item.outstanding.toLocaleString()}</TableCell>
                  <TableCell>{item.dealingOfficer}</TableCell>
                  <TableCell>{item.assignedAgent || item.agent}</TableCell>
                  <TableCell>{item.agentNo}</TableCell>
                  <TableCell>{item.receivedDate}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.remarks}</TableCell>
                  <TableCell>{item.dateOfAllocation}</TableCell>
                  <TableCell>{item.workOrderExpiryDate}</TableCell>
                  <TableCell>{item.permAddVisit}</TableCell>
                  <TableCell>{item.presAddVisit}</TableCell>
                  <TableCell>{item.month}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  const renderOneBankLoanTable = (data: CustomerRecord[]) => {
    const filteredData = data.filter(item => {
      const matchesSearch = item.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.fileNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.loanNo?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || 
                           (selectedStatus === 'Active' && item.status === 'assigned') ||
                           (selectedStatus === 'Expired' && item.status === 'unassigned');
      return matchesSearch && matchesStatus;
    });

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search One Bank Loan files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SL</TableHead>
                <TableHead>File No</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Loan Account</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Outstanding</TableHead>
                <TableHead>Overdue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Collector</TableHead>
                <TableHead>EMI</TableHead>
                <TableHead>Previous Agent</TableHead>
                <TableHead>Current Agent</TableHead>
                <TableHead>Agent Number</TableHead>
                <TableHead>Received Date</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead>Date of Allocation</TableHead>
                <TableHead>Work Order Expiry Date</TableHead>
                <TableHead>CL Saving Amount</TableHead>
                <TableHead>Perm. Add. Visit</TableHead>
                <TableHead>Pres. Add. Visit</TableHead>
                <TableHead>Month</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell>{item.sl || item.id}</TableCell>
                  <TableCell>{item.fileNo}</TableCell>
                  <TableCell className="font-medium">{item.clientName}</TableCell>
                  <TableCell className="font-mono text-sm">{item.loanNo || item.accountNo}</TableCell>
                  <TableCell>{item.product}</TableCell>
                  <TableCell className="font-medium text-red-600">৳{item.outstanding.toLocaleString()}</TableCell>
                  <TableCell className="text-red-600">৳{item.overdue?.toLocaleString()}</TableCell>
                  <TableCell><Badge variant={item.loanStatus === 'Active' ? 'default' : 'destructive'}>{item.loanStatus}</Badge></TableCell>
                  <TableCell>{item.collector}</TableCell>
                  <TableCell>৳{item.emi?.toLocaleString()}</TableCell>
                  <TableCell>{item.previousAgent}</TableCell>
                  <TableCell>{item.currentAgent || item.assignedAgent || item.agent}</TableCell>
                  <TableCell>{item.agentNo}</TableCell>
                  <TableCell>{item.receivedDate}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.remarks}</TableCell>
                  <TableCell>{item.dateOfAllocation}</TableCell>
                  <TableCell>{item.workOrderExpiryDate}</TableCell>
                  <TableCell>৳{item.clSavingAmount?.toLocaleString()}</TableCell>
                  <TableCell>{item.permAddVisit}</TableCell>
                  <TableCell>{item.presAddVisit}</TableCell>
                  <TableCell>{item.month}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Bank Files</h1>
          <p className="text-gray-600 mt-1">Manage files across different banks and product types</p>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <Button 
              variant={activeTab === 'upload' ? 'default' : 'outline'}
              onClick={() => setActiveTab('upload')}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload Files
            </Button>
            <Button 
              variant={activeTab === 'assignment' ? 'default' : 'outline'}
              onClick={() => setActiveTab('assignment')}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Manage Assignment
            </Button>
          </div>
        )}
      </div>

      {/* Upload Section (Admin Only) */}
      {isAdmin && activeTab === 'upload' && (
        <ExcelUpload 
          onDataImported={handleDataImported}
          existingAgents={availableAgents}
        />
      )}

      {/* File Assignment Section (Admin Only) */}
      {isAdmin && activeTab === 'assignment' && (
        <FileAssignment 
          files={allFilesData}
          agents={availableAgents}
          onAssignFiles={handleAssignFiles}
          onUnassignFiles={handleUnassignFiles}
        />
      )}

      {/* Bank Files Tabs */}
      {(activeTab === 'files' || !isAdmin) && (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          <Tabs defaultValue="dbbl-credit-card" className="w-full">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100 px-6 py-4">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-white/50 backdrop-blur-sm p-1 rounded-xl">
                <TabsTrigger value="dbbl-credit-card" className="flex items-center gap-2 text-xs px-2 py-2 rounded-lg">
                  <CreditCard className="h-3 w-3" />
                  <span className="hidden sm:inline">DBBL Credit</span>
                  <span className="sm:hidden">Credit</span>
                </TabsTrigger>
                <TabsTrigger value="dbbl-write-off" className="flex items-center gap-2 text-xs px-2 py-2 rounded-lg">
                  <FileX className="h-3 w-3" />
                  <span className="hidden sm:inline">DBBL Write-Off</span>
                  <span className="sm:hidden">Write-Off</span>
                </TabsTrigger>
                <TabsTrigger value="dbbl-agent-banking" className="flex items-center gap-2 text-xs px-2 py-2 rounded-lg">
                  <Users className="h-3 w-3" />
                  <span className="hidden sm:inline">DBBL Agent</span>
                  <span className="sm:hidden">Agent</span>
                </TabsTrigger>
                <TabsTrigger value="dbbl-loan-branch" className="flex items-center gap-2 text-xs px-2 py-2 rounded-lg">
                  <Landmark className="h-3 w-3" />
                  <span className="hidden sm:inline">DBBL Loan</span>
                  <span className="sm:hidden">Loan</span>
                </TabsTrigger>
                <TabsTrigger value="one-bank-credit" className="flex items-center gap-2 text-xs px-2 py-2 rounded-lg">
                  <Building2 className="h-3 w-3" />
                  <span className="hidden sm:inline">One Credit</span>
                  <span className="sm:hidden">One CC</span>
                </TabsTrigger>
                <TabsTrigger value="one-bank-loan" className="flex items-center gap-2 text-xs px-2 py-2 rounded-lg">
                  <Banknote className="h-3 w-3" />
                  <span className="hidden sm:inline">One Loan</span>
                  <span className="sm:hidden">One PL</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="dbbl-credit-card" className="mt-0">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    DBBL Credit Card Files
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Manage DBBL credit card recovery files</p>
                </div>
                {renderTable(dbblCreditCardFiles, 'DBBL Credit Card')}
              </TabsContent>

              <TabsContent value="dbbl-write-off" className="mt-0">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FileX className="h-5 w-5 text-red-600" />
                    DBBL Write-Off Files
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Manage DBBL write-off account files</p>
                </div>
                {renderTable(dbblWriteOffFiles, 'DBBL Write-Off')}
              </TabsContent>

              <TabsContent value="dbbl-agent-banking" className="mt-0">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    DBBL Agent Banking Files
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Manage DBBL agent banking recovery files</p>
                </div>
                {renderTable(dbblAgentBankingFiles, 'DBBL Agent Banking')}
              </TabsContent>

              <TabsContent value="dbbl-loan-branch" className="mt-0">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Landmark className="h-5 w-5 text-green-600" />
                    DBBL Loan Branch Files
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Manage DBBL loan branch recovery files</p>
                </div>
                {renderTable(dbblLoanBranchFiles, 'DBBL Loan Branch')}
              </TabsContent>

              <TabsContent value="one-bank-credit" className="mt-0">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-teal-600" />
                    One Bank Credit Card Files
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Manage One Bank credit card recovery files</p>
                </div>
                {renderTable(oneBankCreditCardFiles, 'One Bank Credit Card')}
              </TabsContent>

              <TabsContent value="one-bank-loan" className="mt-0">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Banknote className="h-5 w-5 text-orange-600" />
                    One Bank Loan Files
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Manage One Bank personal loan recovery files</p>
                </div>
                {renderTable(oneBankLoanFiles, 'One Bank Loan')}
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
      )}

      {/* Back to Files Button */}
      {isAdmin && activeTab !== 'files' && (
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={() => setActiveTab('files')}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Back to Bank Files
          </Button>
        </div>
      )}
    </div>
  );
}