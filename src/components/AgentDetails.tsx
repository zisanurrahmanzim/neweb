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
import { Search, User, Phone, Mail, MapPin, Calendar, FileText, TrendingUp, Award, Edit, Plus, Save, X } from 'lucide-react';
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
    experience: ''
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
    status: 'Active'
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
      status: agent.status
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

    const agent = {
      id: agentData.length + 1,
      name: newAgent.name,
      email: newAgent.email,
      phone: newAgent.phone,
      address: newAgent.address,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      assignedBanks: newAgent.assignedBanks,
      currentFiles: 0,
      totalCollections: 0,
      monthlyTarget: parseInt(newAgent.monthlyTarget) || 300000,
      performanceRating: 0,
      visitRate: 0,
      collectionRate: 0,
      specialization: newAgent.specialization,
      experience: newAgent.experience,
      lastActive: new Date().toISOString().split('T')[0],
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
      experience: ''
    });
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
      status: editAgent.status
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
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'On Hold':
        return <Badge className="bg-yellow-100 text-yellow-800">On Hold</Badge>;
      case 'Inactive':
        return <Badge className="bg-red-100 text-red-800">Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
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
            <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
              <AvatarImage src={agent.avatar} alt={agent.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {agent.name.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
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
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Add New Agent
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={newAgent.name}
                      onChange={(e) => setNewAgent(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={newAgent.phone}
                      onChange={(e) => setNewAgent(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+91 9876543210"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
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
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={newAgent.address}
                    onChange={(e) => setNewAgent(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter full address"
                    rows={3}
                  />
                </div>
                
                {/* Monthly Target */}
                <div className="space-y-2">
                  <Label htmlFor="target">Monthly Target (৳)</Label>
                  <Input
                    id="target"
                    type="number"
                    value={newAgent.monthlyTarget}
                    onChange={(e) => setNewAgent(prev => ({ ...prev, monthlyTarget: e.target.value }))}
                    placeholder="300000"
                  />
                </div>
                
                {/* Assigned Banks */}
                <div className="space-y-3">
                  <Label>Assigned Banks *</Label>
                  <div className="grid grid-cols-2 gap-3">
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
                <div className="space-y-3">
                  <Label>Specialization</Label>
                  <div className="grid grid-cols-2 gap-3">
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
                <div className="flex justify-end gap-3 pt-4">
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
                    Save Agent
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {/* Edit Agent Dialog */}
        {isAdmin && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Edit Agent
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleEditSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Full Name *</Label>
                    <Input
                      id="edit-name"
                      value={editAgent.name}
                      onChange={(e) => setEditAgent(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone">Phone Number *</Label>
                    <Input
                      id="edit-phone"
                      value={editAgent.phone}
                      onChange={(e) => setEditAgent(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+91 9876543210"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
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
                <div className="space-y-2">
                  <Label htmlFor="edit-address">Address</Label>
                  <Textarea
                    id="edit-address"
                    value={editAgent.address}
                    onChange={(e) => setEditAgent(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter full address"
                    rows={3}
                  />
                </div>
                
                {/* Monthly Target and Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-target">Monthly Target (৳)</Label>
                    <Input
                      id="edit-target"
                      type="number"
                      value={editAgent.monthlyTarget}
                      onChange={(e) => setEditAgent(prev => ({ ...prev, monthlyTarget: e.target.value }))}
                      placeholder="300000"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select value={editAgent.status} onValueChange={(value) => setEditAgent(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="On Hold">On Hold</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Assigned Banks */}
                <div className="space-y-3">
                  <Label>Assigned Banks *</Label>
                  <div className="grid grid-cols-2 gap-3">
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
                <div className="space-y-3">
                  <Label>Specialization</Label>
                  <div className="grid grid-cols-2 gap-3">
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
                
                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-4">
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
                    Update Agent
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        <Card className="border-0 shadow-lg">
          <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-600" />
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-orange-100">
                <Award className="h-5 w-5 text-orange-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Avg Rating</h3>
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {(agentData.reduce((sum, agent) => sum + agent.performanceRating, 0) / agentData.length).toFixed(1)}
            </span>
          </CardContent>
        </Card>
      </div>

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
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Agent Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredData.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
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