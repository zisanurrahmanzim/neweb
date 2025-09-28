import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Search, User, Phone, Mail, MapPin, Calendar, FileText, TrendingUp, Award, Edit, Plus, Save, X, ChevronDown, Clock } from 'lucide-react';
import { useAuth, useIsAdmin } from '../contexts/AuthContext';

export function AgentDetails() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [agentData, setAgentData] = useState([
    {
      id: 1,
      name: 'Priya Singh',
      email: 'priya.singh@company.com',
      phone: '+91 9876543210',
      address: '123 Main Street, Bangalore - 560001',
      joinDate: '2023-01-15',
      status: 'Active',
      statusHistory: [
        { status: 'Active', date: '2023-01-15', reason: 'Initial activation' }
      ],
      assignedBanks: ['DBBL', 'One Bank'],
      currentFiles: 145,
      totalCollections: 2485000,
      monthlyTarget: 500000,
      performanceRating: 4.8,
      visitRate: 91,
      collectionRate: 87,
      specialization: ['Credit Card', 'Personal Loan'],
      experience: '3 years',
      lastActive: '2024-07-30',
      avatar: '/api/placeholder/64/64'
    },
    {
      id: 2,
      name: 'Raj Kumar',
      email: 'raj.kumar@company.com',
      phone: '+91 9876543211',
      address: '456 Park Avenue, Mumbai - 400001',
      joinDate: '2022-08-20',
      status: 'Active',
      statusHistory: [
        { status: 'Active', date: '2022-08-20', reason: 'Initial activation' }
      ],
      assignedBanks: ['One Bank'],
      currentFiles: 120,
      totalCollections: 2120000,
      monthlyTarget: 450000,
      performanceRating: 4.5,
      visitRate: 82,
      collectionRate: 78,
      specialization: ['Personal Loan', 'Write-Off'],
      experience: '2 years',
      lastActive: '2024-07-29',
      avatar: '/api/placeholder/64/64'
    },
    {
      id: 3,
      name: 'Amit Sharma',
      email: 'amit.sharma@company.com',
      phone: '+91 9876543212',
      address: '789 Business District, Delhi - 110001',
      joinDate: '2023-03-10',
      status: 'Active',
      statusHistory: [
        { status: 'Active', date: '2023-03-10', reason: 'Initial activation' }
      ],
      assignedBanks: ['DBBL'],
      currentFiles: 89,
      totalCollections: 1980000,
      monthlyTarget: 400000,
      performanceRating: 4.3,
      visitRate: 96,
      collectionRate: 85,
      specialization: ['Write-Off', 'Agent Banking'],
      experience: '1.5 years',
      lastActive: '2024-07-30',
      avatar: '/api/placeholder/64/64'
    },
    {
      id: 4,
      name: 'Sneha Patel',
      email: 'sneha.patel@company.com',
      phone: '+91 9876543213',
      address: '321 Tech Park, Pune - 411001',
      joinDate: '2023-06-05',
      status: 'On Hold',
      statusHistory: [
        { status: 'Active', date: '2023-06-05', reason: 'Initial activation' },
        { status: 'On Hold', date: '2024-07-20', reason: 'Performance review pending' }
      ],
      assignedBanks: ['One Bank'],
      currentFiles: 110,
      totalCollections: 1765000,
      monthlyTarget: 400000,
      performanceRating: 4.0,
      visitRate: 80,
      collectionRate: 76,
      specialization: ['Credit Card'],
      experience: '1 year',
      lastActive: '2024-07-15',
      avatar: '/api/placeholder/64/64'
    },
    {
      id: 5,
      name: 'Ravi Gupta',
      email: 'ravi.gupta@company.com',
      phone: '+91 9876543214',
      address: '654 Finance Street, Chennai - 600001',
      joinDate: '2022-11-12',
      status: 'Active',
      statusHistory: [
        { status: 'Active', date: '2022-11-12', reason: 'Initial activation' }
      ],
      assignedBanks: ['DBBL'],
      currentFiles: 95,
      totalCollections: 2325000,
      monthlyTarget: 500000,
      performanceRating: 4.9,
      visitRate: 97,
      collectionRate: 89,
      specialization: ['Agent Banking', 'Loan Branch'],
      experience: '2.5 years',
      lastActive: '2024-07-30',
      avatar: '/api/placeholder/64/64'
    }
  ]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<any>(null);
  const [newAgent, setNewAgent] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    assignedBanks: [] as string[],
    specialization: [] as string[],
    monthlyTarget: '',
    experience: '',
    status: 'Active',
    joinDate: '' // Add joinDate field
  });
  const [editAgent, setEditAgent] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    assignedBanks: [] as string[],
    specialization: [] as string[],
    monthlyTarget: '',
    experience: '',
    status: 'Active',
    joinDate: '' // Add joinDate field
  });
  const { user } = useAuth();
  const isAdmin = useIsAdmin();

  // Available options
  const bankOptions = ['DBBL', 'One Bank'];
  const specializationOptions = ['Credit Card', 'Personal Loan', 'Write-Off', 'Agent Banking', 'Loan Branch'];

  // Form handlers for new agent
  const handleBankChange = (bank: string, checked: boolean) => {
    setNewAgent(prev => ({
      ...prev,
      assignedBanks: checked 
        ? [...prev.assignedBanks, bank]
        : prev.assignedBanks.filter(b => b !== bank)
    }));
  };

  const handleSpecializationChange = (spec: string, checked: boolean) => {
    setNewAgent(prev => ({
      ...prev,
      specialization: checked 
        ? [...prev.specialization, spec]
        : prev.specialization.filter(s => s !== spec)
    }));
  };

  // Form handlers for edit agent
  const handleEditBankChange = (bank: string, checked: boolean) => {
    setEditAgent(prev => ({
      ...prev,
      assignedBanks: checked 
        ? [...prev.assignedBanks, bank]
        : prev.assignedBanks.filter(b => b !== bank)
    }));
  };

  const handleEditSpecializationChange = (spec: string, checked: boolean) => {
    setEditAgent(prev => ({
      ...prev,
      specialization: checked 
        ? [...prev.specialization, spec]
        : prev.specialization.filter(s => s !== spec)
    }));
  };

  // Edit agent handlers
  const handleEditAgent = (agent: any) => {
    setEditingAgent(agent);
    setEditAgent({
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      address: agent.address,
      assignedBanks: [...agent.assignedBanks],
      specialization: [...agent.specialization],
      monthlyTarget: agent.monthlyTarget.toString(),
      experience: agent.experience,
      status: agent.status,
      joinDate: agent.joinDate // Add joinDate to the edit form
    });
    setIsEditDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAgent.name || !newAgent.email || !newAgent.phone || newAgent.assignedBanks.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    // Check if email already exists
    if (agentData.some(agent => agent.email.toLowerCase() === newAgent.email.toLowerCase())) {
      alert('An agent with this email already exists');
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0];
    const statusReason = `Initial ${newAgent.status.toLowerCase()} status`;
    
    const agent = {
      id: agentData.length + 1,
      name: newAgent.name,
      email: newAgent.email,
      phone: newAgent.phone,
      address: newAgent.address,
      joinDate: newAgent.joinDate || currentDate, // Use provided date or current date
      status: newAgent.status,
      statusHistory: [
        { status: newAgent.status, date: newAgent.joinDate || currentDate, reason: statusReason }
      ],
      assignedBanks: newAgent.assignedBanks,
      currentFiles: 0,
      totalCollections: 0,
      monthlyTarget: parseInt(newAgent.monthlyTarget) || 300000,
      performanceRating: 0,
      visitRate: 0,
      collectionRate: 0,
      specialization: newAgent.specialization,
      experience: newAgent.experience,
      lastActive: newAgent.joinDate || currentDate,
      avatar: '/api/placeholder/64/64'
    };

    setAgentData(prev => [...prev, agent]);
    
    // In a real application, you would also:
    // 1. Add the agent to the authentication system
    // 2. Send welcome email with login credentials
    // 3. Save to database
    
    alert(`Agent ${newAgent.name} has been successfully added!\n\nEmail: ${newAgent.email}\nBanks: ${newAgent.assignedBanks.join(', ')}\n\nThey can now log in using their email address.`);
    
    setIsAddDialogOpen(false);
    setNewAgent({
      name: '',
      email: '',
      phone: '',
      address: '',
      assignedBanks: [],
      specialization: [],
      monthlyTarget: '',
      experience: '',
      status: 'Active'
    });
  };

  const handleQuickStatusChange = (agentId: number, newStatus: string) => {
    const currentDate = new Date().toISOString().split('T')[0];
    const statusReason = `Status changed to ${newStatus} via quick action`;
    
    setAgentData(prev => prev.map(agent => {
      if (agent.id === agentId) {
        // Check if status has actually changed
        if (agent.status !== newStatus) {
          return {
            ...agent,
            status: newStatus,
            statusHistory: [
              ...agent.statusHistory,
              { status: newStatus, date: currentDate, reason: statusReason }
            ]
          };
        }
        return agent;
      }
      return agent;
    }));
    
    // Find the agent name for the alert
    const agent = agentData.find(a => a.id === agentId);
    
    // Close the popover after the change
    setTimeout(() => {
      // This will close the popover by triggering a re-render
      document.dispatchEvent(new Event('click'));
    }, 100);
    
    // Show success message
    alert(`${agent?.name}'s status has been updated to: ${newStatus}`);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editAgent.name || !editAgent.email || !editAgent.phone || editAgent.assignedBanks.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    // Check if email already exists (excluding current agent)
    if (agentData.some(agent => agent.id !== editingAgent.id && agent.email.toLowerCase() === editAgent.email.toLowerCase())) {
      alert('An agent with this email already exists');
      return;
    }

    // Check if status has changed to add to history
    const statusChanged = editingAgent.status !== editAgent.status;
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Get reason from the textarea (you might want to useRef for this)
    const reasonElement = document.getElementById('status-reason') as HTMLTextAreaElement;
    const reason = reasonElement ? reasonElement.value : 'Status updated';

    const updatedAgent = {
      ...editingAgent,
      name: editAgent.name,
      email: editAgent.email,
      phone: editAgent.phone,
      address: editAgent.address,
      assignedBanks: editAgent.assignedBanks,
      specialization: editAgent.specialization,
      monthlyTarget: parseInt(editAgent.monthlyTarget) || editingAgent.monthlyTarget,
      experience: editAgent.experience,
      status: editAgent.status,
      joinDate: editAgent.joinDate || editingAgent.joinDate, // Update joinDate if changed
      // Add status history if status changed
      statusHistory: statusChanged 
        ? [
            ...editingAgent.statusHistory,
            { status: editAgent.status, date: currentDate, reason }
          ]
        : editingAgent.statusHistory
    };

    setAgentData(prev => prev.map(agent => 
      agent.id === editingAgent.id ? updatedAgent : agent
    ));
    
    alert(`Agent ${editAgent.name} has been successfully updated!`);
    
    setIsEditDialogOpen(false);
    setEditingAgent(null);
    setEditAgent({
      name: '',
      email: '',
      phone: '',
      address: '',
      assignedBanks: [],
      specialization: [],
      monthlyTarget: '',
      experience: '',
      status: 'Active'
    });
  };


  const filteredData = agentData.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.phone.includes(searchQuery);
    const matchesStatus = selectedStatus === 'all' || agent.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Active
          </Badge>
        );
      case 'On Hold':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1.5">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            On Hold
          </Badge>
        );
      case 'Inactive':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1.5">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            Inactive
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'Active':
        return <div className="w-3 h-3 bg-green-500 rounded-full"></div>;
      case 'On Hold':
        return <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>;
      case 'Inactive':
        return <div className="w-3 h-3 bg-red-500 rounded-full"></div>;
      default:
        return <div className="w-3 h-3 bg-gray-500 rounded-full"></div>;
    }
  };

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const AgentCard = ({ agent }: { agent: any }) => (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                <AvatarImage src={agent.avatar} alt={agent.name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                  {agent.name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full border-2 border-white">
                {getStatusIndicator(agent.status)}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
              <p className="text-sm text-gray-600">{agent.experience} experience</p>
              <div className="flex items-center gap-2 mt-1">
                {getStatusBadge(agent.status)}
                <div className="flex items-center gap-1">
                  <Award className="h-3 w-3 text-yellow-500" />
                  <span className={`text-sm font-medium ${getPerformanceColor(agent.performanceRating)}`}>
                    {agent.performanceRating}/5.0
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {isAdmin && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <ChevronDown className="h-4 w-4" />
                    Status
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-2">
                  <div className="space-y-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start gap-2"
                      onClick={() => handleQuickStatusChange(agent.id, 'Active')}
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Set Active
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start gap-2"
                      onClick={() => handleQuickStatusChange(agent.id, 'On Hold')}
                    >
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      Set On Hold
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start gap-2"
                      onClick={() => handleQuickStatusChange(agent.id, 'Inactive')}
                    >
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Set Inactive
                    </Button>
                  </div>
                  <div className="pt-2 mt-2 border-t border-gray-200 text-xs text-gray-500">
                    Changes are saved automatically
                  </div>
                </PopoverContent>
              </Popover>
            )}
            {isAdmin && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={() => handleEditAgent(agent)}
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <User className="h-4 w-4" />
              Contact Information
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{agent.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{agent.email}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                <span className="text-gray-700">{agent.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700">Joined: {agent.joinDate}</span>
              </div>
            </div>
          </div>

          {/* Work Details */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Work Details
            </h4>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-600">Assigned Banks:</span>
                <div className="flex gap-2 mt-1">
                  {agent.assignedBanks.map((bank: string, index: number) => (
                    <Badge key={index} variant="outline">{bank}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Specialization:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {agent.specialization.map((spec: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">{spec}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current Files:</span>
                <span className="font-medium">{agent.currentFiles}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Target:</span>
                <span className="font-medium">৳{agent.monthlyTarget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Active:</span>
                <span className="font-medium">{agent.lastActive}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status History */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4" />
            Status History
          </h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {agent.statusHistory && agent.statusHistory.length > 0 ? (
              agent.statusHistory.map((history: any, index: number) => (
                <div key={index} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(history.status)}
                    <span className="text-gray-500">{history.date}</span>
                  </div>
                  <span className="text-gray-600 text-xs truncate max-w-[150px]">{history.reason}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No status history available</p>
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4" />
            Performance Metrics
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                ৳{agent.totalCollections.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Collections</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{agent.visitRate}%</div>
              <div className="text-sm text-gray-600">Visit Rate</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{agent.collectionRate}%</div>
              <div className="text-sm text-gray-600">Collection Rate</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Agent Details</h1>
          <p className="text-gray-600 mt-1">Comprehensive view of all recovery agents</p>
        </div>
        {isAdmin && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="h-4 w-4" />
                Add New Agent
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto p-4 sm:p-6">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Add New Agent
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Basic Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={newAgent.name}
                      onChange={(e) => setNewAgent(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newAgent.email}
                      onChange={(e) => setNewAgent(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={newAgent.phone}
                      onChange={(e) => setNewAgent(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+91 9876543210"
                      required
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="joinDate">Join Date</Label>
                    <Input
                      id="joinDate"
                      type="date"
                      value={newAgent.joinDate}
                      onChange={(e) => setNewAgent(prev => ({ ...prev, joinDate: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="experience">Experience</Label>
                    <Input
                      id="experience"
                      value={newAgent.experience}
                      onChange={(e) => setNewAgent(prev => ({ ...prev, experience: e.target.value }))}
                      placeholder="e.g., 2 years"
                    />
                  </div>
                </div>
                
                {/* Address */}
                <div className="space-y-1">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={newAgent.address}
                    onChange={(e) => setNewAgent(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter full address"
                    rows={2}
                  />
                </div>
                
                {/* Monthly Target and Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="target">Monthly Target (৳)</Label>
                    <Input
                      id="target"
                      type="number"
                      value={newAgent.monthlyTarget}
                      onChange={(e) => setNewAgent(prev => ({ ...prev, monthlyTarget: e.target.value }))}
                      placeholder="300000"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="new-status" className="text-sm font-semibold text-gray-700">Initial Agent Status</Label>
                    <Select value={newAgent.status} onValueChange={(value) => setNewAgent(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger className="border-2 focus:border-blue-500">
                        <SelectValue placeholder="Select agent status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active" className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Active
                          </div>
                        </SelectItem>
                        <SelectItem value="On Hold" className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            On Hold
                          </div>
                        </SelectItem>
                        <SelectItem value="Inactive" className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            Inactive
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      {newAgent.status === 'Active' && 'Agent can log in and access all assigned files'}
                      {newAgent.status === 'On Hold' && 'Agent access is temporarily suspended'}
                      {newAgent.status === 'Inactive' && 'Agent cannot log in or access any files'}
                    </p>
                  </div>
                </div>
                
                {/* Assigned Banks */}
                <div className="space-y-2">
                  <Label>Assigned Banks *</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {bankOptions.map(bank => (
                      <div key={bank} className="flex items-center space-x-2">
                        <Checkbox
                          id={bank}
                          checked={newAgent.assignedBanks.includes(bank)}
                          onCheckedChange={(checked) => handleBankChange(bank, checked as boolean)}
                        />
                        <Label htmlFor={bank} className="text-sm font-medium">{bank}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Specialization */}
                <div className="space-y-2">
                  <Label>Specialization</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {specializationOptions.map(spec => (
                      <div key={spec} className="flex items-center space-x-2">
                        <Checkbox
                          id={spec}
                          checked={newAgent.specialization.includes(spec)}
                          onCheckedChange={(checked) => handleSpecializationChange(spec, checked as boolean)}
                        />
                        <Label htmlFor={spec} className="text-sm font-medium">{spec}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    <Save className="h-4 w-4 mr-2" />
                    Add Agent
                  </Button>
                </div>
                <div className="text-xs text-gray-500 mt-1 text-right">
                  Agent will be added and saved when you click "Add Agent"
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {/* Edit Agent Dialog */}
        {isAdmin && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto p-4 sm:p-6">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Edit Agent
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleEditSubmit} className="space-y-4">
                {/* Basic Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="edit-name">Full Name *</Label>
                    <Input
                      id="edit-name"
                      value={editAgent.name}
                      onChange={(e) => setEditAgent(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="edit-email">Email Address *</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editAgent.email}
                      onChange={(e) => setEditAgent(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="edit-phone">Phone Number *</Label>
                    <Input
                      id="edit-phone"
                      value={editAgent.phone}
                      onChange={(e) => setEditAgent(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+91 9876543210"
                      required
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="edit-joinDate">Join Date</Label>
                    <Input
                      id="edit-joinDate"
                      type="date"
                      value={editAgent.joinDate}
                      onChange={(e) => setEditAgent(prev => ({ ...prev, joinDate: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="edit-experience">Experience</Label>
                    <Input
                      id="edit-experience"
                      value={editAgent.experience}
                      onChange={(e) => setEditAgent(prev => ({ ...prev, experience: e.target.value }))}
                      placeholder="e.g., 2 years"
                    />
                  </div>
                </div>
                
                {/* Address */}
                <div className="space-y-1">
                  <Label htmlFor="edit-address">Address</Label>
                  <Textarea
                    id="edit-address"
                    value={editAgent.address}
                    onChange={(e) => setEditAgent(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter full address"
                    rows={2}
                  />
                </div>
                
                {/* Monthly Target and Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="edit-target">Monthly Target (৳)</Label>
                    <Input
                      id="edit-target"
                      type="number"
                      value={editAgent.monthlyTarget}
                      onChange={(e) => setEditAgent(prev => ({ ...prev, monthlyTarget: e.target.value }))}
                      placeholder="300000"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="edit-status" className="text-sm font-semibold text-gray-700">Agent Status *</Label>
                    <Select value={editAgent.status} onValueChange={(value) => setEditAgent(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger className="border-2 focus:border-blue-500">
                        <SelectValue placeholder="Select agent status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active" className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Active
                          </div>
                        </SelectItem>
                        <SelectItem value="On Hold" className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            On Hold
                          </div>
                        </SelectItem>
                        <SelectItem value="Inactive" className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            Inactive
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      {editAgent.status === 'Active' && 'Agent can log in and access all assigned files'}
                      {editAgent.status === 'On Hold' && 'Agent access is temporarily suspended'}
                      {editAgent.status === 'Inactive' && 'Agent cannot log in or access any files'}
                    </p>
                  </div>
                </div>
                
                {/* Assigned Banks */}
                <div className="space-y-2">
                  <Label>Assigned Banks *</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {bankOptions.map(bank => (
                      <div key={bank} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-${bank}`}
                          checked={editAgent.assignedBanks.includes(bank)}
                          onCheckedChange={(checked) => handleEditBankChange(bank, checked as boolean)}
                        />
                        <Label htmlFor={`edit-${bank}`} className="text-sm font-medium">{bank}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Specialization */}
                <div className="space-y-2">
                  <Label>Specialization</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {specializationOptions.map(spec => (
                      <div key={spec} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-${spec}`}
                          checked={editAgent.specialization.includes(spec)}
                          onCheckedChange={(checked) => handleEditSpecializationChange(spec, checked as boolean)}
                        />
                        <Label htmlFor={`edit-${spec}`} className="text-sm font-medium">{spec}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Quick Status Actions */}
                <div className="border-t border-gray-200 pt-3">
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">Quick Status Actions</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      size="sm" 
                      variant={editAgent.status === 'Active' ? "default" : "outline"}
                      className={editAgent.status === 'Active' ? "bg-green-600 hover:bg-green-700" : ""}
                      onClick={() => setEditAgent(prev => ({ ...prev, status: 'Active' }))}
                    >
                      <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                      Set Active
                    </Button>
                    <Button 
                      size="sm" 
                      variant={editAgent.status === 'On Hold' ? "default" : "outline"}
                      className={editAgent.status === 'On Hold' ? "bg-yellow-600 hover:bg-yellow-700 text-white" : ""}
                      onClick={() => setEditAgent(prev => ({ ...prev, status: 'On Hold' }))}
                    >
                      <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                      Set On Hold
                    </Button>
                    <Button 
                      size="sm" 
                      variant={editAgent.status === 'Inactive' ? "default" : "outline"}
                      className={editAgent.status === 'Inactive' ? "bg-red-600 hover:bg-red-700" : ""}
                      onClick={() => setEditAgent(prev => ({ ...prev, status: 'Inactive' }))}
                    >
                      <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                      Set Inactive
                    </Button>
                  </div>
                </div>
                
                {/* Status Change Reason */}
                <div className="space-y-1">
                  <Label htmlFor="status-reason">Reason for Status Change (Optional)</Label>
                  <Textarea
                    id="status-reason"
                    placeholder="Enter reason for status change..."
                    rows={2}
                  />
                  <p className="text-xs text-gray-500">
                    Provide a brief explanation for the status change for record keeping
                  </p>
                </div>
                
                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
                <div className="text-xs text-gray-500 mt-1 text-right">
                  All changes will be saved when you click "Save Changes"
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="border-0 shadow-lg">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600" />
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-100">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Total Agents</h3>
            </div>
            <span className="text-2xl font-bold text-gray-900">{agentData.length}</span>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <div className="h-2 bg-gradient-to-r from-green-500 to-green-600" />
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-100">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Active Agents</h3>
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {agentData.filter(a => a.status === 'Active').length}
            </span>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <div className="h-2 bg-gradient-to-r from-yellow-500 to-yellow-600" />
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">On Hold</h3>
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {agentData.filter(a => a.status === 'On Hold').length}
            </span>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <div className="h-2 bg-gradient-to-r from-red-500 to-red-600" />
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-red-100">
                <X className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Inactive</h3>
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {agentData.filter(a => a.status === 'Inactive').length}
            </span>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-600" />
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-100">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Total Files</h3>
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {agentData.reduce((sum, agent) => sum + agent.currentFiles, 0)}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Status Legend */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Agent Status Legend</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Active - Agent can log in and access files</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm">On Hold - Agent access temporarily suspended</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm">Inactive - Agent cannot log in or access files</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search agents by name, email, or phone..."
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
                <SelectItem value="Active">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Active
                  </div>
                </SelectItem>
                <SelectItem value="On Hold">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    On Hold
                  </div>
                </SelectItem>
                <SelectItem value="Inactive">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Inactive
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Agent Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredData.map((agent) => (
          <AgentCard agent={agent} />
        ))}
      </div>

      {filteredData.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No agents found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}