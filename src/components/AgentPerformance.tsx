import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, Trophy, Star, TrendingUp, User, Phone, Mail } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function AgentPerformance() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('june-2024');
  const [selectedBank, setSelectedBank] = useState('all');

  const agentPerformanceData = [
    {
      id: 1,
      name: 'Priya Singh',
      phone: '+91 9876543210',
      email: 'priya.singh@company.com',
      month: 'July 2024',
      bank: 'DBBL',
      fileType: 'Credit Card',
      totalAccounts: 145,
      filesVisited: 132,
      permanentAddressChecked: 128,
      presentAddressChecked: 135,
      collectedAmount: 485000,
      visitPercentage: 91,
      collectionRate: 87,
      remarks: 'Excellent performance',
      rating: 5,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Raj Kumar',
      phone: '+91 9876543211',
      email: 'raj.kumar@company.com',
      month: 'July 2024',
      bank: 'One Bank',
      fileType: 'Personal Loan',
      totalAccounts: 120,
      filesVisited: 98,
      permanentAddressChecked: 95,
      presentAddressChecked: 102,
      collectedAmount: 420000,
      visitPercentage: 82,
      collectionRate: 78,
      remarks: 'Good performance',
      rating: 4,
      status: 'Active'
    },
    {
      id: 3,
      name: 'Amit Sharma',
      phone: '+91 9876543212',
      email: 'amit.sharma@company.com',
      month: 'July 2024',
      bank: 'DBBL',
      fileType: 'Write-Off',
      totalAccounts: 89,
      filesVisited: 85,
      permanentAddressChecked: 82,
      presentAddressChecked: 87,
      collectedAmount: 380000,
      visitPercentage: 96,
      collectionRate: 85,
      remarks: 'Consistent performer',
      rating: 4,
      status: 'Active'
    },
    {
      id: 4,
      name: 'Sneha Patel',
      phone: '+91 9876543213',
      email: 'sneha.patel@company.com',
      month: 'July 2024',
      bank: 'One Bank',
      fileType: 'Credit Card',
      totalAccounts: 110,
      filesVisited: 88,
      permanentAddressChecked: 85,
      presentAddressChecked: 90,
      collectedAmount: 365000,
      visitPercentage: 80,
      collectionRate: 76,
      remarks: 'Needs improvement',
      rating: 3,
      status: 'Active'
    },
    {
      id: 5,
      name: 'Ravi Gupta',
      phone: '+91 9876543214',
      email: 'ravi.gupta@company.com',
      month: 'July 2024',
      bank: 'DBBL',
      fileType: 'Agent Banking',
      totalAccounts: 95,
      filesVisited: 92,
      permanentAddressChecked: 90,
      presentAddressChecked: 94,
      collectedAmount: 425000,
      visitPercentage: 97,
      collectionRate: 89,
      remarks: 'Outstanding work',
      rating: 5,
      status: 'Active'
    }
  ];

  const topPerformersData = agentPerformanceData
    .sort((a, b) => b.collectedAmount - a.collectedAmount)
    .slice(0, 5)
    .map(agent => ({
      name: agent.name.split(' ')[0],
      collections: agent.collectedAmount,
      visitRate: agent.visitPercentage
    }));

  const performanceDistribution = [
    { name: 'Excellent (90%+)', value: 2, color: '#10B981' },
    { name: 'Good (70-89%)', value: 2, color: '#3B82F6' },
    { name: 'Average (50-69%)', value: 1, color: '#F59E0B' },
    { name: 'Needs Improvement (<50%)', value: 0, color: '#EF4444' },
  ];

  const filteredData = agentPerformanceData.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.bank.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBank = selectedBank === 'all' || agent.bank.toLowerCase() === selectedBank.toLowerCase();
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
                <SelectItem value="july-2024">July 2024</SelectItem>
                <SelectItem value="june-2024">June 2024</SelectItem>
                <SelectItem value="may-2024">May 2024</SelectItem>
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
                  <Tooltip />
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
        </CardContent>
      </Card>
    </div>
  );
}