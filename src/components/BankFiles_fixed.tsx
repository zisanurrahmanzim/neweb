import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Building2, CreditCard, FileX, Landmark, Banknote, Users, Upload, Settings, FileText, User, Trash2, Edit, Camera, Check, X, AlertTriangle } from 'lucide-react';
import { useAuth, useIsAdmin } from '../contexts/AuthContext';
import { ExcelUpload } from './ExcelUpload';
import { FileAssignment } from './FileAssignment';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';

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
  
  // New fields for visit verification and notes
  permAddVisitVerified?: boolean;
  permAddVisitImage?: string;
  permAddVisitDate?: string;
  presAddVisitVerified?: boolean;
  presAddVisitImage?: string;
  presAddVisitDate?: string;
  notesHistory?: {
    date: string;
    note: string;
    addedBy: string;
  }[];
}

export function BankFiles() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('files');
  const [importedFiles, setImportedFiles] = useState<CustomerRecord[]>([]);
  const [allFilesData, setAllFilesData] = useState<CustomerRecord[]>([]);
  const [fileToDelete, setFileToDelete] = useState<CustomerRecord | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [fileToEdit, setFileToEdit] = useState<CustomerRecord | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editType, setEditType] = useState<'details' | 'remarks' | 'permAddVisit' | 'presAddVisit'>('details');
  const [noteText, setNoteText] = useState('');
  const [permAddVisitVerified, setPermAddVisitVerified] = useState(false);
  const [presAddVisitVerified, setPresAddVisitVerified] = useState(false);
  const [permAddVisitImage, setPermAddVisitImage] = useState<string | null>(null);
  const [presAddVisitImage, setPresAddVisitImage] = useState<string | null>(null);
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
    // Try to get files from localStorage first
    const savedFiles = localStorage.getItem('bankFiles');
    
    if (savedFiles) {
      setAllFilesData(JSON.parse(savedFiles));
    } else {
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
      // Save to localStorage
      localStorage.setItem('bankFiles', JSON.stringify(initialFiles));
    }
  }, []); // Empty dependency array to run only on mount

  // Update localStorage whenever allFilesData changes
  useEffect(() => {
    localStorage.setItem('bankFiles', JSON.stringify(allFilesData));
  }, [allFilesData]);

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
    const updatedFiles = [...allFilesData, ...newFiles];
    setAllFilesData(updatedFiles);
    // Save to localStorage
    localStorage.setItem('bankFiles', JSON.stringify(updatedFiles));
    setActiveTab('assignment'); // Switch to assignment tab after import
  };

  // Handle file assignment
  const handleAssignFiles = (fileIds: string[], agentId: string) => {
    const agent = availableAgents.find(a => a.id === agentId);
    if (!agent) return;

    const updatedFiles = allFilesData.map(file => 
      fileIds.includes(file.id) 
        ? { ...file, assignedAgent: agent.name, status: 'assigned' as const, agent: agent.name }
        : file
    );
    
    setAllFilesData(updatedFiles);
    // Save to localStorage
    localStorage.setItem('bankFiles', JSON.stringify(updatedFiles));
  };

  // Handle file unassignment
  const handleUnassignFiles = (fileIds: string[]) => {
    const updatedFiles = allFilesData.map(file => 
      fileIds.includes(file.id) 
        ? { ...file, assignedAgent: undefined, status: 'unassigned' as const, agent: undefined }
        : file
    );
    
    setAllFilesData(updatedFiles);
    // Save to localStorage
    localStorage.setItem('bankFiles', JSON.stringify(updatedFiles));
  };

  // Handle file deletion
  const handleDeleteFile = (file: CustomerRecord) => {
    setFileToDelete(file);
    setIsDeleteDialogOpen(true);
  };

  // Confirm file deletion
  const confirmDelete = () => {
    if (fileToDelete) {
      const updatedFiles = allFilesData.filter(file => file.id !== fileToDelete.id);
      setAllFilesData(updatedFiles);
      // Save to localStorage
      localStorage.setItem('bankFiles', JSON.stringify(updatedFiles));
      setIsDeleteDialogOpen(false);
      setFileToDelete(null);
    }
  };
  
  // Handle file edit
  const handleEditFile = (file: CustomerRecord, type: 'details' | 'remarks' | 'permAddVisit' | 'presAddVisit') => {
    setFileToEdit({...file});
    setEditType(type);
    
    // Initialize form states based on edit type
    if (type === 'remarks') {
      setNoteText('');
    } else if (type === 'permAddVisit') {
      setPermAddVisitVerified(file.permAddVisitVerified || false);
      setPermAddVisitImage(file.permAddVisitImage || null);
    } else if (type === 'presAddVisit') {
      setPresAddVisitVerified(file.presAddVisitVerified || false);
      setPresAddVisitImage(file.presAddVisitImage || null);
    }
    
    setIsEditDialogOpen(true);
  };
  
  // Add a note to a file
  const addNote = () => {
    if (!fileToEdit || !noteText.trim()) return;
    
    const currentDate = new Date().toISOString().split('T')[0];
    const userName = user?.email || 'System';
    
    const newNote = {
      date: currentDate,
      note: noteText.trim(),
      addedBy: userName
    };
    
    const updatedNotes = fileToEdit.notesHistory ? [...fileToEdit.notesHistory, newNote] : [newNote];
    
    const updatedFile = {
      ...fileToEdit,
      notesHistory: updatedNotes,
      remarks: noteText.trim() // Also update the remarks field for compatibility
    };
    
    const updatedFiles = allFilesData.map(file => 
      file.id === fileToEdit.id ? updatedFile : file
    );
    
    setAllFilesData(updatedFiles);
    localStorage.setItem('bankFiles', JSON.stringify(updatedFiles));
    setIsEditDialogOpen(false);
    setNoteText('');
  };
  
  // Update visit verification status
  const updateVisitStatus = (visitType: 'permAddVisit' | 'presAddVisit') => {
    if (!fileToEdit) return;
    
    const currentDate = new Date().toISOString().split('T')[0];
    const isVerified = visitType === 'permAddVisit' ? permAddVisitVerified : presAddVisitVerified;
    const image = visitType === 'permAddVisit' ? permAddVisitImage : presAddVisitImage;
    
    // Don't allow verification without an image
    if (isVerified && !image) {
      alert('Please upload an image to verify the visit');
      return;
    }
    
    const updatedFile = {
      ...fileToEdit,
      ...(visitType === 'permAddVisit' 
        ? { 
            permAddVisitVerified: isVerified,
            permAddVisitImage: image,
            permAddVisitDate: isVerified ? currentDate : undefined,
            permAddVisit: isVerified ? 'Yes' : 'No'
          } 
        : { 
            presAddVisitVerified: isVerified,
            presAddVisitImage: image,
            presAddVisitDate: isVerified ? currentDate : undefined,
            presAddVisit: isVerified ? 'Yes' : 'No'
          }
      )
    };
    
    const updatedFiles = allFilesData.map(file => 
      file.id === fileToEdit.id ? updatedFile : file
    );
    
    setAllFilesData(updatedFiles);
    localStorage.setItem('bankFiles', JSON.stringify(updatedFiles));
    setIsEditDialogOpen(false);
    
    // Reset state
    if (visitType === 'permAddVisit') {
      setPermAddVisitVerified(false);
      setPermAddVisitImage(null);
    } else {
      setPresAddVisitVerified(false);
      setPresAddVisitImage(null);
    }
  };
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, visitType: 'permAddVisit' | 'presAddVisit') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (visitType === 'permAddVisit') {
        setPermAddVisitImage(base64String);
      } else {
        setPresAddVisitImage(base64String);
      }
    };
    reader.readAsDataURL(file);
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
                {isAdmin && <TableHead className="text-right">Actions</TableHead>}
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
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="max-w-xs truncate">
                        {item.remarks || (item.notesHistory && item.notesHistory.length > 0 ? 
                          item.notesHistory[item.notesHistory.length - 1].note : '')}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-blue-500 hover:text-blue-700"
                        onClick={() => handleEditFile(item, 'remarks')}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-between">
                      <Badge className={
                        item.permAddVisitVerified ? 
                          "bg-green-100 text-green-800 border-green-200" : 
                          "bg-yellow-100 text-yellow-800 border-yellow-200"
                      }>
                        {item.permAddVisit || 'No'}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-blue-500 hover:text-blue-700"
                        onClick={() => handleEditFile(item, 'permAddVisit')}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-between">
                      <Badge className={
                        item.presAddVisitVerified ? 
                          "bg-green-100 text-green-800 border-green-200" : 
                          "bg-yellow-100 text-yellow-800 border-yellow-200"
                      }>
                        {item.presAddVisit || 'No'}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-blue-500 hover:text-blue-700"
                        onClick={() => handleEditFile(item, 'presAddVisit')}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{item.month}</TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteFile(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
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
                {isAdmin && <TableHead className="text-right">Actions</TableHead>}
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
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="max-w-xs truncate">
                        {item.remarks || (item.notesHistory && item.notesHistory.length > 0 ? 
                          item.notesHistory[item.notesHistory.length - 1].note : '')}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-blue-500 hover:text-blue-700"
                        onClick={() => handleEditFile(item, 'remarks')}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-between">
                      <Badge className={
                        item.permAddVisitVerified ? 
                          "bg-green-100 text-green-800 border-green-200" : 
                          "bg-yellow-100 text-yellow-800 border-yellow-200"
                      }>
                        {item.permAddVisit || 'No'}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-blue-500 hover:text-blue-700"
                        onClick={() => handleEditFile(item, 'permAddVisit')}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-between">
                      <Badge className={
                        item.presAddVisitVerified ? 
                          "bg-green-100 text-green-800 border-green-200" : 
                          "bg-yellow-100 text-yellow-800 border-yellow-200"
                      }>
                        {item.presAddVisit || 'No'}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-blue-500 hover:text-blue-700"
                        onClick={() => handleEditFile(item, 'presAddVisit')}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{item.month}</TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteFile(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
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
                {isAdmin && <TableHead className="text-right">Actions</TableHead>}
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
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="max-w-xs truncate">
                        {item.remarks || (item.notesHistory && item.notesHistory.length > 0 ? 
                          item.notesHistory[item.notesHistory.length - 1].note : '')}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-blue-500 hover:text-blue-700"
                        onClick={() => handleEditFile(item, 'remarks')}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{item.allegationDate}</TableCell>
                  <TableCell>{item.expiryDate}</TableCell>
                  <TableCell>{item.rateOfInterest}%</TableCell>
                  <TableCell>{item.branchName}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-between">
                      <Badge className={
                        item.permAddVisitVerified ? 
                          "bg-green-100 text-green-800 border-green-200" : 
                          "bg-yellow-100 text-yellow-800 border-yellow-200"
                      }>
                        {item.permAddVisit || 'No'}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-blue-500 hover:text-blue-700"
                        onClick={() => handleEditFile(item, 'permAddVisit')}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-between">
                      <Badge className={
                        item.presAddVisitVerified ? 
                          "bg-green-100 text-green-800 border-green-200" : 
                          "bg-yellow-100 text-yellow-800 border-yellow-200"
                      }>
                        {item.presAddVisit || 'No'}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-blue-500 hover:text-blue-700"
                        onClick={() => handleEditFile(item, 'presAddVisit')}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{item.month}</TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteFile(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

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
                <TableHead>Client ID</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>Loan No</TableHead>
                <TableHead>Outstanding</TableHead>
                <TableHead>EMP Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Branch/Division</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Division</TableHead>
                <TableHead>Allegation Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Agent Name</TableHead>
                <TableHead>Agent Contact No</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead>Perm. Add. Visit</TableHead>
                <TableHead>Pres. Add. Visit</TableHead>
                <TableHead>Month</TableHead>
                {isAdmin && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell>{item.slNo || item.id}</TableCell>
                  <TableCell>{item.clientId}</TableCell>
                  <TableCell className="font-medium">{item.clientName}</TableCell>
                  <TableCell className="font-mono text-sm">{item.loanNo}</TableCell>
                  <TableCell className="font-medium text-red-600">৳{item.outstanding.toLocaleString()}</TableCell>
                  <TableCell>{item.empName}</TableCell>
                  <TableCell>{item.position}</TableCell>
                  <TableCell>{item.mobile}</TableCell>
                  <TableCell>{item.branchDivision}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.address}</TableCell>
                  <TableCell>{item.division}</TableCell>
                  <TableCell>{item.allegationDate}</TableCell>
                  <TableCell>{item.expiryDate}</TableCell>
                  <TableCell>{item.assignedAgent || item.agent}</TableCell>
                  <TableCell>{item.agentContactNo}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="max-w-xs truncate">
                        {item.remarks || (item.notesHistory && item.notesHistory.length > 0 ? 
                          item.notesHistory[item.notesHistory.length - 1].note : '')}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-blue-500 hover:text-blue-700"
                        onClick={() => handleEditFile(item, 'remarks')}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-between">
                      <Badge className={
                        item.permAddVisitVerified ? 
                          "bg-green-100 text-green-800 border-green-200" : 
                          "bg-yellow-100 text-yellow-800 border-yellow-200"
                      }>
                        {item.permAddVisit || 'No'}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-blue-500 hover:text-blue-700"
                        onClick={() => handleEditFile(item, 'permAddVisit')}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-between">
                      <Badge className={
                        item.presAddVisitVerified ? 
                          "bg-green-100 text-green-800 border-green-200" : 
                          "bg-yellow-100 text-yellow-800 border-yellow-200"
                      }>
                        {item.presAddVisit || 'No'}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-blue-500 hover:text-blue-700"
                        onClick={() => handleEditFile(item, 'presAddVisit')}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{item.month}</TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteFile(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
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
                {isAdmin && <TableHead className="text-right">Actions</TableHead>}
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
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="max-w-xs truncate">
                        {item.remarks || (item.notesHistory && item.notesHistory.length > 0 ? 
                          item.notesHistory[item.notesHistory.length - 1].note : '')}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-blue-500 hover:text-blue-700"
                        onClick={() => handleEditFile(item, 'remarks')}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-between">
                      <Badge className={
                        item.permAddVisitVerified ? 
                          "bg-green-100 text-green-800 border-green-200" : 
                          "bg-yellow-100 text-yellow-800 border-yellow-200"
                      }>
                        {item.permAddVisit || 'No'}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-blue-500 hover:text-blue-700"
                        onClick={() => handleEditFile(item, 'permAddVisit')}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-between">
                      <Badge className={
                        item.presAddVisitVerified ? 
                          "bg-green-100 text-green-800 border-green-200" : 
                          "bg-yellow-100 text-yellow-800 border-yellow-200"
                      }>
                        {item.presAddVisit || 'No'}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-blue-500 hover:text-blue-700"
                        onClick={() => handleEditFile(item, 'presAddVisit')}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{item.month}</TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteFile(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
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
                {isAdmin && <TableHead className="text-right">Actions</TableHead>}
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
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="max-w-xs truncate">
                        {item.remarks || (item.notesHistory && item.notesHistory.length > 0 ? 
                          item.notesHistory[item.notesHistory.length - 1].note : '')}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-blue-500 hover:text-blue-700"
                        onClick={() => handleEditFile(item, 'remarks')}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{item.dateOfAllocation}</TableCell>
                  <TableCell>{item.workOrderExpiryDate}</TableCell>
                  <TableCell>৳{item.clSavingAmount?.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-between">
                      <Badge className={
                        item.permAddVisitVerified ? 
                          "bg-green-100 text-green-800 border-green-200" : 
                          "bg-yellow-100 text-yellow-800 border-yellow-200"
                      }>
                        {item.permAddVisit || 'No'}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-blue-500 hover:text-blue-700"
                        onClick={() => handleEditFile(item, 'permAddVisit')}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-between">
                      <Badge className={
                        item.presAddVisitVerified ? 
                          "bg-green-100 text-green-800 border-green-200" : 
                          "bg-yellow-100 text-yellow-800 border-yellow-200"
                      }>
                        {item.presAddVisit || 'No'}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-blue-500 hover:text-blue-700"
                        onClick={() => handleEditFile(item, 'presAddVisit')}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{item.month}</TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteFile(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
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
          <p className="text-gray-600 mt-1">Manage and view all bank files</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="files" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Files
              </TabsTrigger>
              <TabsTrigger value="assignment" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Assignment
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
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
                  <p className="text-sm text-gray-600 mt-1">Manage DBBL write-off recovery files</p>
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
                    <Building2 className="h-5 w-5 text-indigo-600" />
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
                    One Bank Personal Loan Files
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete File</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this file? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {fileToDelete && (
            <div className="py-4">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <FileText className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="font-medium">{fileToDelete.clientName}</p>
                  <p className="text-sm text-gray-600">File No: {fileToDelete.fileNo}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          {fileToEdit && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {editType === 'details' && 'Edit File Details'}
                  {editType === 'remarks' && 'Add Note/Remark'}
                  {editType === 'permAddVisit' && 'Permanent Address Visit'}
                  {editType === 'presAddVisit' && 'Present Address Visit'}
                </DialogTitle>
                <DialogDescription>
                  {editType === 'details' && 'Update the file details below'}
                  {editType === 'remarks' && 'Add a note or remark for this file'}
                  {editType === 'permAddVisit' && 'Record visit to permanent address'}
                  {editType === 'presAddVisit' && 'Record visit to present address'}
                </DialogDescription>
              </DialogHeader>
              
              {editType === 'details' && (
                <div className="space-y-4 py-2">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="client-name">Client Name</Label>
                      <Input id="client-name" value={fileToEdit.clientName} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="file-no">File Number</Label>
                      <Input id="file-no" value={fileToEdit.fileNo} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="outstanding">Outstanding Amount</Label>
                      <Input 
                        id="outstanding" 
                        value={`৳${fileToEdit.outstanding.toLocaleString()}`} 
                        readOnly 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agent">Assigned Agent</Label>
                      <Input id="agent" value={fileToEdit.assignedAgent || 'Unassigned'} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact">Contact Number</Label>
                      <Input id="contact" value={fileToEdit.contactNumber || ''} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" value={fileToEdit.address || ''} readOnly />
                    </div>
                  </div>
                </div>
              )}
              
              {editType === 'remarks' && (
                <div className="space-y-4 py-2">
                  {/* Previous notes */}
                  {fileToEdit.notesHistory && fileToEdit.notesHistory.length > 0 && (
                    <div className="space-y-3">
                      <Label>Previous Notes</Label>
                      <div className="max-h-40 overflow-y-auto space-y-2">
                        {fileToEdit.notesHistory.map((note, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-md">
                            <div className="flex justify-between items-start">
                              <p className="text-sm font-medium text-gray-900">{note.addedBy}</p>
                              <p className="text-xs text-gray-500">{note.date}</p>
                            </div>
                            <p className="text-sm text-gray-700 mt-1">{note.note}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Add new note */}
                  <div className="space-y-2">
                    <Label htmlFor="note-text">Add Note</Label>
                    <Textarea 
                      id="note-text"
                      placeholder="Enter your note about this file..."
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      rows={5}
                    />
                  </div>
                  
                  <DialogFooter className="pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={addNote}
                      disabled={!noteText.trim()}
                    >
                      Add Note
                    </Button>
                  </DialogFooter>
                </div>
              )}
              
              {/* Permanent Address Visit Form */}
              {editType === 'permAddVisit' && (
                <div className="space-y-4 py-2">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="perm-visit-verified" 
                        checked={permAddVisitVerified} 
                        onCheckedChange={(checked) => setPermAddVisitVerified(!!checked)}
                      />
                      <Label htmlFor="perm-visit-verified" className="font-medium">Address Visited</Label>
                    </div>
                    <p className="text-xs text-gray-500">Check if you have visited this permanent address</p>
                  </div>
                  
                  {permAddVisitImage ? (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Verification Image</p>
                      <div className="relative w-full h-64 bg-gray-100 rounded-md overflow-hidden">
                        <img 
                          src={permAddVisitImage} 
                          alt="Visit verification" 
                          className="w-full h-full object-cover" 
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 h-8 w-8 p-0"
                          onClick={() => setPermAddVisitImage(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="perm-visit-image">Upload Visit Photo</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                        <Camera className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 mb-4">Upload a photo of the address visit</p>
                        <input
                          id="perm-visit-image"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, 'permAddVisit')}
                        />
                        <Button asChild size="sm" disabled={!permAddVisitVerified}>
                          <label htmlFor="perm-visit-image" className="cursor-pointer">
                            Upload Photo
                          </label>
                        </Button>
                        {permAddVisitVerified && !permAddVisitImage && (
                          <p className="text-xs text-yellow-600 mt-2">Photo is required to verify visit</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-sm text-yellow-800">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                      <div>
                        <p className="font-medium">Image Required</p>
                        <p className="mt-1">You must upload a photo to mark this address as visited.</p>
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter className="pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={() => updateVisitStatus('permAddVisit')}
                      disabled={permAddVisitVerified && !permAddVisitImage}
                    >
                      {permAddVisitVerified ? 'Save Visit Verification' : 'Save Status'}
                    </Button>
                  </DialogFooter>
                </div>
              )}
              
              {/* Present Address Visit Form */}
              {editType === 'presAddVisit' && (
                <div className="space-y-4 py-2">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="pres-visit-verified" 
                        checked={presAddVisitVerified} 
                        onCheckedChange={(checked) => setPresAddVisitVerified(!!checked)}
                      />
                      <Label htmlFor="pres-visit-verified" className="font-medium">Address Visited</Label>
                    </div>
                    <p className="text-xs text-gray-500">Check if you have visited this present address</p>
                  </div>
                  
                  {presAddVisitImage ? (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Verification Image</p>
                      <div className="relative w-full h-64 bg-gray-100 rounded-md overflow-hidden">
                        <img 
                          src={presAddVisitImage} 
                          alt="Visit verification" 
                          className="w-full h-full object-cover" 
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 h-8 w-8 p-0"
                          onClick={() => setPresAddVisitImage(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="pres-visit-image">Upload Visit Photo</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                        <Camera className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 mb-4">Upload a photo of the address visit</p>
                        <input
                          id="pres-visit-image"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, 'presAddVisit')}
                        />
                        <Button asChild size="sm" disabled={!presAddVisitVerified}>
                          <label htmlFor="pres-visit-image" className="cursor-pointer">
                            Upload Photo
                          </label>
                        </Button>
                        {presAddVisitVerified && !presAddVisitImage && (
                          <p className="text-xs text-yellow-600 mt-2">Photo is required to verify visit</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-sm text-yellow-800">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                      <div>
                        <p className="font-medium">Image Required</p>
                        <p className="mt-1">You must upload a photo to mark this address as visited.</p>
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter className="pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={() => updateVisitStatus('presAddVisit')}
                      disabled={presAddVisitVerified && !presAddVisitImage}
                    >
                      {presAddVisitVerified ? 'Save Visit Verification' : 'Save Status'}
                    </Button>
                  </DialogFooter>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}