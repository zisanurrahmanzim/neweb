import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, Trophy, Star, TrendingUp, User, Phone, Mail } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../contexts/AuthContext';

// Define TypeScript interfaces
interface CollectionData {
  agent: string;
  bank: string;
  fileType: string;
  amountCollected?: number;
  status: string;
  clientId?: string;
  date?: string;
}

interface BankFileData {
  clientId?: string;
  assignedAgent?: string;
  agent?: string;
  bank: string;
  productType: string;
  permAddVisitVerified?: boolean;
  presAddVisitVerified?: boolean;
}

interface AgentData {
  name: string;
  phone: string;
  email: string;
  totalAccounts: number;
  filesVisited: number;
  permanentAddressChecked: number;
  presentAddressChecked: number;
  collectedAmount: number;
  approvedCollections: number;
  pendingCollections: number;
  rejectedCollections: number;
  banks: Set<string>;
  fileTypes: Set<string>;
}

interface AgentPerformanceRecord {
  id: number;
  name: string;
  phone: string;
  email: string;
  month: string;
  bank: string;
  fileType: string;
  totalAccounts: number;
  filesVisited: number;
  permanentAddressChecked: number;
  presentAddressChecked: number;
  collectedAmount: number;
  visitPercentage: number;
  collectionRate: number;
  remarks: string;
  rating: number;
  status: string;
}

export function AgentPerformance() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedBank, setSelectedBank] = useState('all');
  const [collectionData, setCollectionData] = useState<CollectionData[]>([]);
  const [bankFilesData, setBankFilesData] = useState<BankFileData[]>([]);

  // Load data from localStorage
  useEffect(() => {
    // Load collection data
    const savedCollections = localStorage.getItem('collectionData');
    if (savedCollections) {
      try {
        const parsedCollections = JSON.parse(savedCollections);
        setCollectionData(parsedCollections);
      } catch (error) {
        console.error('Error parsing collection data:', error);
        setCollectionData([]);
      }
    }
    
    // Load bank files data
    const savedBankFiles = localStorage.getItem('bankFiles');
    if (savedBankFiles) {
      try {
        const parsedFiles = JSON.parse(savedBankFiles);
        setBankFilesData(parsedFiles);
      } catch (error) {
        console.error('Error parsing bank files data:', error);
        setBankFilesData([]);
      }
    }
  }, []);

  // Generate agent performance data based on real data
  const generateAgentPerformanceData = (): AgentPerformanceRecord[] => {
    // Group collections by agent
    const agentData: Record<string, AgentData> = {};
    
    // Get unique agents from collections
    const agentsInCollections = [...new Set(collectionData.map(c => c.agent))].filter(agent => agent) as string[];
    
    // Initialize agent data
    agentsInCollections.forEach(agentName => {
      agentData[agentName] = {
        name: agentName,
        phone: '+91 XXXXXXXXXX', // Placeholder - in a real app, this would come from user data
        email: `${agentName.toLowerCase().replace(/\s+/g, '.')}@company.com`, // Placeholder
        totalAccounts: 0,
        filesVisited: 0,
        permanentAddressChecked: 0,
        presentAddressChecked: 0,
        collectedAmount: 0,
        approvedCollections: 0,
        pendingCollections: 0,
        rejectedCollections: 0,
        banks: new Set<string>(),
        fileTypes: new Set<string>()
      };
    });
    
    // Process collection data
    collectionData.forEach(collection => {
      const agentName = collection.agent;
      if (agentName && agentData[agentName]) {
        agentData[agentName].banks.add(collection.bank);
        agentData[agentName].fileTypes.add(collection.fileType);
        agentData[agentName].collectedAmount += collection.amountCollected || 0;
        
        // Count collection statuses
        if (collection.status === 'approved') {
          agentData[agentName].approvedCollections += 1;
        } else if (collection.status === 'pending') {
          agentData[agentName].pendingCollections += 1;
        } else if (collection.status === 'rejected') {
          agentData[agentName].rejectedCollections += 1;
        }
      }
    });
    
    // Process bank files data to get account counts
    bankFilesData.forEach(file => {
      // Find collections for this file to determine if it was visited
      const fileCollections = collectionData.filter(c => c.clientId === file.clientId);
      
      // For each agent assigned to this file
      const agentName = file.assignedAgent || file.agent;
      if (agentName && agentData[agentName]) {
        agentData[agentName].totalAccounts += 1;
        agentData[agentName].banks.add(file.bank);
        agentData[agentName].fileTypes.add(file.productType);
        
        // If there are collections for this file, increment visited count
        if (fileCollections.length > 0) {
          agentData[agentName].filesVisited += 1;
        }
        
        // Check address verification (simplified logic)
        if (file.permAddVisitVerified) {
          agentData[agentName].permanentAddressChecked += 1;
        }
        if (file.presAddVisitVerified) {
          agentData[agentName].presentAddressChecked += 1;
        }
      }
    });
    
    // Convert to array format
    return Object.values(agentData).map((agent, index) => {
      const totalCollections = agent.approvedCollections + agent.pendingCollections + agent.rejectedCollections;
      const visitPercentage = agent.totalAccounts > 0 ? Math.round((agent.filesVisited / agent.totalAccounts) * 100) : 0;
      const collectionRate = totalCollections > 0 ? Math.round((agent.approvedCollections / totalCollections) * 100) : 0;
      
      // Determine rating based on performance
      let rating = 1;
      if (visitPercentage >= 90 && collectionRate >= 85) {
        rating = 5;
      } else if (visitPercentage >= 80 && collectionRate >= 75) {
        rating = 4;
      } else if (visitPercentage >= 60 && collectionRate >= 60) {
        rating = 3;
      } else if (visitPercentage >= 40 && collectionRate >= 40) {
        rating = 2;
      }
      
      // Determine remarks based on performance
      let remarks = 'Needs improvement';
      if (rating === 5) {
        remarks = 'Outstanding work';
      } else if (rating === 4) {
        remarks = 'Good performance';
      } else if (rating === 3) {
        remarks = 'Average performance';
      }
      
      return {
        id: index + 1,
        name: agent.name,
        phone: agent.phone,
        email: agent.email,
        month: selectedMonth === 'all' ? 'All Time' : selectedMonth,
        bank: Array.from(agent.banks).join(', ') || 'N/A',
        fileType: Array.from(agent.fileTypes).join(', ') || 'N/A',
        totalAccounts: agent.totalAccounts,
        filesVisited: agent.filesVisited,
        permanentAddressChecked: agent.permanentAddressChecked,
        presentAddressChecked: agent.presentAddressChecked,
        collectedAmount: agent.collectedAmount,
        visitPercentage,
        collectionRate,
        remarks,
        rating,
        status: 'Active'
      };
    });
  };

  const agentPerformanceData = generateAgentPerformanceData();

  const topPerformersData = agentPerformanceData
    .sort((a, b) => b.collectedAmount - a.collectedAmount)
    .slice(0, 5)
    .map(agent => ({
      name: agent.name.split(' ')[0],
      collections: agent.collectedAmount,
      visitRate: agent.visitPercentage
    }));

  // Generate performance distribution based on real data
  const generatePerformanceDistribution = () => {
    const distribution = [
      { name: 'Excellent (90%+)', value: 0, color: '#10B981' },
      { name: 'Good (70-89%)', value: 0, color: '#3B82F6' },
      { name: 'Average (50-69%)', value: 0, color: '#F59E0B' },
      { name: 'Needs Improvement (<50%)', value: 0, color: '#EF4444' },
    ];
    
    agentPerformanceData.forEach(agent => {
      if (agent.visitPercentage >= 90) {
        distribution[0].value += 1;
      } else if (agent.visitPercentage >= 70) {
        distribution[1].value += 1;
      } else if (agent.visitPercentage >= 50) {
        distribution[2].value += 1;
      } else {
        distribution[3].value += 1;
      }
    });
    
    return distribution;
  };

  const performanceDistribution = generatePerformanceDistribution();

  const filteredData = agentPerformanceData.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.bank.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBank = selectedBank === 'all' || agent.bank.toLowerCase().includes(selectedBank.toLowerCase());
    return matchesSearch && matchesBank;
  });

  const getPerformanceBadge = (percentage: number) => {
    if (percentage >= 90) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (percentage >= 70) return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
    if (percentage >= 50) return <Badge className="bg-yellow-100 text-yellow-800">Average</Badge>;
    return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>;
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  // Get available months from collection data
  const getAvailableMonths = () => {
    const months = new Set<string>();
    
    collectionData.forEach(collection => {
      if (collection.date) {
        try {
          const date = new Date(collection.date);
          const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
          months.add(monthYear);
        } catch (error) {
          console.error('Error parsing date:', collection.date, error);
        }
      }
    });
    
    return Array.from(months).sort();
  };

  const availableMonths = getAvailableMonths();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Agent Performance</h1>
          <p className="text-gray-600 mt-1">Track and analyze agent performance metrics</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search agents or banks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                {availableMonths.map((month, index) => (
                  <SelectItem key={index} value={month}>{month}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedBank} onValueChange={setSelectedBank}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Banks</SelectItem>
                <SelectItem value="dbbl">DBBL</SelectItem>
                <SelectItem value="one bank">One Bank</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers Chart */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Top Performers - Collections
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {topPerformersData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topPerformersData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis 
                    stroke="#6B7280"
                    tickFormatter={(value) => `৳${value.toLocaleString()}`}
                  />
                  <Tooltip 
                    formatter={(value) => [`৳${value.toLocaleString()}`, 'Collections']}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Bar 
                    dataKey="collections" 
                    fill="url(#performanceGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <Trophy className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-lg font-medium">No Performance Data</p>
                  <p className="text-sm">Add collection data to see agent performance</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Distribution */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Performance Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-6 items-center">
              {performanceDistribution.some(item => item.value > 0) ? (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={performanceDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {performanceDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} agents`, 'Count']} />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  <div className="space-y-2">
                    {performanceDistribution.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-gray-700">{item.name}</span>
                        </div>
                        <span className="font-medium">{item.value} agents</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-lg font-medium">No Distribution Data</p>
                    <p className="text-sm">Add agent data to see performance distribution</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Performance Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
          <CardTitle>Detailed Agent Performance</CardTitle>
          <p className="text-sm text-gray-600 mt-1">Complete performance metrics for all agents</p>
        </CardHeader>
        <CardContent className="p-6">
          {filteredData.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead>Bank</TableHead>
                    <TableHead>File Type</TableHead>
                    <TableHead>Total Accounts</TableHead>
                    <TableHead>Files Visited</TableHead>
                    <TableHead>Address Verification</TableHead>
                    <TableHead>Collections</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((agent) => (
                    <TableRow key={agent.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{agent.name}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {agent.phone}
                              </div>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{agent.bank}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">{agent.fileType}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{agent.totalAccounts}</span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <span className="font-medium">{agent.filesVisited}</span>
                          <div className="text-xs text-gray-500">
                            {agent.visitPercentage}% visited
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Present: {agent.presentAddressChecked}</div>
                          <div>Permanent: {agent.permanentAddressChecked}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <span className="font-medium text-green-600">
                            ৳{agent.collectedAmount.toLocaleString()}
                          </span>
                          <div className="text-xs text-gray-500">
                            {agent.collectionRate}% rate
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getPerformanceBadge(agent.visitPercentage)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getRatingStars(agent.rating)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">{agent.remarks}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Agent Data Found</h3>
              <p className="text-gray-500">Add collection and file data to see agent performance metrics</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}