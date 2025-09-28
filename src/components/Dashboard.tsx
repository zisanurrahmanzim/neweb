import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Users, FileText, Clock, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';

export function Dashboard() {
  const [bankFilesData, setBankFilesData] = useState<any[]>([]);
  const [collectionData, setCollectionData] = useState<any[]>([]);
  
  // Load data from localStorage on component mount
  useEffect(() => {
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
  }, []);

  // Listen for localStorage changes to update data in real-time
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'bankFiles' && e.newValue) {
        try {
          const parsedFiles = JSON.parse(e.newValue);
          setBankFilesData(parsedFiles);
        } catch (error) {
          console.error('Error parsing bank files data from storage event:', error);
        }
      } else if (e.key === 'collectionData' && e.newValue) {
        try {
          const parsedCollections = JSON.parse(e.newValue);
          setCollectionData(parsedCollections);
        } catch (error) {
          console.error('Error parsing collection data from storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Calculate real KPI data based on actual data
  const calculateKPIs = () => {
    console.log('Calculating KPIs with data:');
    console.log('Bank Files Data:', bankFilesData);
    console.log('Collection Data:', collectionData);
    
    // Total Accounts (files)
    const totalAccounts = bankFilesData.length;
    
    // Total Outstanding (sum of all outstanding amounts)
    const totalOutstanding = bankFilesData.reduce((sum, file) => sum + (file.outstanding || 0), 0);
    
    // Total Overdue (using a simple calculation - files with status 'unassigned' or overdue)
    const totalOverdue = bankFilesData.reduce((sum, file) => {
      // For simplicity, we'll consider unassigned files as overdue
      if (file.status === 'unassigned') {
        return sum + (file.outstanding || 0);
      }
      return sum;
    }, 0);
    
    // Total Collected (sum of all collections)
    const totalCollected = collectionData
      .filter(collection => collection.status === 'approved')
      .reduce((sum, collection) => sum + (collection.amountCollected || 0), 0);
    
    // Expired Files (files with expired status)
    const expiredFiles = bankFilesData.filter(file => {
      if (file.expiryDate) {
        const expiryDate = new Date(file.expiryDate);
        const today = new Date();
        return expiryDate < today;
      }
      return false;
    }).length;
    
    // Active Files (files that are not expired)
    const activeFiles = bankFilesData.length - expiredFiles;
    
    console.log('Calculated KPIs:', {
      totalAccounts,
      totalOutstanding,
      totalOverdue,
      totalCollected,
      expiredFiles,
      activeFiles
    });
    
    return {
      totalAccounts,
      totalOutstanding,
      totalOverdue,
      totalCollected,
      expiredFiles,
      activeFiles
    };
  };

  const kpiData = () => {
    const kpis = calculateKPIs();
    
    return [
      {
        title: 'Total Accounts',
        value: kpis.totalAccounts.toLocaleString(),
        change: '+0%',
        trend: 'up',
        icon: Users,
        gradient: 'from-blue-500 to-blue-600',
      },
      {
        title: 'Total Outstanding',
        value: `৳${kpis.totalOutstanding.toLocaleString()}`,
        change: '+0%',
        trend: 'up',
        icon: DollarSign,
        gradient: 'from-purple-500 to-purple-600',
      },
      {
        title: 'Total Overdue',
        value: `৳${kpis.totalOverdue.toLocaleString()}`,
        change: '+0%',
        trend: 'up',
        icon: AlertTriangle,
        gradient: 'from-orange-500 to-red-500',
      },
      {
        title: 'Total Collected',
        value: `৳${kpis.totalCollected.toLocaleString()}`,
        change: '+0%',
        trend: 'up',
        icon: CheckCircle,
        gradient: 'from-green-500 to-green-600',
      },
      {
        title: 'Expired Files',
        value: kpis.expiredFiles.toLocaleString(),
        change: '+0%',
        trend: 'up',
        icon: Clock,
        gradient: 'from-red-500 to-pink-500',
      },
      {
        title: 'Active Files',
        value: kpis.activeFiles.toLocaleString(),
        change: '+0%',
        trend: 'up',
        icon: FileText,
        gradient: 'from-teal-500 to-teal-600',
      },
    ];
  };

  // Calculate collections data for the chart
  const collectionsData = () => {
    console.log('Calculating collections data with:', collectionData);
    
    // Initialize with last 6 months of data
    const monthlyCollections: Record<string, { collections: number; target: number }> = {};
    const monthlyTarget = 1500000;
    
    // Generate last 6 months
    const currentDate = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      monthlyCollections[monthKey] = { collections: 0, target: monthlyTarget };
    }
    
    // Add actual collection data
    collectionData.forEach(collection => {
      if (collection.status === 'approved' && collection.date) {
        try {
          const date = new Date(collection.date);
          if (!isNaN(date.getTime())) { // Check if date is valid
            const monthKey = date.toLocaleString('default', { month: 'short', year: 'numeric' });
            
            if (monthlyCollections[monthKey]) {
              monthlyCollections[monthKey].collections += collection.amountCollected || 0;
            }
          }
        } catch (error) {
          console.error('Error parsing collection date:', collection.date, error);
        }
      }
    });
    
    // Convert to array format and sort by date
    const chartData = Object.entries(monthlyCollections)
      .map(([month, data]) => ({
        month,
        collections: data.collections,
        target: data.target
      }))
      .sort((a, b) => {
        const [aMonth, aYear] = a.month.split(' ');
        const [bMonth, bYear] = b.month.split(' ');
        
        if (aYear !== bYear) {
          return parseInt(aYear) - parseInt(bYear);
        }
        
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.indexOf(aMonth) - months.indexOf(bMonth);
      });
    
    console.log('Collections Chart Data:', chartData); // Debug log
    return chartData;
  };

  // Calculate agent performance data
  const agentPerformanceData = () => {
    // Group collections by agent
    const agentCollections: Record<string, { collections: number; files: number; target: number }> = {};
    
    collectionData.forEach(collection => {
      if (collection.status === 'approved') {
        const agent = collection.agent || 'Unknown Agent';
        
        if (!agentCollections[agent]) {
          agentCollections[agent] = { collections: 0, files: 0, target: 400000 };
        }
        
        agentCollections[agent].collections += collection.amountCollected || 0;
        agentCollections[agent].files += 1;
      }
    });
    
    // Convert to array format for the chart
    return Object.entries(agentCollections).map(([name, data]) => ({
      name,
      collections: data.collections,
      files: data.files,
      target: data.target
    }));
  };

  // Calculate bank distribution
  const bankDistribution = () => {
    const bankCounts: Record<string, number> = {};
    
    bankFilesData.forEach(file => {
      const bankType = `${file.bank} ${file.productType}`;
      bankCounts[bankType] = (bankCounts[bankType] || 0) + 1;
    });
    
    // Convert to percentage
    const totalFiles = bankFilesData.length;
    const distribution = Object.entries(bankCounts).map(([name, count]) => {
      const percentage = totalFiles > 0 ? Math.round((count / totalFiles) * 100) : 0;
      return {
        name,
        value: percentage,
        color: getColorForBank(name)
      };
    });
    
    return distribution;
  };

  // Helper function to assign colors to banks
  const getColorForBank = (bankName: string) => {
    const colors = {
      'DBBL Credit Card': '#3B82F6',
      'DBBL Write-Off': '#8B5CF6',
      'DBBL Agent Banking': '#06B6D4',
      'DBBL Loan Branch': '#F59E0B',
      'One Bank Credit Card': '#10B981',
      'One Bank Personal Loan': '#EF4444'
    };
    
    return colors[bankName as keyof typeof colors] || '#6B7280';
  };

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
        {kpiData().map((kpi, index) => {
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
            <p className="text-sm text-gray-600">Monthly collections vs target (Last 6 months)</p>
          </CardHeader>
          <CardContent className="p-6">
            {collectionsData().length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={collectionsData()} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                    tick={{ fill: '#6B7280' }}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    tickFormatter={(value) => `৳${(value/1000000).toFixed(1)}M`}
                    fontSize={12}
                    tick={{ fill: '#6B7280' }}
                  />
                  <Tooltip 
                    formatter={(value, name) => [
                      `৳${Number(value).toLocaleString()}`, 
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
                    name="target"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="collections" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorCollections)"
                    name="collections"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-lg font-medium">No Collection Data</p>
                  <p className="text-sm">Start adding collections to see the trend chart</p>
                </div>
              </div>
            )}
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
              <BarChart data={agentPerformanceData()}>
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
                  data={bankDistribution()}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {bankDistribution().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-3">
              {bankDistribution().map((item, index) => (
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