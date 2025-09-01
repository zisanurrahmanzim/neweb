import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Users, FileText, Clock, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';

export function Dashboard() {
  const kpiData = [
    {
      title: 'Total Accounts',
      value: '12,458',
      change: '+12.3%',
      trend: 'up',
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Total Outstanding',
      value: '৳24,800,000',
      change: '-3.2%',
      trend: 'down',
      icon: DollarSign,
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Total Overdue',
      value: '৳8,200,000',
      change: '+5.7%',
      trend: 'up',
      icon: AlertTriangle,
      gradient: 'from-orange-500 to-red-500',
    },
    {
      title: 'Total Collected',
      value: '৳15,600,000',
      change: '+18.4%',
      trend: 'up',
      icon: CheckCircle,
      gradient: 'from-green-500 to-green-600',
    },
    {
      title: 'Expired Files',
      value: '1,243',
      change: '+8.1%',
      trend: 'up',
      icon: Clock,
      gradient: 'from-red-500 to-pink-500',
    },
    {
      title: 'Active Files',
      value: '8,915',
      change: '-2.1%',
      trend: 'down',
      icon: FileText,
      gradient: 'from-teal-500 to-teal-600',
    },
  ];

  const collectionsData = [
    { month: 'Jan', collections: 1200000, target: 1500000 },
    { month: 'Feb', collections: 1800000, target: 1500000 },
    { month: 'Mar', collections: 1400000, target: 1500000 },
    { month: 'Apr', collections: 2100000, target: 1500000 },
    { month: 'May', collections: 1900000, target: 1500000 },
    { month: 'Jun', collections: 2300000, target: 1500000 },
  ];

  const agentPerformanceData = [
    { name: 'Priya Singh', collections: 485000, files: 145, target: 500000 },
    { name: 'Ravi Gupta', collections: 425000, files: 102, target: 400000 },
    { name: 'Amit Sharma', collections: 398000, files: 89, target: 400000 },
    { name: 'Raj Kumar', collections: 365000, files: 120, target: 450000 },
    { name: 'Sneha Patel', collections: 312000, files: 95, target: 350000 },
  ];

  const bankDistribution = [
    { name: 'DBBL Credit Card', value: 35, color: '#3B82F6' },
    { name: 'DBBL Write-Off', value: 25, color: '#8B5CF6' },  
    { name: 'One Bank Credit', value: 20, color: '#10B981' },
    { name: 'DBBL Loan Branch', value: 15, color: '#F59E0B' },
    { name: 'One Bank Loan', value: 5, color: '#EF4444' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your recovery overview</p>
        </div>
        
        <div className="flex gap-3">
          <Select defaultValue="this-month">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="all-banks">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-banks">All Banks</SelectItem>
              <SelectItem value="dbbl">DBBL</SelectItem>
              <SelectItem value="one-bank">One Bank</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          const TrendIcon = kpi.trend === 'up' ? TrendingUp : TrendingDown;
          
          return (
            <Card key={index} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className={`h-2 bg-gradient-to-r ${kpi.gradient}`} />
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${kpi.gradient} bg-opacity-10`}>
                        <Icon className="h-5 w-5 text-gray-700" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-600">{kpi.title}</h3>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-gray-900">{kpi.value}</span>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        kpi.trend === 'up' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        <TrendIcon className="h-3 w-3" />
                        {kpi.change}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Collections Trend */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
            <CardTitle className="text-lg font-semibold text-gray-900">Collections Trend</CardTitle>
            <p className="text-sm text-gray-600">Monthly collections vs target</p>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={collectionsData}>
                <defs>
                  <linearGradient id="colorCollections" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6B7280" 
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6B7280"
                  tickFormatter={(value) => `৳${(value/1000000).toFixed(1)}M`}
                  fontSize={12}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    `৳${value.toLocaleString()}`, 
                    name === 'collections' ? 'Collections' : 'Target'
                  ]}
                  labelStyle={{ color: '#374151' }}
                  contentStyle={{ 
                    backgroundColor: '#F9FAFB', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '15px' }}
                  formatter={(value) => {
                    return value === 'collections' ? 'Collections' : 'Target';
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fillOpacity={0.1} 
                  fill="url(#colorTarget)"
                  name="Target"
                />
                <Area 
                  type="monotone" 
                  dataKey="collections" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorCollections)"
                  name="Collections"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Agent Performance */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 border-b border-gray-100">
            <CardTitle className="text-lg font-semibold text-gray-900">Agent Performance Overview</CardTitle>
            <p className="text-sm text-gray-600">Collections vs targets by top agents this month</p>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={agentPerformanceData}>
                <defs>
                  <linearGradient id="collectionsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.7}/>
                  </linearGradient>
                  <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  stroke="#6B7280"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={11}
                />
                <YAxis 
                  stroke="#6B7280"
                  tickFormatter={(value) => `৳${(value/1000)}K`}
                  fontSize={12}
                />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'collections') {
                      return [`৳${value.toLocaleString()}`, 'Collections'];
                    } else if (name === 'target') {
                      return [`৳${value.toLocaleString()}`, 'Target'];
                    }
                    return [value, name];
                  }}
                  labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                  contentStyle={{ 
                    backgroundColor: '#F9FAFB', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  formatter={(value) => {
                    return value === 'collections' ? 'Collections' : 'Target';
                  }}
                />
                <Bar 
                  dataKey="target" 
                  fill="url(#targetGradient)"
                  radius={[4, 4, 0, 0]}
                  name="target"
                  opacity={0.6}
                />
                <Bar 
                  dataKey="collections" 
                  fill="url(#collectionsGradient)"
                  radius={[4, 4, 0, 0]}
                  name="collections"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bank Distribution */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
          <CardTitle className="text-lg font-semibold text-gray-900">File Distribution by Bank</CardTitle>
          <p className="text-sm text-gray-600">Current active files across different banks</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={bankDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {bankDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-3">
              {bankDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-gray-900">{item.name}</span>
                  </div>
                  <span className="font-semibold text-gray-700">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}