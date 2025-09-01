import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Search, Plus, Download, TrendingUp, DollarSign, Target, Calendar, IndianRupee, Eye, Check, X, Clock, Upload, FileImage } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useAuth, useIsAdmin } from '../contexts/AuthContext';

export function CollectionTracker() {
  const { user } = useAuth();
  const isAdmin = useIsAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBank, setSelectedBank] = useState('all');
  const [selectedAgent, setSelectedAgent] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [isCustomDateRange, setIsCustomDateRange] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<any>(null);
  const [proofImages, setProofImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [clientSearch, setClientSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [noProofProvided, setNoProofProvided] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [collectionData, setCollectionData] = useState<any[]>([]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Initialize default data only if localStorage is empty
  useEffect(() => {
    const savedCollections = localStorage.getItem('collectionData');
    if (!savedCollections) {
      // Default collections when no data exists in localStorage
      const defaultCollections = [
        {
          id: 1,
          month: 'July 2024',
          agent: 'Priya Singh',
          agentEmail: 'priya.singh@company.com',
          fileType: 'Credit Card',
          bank: 'DBBL',
          clientId: 'CL001234',
          clientName: 'Rajesh Kumar',
          amountCollected: 25000,
          date: '2024-07-28',
          percent: 18.5,
          receivedAmount: 25000,
          paymentMethod: 'bKash',
          status: 'approved',
          submittedAt: '2024-07-28 10:30:00',
          approvedAt: '2024-07-28 14:15:00',
          approvedBy: 'admin@company.com',
          proofImages: ['receipt1.jpg', 'payment_proof1.jpg'],
          notes: 'Partial payment collected at client location'
        },
        {
          id: 2,
          month: 'July 2024',
          agent: 'Raj Kumar',
          agentEmail: 'raj.kumar@company.com',
          fileType: 'Personal Loan',
          bank: 'One Bank',
          clientId: 'CL001235',
          clientName: 'Meera Gupta',
          amountCollected: 45000,
          date: '2024-07-27',
          percent: 50.2,
          receivedAmount: 45000,
          paymentMethod: 'Bank Transfer',
          status: 'approved',
          submittedAt: '2024-07-27 09:45:00',
          approvedAt: '2024-07-27 11:20:00',
          approvedBy: 'admin@company.com',
          proofImages: ['bank_transfer.jpg'],
          notes: 'Full payment received via bank transfer'
        },
        {
          id: 3,
          month: 'July 2024',
          agent: 'Amit Sharma',
          agentEmail: 'amit.sharma@company.com',
          fileType: 'Write-Off',
          bank: 'DBBL',
          clientId: 'CL001236',
          clientName: 'Arjun Patel',
          amountCollected: 35000,
          date: '2024-07-26',
          percent: 52.1,
          receivedAmount: 35000,
          paymentMethod: 'Cash',
          status: 'pending',
          submittedAt: '2024-07-26 16:20:00',
          approvedAt: null,
          approvedBy: null,
          proofImages: ['cash_receipt.jpg', 'client_photo.jpg'],
          notes: 'Cash payment collected, client requested receipt'
        },
        {
          id: 4,
          month: 'July 2024',
          agent: 'Priya Singh',
          agentEmail: 'priya.singh@company.com',
          fileType: 'Credit Card',
          bank: 'One Bank',
          clientId: 'CL001240',
          clientName: 'Kavya Singh',
          amountCollected: 28000,
          date: '2024-07-25',
          percent: 17.9,
          receivedAmount: 28000,
          paymentMethod: 'Cheque',
          status: 'rejected',
          submittedAt: '2024-07-25 12:15:00',
          approvedAt: '2024-07-25 18:30:00',
          approvedBy: 'admin@company.com',
          proofImages: ['cheque_image.jpg'],
          notes: 'Cheque payment - needs verification',
          rejectionReason: 'Cheque image unclear, please resubmit with better quality'
        },
        {
          id: 5,
          month: 'July 2024',
          agent: 'Raj Kumar',
          agentEmail: 'raj.kumar@company.com',
          fileType: 'Personal Loan',
          bank: 'One Bank',
          clientId: 'CL001241',
          clientName: 'Suresh Reddy',
          amountCollected: 15000,
          date: '2024-07-24',
          percent: 19.2,
          receivedAmount: 15000,
          paymentMethod: 'Nagad',
          status: 'pending',
          submittedAt: '2024-07-24 14:30:00',
          approvedAt: null,
          approvedBy: null,
          proofImages: ['nagad_screenshot.jpg'],
          notes: 'Mobile payment via Nagad'
        },
        {
          id: 6,
          month: 'July 2024',
          agent: 'Amit Sharma',
          agentEmail: 'amit.sharma@company.com',
          fileType: 'Write-Off',
          bank: 'DBBL',
          clientId: 'CL001247',
          clientName: 'Ravi Kumar',
          amountCollected: 18000,
          date: '2024-07-23',
          percent: 25.6,
          receivedAmount: 18000,
          paymentMethod: 'Cash',
          status: 'pending',
          submittedAt: '2024-07-23 11:45:00',
          approvedAt: null,
          approvedBy: null,
          proofImages: [],
          noProofProvided: true,
          proofNote: 'Customer did not provide proof images',
          notes: 'Cash payment received, customer refused to provide receipt'
        }
      ];
      
      // Set the default collections and save to localStorage
      setCollectionData(defaultCollections);
      localStorage.setItem('collectionData', JSON.stringify(defaultCollections));
    } else {
      try {
        // Load collections from localStorage
        const parsedCollections = JSON.parse(savedCollections);
        setCollectionData(parsedCollections);
      } catch (error) {
        console.error('Error parsing saved collections:', error);
      }
    }
  }, []);

  // Save collections to localStorage whenever it changes
  useEffect(() => {
    if (collectionData.length > 0) {
      localStorage.setItem('collectionData', JSON.stringify(collectionData));
      console.log('Saved collections to localStorage:', collectionData.length, 'items');
    }
  }, [collectionData]);

  const monthlyTrendData = [
    { month: 'Jan', target: 1500000, achieved: 1200000 },
    { month: 'Feb', target: 1500000, achieved: 1800000 },
    { month: 'Mar', target: 1500000, achieved: 1400000 },
    { month: 'Apr', target: 1500000, achieved: 2100000 },
    { month: 'May', target: 1500000, achieved: 1900000 },
    { month: 'Jun', target: 1500000, achieved: 2300000 },
    { month: 'Jul', target: 1500000, achieved: 1950000 },
  ];

  // Mock agent assignments - in real app, this would come from API
  const agentAssignments = {
    'priya.singh@company.com': {
      name: 'Priya Singh',
      assignedFiles: [
        { clientId: 'CL001234', clientName: 'Rajesh Kumar', bank: 'DBBL', fileType: 'Credit Card' },
        { clientId: 'CL001240', clientName: 'Kavya Singh', bank: 'One Bank', fileType: 'Credit Card' },
        { clientId: 'CL001245', clientName: 'Arjun Mehta', bank: 'DBBL', fileType: 'Personal Loan' },
        { clientId: 'CL001250', clientName: 'Sunita Sharma', bank: 'One Bank', fileType: 'Write-Off' },
        { clientId: 'CL001255', clientName: 'Vikash Gupta', bank: 'DBBL', fileType: 'Agent Banking' }
      ],
      banks: ['DBBL', 'One Bank']
    },
    'raj.kumar@company.com': {
      name: 'Raj Kumar',
      assignedFiles: [
        { clientId: 'CL001235', clientName: 'Meera Gupta', bank: 'One Bank', fileType: 'Personal Loan' },
        { clientId: 'CL001241', clientName: 'Suresh Reddy', bank: 'One Bank', fileType: 'Personal Loan' },
        { clientId: 'CL001246', clientName: 'Rohit Jain', bank: 'One Bank', fileType: 'Credit Card' },
        { clientId: 'CL001251', clientName: 'Anita Rao', bank: 'One Bank', fileType: 'Write-Off' }
      ],
      banks: ['One Bank']
    },
    'amit.sharma@company.com': {
      name: 'Amit Sharma',
      assignedFiles: [
        { clientId: 'CL001236', clientName: 'Arjun Patel', bank: 'DBBL', fileType: 'Write-Off' },
        { clientId: 'CL001242', clientName: 'Deepika Verma', bank: 'DBBL', fileType: 'Credit Card' },
        { clientId: 'CL001247', clientName: 'Ravi Kumar', bank: 'DBBL', fileType: 'Loan Branch' },
        { clientId: 'CL001252', clientName: 'Priya Nair', bank: 'DBBL', fileType: 'Agent Banking' }
      ],
      banks: ['DBBL']
    }
  };

  const getCurrentAgentFiles = () => {
    if (isAdmin) return [];
    return agentAssignments[user?.email as keyof typeof agentAssignments]?.assignedFiles || [];
  };

  // Function to find client details by ID
  const getClientDetails = (clientId: string) => {
    const currentAgentFiles = getCurrentAgentFiles();
    return currentAgentFiles.find(file => file.clientId === clientId);
  };

  // Handle client ID selection and auto-populate client name
  const handleClientIdChange = (clientId: string) => {
    const clientDetails = getClientDetails(clientId);
    setNewCollection({
      ...newCollection,
      clientId: clientId,
      clientName: clientDetails?.clientName || ''
    });
    setIsDropdownOpen(false);
    setClientSearch('');
  };

  // Filter files based on search
  const getFilteredFiles = () => {
    return getCurrentAgentFiles().filter(file => 
      clientSearch === '' ||
      file.clientId.toLowerCase().includes(clientSearch.toLowerCase()) ||
      file.clientName.toLowerCase().includes(clientSearch.toLowerCase())
    );
  };

  // Filter data based on user role
  const getFilteredCollections = () => {
    let filtered = collectionData;
    
    // If agent, show only their collections
    if (!isAdmin) {
      filtered = filtered.filter(item => item.agentEmail === user?.email);
    }
    
    // Apply other filters
    filtered = filtered.filter(item => {
      const matchesSearch = item.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.clientId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBank = selectedBank === 'all' || item.bank === selectedBank;
      const matchesAgent = selectedAgent === 'all' || item.agent === selectedAgent;
      const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
      
      // Date range filtering
      let matchesDateRange = true;
      if (isCustomDateRange && dateRange.start && dateRange.end) {
        const itemDate = new Date(item.date);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        matchesDateRange = itemDate >= startDate && itemDate <= endDate;
      }
      
      return matchesSearch && matchesBank && matchesAgent && matchesStatus && matchesDateRange;
    });
    
    return filtered;
  };
  
  const filteredData = getFilteredCollections();
  
  const summaryStats = {
    totalCollected: filteredData.reduce((sum, item) => sum + item.amountCollected, 0),
    monthlyTarget: 1500000,
    averagePercent: filteredData.length > 0 ? filteredData.reduce((sum, item) => sum + item.percent, 0) / filteredData.length : 0,
    totalTransactions: filteredData.length
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
          <Check className="h-3 w-3" />
          Approved
        </Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
          <X className="h-3 w-3" />
          Rejected
        </Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setProofImages(prev => [...prev, ...files]);
      
      // Create preview URLs
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewImages(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file as Blob);
      });
    }
  };

  const removeImage = (index: number) => {
    setProofImages(prev => prev.filter((_, i) => i !== index));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleViewCollection = (collection: any) => {
    setSelectedCollection(collection);
    setIsViewDialogOpen(true);
  };

  const handleApproveReject = async (collectionId: number, action: 'approve' | 'reject', reason?: string) => {
    try {
      const currentTime = new Date().toISOString();
      const adminEmail = user?.email || 'admin@company.com';
      
      setCollectionData(prevData => 
        prevData.map(collection => {
          if (collection.id === collectionId) {
            if (action === 'approve') {
              return {
                ...collection,
                status: 'approved',
                approvedAt: currentTime,
                approvedBy: adminEmail,
                rejectionReason: undefined // Clear any previous rejection reason
              };
            } else {
              return {
                ...collection,
                status: 'rejected',
                approvedAt: currentTime,
                approvedBy: adminEmail,
                rejectionReason: reason || 'No reason provided'
              };
            }
          }
          return collection;
        })
      );
      
      // Show success message
      alert(`Collection ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
      
    } catch (error) {
      console.error(`Error ${action}ing collection:`, error);
      alert(`Failed to ${action} collection. Please try again.`);
    }
  };

  const [newCollection, setNewCollection] = useState({
    clientId: '',
    clientName: '',
    amountCollected: '',
    paymentMethod: '',
    date: '',
    notes: ''
  });

  const handleAddCollection = () => {
    if (!newCollection.clientId || !newCollection.amountCollected) {
      alert('Please fill all required fields');
      return;
    }

    if (!noProofProvided && proofImages.length === 0) {
      alert('Please upload at least one proof image or check "Customer didn\'t provide proof"');
      return;
    }

    const currentAgent = agentAssignments[user?.email as keyof typeof agentAssignments];
    if (!currentAgent?.assignedFiles.some(file => file.clientId === newCollection.clientId)) {
      alert('You can only add collections for your assigned files');
      return;
    }

    // Add new collection to state
    const clientDetails = getClientDetails(newCollection.clientId);
    const newCollectionData = {
      id: Math.max(...collectionData.map(c => c.id)) + 1, // Generate new ID
      month: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }), // Dynamic month
      agent: currentAgent.name,
      agentEmail: user?.email,
      fileType: clientDetails?.fileType || 'Unknown',
      bank: clientDetails?.bank || 'Unknown',
      clientId: newCollection.clientId,
      clientName: newCollection.clientName,
      amountCollected: parseInt(newCollection.amountCollected),
      date: newCollection.date,
      percent: 0, // You might want to calculate this based on original amount
      receivedAmount: parseInt(newCollection.amountCollected),
      paymentMethod: newCollection.paymentMethod,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      approvedAt: null,
      approvedBy: null,
      proofImages: noProofProvided ? [] : proofImages.map(file => file.name),
      noProofProvided: noProofProvided,
      proofNote: noProofProvided ? 'Customer did not provide proof images' : null,
      notes: newCollection.notes
    };
    
    setCollectionData(prevData => {
      const updatedData = [...prevData, newCollectionData];
      // Save to localStorage immediately
      localStorage.setItem('collectionData', JSON.stringify(updatedData));
      return updatedData;
    });
    
    console.log('New collection added:', newCollectionData); // For debugging
    console.log('Updated collection data length:', collectionData.length + 1);
    
    // Reset form
    setIsAddDialogOpen(false);
    setNewCollection({
      clientId: '',
      clientName: '',
      amountCollected: '',
      paymentMethod: '',
      date: '',
      notes: ''
    });
    setProofImages([]);
    setPreviewImages([]);
    setClientSearch('');
    setIsDropdownOpen(false);
    setNoProofProvided(false);
    
    alert(`Collection report for ${newCollection.clientName} (${newCollection.clientId}) submitted successfully! It has been saved and will appear in the admin's pending approvals. The page will maintain this data even if refreshed.`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Collection Tracker</h1>
          <p className="text-gray-600 mt-1">Monitor and manage payment collections</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          {!isAdmin && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="h-4 w-4" />
                  Add Collection
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Submit Collection Report</DialogTitle>
                  <p className="text-sm text-gray-600">Submit a collection report for admin approval</p>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clientId">Client ID *</Label>
                      <div className="space-y-2" ref={dropdownRef}>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            placeholder="Search and select client ID..."
                            value={newCollection.clientId ? `${newCollection.clientId} - ${newCollection.clientName}` : clientSearch}
                            onChange={(e) => {
                              if (!newCollection.clientId) {
                                setClientSearch(e.target.value);
                                setIsDropdownOpen(true);
                              }
                            }}
                            onFocus={() => setIsDropdownOpen(true)}
                            className="pl-10 pr-8"
                            readOnly={!!newCollection.clientId}
                          />
                          {(clientSearch || newCollection.clientId) && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
                              onClick={() => {
                                setClientSearch('');
                                setNewCollection({...newCollection, clientId: '', clientName: ''});
                                setIsDropdownOpen(false);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        
                        {/* Custom Dropdown */}
                        {isDropdownOpen && !newCollection.clientId && (
                          <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                            {getFilteredFiles().length > 0 ? (
                              getFilteredFiles().map(file => (
                                <div
                                  key={file.clientId}
                                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                  onClick={() => handleClientIdChange(file.clientId)}
                                >
                                  <div className="font-medium text-sm">{file.clientId} - {file.clientName}</div>
                                  <div className="text-xs text-gray-500">{file.bank} - {file.fileType}</div>
                                </div>
                              ))
                            ) : (
                              <div className="px-3 py-2 text-gray-500 text-sm">
                                No files found matching "{clientSearch}"
                              </div>
                            )}
                          </div>
                        )}
                        
                        <p className="text-xs text-gray-500 mt-1">
                          {getCurrentAgentFiles().length} files assigned • 
                          {getFilteredFiles().length} files {clientSearch ? 'found' : 'available'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="clientName">Client Name *</Label>
                      <Input
                        value={newCollection.clientName}
                        onChange={(e) => setNewCollection({...newCollection, clientName: e.target.value})}
                        placeholder="Auto-filled from client selection"
                        className="bg-gray-50"
                        readOnly
                      />
                      <p className="text-xs text-gray-500 mt-1">Automatically filled when client ID is selected</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="amount">Amount Collected *</Label>
                      <Input
                        type="number"
                        value={newCollection.amountCollected}
                        onChange={(e) => setNewCollection({...newCollection, amountCollected: e.target.value})}
                        placeholder="Enter amount"
                      />
                    </div>
                    <div>
                      <Label htmlFor="paymentMethod">Payment Method *</Label>
                      <Select value={newCollection.paymentMethod} onValueChange={(value) => setNewCollection({...newCollection, paymentMethod: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="bkash">bKash</SelectItem>
                          <SelectItem value="nagad">Nagad</SelectItem>
                          <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                          <SelectItem value="cheque">Cheque</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="date">Collection Date *</Label>
                    <Input
                      type="date"
                      value={newCollection.date}
                      onChange={(e) => setNewCollection({...newCollection, date: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      value={newCollection.notes}
                      onChange={(e) => setNewCollection({...newCollection, notes: e.target.value})}
                      placeholder="Add any additional notes..."
                      className="min-h-[80px]"
                    />
                  </div>

                  {/* Image Upload Section */}
                  <div className="space-y-3">
                    <Label>Payment Proof Images *</Label>
                    
                    {/* No Proof Checkbox */}
                    <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <input
                        type="checkbox"
                        id="no-proof-checkbox"
                        checked={noProofProvided}
                        onChange={(e) => {
                          setNoProofProvided(e.target.checked);
                          if (e.target.checked) {
                            setProofImages([]);
                            setPreviewImages([]);
                          }
                        }}
                        className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                      />
                      <label htmlFor="no-proof-checkbox" className="text-sm font-medium text-yellow-800">
                        Customer didn't provide proof images
                      </label>
                    </div>
                    
                    {!noProofProvided ? (
                      <>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageSelect}
                            className="hidden"
                            id="image-upload"
                          />
                          <label htmlFor="image-upload" className="cursor-pointer">
                            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600 mb-1">Click to upload proof images</p>
                            <p className="text-xs text-gray-500">PNG, JPG up to 10MB each</p>
                          </label>
                        </div>
                        
                        {/* Image Previews */}
                        {previewImages.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {previewImages.map((src, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={src}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-lg border"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                                  onClick={() => removeImage(index)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                                <p className="text-xs text-gray-600 mt-1 truncate">{proofImages[index]?.name}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-gray-500">Upload proof images or check the box above if customer didn't provide any</p>
                      </>
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">
                              No Proof Images
                            </h3>
                            <div className="mt-1 text-sm text-yellow-700">
                              <p>You've indicated that the customer didn't provide proof images. This collection will be submitted without proof attachments.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleAddCollection} className="flex-1">
                      Submit for Approval
                    </Button>
                  </div>
                </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <div className="h-2 bg-gradient-to-r from-green-500 to-green-600" />
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-100">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Total Collected</h3>
            </div>
            <span className="text-2xl font-bold text-gray-900">৳{summaryStats.totalCollected.toLocaleString()}</span>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600" />
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-100">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Monthly Target</h3>
            </div>
            <span className="text-2xl font-bold text-gray-900">৳{summaryStats.monthlyTarget.toLocaleString()}</span>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-600" />
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-100">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Avg Recovery %</h3>
            </div>
            <span className="text-2xl font-bold text-gray-900">{summaryStats.averagePercent.toFixed(1)}%</span>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-600" />
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-orange-100">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Transactions</h3>
            </div>
            <span className="text-2xl font-bold text-gray-900">{summaryStats.totalTransactions}</span>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Recovery Chart */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-2">
            <IndianRupee className="h-5 w-5" />
            Monthly Recovery vs Target
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">Track monthly performance against targets</p>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={monthlyTrendData}>
              <defs>
                <linearGradient id="colorAchieved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis 
                stroke="#6B7280"
                tickFormatter={(value) => `৳${value.toLocaleString()}`}
              />
              <Tooltip 
                formatter={(value, name) => [
                  `৳${value.toLocaleString()}`, 
                  name === 'achieved' ? 'Achieved' : 'Target'
                ]}
                labelStyle={{ color: '#374151' }}
              />
              <Area 
                type="monotone" 
                dataKey="achieved" 
                stroke="#3B82F6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorAchieved)" 
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke="#EF4444" 
                strokeDasharray="5 5" 
                strokeWidth={2} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by client name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Date Filter Section */}
            <div className="flex items-center gap-2">
              <Button
                variant={!isCustomDateRange ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setIsCustomDateRange(false);
                  setDateRange({ start: '', end: '' });
                }}
                className="h-10 px-3"
              >
                All Dates
              </Button>
              <Button
                variant={isCustomDateRange ? "default" : "outline"}
                size="sm"
                onClick={() => setIsCustomDateRange(true)}
                className="h-10 px-3"
              >
                Custom Range
              </Button>
            </div>
            
            {isCustomDateRange && (
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-40"
                  placeholder="Start Date"
                />
                <span className="text-gray-500">to</span>
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-40"
                  placeholder="End Date"
                />
              </div>
            )}
            
            <Select value={selectedBank} onValueChange={setSelectedBank}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Banks</SelectItem>
                <SelectItem value="DBBL">DBBL</SelectItem>
                <SelectItem value="One Bank">One Bank</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            {isAdmin && (
              <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Agents</SelectItem>
                  <SelectItem value="Priya Singh">Priya Singh</SelectItem>
                  <SelectItem value="Raj Kumar">Raj Kumar</SelectItem>
                  <SelectItem value="Amit Sharma">Amit Sharma</SelectItem>
                </SelectContent>
              </Select>
            )}
            
            {/* Clear Filters Button */}
            {(isCustomDateRange || selectedBank !== 'all' || selectedStatus !== 'all' || (isAdmin && selectedAgent !== 'all') || searchQuery) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedBank('all');
                  setSelectedStatus('all');
                  setSelectedAgent('all');
                  setIsCustomDateRange(false);
                  setDateRange({ start: '', end: '' });
                }}
                className="h-10 px-3 text-red-600 border-red-300 hover:bg-red-50"
              >
                Clear All
              </Button>
            )}
          </div>
          
          {/* Active Filters Display */}
          {(isCustomDateRange && (dateRange.start || dateRange.end)) && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Active Filters:</span>
              {isCustomDateRange && dateRange.start && dateRange.end && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Date: {dateRange.start} to {dateRange.end}
                  <button
                    onClick={() => {
                      setDateRange({ start: '', end: '' });
                      setIsCustomDateRange(false);
                    }}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Collections Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 border-b border-gray-100">
          <CardTitle>Collection Records</CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Showing {filteredData.length} of {collectionData.length} collections
            {isCustomDateRange && dateRange.start && dateRange.end && (
              <span className="text-blue-600"> • Filtered by date range: {dateRange.start} to {dateRange.end}</span>
            )}
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Details</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Bank & Type</TableHead>
                  <TableHead>Amount Collected</TableHead>
                  <TableHead>Recovery %</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{item.clientName}</p>
                        <p className="text-sm text-gray-500">ID: {item.clientId}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-gray-900">{item.agent}</span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Badge variant="outline" className="mb-1">{item.bank}</Badge>
                        <div className="text-sm text-gray-600">{item.fileType}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-green-600">
                        ৳{item.amountCollected.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-blue-600">{item.percent}%</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{item.paymentMethod}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{item.date}</span>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(item.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewCollection(item)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                        {isAdmin && item.status === 'pending' && (
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApproveReject(item.id, 'approve')}
                              className="text-green-600 border-green-600 hover:bg-green-50"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const reason = prompt('Please provide a reason for rejection:');
                                if (reason !== null) { // User didn't cancel
                                  handleApproveReject(item.id, 'reject', reason);
                                }
                              }}
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Collection Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Collection Details</DialogTitle>
          </DialogHeader>
          {selectedCollection && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Client Name</Label>
                  <p className="text-sm">{selectedCollection.clientName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Client ID</Label>
                  <p className="text-sm">{selectedCollection.clientId}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Agent</Label>
                  <p className="text-sm">{selectedCollection.agent}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Bank & Type</Label>
                  <p className="text-sm">{selectedCollection.bank} - {selectedCollection.fileType}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Amount Collected</Label>
                  <p className="text-sm font-medium text-green-600">৳{selectedCollection.amountCollected.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Payment Method</Label>
                  <p className="text-sm">{selectedCollection.paymentMethod}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Collection Date</Label>
                  <p className="text-sm">{selectedCollection.date}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                  <div>{getStatusBadge(selectedCollection.status)}</div>
                </div>
              </div>
              {selectedCollection.notes && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Notes</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded">{selectedCollection.notes}</p>
                </div>
              )}
              <div>
                <Label className="text-sm font-medium text-gray-600">Submission Details</Label>
                <div className="text-sm bg-gray-50 p-2 rounded space-y-1">
                  <p><span className="font-medium">Submitted:</span> {selectedCollection.submittedAt}</p>
                  {selectedCollection.approvedAt && (
                    <p><span className="font-medium">Processed:</span> {selectedCollection.approvedAt}</p>
                  )}
                  {selectedCollection.approvedBy && (
                    <p><span className="font-medium">Processed by:</span> {selectedCollection.approvedBy}</p>
                  )}
                  {selectedCollection.rejectionReason && (
                    <p className="text-red-600"><span className="font-medium">Rejection Reason:</span> {selectedCollection.rejectionReason}</p>
                  )}
                </div>
              </div>
              {selectedCollection.proofImages && selectedCollection.proofImages.length > 0 ? (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Proof Images</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {selectedCollection.proofImages.map((image: string, index: number) => (
                      <div key={index} className="relative">
                        <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center border">
                          <FileImage className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-600 mt-1 truncate text-center">{image}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : selectedCollection.noProofProvided ? (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Proof Images</Label>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                          No Proof Provided
                        </h3>
                        <div className="mt-1 text-xs text-yellow-700">
                          <p>{selectedCollection.proofNote || 'Customer did not provide proof images'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}