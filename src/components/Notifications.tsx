import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Search, Bell, Check, X, Eye, Trash2, Filter } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Load notifications from localStorage on component mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        const parsedNotifications = JSON.parse(savedNotifications);
        setNotifications(parsedNotifications);
      } catch (error) {
        console.error('Error parsing saved notifications:', error);
        // Fallback to mock data if parsing fails
        const mockData = getMockNotifications();
        setNotifications(mockData);
        localStorage.setItem('notifications', JSON.stringify(mockData));
      }
    } else {
      // Initialize with mock data if no saved notifications exist
      const mockData = getMockNotifications();
      setNotifications(mockData);
      localStorage.setItem('notifications', JSON.stringify(mockData));
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Apply filters when search, type, or status changes
  useEffect(() => {
    let result = notifications;
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(notification => 
        notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply type filter
    if (selectedType !== 'all') {
      result = result.filter(notification => notification.type === selectedType);
    }
    
    // Apply status filter
    if (selectedStatus !== 'all') {
      result = result.filter(notification => 
        selectedStatus === 'read' ? notification.read : !notification.read
      );
    }
    
    setFilteredNotifications(result);
  }, [searchQuery, selectedType, selectedStatus, notifications]);

  // Mock notifications data - in a real app, this would come from an API
  const getMockNotifications = () => {
    return [
      {
        id: 1,
        title: 'New Collection Submitted',
        message: 'Priya Singh submitted a new collection report for review',
        time: '2024-07-28 10:30:00',
        type: 'info',
        read: false,
        color: 'blue'
      },
      {
        id: 2,
        title: 'File Expiry Alert',
        message: '5 files assigned to Priya Singh will expire in 2 days',
        time: '2024-07-28 09:15:00',
        type: 'warning',
        read: false,
        color: 'orange'
      },
      {
        id: 3,
        title: 'Monthly Target Achieved',
        message: 'Amit Sharma has achieved 105% of monthly collection target',
        time: '2024-07-28 07:45:00',
        type: 'success',
        read: true,
        color: 'green'
      },
      {
        id: 4,
        title: 'System Maintenance',
        message: 'Scheduled maintenance will occur tonight from 12:00 AM to 2:00 AM',
        time: '2024-07-27 16:30:00',
        type: 'info',
        read: true,
        color: 'blue'
      },
      {
        id: 5,
        title: 'Collection Approved',
        message: 'Your collection report for Rajesh Kumar has been approved',
        time: '2024-07-27 14:20:00',
        type: 'success',
        read: true,
        color: 'green'
      },
      {
        id: 6,
        title: 'Collection Rejected',
        message: 'Your collection report for Kavya Singh has been rejected. Reason: Cheque image unclear',
        time: '2024-07-27 11:10:00',
        type: 'error',
        read: false,
        color: 'red'
      },
      {
        id: 7,
        title: 'New File Assigned',
        message: '12 new files have been assigned to your account',
        time: '2024-07-26 18:45:00',
        type: 'info',
        read: true,
        color: 'blue'
      },
      {
        id: 8,
        title: 'Performance Alert',
        message: 'Your collection performance is below target this month',
        time: '2024-07-26 09:30:00',
        type: 'warning',
        read: true,
        color: 'orange'
      }
    ];
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleMarkAsUnread = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: false }
          : notification
      )
    );
  };

  const handleDelete = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const handleMarkAllAsUnread = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: false }))
    );
  };

  const handleDeleteAllRead = () => {
    setNotifications(prev => prev.filter(notification => !notification.read));
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'info':
        return <Badge className="bg-blue-100 text-blue-800">Info</Badge>;
      case 'warning':
        return <Badge className="bg-orange-100 text-orange-800">Warning</Badge>;
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const getStatusBadge = (read: boolean) => {
    return read ? 
      <Badge className="bg-gray-100 text-gray-800">Read</Badge> :
      <Badge className="bg-purple-100 text-purple-800">Unread</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">Manage and review all your notifications</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            Mark All Read
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleMarkAllAsUnread}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Mark All Unread
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDeleteAllRead}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Read
          </Button>
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
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setSelectedType('all');
                setSelectedStatus('all');
              }}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification History
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Showing {filteredNotifications.length} of {notifications.length} notifications
          </p>
        </CardHeader>
        <CardContent className="p-6">
          {filteredNotifications.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotifications.map((notification) => (
                    <TableRow 
                      key={notification.id} 
                      className={`hover:bg-gray-50 ${notification.read ? 'opacity-75' : ''}`}
                    >
                      <TableCell>
                        <div className="font-medium text-gray-900">{notification.title}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600 max-w-md">{notification.message}</div>
                      </TableCell>
                      <TableCell>
                        {getTypeBadge(notification.type)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-500">{notification.time}</div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(notification.read)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {!notification.read ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="flex items-center gap-1"
                            >
                              <Check className="h-3 w-3" />
                              Mark Read
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMarkAsUnread(notification.id)}
                              className="flex items-center gap-1"
                            >
                              <Eye className="h-3 w-3" />
                              Mark Unread
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(notification.id)}
                            className="flex items-center gap-1 text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No notifications found</h3>
              <p className="text-gray-500">
                {notifications.length === 0 
                  ? 'You have no notifications at this time.' 
                  : 'Try adjusting your filters to see more notifications.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}