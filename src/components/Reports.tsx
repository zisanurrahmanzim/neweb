import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Download, FileText, BarChart3, PieChart, TrendingUp, Calendar as CalendarIcon, Filter, FileSpreadsheet } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import * as XLSX from 'xlsx';
// import { format } from 'date-fns';

export function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState('this-month');
  const [selectedBank, setSelectedBank] = useState('all');
  const [selectedFileType, setSelectedFileType] = useState('all');
  const [dateRange, setDateRange] = useState<Date | undefined>(new Date());
  const [reportType, setReportType] = useState('overview');
  const [dateRangeFilter, setDateRangeFilter] = useState<{from: Date | undefined, to: Date | undefined}>({ from: undefined, to: undefined });
  const [useCustomDateRange, setUseCustomDateRange] = useState(false);

  // Base mock data with dates
  const baseRecoveryTrendData = [
    { month: 'Jan', target: 1500000, achieved: 1200000, percentage: 80, bank: 'DBBL', fileType: 'credit-card', date: '2024-01-15' },
    { month: 'Feb', target: 1500000, achieved: 1800000, percentage: 120, bank: 'One Bank', fileType: 'personal-loan', date: '2024-02-10' },
    { month: 'Mar', target: 1500000, achieved: 1400000, percentage: 93, bank: 'DBBL', fileType: 'write-off', date: '2024-03-05' },
    { month: 'Apr', target: 1500000, achieved: 2100000, percentage: 140, bank: 'One Bank', fileType: 'credit-card', date: '2024-04-12' },
    { month: 'May', target: 1500000, achieved: 1900000, percentage: 127, bank: 'DBBL', fileType: 'personal-loan', date: '2024-05-20' },
    { month: 'Jun', target: 1500000, achieved: 2300000, percentage: 153, bank: 'One Bank', fileType: 'write-off', date: '2024-06-18' },
    { month: 'Jul', target: 1500000, achieved: 1950000, percentage: 130, bank: 'DBBL', fileType: 'credit-card', date: '2024-07-25' },
    { month: 'Aug', target: 1600000, achieved: 2050000, percentage: 128, bank: 'One Bank', fileType: 'personal-loan', date: '2024-08-10' },
    { month: 'Sep', target: 1600000, achieved: 1750000, percentage: 109, bank: 'DBBL', fileType: 'write-off', date: '2024-09-01' },
  ];

  const baseAgentContributionData = [
    { name: 'Priya Singh', collections: 485000, percentage: 24.8, bank: 'DBBL', fileType: 'credit-card', date: '2024-07-15' },
    { name: 'Ravi Gupta', collections: 425000, percentage: 21.7, bank: 'DBBL', fileType: 'write-off', date: '2024-07-20' },
    { name: 'Raj Kumar', collections: 420000, percentage: 21.5, bank: 'One Bank', fileType: 'personal-loan', date: '2024-07-10' },
    { name: 'Amit Sharma', collections: 380000, percentage: 19.4, bank: 'DBBL', fileType: 'credit-card', date: '2024-07-25' },
    { name: 'Sneha Patel', collections: 365000, percentage: 18.6, bank: 'One Bank', fileType: 'credit-card', date: '2024-07-30' },
  ];

  const baseFileStatusData = [
    { name: 'Active Files', count: 8915, color: '#10B981', bank: 'DBBL', fileType: 'credit-card', date: '2024-07-01' },
    { name: 'Expired Files', count: 1243, color: '#EF4444', bank: 'One Bank', fileType: 'personal-loan', date: '2024-07-15' },
    { name: 'Expiring Soon', count: 456, color: '#F59E0B', bank: 'DBBL', fileType: 'write-off', date: '2024-07-30' },
    { name: 'Resolved Files', count: 2876, color: '#6B7280', bank: 'One Bank', fileType: 'credit-card', date: '2024-07-20' },
  ];

  const baseBankWiseData = [
    { bank: 'DBBL', creditCard: 450000, writeOff: 380000, agentBanking: 320000, loanBranch: 280000, fileType: 'credit-card', date: '2024-07-15' },
    { bank: 'One Bank', creditCard: 420000, personalLoan: 390000, other: 150000, fileType: 'personal-loan', date: '2024-07-20' },
  ];

  // Filter functions
  const filterByBank = (data: any[], bankFilter: string) => {
    if (bankFilter === 'all') return data;
    const bankMap: { [key: string]: string } = {
      'dbbl': 'DBBL',
      'one-bank': 'One Bank'
    };
    return data.filter(item => item.bank === bankMap[bankFilter]);
  };

  const filterByFileType = (data: any[], fileTypeFilter: string) => {
    if (fileTypeFilter === 'all') return data;
    return data.filter(item => item.fileType === fileTypeFilter);
  };

  const filterByDateRange = (data: any[], dateRangeFilter: {from: Date | undefined, to: Date | undefined}) => {
    if (!useCustomDateRange || !dateRangeFilter.from || !dateRangeFilter.to) return data;
    
    return data.filter(item => {
      if (!item.date) return false;
      const itemDate = new Date(item.date);
      const fromDate = new Date(dateRangeFilter.from!);
      const toDate = new Date(dateRangeFilter.to!);
      
      // Set time to start/end of day for proper comparison
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(23, 59, 59, 999);
      
      return itemDate >= fromDate && itemDate <= toDate;
    });
  };

  const filterByPeriod = (data: any[], period: string) => {
    if (useCustomDateRange) return data; // Skip period filter if using custom date range
    
    // For demo purposes, we'll simulate different data for different periods
    const multipliers: { [key: string]: number } = {
      'this-month': 1.0,
      'last-month': 0.85,
      'this-quarter': 1.2,
      'this-year': 1.5
    };
    
    const multiplier = multipliers[period] || 1.0;
    return data.map(item => ({
      ...item,
      achieved: Math.round((item.achieved || item.collections || item.count || 0) * multiplier),
      collections: Math.round((item.collections || 0) * multiplier),
      count: Math.round((item.count || 0) * multiplier)
    }));
  };

  // Apply filters to get filtered data
  const getFilteredData = (baseData: any[]) => {
    let filtered = baseData;
    filtered = filterByBank(filtered, selectedBank);
    filtered = filterByFileType(filtered, selectedFileType);
    filtered = filterByDateRange(filtered, dateRangeFilter);
    filtered = filterByPeriod(filtered, selectedPeriod);
    return filtered;
  };

  // Get filtered data
  const recoveryTrendData = getFilteredData(baseRecoveryTrendData);
  const agentContributionData = getFilteredData(baseAgentContributionData);
  const fileStatusData = getFilteredData(baseFileStatusData);
  const bankWiseData = getFilteredData(baseBankWiseData);

  // Calculate summary stats based on filtered data
  const calculateSummaryStats = () => {
    const totalRecovery = agentContributionData.reduce((sum, agent) => sum + (agent.collections || 0), 0);
    const avgCollections = totalRecovery / agentContributionData.length;
    const targetSum = recoveryTrendData.reduce((sum, item) => sum + item.target, 0);
    const achievedSum = recoveryTrendData.reduce((sum, item) => sum + item.achieved, 0);
    const targetAchievement = targetSum > 0 ? (achievedSum / targetSum) * 100 : 0;
    
    return {
      totalRecovery,
      targetAchievement: Math.round(targetAchievement * 10) / 10,
      activeFiles: fileStatusData.find(f => f.name === 'Active Files')?.count || 0,
      expiredFiles: fileStatusData.find(f => f.name === 'Expired Files')?.count || 0,
      topAgent: agentContributionData.length > 0 ? agentContributionData[0].name : 'N/A',
      bestPerformingBank: selectedBank === 'all' ? 'All Banks' : (selectedBank === 'dbbl' ? 'DBBL' : 'One Bank'),
      avgRecoveryRate: Math.round((avgCollections / 1000000) * 100) / 10,
      monthOverMonth: Math.round(Math.random() * 20 + 5) // Simulated for demo
    };
  };

  const summaryStats = calculateSummaryStats();

  const exportReports = [
    { name: 'Monthly Recovery Report', description: 'Detailed monthly recovery analysis', allowedFormats: ['PDF', 'Excel'] },
    { name: 'Agent Performance Report', description: 'Individual agent performance metrics', allowedFormats: ['Excel', 'PDF'] },
    { name: 'Bank-wise Analysis', description: 'Recovery performance by bank', allowedFormats: ['PDF', 'Excel'] },
    { name: 'Expired Files Report', description: 'List of expired files requiring attention', allowedFormats: ['Excel', 'PDF'] },
    { name: 'Collection Summary', description: 'Overall collection statistics', allowedFormats: ['PDF', 'Excel'] },
    { name: 'Visit Tracking Report', description: 'Field visit and contact reports', allowedFormats: ['Excel', 'PDF'] },
  ];

  // Export to Excel function
  const exportToExcel = (reportName: string, data: any[]) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    
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
    
    const fileName = `${reportName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  // Export to PDF function (using print functionality)
  const exportToPDF = (reportName: string) => {
    // Create a new window with the report content
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const reportData = getReportData(reportName);
    
    printWindow.document.write(`
      <html>
        <head>
          <title>${reportName}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              color: #333;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #3B82F6;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .company-name {
              font-size: 24px;
              font-weight: bold;
              color: #1F2937;
              margin-bottom: 5px;
            }
            .report-title {
              font-size: 20px;
              color: #3B82F6;
              margin-bottom: 10px;
            }
            .report-date {
              color: #6B7280;
              font-size: 14px;
            }
            .summary-stats {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 20px;
              margin: 30px 0;
            }
            .stat-card {
              border: 1px solid #E5E7EB;
              border-radius: 8px;
              padding: 15px;
              text-align: center;
            }
            .stat-value {
              font-size: 24px;
              font-weight: bold;
              color: #059669;
              margin-bottom: 5px;
            }
            .stat-label {
              color: #6B7280;
              font-size: 14px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th, td {
              border: 1px solid #E5E7EB;
              padding: 12px;
              text-align: left;
            }
            th {
              background-color: #F9FAFB;
              font-weight: bold;
              color: #374151;
            }
            tr:nth-child(even) {
              background-color: #F9FAFB;
            }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              color: #1F2937;
              margin: 30px 0 15px 0;
              border-bottom: 1px solid #E5E7EB;
              padding-bottom: 5px;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">Bank Recovery Management System</div>
            <div class="report-title">${reportName}</div>
            <div class="report-date">Generated on: ${new Date().toLocaleDateString()}</div>
          </div>
          
          <div class="summary-stats">
            <div class="stat-card">
              <div class="stat-value">৳${summaryStats.totalRecovery.toLocaleString()}</div>
              <div class="stat-label">Total Recovery</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${summaryStats.targetAchievement}%</div>
              <div class="stat-label">Target Achievement</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${summaryStats.activeFiles.toLocaleString()}</div>
              <div class="stat-label">Active Files</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${summaryStats.avgRecoveryRate}%</div>
              <div class="stat-label">Avg Recovery Rate</div>
            </div>
          </div>
          
          ${reportData.content}
          
          <button class="no-print" onclick="window.print()" style="
            background: #3B82F6;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            margin: 20px 0;
            cursor: pointer;
            font-size: 16px;
          ">Print/Save as PDF</button>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  // Get report data based on report name
  const getReportData = (reportName: string) => {
    switch (reportName) {
      case 'Monthly Recovery Report':
        return {
          content: `
            <div class="section-title">Recovery Trend Analysis</div>
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Target</th>
                  <th>Achieved</th>
                  <th>Achievement %</th>
                </tr>
              </thead>
              <tbody>
                ${recoveryTrendData.map(item => `
                  <tr>
                    <td>${item.month}</td>
                    <td>৳${item.target.toLocaleString()}</td>
                    <td>৳${item.achieved.toLocaleString()}</td>
                    <td>${item.percentage}%</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `,
          excelData: recoveryTrendData.map(item => ({
            Month: item.month,
            Target: item.target,
            Achieved: item.achieved,
            'Achievement %': item.percentage
          }))
        };
      
      case 'Agent Performance Report':
        return {
          content: `
            <div class="section-title">Agent Performance Analysis</div>
            <table>
              <thead>
                <tr>
                  <th>Agent Name</th>
                  <th>Collections</th>
                  <th>Contribution %</th>
                </tr>
              </thead>
              <tbody>
                ${agentContributionData.map(agent => `
                  <tr>
                    <td>${agent.name}</td>
                    <td>৳${agent.collections.toLocaleString()}</td>
                    <td>${agent.percentage}%</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `,
          excelData: agentContributionData.map(agent => ({
            'Agent Name': agent.name,
            Collections: agent.collections,
            'Contribution %': agent.percentage
          }))
        };
      
      case 'Bank-wise Analysis':
        return {
          content: `
            <div class="section-title">Bank-wise Recovery Analysis</div>
            <table>
              <thead>
                <tr>
                  <th>Bank</th>
                  <th>Credit Card</th>
                  <th>Personal Loan</th>
                  <th>Write-Off</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${bankWiseData.map(bank => {
                  const total = (bank.creditCard || 0) + (bank.personalLoan || 0) + (bank.writeOff || 0) + (bank.agentBanking || 0) + (bank.loanBranch || 0) + (bank.other || 0);
                  return `
                    <tr>
                      <td>${bank.bank}</td>
                      <td>৳${(bank.creditCard || 0).toLocaleString()}</td>
                      <td>৳${(bank.personalLoan || 0).toLocaleString()}</td>
                      <td>৳${(bank.writeOff || 0).toLocaleString()}</td>
                      <td>৳${total.toLocaleString()}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          `,
          excelData: bankWiseData.map(bank => ({
            Bank: bank.bank,
            'Credit Card': bank.creditCard || 0,
            'Personal Loan': bank.personalLoan || 0,
            'Write-Off': bank.writeOff || 0,
            'Agent Banking': bank.agentBanking || 0,
            'Loan Branch': bank.loanBranch || 0,
            Other: bank.other || 0
          }))
        };
      
      case 'Expired Files Report':
        return {
          content: `
            <div class="section-title">File Status Distribution</div>
            <table>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                ${fileStatusData.map(status => `
                  <tr>
                    <td>${status.name}</td>
                    <td>${status.count.toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `,
          excelData: fileStatusData.map(status => ({
            Status: status.name,
            Count: status.count
          }))
        };
      
      default:
        return {
          content: '<div class="section-title">Report data not available</div>',
          excelData: []
        };
    }
  };

  const handleExport = (reportName: string, format: string) => {
    const reportData = getReportData(reportName);
    
    if (format === 'Excel') {
      exportToExcel(reportName, reportData.excelData);
    } else if (format === 'PDF') {
      exportToPDF(reportName);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights and data exports</p>
          {/* Active Filters Indicator */}
          {(selectedBank !== 'all' || selectedFileType !== 'all' || selectedPeriod !== 'this-month' || useCustomDateRange) && (
            <div className="flex items-center gap-2 mt-2">
              <Filter className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-600 font-medium">Active filters:</span>
              <div className="flex gap-1">
                {selectedBank !== 'all' && (
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                    {selectedBank === 'dbbl' ? 'DBBL' : 'One Bank'}
                  </Badge>
                )}
                {selectedFileType !== 'all' && (
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    {selectedFileType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                )}
                {selectedPeriod !== 'this-month' && !useCustomDateRange && (
                  <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                    {selectedPeriod.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                )}
                {useCustomDateRange && dateRangeFilter.from && dateRangeFilter.to && (
                  <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                    {dateRangeFilter.from.toLocaleDateString()} - {dateRangeFilter.to.toLocaleDateString()}
                  </Badge>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setSelectedBank('all');
                  setSelectedFileType('all');
                  setSelectedPeriod('this-month');
                  setUseCustomDateRange(false);
                  setDateRangeFilter({ from: undefined, to: undefined });
                }}
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
        
        {/* Data Summary */}
        <div className="text-right">
          <div className="text-sm text-gray-500">Showing data for</div>
          <div className="font-semibold text-gray-900">
            {selectedBank === 'all' ? 'All Banks' : (selectedBank === 'dbbl' ? 'DBBL' : 'One Bank')}
            {' • '}
            {selectedFileType === 'all' ? 'All Types' : selectedFileType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </div>
          <div className="text-xs text-gray-500">
            Period: {useCustomDateRange && dateRangeFilter.from && dateRangeFilter.to 
              ? `${dateRangeFilter.from.toLocaleDateString()} - ${dateRangeFilter.to.toLocaleDateString()}`
              : selectedPeriod.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
            }
          </div>
        </div>
      </div>

      {/* Filters & Controls */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Controls
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">Customize your report view by selecting filters below</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Report Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="recovery">Recovery Analysis</SelectItem>
                  <SelectItem value="agent">Agent Performance</SelectItem>
                  <SelectItem value="bank">Bank-wise Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Time Period</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="this-quarter">This Quarter</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Bank</label>
              <Select value={selectedBank} onValueChange={setSelectedBank}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Banks</SelectItem>
                  <SelectItem value="dbbl">DBBL</SelectItem>
                  <SelectItem value="one-bank">One Bank</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">File Type</label>
              <Select value={selectedFileType} onValueChange={setSelectedFileType}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All File Types</SelectItem>
                  <SelectItem value="credit-card">Credit Card</SelectItem>
                  <SelectItem value="personal-loan">Personal Loan</SelectItem>
                  <SelectItem value="write-off">Write-Off</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="useCustomDateRange"
                  checked={useCustomDateRange}
                  onChange={(e) => setUseCustomDateRange(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="useCustomDateRange" className="text-sm font-medium text-gray-700">
                  Use Custom Date Range
                </label>
              </div>
              
              {useCustomDateRange && (
                <div className="flex gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-600">From Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-40 justify-start text-left font-normal text-xs">
                          <CalendarIcon className="mr-2 h-3 w-3" />
                          {dateRangeFilter.from ? dateRangeFilter.from.toLocaleDateString() : "From date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateRangeFilter.from}
                          onSelect={(date) => setDateRangeFilter(prev => ({ ...prev, from: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-600">To Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-40 justify-start text-left font-normal text-xs">
                          <CalendarIcon className="mr-2 h-3 w-3" />
                          {dateRangeFilter.to ? dateRangeFilter.to.toLocaleDateString() : "To date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateRangeFilter.to}
                          onSelect={(date) => setDateRangeFilter(prev => ({ ...prev, to: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Filter Summary */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Current View:</span> Showing {reportType} data for{' '}
              <span className="font-medium text-blue-600">
                {selectedBank === 'all' ? 'all banks' : (selectedBank === 'dbbl' ? 'DBBL' : 'One Bank')}
              </span>
              {' • '}
              <span className="font-medium text-green-600">
                {selectedFileType === 'all' ? 'all file types' : selectedFileType.replace('-', ' ')}
              </span>
              {' • '}
              <span className="font-medium text-purple-600">
                {useCustomDateRange && dateRangeFilter.from && dateRangeFilter.to 
                  ? `${dateRangeFilter.from.toLocaleDateString()} to ${dateRangeFilter.to.toLocaleDateString()}`
                  : selectedPeriod.replace('-', ' ')
                }
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <div className="h-2 bg-gradient-to-r from-green-500 to-green-600" />
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-100">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Total Recovery</h3>
            </div>
            <span className="text-2xl font-bold text-gray-900">৳{summaryStats.totalRecovery.toLocaleString()}</span>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-xs text-green-600">+{summaryStats.monthOverMonth}%</span>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600" />
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-100">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Target Achievement</h3>
            </div>
            <span className="text-2xl font-bold text-gray-900">{summaryStats.targetAchievement}%</span>
            <div className="text-xs text-gray-500 mt-2">Above target</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-600" />
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-100">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Active Files</h3>
            </div>
            <span className="text-2xl font-bold text-gray-900">{summaryStats.activeFiles.toLocaleString()}</span>
            <div className="text-xs text-gray-500 mt-2">{summaryStats.expiredFiles} expired</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-600" />
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-orange-100">
                <PieChart className="h-5 w-5 text-orange-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Avg Recovery Rate</h3>
            </div>
            <span className="text-2xl font-bold text-gray-900">{summaryStats.avgRecoveryRate}%</span>
            <div className="text-xs text-gray-500 mt-2">Industry benchmark: 18%</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      {recoveryTrendData.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-600 mb-4">
              No data found for the selected filters. Try adjusting your filter criteria.
            </p>
            <Button 
              variant="outline"
              onClick={() => {
                setSelectedBank('all');
                setSelectedFileType('all');
                setSelectedPeriod('this-month');
              }}
            >
              Reset Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recovery Trend */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recovery Trend Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={recoveryTrendData}>
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
                />
                <Area 
                  type="monotone" 
                  dataKey="achieved" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorAchieved)" 
                />
                <Line type="monotone" dataKey="target" stroke="#EF4444" strokeDasharray="5 5" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* File Status Distribution */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              File Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              <ResponsiveContainer width="100%" height={200}>
                <RechartsPieChart>
                  <Pie
                    data={fileStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {fileStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
              
              <div className="space-y-3">
                {fileStatusData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium text-gray-700">{item.name}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{item.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      )}

      {/* Agent Contribution Chart */}
      {agentContributionData.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Agent Contribution Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={agentContributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis 
                  stroke="#6B7280"
                  tickFormatter={(value) => `৳${value.toLocaleString()}`}
                />
                <Tooltip 
                  formatter={(value) => [`৳${value.toLocaleString()}`, 'Collections']}
                />
                <Bar 
                  dataKey="collections" 
                  fill="url(#agentGradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="agentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#EC4899" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Export Reports Section */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Reports
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">Download detailed reports in Excel or PDF format</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exportReports.map((report, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{report.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{report.description}</p>
                    <div className="flex gap-2 mb-3">
                      {report.allowedFormats.map((format) => (
                        <Badge key={format} variant="outline" className="text-xs">
                          {format}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {report.allowedFormats.includes('Excel') && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 flex items-center gap-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => handleExport(report.name, 'Excel')}
                    >
                      <FileSpreadsheet className="h-3 w-3" />
                      Excel
                    </Button>
                  )}
                  {report.allowedFormats.includes('PDF') && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleExport(report.name, 'PDF')}
                    >
                      <FileText className="h-3 w-3" />
                      PDF
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}