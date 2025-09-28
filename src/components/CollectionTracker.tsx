import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Search, Plus, Download, TrendingUp, DollarSign, Target, Calendar, IndianRupee, Eye, Check, X, Clock, Upload, FileImage, Settings, AlertTriangle, FileSpreadsheet, Trash2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useAuth, useIsAdmin } from '../contexts/AuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from './ui/dropdown-menu';

export function CollectionTracker() {
  const { user } = useAuth();
  const isAdmin = useIsAdmin();
  const [, forceUpdate] = React.useReducer(x => x + 1, 0); // Force re-render mechanism
  
  // Debugging: Log authentication status
  useEffect(() => {
    console.log('User:', user);
    console.log('Is Admin:', isAdmin);
    console.log('User Role:', user?.role);
    forceUpdate(); // Force re-render after auth check
  }, [user, isAdmin]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBank, setSelectedBank] = useState('all');
  const [selectedAgent, setSelectedAgent] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [isCustomDateRange, setIsCustomDateRange] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Debugging: Log dialog state changes
  useEffect(() => {
    console.log('isAddDialogOpen:', isAddDialogOpen);
  }, [isAddDialogOpen]);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isTargetDialogOpen, setIsTargetDialogOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<any>(null);
  const [proofImages, setProofImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [clientSearch, setClientSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [noProofProvided, setNoProofProvided] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [collectionData, setCollectionData] = useState<any[]>([]);
  const [monthlyTargets, setMonthlyTargets] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [targetMonth, setTargetMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
  const [targetYear, setTargetYear] = useState('2024');
  const [targetAmount, setTargetAmount] = useState('1500000'); // Add this state for target amount

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
    console.log('🔄 Checking localStorage for existing data...');
    
    const savedCollections = localStorage.getItem('collectionData');
    if (!savedCollections) {
      // Force refresh data with September 2025 dates and approved status
      console.log('✨ No existing data found, initializing with default data...');
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
          status: 'approved',
          submittedAt: '2024-07-26 16:20:00',
          approvedAt: '2024-07-26 18:30:00',
          approvedBy: 'admin@company.com',
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
      console.log('✨ Setting fresh collection data with 3 approved collections');
      setCollectionData(defaultCollections);
      localStorage.setItem('collectionData', JSON.stringify(defaultCollections));
      
      // Force component re-render
      forceUpdate();
    } else {
      try {
        // Load collections from localStorage
        const parsedCollections = JSON.parse(savedCollections);
        setCollectionData(parsedCollections);
      } catch (error) {
        console.error('Error parsing saved collections:', error);
      }
    }

    // Load monthly targets
    const savedTargets = localStorage.getItem('monthlyTargets');
    if (!savedTargets) {
      // Default targets for 2024 - Full year
      const defaultTargets = [
        { month: 'Jan 2024', target: 1500000 },
        { month: 'Feb 2024', target: 1500000 },
        { month: 'Mar 2024', target: 1500000 },
        { month: 'Apr 2024', target: 1500000 },
        { month: 'May 2024', target: 1500000 },
        { month: 'Jun 2024', target: 1500000 },
        { month: 'Jul 2024', target: 1500000 },
        { month: 'Aug 2024', target: 1500000 },
        { month: 'Sep 2024', target: 1500000 },
        { month: 'Oct 2024', target: 1500000 },
        { month: 'Nov 2024', target: 1500000 },
        { month: 'Dec 2024', target: 1500000 }
      ];
      setMonthlyTargets(defaultTargets);
      localStorage.setItem('monthlyTargets', JSON.stringify(defaultTargets));
    } else {
      try {
        const parsedTargets = JSON.parse(savedTargets);
        setMonthlyTargets(parsedTargets);
      } catch (error) {
        console.error('Error parsing saved targets:', error);
      }
    }
  }, []);

  // Listen for localStorage changes to update data in real-time
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'collectionData' && e.newValue) {
        try {
          const parsedCollections = JSON.parse(e.newValue);
          setCollectionData(parsedCollections);
        } catch (error) {
          console.error('Error parsing collection data from storage event:', error);
        }
      } else if (e.key === 'monthlyTargets' && e.newValue) {
        try {
          const parsedTargets = JSON.parse(e.newValue);
          setMonthlyTargets(parsedTargets);
        } catch (error) {
          console.error('Error parsing targets data from storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Save collections to localStorage whenever it changes
  useEffect(() => {
    if (collectionData.length > 0) {
      localStorage.setItem('collectionData', JSON.stringify(collectionData));
      console.log('💾 Saved collections to localStorage:', collectionData.length, 'items');
      console.log('📋 Collections data:', collectionData.map(c => ({
        id: c.id,
        clientName: c.clientName,
        status: c.status,
        date: c.date,
        amount: c.amountCollected
      })));
    }
  }, [collectionData]);

  // Save targets to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('monthlyTargets', JSON.stringify(monthlyTargets));
  }, [monthlyTargets]);

  // Get monthly trend data based on actual collections and targets
  const getMonthlyTrendData = () => {
    console.log('\n🚀 === ACTUAL CHART DATA ===');
    
    // Get all months from monthlyTargets
    const months = monthlyTargets.map(target => target.month);
    
    // Calculate achieved amounts from collectionData
    const monthlyAchieved: Record<string, number> = {};
    
    // Initialize all months with 0
    months.forEach(month => {
      monthlyAchieved[month] = 0;
    });
    
    // Sum up approved collections by month
    collectionData.forEach(collection => {
      if (collection.status === 'approved') {
        const collectionMonth = new Date(collection.date).toLocaleString('default', { month: 'short', year: 'numeric' });
        const formattedMonth = collectionMonth.replace(' ', ' '); // Ensure consistent format
        
        if (monthlyAchieved.hasOwnProperty(formattedMonth)) {
          monthlyAchieved[formattedMonth] += collection.amountCollected;
        } else {
          // For months not in targets, initialize them
          monthlyAchieved[formattedMonth] = collection.amountCollected;
        }
      }
    });
    
    // Create chart data from targets and achieved amounts
    const chartData = monthlyTargets.map(target => ({
      month: target.month,
      achieved: monthlyAchieved[target.month] || 0,
      target: target.target
    }));
    
    // Also include months that have collections but no targets
    Object.keys(monthlyAchieved).forEach(month => {
      if (!chartData.some(data => data.month === month)) {
        chartData.push({
          month,
          achieved: monthlyAchieved[month],
          target: 0 // No target set
        });
      }
    });
    
    // Sort chart data chronologically
    const sortedChartData = chartData.sort((a, b) => {
      const [aMonth, aYear] = a.month.split(' ');
      const [bMonth, bYear] = b.month.split(' ');
      
      // First compare years
      if (parseInt(aYear) !== parseInt(bYear)) {
        return parseInt(aYear) - parseInt(bYear);
      }
      
      // If years are the same, compare months
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.indexOf(aMonth) - months.indexOf(bMonth);
    });
    
    console.log('📊 Actual chart data:', sortedChartData);
    return sortedChartData;
  };

  const monthlyTrendData = getMonthlyTrendData();
  
  // Debug: Log the chart data
  console.log('📊 Chart data for rendering:', monthlyTrendData);
  
  // Fallback data if no data exists
  const chartData = monthlyTrendData.length > 0 ? monthlyTrendData : [
    { month: 'Sep 2025', achieved: 0, target: 1500000 }
  ];
  
  console.log('📊 Final chart data:', chartData);

  // Get available months from collection data
  const getAvailableMonths = () => {
    const months = new Set<string>();
    
    collectionData.forEach(collection => {
      const date = new Date(collection.date);
      const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      months.add(monthYear);
    });
    
    // Add default months if no data
    if (months.size === 0) {
      const now = new Date();
      for (let i = 0; i < 12; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.add(date.toLocaleString('default', { month: 'long', year: 'numeric' }));
      }
    }
    
    return Array.from(months).sort();
  };

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
    if (isAdmin) {
      // For admins, return all files from all agents
      const allFiles: any[] = [];
      Object.values(agentAssignments).forEach(agent => {
        allFiles.push(...agent.assignedFiles);
      });
      return allFiles;
    }
    return agentAssignments[user?.email as keyof typeof agentAssignments]?.assignedFiles || [];
  };

  // Function to find client details by ID
  const getClientDetails = (clientId: string) => {
    const currentAgentFiles = getCurrentAgentFiles();
    return currentAgentFiles.find(file => file.clientId === clientId);
  };

  // Handle client ID selection and auto-populate client name
  const handleClientIdChange = (clientId: string) => {
    console.log("handleClientIdChange called with clientId:", clientId);
    const clientDetails = getClientDetails(clientId);
    console.log("Client details found:", clientDetails);
    
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
      
      // Month filtering
      let matchesMonth = true;
      if (selectedMonth !== 'all') {
        const itemDate = new Date(item.date);
        const itemMonthYear = itemDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        matchesMonth = itemMonthYear === selectedMonth;
      }
      
      // Date range filtering
      let matchesDateRange = true;
      if (isCustomDateRange && dateRange.start && dateRange.end) {
        const itemDate = new Date(item.date);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        matchesDateRange = itemDate >= startDate && itemDate <= endDate;
      }
      
      return matchesSearch && matchesBank && matchesAgent && matchesStatus && matchesMonth && matchesDateRange;
    });
    
    return filtered;
  };
  
  const filteredData = getFilteredCollections();
  
  // Get current month target
  const getCurrentMonthTarget = () => {
    const currentMonth = new Date().toLocaleString('default', { month: 'short', year: 'numeric' });
    const target = monthlyTargets.find(t => t.month === currentMonth);
    return target ? target.target : 1500000;
  };
  
  // Get total overdue files from localStorage
  const getTotalOverdueFiles = () => {
    const savedBankFiles = localStorage.getItem('bankFiles');
    if (savedBankFiles) {
      try {
        const bankFiles = JSON.parse(savedBankFiles);
        // Count files with expired dates
        return bankFiles.filter((file: any) => {
          if (file.expiryDate) {
            const expiryDate = new Date(file.expiryDate);
            const today = new Date();
            return expiryDate < today;
          }
          return false;
        }).length;
      } catch (error) {
        console.error('Error parsing bank files:', error);
        return 0;
      }
    }
    return 0;
  };
  
  const summaryStats = {
    totalCollected: filteredData.reduce((sum, item) => sum + (item.status === 'approved' ? item.amountCollected : 0), 0),
    monthlyTarget: getCurrentMonthTarget(),
    averagePercent: filteredData.length > 0 ? 
      (filteredData.reduce((sum, item) => sum + (item.status === 'approved' ? item.amountCollected : 0), 0) / getCurrentMonthTarget()) * 100 : 0,
    totalTransactions: filteredData.filter(item => item.status === 'approved').length,
    totalOverdue: getTotalOverdueFiles()
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
    console.log("handleImageSelect called");
    console.log("Files selected:", event.target.files);
    
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
    
    // Reset the file input value to allow selecting the same file again
    event.target.value = '';
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

  const handleDeleteCollection = async (collectionId: number) => {
    // Find the collection to get client name for better UX
    const collectionToDelete = collectionData.find(collection => collection.id === collectionId);
    const clientName = collectionToDelete ? collectionToDelete.clientName : 'this collection';
    
    // Confirm deletion with more specific information
    const confirmDelete = window.confirm(`Are you sure you want to delete the collection record for ${clientName}? This action cannot be undone.`);
    if (!confirmDelete) return;
    
    try {
      const updatedData = collectionData.filter(collection => collection.id !== collectionId);
      setCollectionData(updatedData);
      // Save to localStorage immediately
      localStorage.setItem('collectionData', JSON.stringify(updatedData));
      
      // Show success message with client name
      alert(`Collection record for ${clientName} deleted successfully!`);
      
    } catch (error) {
      console.error('Error deleting collection:', error);
      alert('Failed to delete collection. Please try again.');
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
    console.log("handleAddCollection called");
    console.log("newCollection:", newCollection);
    console.log("proofImages:", proofImages);
    console.log("noProofProvided:", noProofProvided);
    
    if (!newCollection.clientId || !newCollection.amountCollected) {
      alert('Please fill all required fields');
      return;
    }

    if (!noProofProvided && proofImages.length === 0) {
      alert('Please upload at least one proof image or check "Customer didn\'t provide proof"');
      return;
    }

    // Only check file assignment for agents, not admins
    if (!isAdmin) {
      const currentAgent = agentAssignments[user?.email as keyof typeof agentAssignments];
      if (!currentAgent?.assignedFiles.some(file => file.clientId === newCollection.clientId)) {
        alert('You can only add collections for your assigned files');
        return;
      }
    }

    // Add new collection to state
    const clientDetails = getClientDetails(newCollection.clientId);
    const newCollectionData = {
      id: Math.max(...collectionData.map(c => c.id)) + 1, // Generate new ID
      month: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }), // Dynamic month
      agent: isAdmin ? 'Admin' : agentAssignments[user?.email as keyof typeof agentAssignments]?.name || 'Unknown',
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
    
    console.log("New collection data:", newCollectionData);
    
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

  // Debugging: Log dialog state changes
  useEffect(() => {
    console.log('Target Dialog Open:', isTargetDialogOpen);
    console.log('isAdmin:', isAdmin);
    console.log('user:', user);
  }, [isTargetDialogOpen, isAdmin, user]);
  
  // Debugging: Check for rapid state changes
  const previousDialogState = React.useRef(isTargetDialogOpen);
  useEffect(() => {
    if (previousDialogState.current !== isTargetDialogOpen) {
      console.log('Dialog state changed from', previousDialogState.current, 'to', isTargetDialogOpen);
      previousDialogState.current = isTargetDialogOpen;
    }
  }, [isTargetDialogOpen]);

  // Debugging: Check if dialog is rendered
  useEffect(() => {
    console.log('Checking if dialog is rendered in DOM');
    const dialogElement = document.querySelector('[data-slot="dialog"]');
    console.log('Dialog element found:', dialogElement);
    if (dialogElement) {
      console.log('Dialog element style:', (dialogElement as HTMLElement).style);
    }
    
    const dialogContentElement = document.querySelector('[data-slot="dialog-content"]');
    console.log('Dialog content element found:', dialogContentElement);
    if (dialogContentElement) {
      console.log('Dialog content element style:', (dialogContentElement as HTMLElement).style);
    }
  }, [isTargetDialogOpen]);

  // Handle target update
  const handleUpdateTarget = (month: string, newTarget: number) => {
    console.log('Updating target for month:', month, 'to:', newTarget);
    setMonthlyTargets(prevTargets => {
      const updated = prevTargets.map(target => 
        target.month === month ? { ...target, target: newTarget } : target
      );
      console.log('Updated targets:', updated);
      return updated;
    });
  };

  // Handle adding a new target month
  const handleAddTargetMonth = () => {
    console.log('Add Month button clicked');
    console.log('Target Month:', targetMonth);
    console.log('Target Year:', targetYear);
    console.log('Target Amount:', targetAmount);
    console.log('Current monthlyTargets:', monthlyTargets);
  
    // Validation
    if (!targetMonth || !targetYear) {
      alert('Please select both month and year!');
      return;
    }
    
    if (!targetAmount || Number(targetAmount) <= 0) {
      alert('Please enter a valid target amount!');
      return;
    }
  
    const monthYear = `${targetMonth.substring(0, 3)} ${targetYear}`; // Use 3-letter month format
    const existingTarget = monthlyTargets.find(t => t.month === monthYear);
  
    if (!existingTarget) {
      const newTarget = { month: monthYear, target: Number(targetAmount) || 1500000 };
      console.log('Adding new target:', newTarget);
      setMonthlyTargets(prev => {
        const updated = [...prev, newTarget].sort((a, b) => {
          // Sort by year then by month
          const [aMonth, aYear] = a.month.split(' ');
          const [bMonth, bYear] = b.month.split(' ');
          
          if (aYear !== bYear) {
            return parseInt(aYear) - parseInt(bYear);
          }
          
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return months.indexOf(aMonth) - months.indexOf(bMonth);
        });
        console.log('Updated targets:', updated);
        return updated;
      });
      // Reset form
      setTargetAmount('1500000');
      setTargetMonth(new Date().toLocaleString('default', { month: 'long' }));
      setTargetYear('2025');
      // Show success message
      alert(`🎯 Target for ${targetMonth} ${targetYear} added successfully!\n💰 Amount: BDT ${Number(targetAmount).toLocaleString()}`);
    } else {
      // Show message that target already exists
      alert(`⚠️ Target for ${targetMonth} ${targetYear} already exists!

Current target: BDT ${existingTarget.target.toLocaleString()}

You can edit it in the list below.`);
    }
  };

  // Handle setting all 12 months at once
  const handleSetAll12Months = () => {
    console.log('Set All 12 Months button clicked');
    console.log('Target Year:', targetYear);
    console.log('Target Amount:', targetAmount);
    
    // Validation
    if (!targetYear) {
      alert('Please select a year!');
      return;
    }
    
    if (!targetAmount || Number(targetAmount) <= 0) {
      alert('Please enter a valid target amount!');
      return;
    }
    
    const targetValue = Number(targetAmount);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Check if any months already exist for this year
    const existingMonths = monthlyTargets.filter(t => t.month.includes(targetYear));
    
    if (existingMonths.length > 0) {
      const confirmMessage = `⚠️ Found ${existingMonths.length} existing targets for ${targetYear}:\n\n` +
        existingMonths.map(t => `• ${t.month}: BDT ${t.target.toLocaleString()}`).join('\n') +
        `

Do you want to:
• Replace all existing targets
• Keep existing and add missing months only?`;
      
      const choice = confirm(confirmMessage + '\n\nClick OK to REPLACE ALL, Cancel to ADD MISSING ONLY');
      
      if (choice) {
        // Replace all - remove existing targets for this year
        setMonthlyTargets(prev => {
          const filtered = prev.filter(t => !t.month.includes(targetYear));
          const newTargets = months.map(month => ({
            month: `${month} ${targetYear}`,
            target: targetValue
          }));
          return [...filtered, ...newTargets].sort((a, b) => {
            const [aMonth, aYear] = a.month.split(' ');
            const [bMonth, bYear] = b.month.split(' ');
            if (aYear !== bYear) return parseInt(aYear) - parseInt(bYear);
            return months.indexOf(aMonth) - months.indexOf(bMonth);
          });
        });
        alert(`🎯 All 12 months for ${targetYear} have been set!\n💰 Target Amount: BDT ${targetValue.toLocaleString()} per month`);
      } else {
        // Add missing months only
        const existingMonthNames = existingMonths.map(t => t.month.split(' ')[0]);
        const missingMonths = months.filter(month => !existingMonthNames.includes(month));
        
        if (missingMonths.length === 0) {
          alert(`✅ All 12 months for ${targetYear} already exist!\n\nNo new targets to add.`);
          return;
        }
        
        setMonthlyTargets(prev => {
          const newTargets = missingMonths.map(month => ({
            month: `${month} ${targetYear}`,
            target: targetValue
          }));
          return [...prev, ...newTargets].sort((a, b) => {
            const [aMonth, aYear] = a.month.split(' ');
            const [bMonth, bYear] = b.month.split(' ');
            if (aYear !== bYear) return parseInt(aYear) - parseInt(bYear);
            return months.indexOf(aMonth) - months.indexOf(bMonth);
          });
        });
        alert(`🎯 Added ${missingMonths.length} missing months for ${targetYear}!\n💰 Target Amount: BDT ${targetValue.toLocaleString()} per month\n\nAdded: ${missingMonths.join(', ')}`);
      }
    } else {
      // No existing targets for this year, add all 12 months
      const newTargets = months.map(month => ({
        month: `${month} ${targetYear}`,
        target: targetValue
      }));
      
      setMonthlyTargets(prev => {
        const updated = [...prev, ...newTargets].sort((a, b) => {
          const [aMonth, aYear] = a.month.split(' ');
          const [bMonth, bYear] = b.month.split(' ');
          if (aYear !== bYear) return parseInt(aYear) - parseInt(bYear);
          return months.indexOf(aMonth) - months.indexOf(bMonth);
        });
        return updated;
      });
      
      alert(`🎯 All 12 months for ${targetYear} have been set successfully!\n💰 Target Amount: BDT ${targetValue.toLocaleString()} per month\n\n📅 Created: Jan ${targetYear} - Dec ${targetYear}`);
    }
    
    // Reset form
    setTargetAmount('1500000');
    setTargetMonth(new Date().toLocaleString('default', { month: 'long' }));
  };

  // Export to Excel function
  const exportToExcel = (data: any[], fileName: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Collections');
    
    // Auto-size columns
    const colWidths: any[] = [];
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    for (let C = range.s.c; C <= range.e.c; ++C) {
      let maxWidth = 10;
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const cellAddress = XLSX.utils.encode_cell({r: R, c: C});
        const cell = worksheet[cellAddress];
        if (cell && cell.v) {
          const cellValue = cell.v.toString();
          maxWidth = Math.max(maxWidth, cellValue.length);
        }
      }
      colWidths.push({wch: Math.min(maxWidth + 2, 50)});
    }
    worksheet['!cols'] = colWidths;
    
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  // Handle export button click
  const handleExport = () => {
    // Prepare data for export
    const exportData = filteredData.map(item => ({
      'Client ID': item.clientId,
      'Client Name': item.clientName,
      'Agent': item.agent,
      'Bank': item.bank,
      'File Type': item.fileType,
      'Amount Collected': item.amountCollected,
      'Date': item.date,
      'Recovery %': item.percent,
      'Payment Method': item.paymentMethod,
      'Status': item.status,
      'Submitted At': item.submittedAt,
      'Approved At': item.approvedAt || 'N/A',
      'Approved By': item.approvedBy || 'N/A',
      'Notes': item.notes
    }));
    
    // Create descriptive filename based on current filters
    const filterDescription: string[] = [];
    if (selectedMonth !== 'all') {
      filterDescription.push(selectedMonth.replace(/\s+/g, '_'));
    }
    if (isCustomDateRange && dateRange.start && dateRange.end) {
      filterDescription.push(`${dateRange.start}_to_${dateRange.end}`);
    }
    if (selectedBank !== 'all') {
      filterDescription.push(selectedBank);
    }
    if (selectedStatus !== 'all') {
      filterDescription.push(selectedStatus);
    }
    
    const fileNameSuffix = filterDescription.length > 0 
      ? filterDescription.join('_') 
      : 'All_Data';
    
    exportToExcel(exportData, `Collection_Tracker_${fileNameSuffix}_${new Date().toISOString().split('T')[0]}`);
  };

  // Export by specific month
  const handleExportByMonth = (month: string) => {
    // Filter data by selected month
    const monthData = collectionData.filter(item => {
      const itemDate = new Date(item.date);
      const itemMonthYear = itemDate.toLocaleString('default', { month: 'long', year: 'numeric' });
      return itemMonthYear === month;
    });
    
    if (monthData.length === 0) {
      alert(`No data found for ${month}`);
      return;
    }
    
    // Prepare data for export
    const exportData = monthData.map(item => ({
      'Client ID': item.clientId,
      'Client Name': item.clientName,
      'Agent': item.agent,
      'Bank': item.bank,
      'File Type': item.fileType,
      'Amount Collected': item.amountCollected,
      'Date': item.date,
      'Recovery %': item.percent,
      'Payment Method': item.paymentMethod,
      'Status': item.status,
      'Submitted At': item.submittedAt,
      'Approved At': item.approvedAt || 'N/A',
      'Approved By': item.approvedBy || 'N/A',
      'Notes': item.notes
    }));
    
    exportToExcel(exportData, `Collection_Tracker_${month.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`);
  };

  // Export by specific year
  const handleExportByYear = (year: string) => {
    // Filter data by selected year
    const yearData = collectionData.filter(item => {
      const itemDate = new Date(item.date);
      return !isNaN(itemDate.getTime()) && itemDate.getFullYear().toString() === year;
    });
    
    if (yearData.length === 0) {
      alert(`No data found for ${year}`);
      return;
    }
    
    // Prepare data for export
    const exportData = yearData.map(item => ({
      'Client ID': item.clientId,
      'Client Name': item.clientName,
      'Agent': item.agent,
      'Bank': item.bank,
      'File Type': item.fileType,
      'Amount Collected': item.amountCollected,
      'Date': item.date,
      'Recovery %': item.percent,
      'Payment Method': item.paymentMethod,
      'Status': item.status,
      'Submitted At': item.submittedAt,
      'Approved At': item.approvedAt || 'N/A',
      'Approved By': item.approvedBy || 'N/A',
      'Notes': item.notes
    }));
    
    exportToExcel(exportData, `Collection_Tracker_${year}_${new Date().toISOString().split('T')[0]}`);
  };

  // Export by date range
  const handleExportByDateRange = (startDate: string, endDate: string) => {
    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      alert('Invalid date format. Please use YYYY-MM-DD format.');
      return;
    }
    
    if (start > end) {
      alert('Start date must be before end date.');
      return;
    }
    
    // Filter data by date range
    const rangeData = collectionData.filter(item => {
      const itemDate = new Date(item.date);
      return !isNaN(itemDate.getTime()) && itemDate >= start && itemDate <= end;
    });
    
    if (rangeData.length === 0) {
      alert(`No data found between ${startDate} and ${endDate}`);
      return;
    }
    
    // Prepare data for export
    const exportData = rangeData.map(item => ({
      'Client ID': item.clientId,
      'Client Name': item.clientName,
      'Agent': item.agent,
      'Bank': item.bank,
      'File Type': item.fileType,
      'Amount Collected': item.amountCollected,
      'Date': item.date,
      'Recovery %': item.percent,
      'Payment Method': item.paymentMethod,
      'Status': item.status,
      'Submitted At': item.submittedAt,
      'Approved At': item.approvedAt || 'N/A',
      'Approved By': item.approvedBy || 'N/A',
      'Notes': item.notes
    }));
    
    exportToExcel(exportData, `Collection_Tracker_${startDate}_to_${endDate}_${new Date().toISOString().split('T')[0]}`);
  };

  const availableMonths = getAvailableMonths();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Collection Tracker</h1>
          <p className="text-gray-600 mt-1">Monitor and manage payment collections</p>
        </div>
        <div className="flex gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuItem onClick={handleExport}>
                Export Filtered Data
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                // Export all data without filters
                const exportData = collectionData.map(item => ({
                  'Client ID': item.clientId,
                  'Client Name': item.clientName,
                  'Agent': item.agent,
                  'Bank': item.bank,
                  'File Type': item.fileType,
                  'Amount Collected': item.amountCollected,
                  'Date': item.date,
                  'Recovery %': item.percent,
                  'Payment Method': item.paymentMethod,
                  'Status': item.status,
                  'Submitted At': item.submittedAt,
                  'Approved At': item.approvedAt || 'N/A',
                  'Approved By': item.approvedBy || 'N/A',
                  'Notes': item.notes
                }));
                exportToExcel(exportData, `Collection_Tracker_All_Data_${new Date().toISOString().split('T')[0]}`);
              }}>
                Export All Data
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Export by Month</DropdownMenuLabel>
              {availableMonths.map((month, index) => (
                <DropdownMenuItem 
                  key={index} 
                  onClick={() => handleExportByMonth(month)}
                  className="pl-6"
                >
                  {month}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Export by Year</DropdownMenuLabel>
              {Array.from(new Set(collectionData.map(item => new Date(item.date).getFullYear()))).map((year: unknown) => (
                <DropdownMenuItem 
                  key={year as number} 
                  onClick={() => handleExportByYear((year as number).toString())}
                  className="pl-6"
                >
                  {year as number}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Always show button for debugging - remove isAdmin condition */}
          <Button 
            variant="outline" 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-gray-800"
            onClick={() => {
              console.log('Set Targets button clicked');
              console.log('isAdmin:', isAdmin);
              console.log('user:', user);
              try {
                setIsTargetDialogOpen(true);
                console.log('Set isTargetDialogOpen to true');
              } catch (error) {
                console.error('Error opening dialog:', error);
              }
            }}
          >
            <Target className="h-4 w-4" />
            Set Targets
          </Button>
          {/* Add Collection button - only visible for agents */}
          {!isAdmin && (
            <Button 
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-md shadow-md"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">Add Collection</span>
            </Button>
          )}
          {/* For debugging: Show button for all users temporarily */}
          {isAdmin && (
            <Button 
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-md shadow-md"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">Add Collection</span>
            </Button>
          )}

        </div>
      </div>
      
      {/* Set Targets Dialog - always render for debugging */}
      <Dialog open={isTargetDialogOpen} onOpenChange={(open) => {
        console.log('Dialog onOpenChange called with:', open);
        try {
          setIsTargetDialogOpen(open);
          console.log('Set isTargetDialogOpen to:', open);
        } catch (error) {
          console.error('Error in onOpenChange:', error);
        }
      }}>
        <DialogContent className="max-w-[95vw] w-full h-[85vh] max-h-[85vh] flex flex-col overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
            <DialogTitle>Set Monthly Targets</DialogTitle>
            <p className="text-sm text-gray-600">Define collection targets for each month</p>
          </DialogHeader>
          
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto">
            {/* Add new month/year - Always Visible Form */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 sticky top-0 z-10">
              <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Plus className="h-5 w-5 text-blue-600" />
                Add New Target Month
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 items-end">
                {/* Month Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 block">Select Month</Label>
                  <Select value={targetMonth} onValueChange={setTargetMonth}>
                    <SelectTrigger className="h-10 text-sm w-full">
                      <SelectValue placeholder="Choose Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
                        <SelectItem key={month} value={month}>{month}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Year Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 block">Select Year</Label>
                  <Select value={targetYear} onValueChange={setTargetYear}>
                    <SelectTrigger className="h-10 text-sm w-full">
                      <SelectValue placeholder="Choose Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 6 }, (_, i) => 2020 + i).map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Target Amount */}
                <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                  <Label className="text-sm font-medium text-gray-700 block">Target Amount (BDT)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">৳</span>
                    <Input
                      type="number"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                      className="pl-8 h-10 text-sm font-medium text-right pr-3 w-full"
                      min="0"
                      step="10000"
                      placeholder="1500000"
                    />
                  </div>
                </div>
              </div>
              
              {/* Buttons Row */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button 
                  onClick={handleAddTargetMonth} 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 text-sm rounded-md shadow-md border-0 w-full"
                  style={{ backgroundColor: '#2563eb', color: 'white' }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Target Month
                </Button>
                
                <Button 
                  onClick={handleSetAll12Months} 
                  className="bg-green-600 hover:bg-green-700 text-white font-bold h-10 text-sm rounded-md shadow-md border-0 w-full"
                  style={{ backgroundColor: '#16a34a', color: 'white' }}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Set All 12 Months ({targetYear})
                </Button>
              </div>
              
              {/* Helper Text */}
              <div className="mt-3 text-xs text-blue-700 bg-blue-50 p-2 rounded border border-blue-200">
                💡 <strong>Quick Tip:</strong> Use "Set All 12 Months" to create an entire year of targets at once.
              </div>
            </div>
            {/* Existing targets - Enhanced Grid Layout */}
            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Current Monthly Targets</h3>
                <Badge variant="outline" className="px-3 py-1 bg-blue-50 text-blue-700 border-blue-200">
                  {monthlyTargets.length} {monthlyTargets.length === 1 ? 'Target' : 'Targets'} Set
                </Badge>
              </div>
              <div className="h-80 w-full border-2 border-gray-200 rounded-xl p-4 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
              {monthlyTargets.length > 0 ? (
                <div className="h-full overflow-y-auto">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2 sm:gap-3 min-h-full">
                    {monthlyTargets.map((target, index) => {
                      const achieved = monthlyTrendData.find(data => data.month === target.month)?.achieved || 0;
                      const progressPercent = Math.min((achieved / target.target) * 100, 100);
                      
                      return (
                        <div key={index} className="group relative bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-300 min-w-0 w-full h-48 flex flex-col">
                        {/* Remove Button */}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            if (confirm(`Remove target for ${target.month}?`)) {
                              setMonthlyTargets(prev => prev.filter((_, i) => i !== index));
                            }
                          }}
                          className="absolute top-1 right-1 h-5 w-5 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        
                        {/* Status Dot */}
                        <div className="absolute top-2 left-2">
                          <div className={`w-2 h-2 rounded-full ${
                            progressPercent >= 100 ? 'bg-green-500' : 
                            progressPercent >= 75 ? 'bg-blue-500' : 
                            progressPercent >= 50 ? 'bg-yellow-500' : 'bg-red-400'
                          }`}></div>
                        </div>
                        
                        {/* Month Header */}
                        <div className="text-center mb-3 pt-2">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Calendar className="h-3 w-3 text-blue-600" />
                          </div>
                          <h4 className="font-bold text-gray-800 text-xs truncate">{target.month}</h4>
                          <p className="text-xs text-gray-500">Target</p>
                        </div>
                        
                        {/* Target Amount */}
                        <div className="mb-3 flex-shrink-0">
                          <div className="text-xs text-gray-500 font-medium mb-1 text-center">Amount</div>
                          <div className="relative">
                            <Input
                              type="number"
                              value={target.target}
                              onChange={(e) => {
                                const newValue = e.target.value === '' ? 0 : Number(e.target.value);
                                handleUpdateTarget(target.month, newValue);
                              }}
                              onFocus={(e) => e.target.select()}
                              className="text-center font-bold border-gray-300 focus:border-blue-500 h-7 text-xs bg-gray-50 focus:bg-white px-1"
                              min="0"
                              step="10000"
                              placeholder="0"
                            />
                          </div>
                        </div>
                        
                        {/* Progress - Fixed bottom section */}
                        <div className="mt-auto space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Progress</span>
                            <span className="text-xs font-bold text-blue-600">{progressPercent.toFixed(0)}%</span>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full transition-all duration-500 ${
                                progressPercent >= 100 ? 'bg-green-500' : 
                                progressPercent >= 75 ? 'bg-blue-500' : 
                                progressPercent >= 50 ? 'bg-yellow-500' : 'bg-red-400'
                              }`}
                              style={{ width: `${progressPercent}%` }}
                            ></div>
                          </div>
                          
                          {/* Collected Amount */}
                          <div className="text-center">
                            <div className="text-xs text-gray-500">Collected</div>
                            <div className="text-xs font-bold text-green-600 truncate">৳{achieved.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                }
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-gray-500">
                  <Target className="h-20 w-20 mx-auto mb-6 text-gray-300" />
                  <p className="text-xl font-medium text-gray-600 mb-3">No Monthly Targets Set</p>
                  <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                    Start by adding your first monthly collection target using the form above to track your performance effectively
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mx-8">
                    <p className="text-sm text-blue-700">
                      💡 <strong>Pro Tip:</strong> Setting monthly targets helps you track collection performance, identify trends, and achieve better results
                    </p>
                  </div>
                </div>
              )}  
            </div>
            </div>
          </div>
            
          {/* Footer buttons */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <Button 
              variant="outline" 
              onClick={() => setIsTargetDialogOpen(false)}
              className="px-6 py-2"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                console.log('Save Targets button clicked');
                console.log('Current monthlyTargets:', monthlyTargets);
                setIsTargetDialogOpen(false);
                // Show success message when targets are saved
                alert('Monthly targets saved successfully!');
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
            >
              <Check className="h-4 w-4 mr-2" />
              Save Targets
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Add Collection Dialog - only for agents */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Submit Collection Report</DialogTitle>
            <p className="text-sm text-gray-600">Submit a collection report for admin approval</p>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6">
            <div className="py-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientId">Client ID *</Label>
                  <div className="space-y-2" ref={dropdownRef}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search and select client ID..."
                        value={newCollection.clientId ? `${newCollection.clientId} - ${newCollection.clientName}` : clientSearch}
                        onChange={(e) => {
                          console.log("Client ID input changed:", e.target.value);
                          if (!newCollection.clientId) {
                            setClientSearch(e.target.value);
                            setIsDropdownOpen(true);
                          }
                        }}
                        onFocus={() => {
                          console.log("Client ID input focused");
                          setIsDropdownOpen(true);
                        }}
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
                            console.log("Clear client ID button clicked");
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
                      <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto mt-1">
                        {getFilteredFiles().length > 0 ? (
                          getFilteredFiles().map(file => (
                            <div
                              key={file.clientId}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                              onClick={() => {
                                console.log("Client selected:", file.clientId);
                                handleClientIdChange(file.clientId);
                              }}
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
                      {isAdmin ? 'All files available (Admin)' : `${getCurrentAgentFiles().length} files assigned`} • 
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Amount Collected *</Label>
                  <Input
                    type="number"
                    value={newCollection.amountCollected}
                    onChange={(e) => setNewCollection({...newCollection, amountCollected: e.target.value})}
                    placeholder="Enter amount collected"
                    className="mt-1"
                    min="0"
                    step="100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter the total amount collected from this client</p>
                </div>
                <div>
                  <Label htmlFor="date">Collection Date *</Label>
                  <Input
                    type="date"
                    value={newCollection.date}
                    onChange={(e) => setNewCollection({...newCollection, date: e.target.value})}
                    className="mt-1"
                    max={new Date().toISOString().split('T')[0]}
                  />
                  <p className="text-xs text-gray-500 mt-1">Date when the collection was made</p>
                </div>
              </div>

              <div>
                <Label htmlFor="paymentMethod">Payment Method *</Label>
                <Select value={newCollection.paymentMethod} onValueChange={(value) => setNewCollection({...newCollection, paymentMethod: value})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bKash">bKash</SelectItem>
                    <SelectItem value="Nagad">Nagad</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Cheque">Cheque</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">Method used for this collection</p>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  value={newCollection.notes}
                  onChange={(e) => setNewCollection({...newCollection, notes: e.target.value})}
                  placeholder="Add any additional notes about this collection..."
                  className="mt-1"
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">Optional notes about the collection</p>
              </div>

              <div>
                <Label>Proof of Payment</Label>
                <div className="mt-2 flex flex-col gap-3">
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
                    onClick={() => {
                      console.log("Upload proof area clicked");
                      const fileInput = document.getElementById('proof-upload');
                      if (fileInput) {
                        console.log("Clicking file input");
                        fileInput.click();
                      } else {
                        console.log("File input not found");
                      }
                    }}
                  >
                    <Upload className="h-8 w-8 mx-auto text-gray-400" />
                    <p className="text-sm text-gray-600 mt-2">Click to upload proof</p>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG, PDF up to 5MB</p>
                    <input
                      id="proof-upload"
                      type="file"
                      className="hidden"
                      accept="image/*,.pdf"
                      multiple
                      onChange={(e) => {
                        console.log("File selected:", e.target.files);
                        handleImageSelect(e);
                      }}
                    />
                  </div>
                    
                  {previewImages.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {previewImages.map((preview, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={preview} 
                            alt={`Preview {index + 1}`} 
                            className="h-16 w-16 object-cover rounded-md border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                  
                <div className="flex items-center gap-2 mt-3">
                  <Checkbox 
                    id="no-proof" 
                    checked={noProofProvided}
                    onCheckedChange={(checked) => setNoProofProvided(checked as boolean)}
                  />
                  <Label htmlFor="no-proof" className="text-sm">
                    No proof available
                  </Label>
                </div>
                  
                {noProofProvided && (
                  <Textarea
                    value={newCollection.proofNote || ''}
                    onChange={(e) => setNewCollection({...newCollection, proofNote: e.target.value})}
                    placeholder="Explain why no proof is available..."
                    className="mt-2"
                    rows={2}
                  />
                )}
              </div>
            </div>
          </div>
            
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddCollection}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Check className="h-4 w-4 mr-2" />
              Submit for Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="border-0 shadow-lg">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600" />
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-100">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-600">Total Collected</h3>
              </div>
            </div>
            <span className="text-2xl font-bold text-gray-900">BDT {summaryStats.totalCollected.toLocaleString()}</span>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-600" />
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-100">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Monthly Target</h3>
            </div>
            <span className="text-2xl font-bold text-gray-900">BDT {summaryStats.monthlyTarget.toLocaleString()}</span>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-600" />
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-orange-100">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Avg Recovery %</h3>
            </div>
            <span className="text-2xl font-bold text-gray-900">{summaryStats.averagePercent.toFixed(1)}%</span>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <div className="h-2 bg-gradient-to-r from-green-500 to-green-600" />
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-100">
                <Calendar className="h-5 w-5 text-green-600" />
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
        <CardContent className="p-6" style={{ minHeight: '400px' }}>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData}>
              <defs>
                {/* Gradient for Target Area */}
                <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
                {/* Gradient for Collections Area */}
                <linearGradient id="collectionsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
              <XAxis 
                dataKey="month" 
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value, name) => [
                  `BDT ${value.toLocaleString()}`, 
                  name === 'target' ? '🎯 Target' : '💰 Collections'
                ]}
                labelStyle={{ color: '#374151', fontWeight: 'bold' }}
              />
              {/* Target Area - Blue Wave */}
              <Area 
                type="monotone" 
                dataKey="target" 
                stroke="#3B82F6" 
                strokeWidth={2}
                fill="url(#targetGradient)"
                name="target"
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4, fillOpacity: 1 }}
                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2, fill: '#fff' }}
              />
              {/* Collections Area - Red Wave */}
              <Area 
                type="monotone" 
                dataKey="achieved" 
                stroke="#EF4444" 
                strokeWidth={3}
                fill="url(#collectionsGradient)"
                name="achieved"
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 5, fillOpacity: 1 }}
                activeDot={{ r: 7, stroke: '#EF4444', strokeWidth: 2, fill: '#fff' }}
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
            
            {/* Month Filter */}
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Months" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                {availableMonths.map((month, index) => (
                  <SelectItem key={index} value={month}>{month}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
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
            {(isCustomDateRange || selectedBank !== 'all' || selectedStatus !== 'all' || selectedMonth !== 'all' || (isAdmin && selectedAgent !== 'all') || searchQuery) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedBank('all');
                  setSelectedStatus('all');
                  setSelectedAgent('all');
                  setSelectedMonth('all');
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
                        {isAdmin && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCollection(item.id)}
                            className="text-red-600 border-red-600 hover:bg-red-50 flex items-center gap-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </Button>
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