import React, { useState, useEffect } from 'react';
import { Search, Menu, Bell, User, LogOut, Shield, CheckCheck, Eye } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useAuth, useIsAdmin } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
  onSearch: (query: string) => void;
}

export function Layout({ children, currentPage, onPageChange, onSearch }: LayoutProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Load notifications from localStorage on component mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        const parsedNotifications = JSON.parse(savedNotifications);
        setNotifications(parsedNotifications);
      } catch (error) {
        console.error('Error parsing saved notifications:', error);
        // Initialize with default notifications if parsing fails
        setNotifications([
          {
            id: 1,
            title: 'New Collection Submitted',
            message: 'Priya Singh submitted a new collection report for review',
            time: '2 hours ago',
            type: 'info',
            read: false,
            color: 'blue'
          },
          {
            id: 2,
            title: 'File Expiry Alert',
            message: '5 files assigned to Priya Singh will expire in 2 days',
            time: '1 hour ago',
            type: 'warning',
            read: false,
            color: 'orange'
          },
          {
            id: 3,
            title: 'Monthly Target Achieved',
            message: 'Amit Sharma has achieved 105% of monthly collection target',
            time: '3 hours ago',
            type: 'success',
            read: false,
            color: 'green'
          }
        ]);
      }
    } else {
      // Initialize with default notifications if none exist in localStorage
      const defaultNotifications = [
        {
          id: 1,
          title: 'New Collection Submitted',
          message: 'Priya Singh submitted a new collection report for review',
          time: '2 hours ago',
          type: 'info',
          read: false,
          color: 'blue'
        },
        {
          id: 2,
          title: 'File Expiry Alert',
          message: '5 files assigned to Priya Singh will expire in 2 days',
          time: '1 hour ago',
          type: 'warning',
          read: false,
          color: 'orange'
        },
        {
          id: 3,
          title: 'Monthly Target Achieved',
          message: 'Amit Sharma has achieved 105% of monthly collection target',
          time: '3 hours ago',
          type: 'success',
          read: false,
          color: 'green'
        }
      ];
      setNotifications(defaultNotifications);
      localStorage.setItem('notifications', JSON.stringify(defaultNotifications));
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const { user, logout } = useAuth();
  const isAdmin = useIsAdmin();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  // Notification handlers
  const handleNotificationClick = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
    
    // You can add specific actions based on notification type
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      switch (notification.type) {
        case 'info':
          onPageChange('collection-tracker');
          break;
        case 'warning':
          onPageChange('expiry-tracker');
          break;
        case 'success':
          onPageChange('agent-performance');
          break;
        default:
          break;
      }
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const handleViewAllNotifications = () => {
    // Navigate to notifications page
    onPageChange('notifications');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const adminNavigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'agent-performance', label: 'Agent Performance', icon: '👥' },
    { id: 'expiry-tracker', label: 'Expiry Tracker', icon: '⏰' },
    { id: 'collection-tracker', label: 'Collection Tracker', icon: '💰' },
    { id: 'bank-files', label: 'Bank Files', icon: '🏦' },
    { id: 'agent-details', label: 'Agent Details', icon: '👨‍💼' },
    { id: 'reports', label: 'Reports', icon: '📈' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const agentNavigationItems = [
    { id: 'agent-dashboard', label: 'My Dashboard', icon: '📊' },
    { id: 'my-files', label: 'My Files', icon: '📋' },
    { id: 'my-collections', label: 'Collections', icon: '💰' },
    { id: 'my-performance', label: 'Performance', icon: '📈' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const navigationItems = isAdmin ? adminNavigationItems : agentNavigationItems;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-white shadow-xl transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold">BR</span>
            </div>
            {sidebarOpen && <span className="font-semibold text-gray-900">Bank Recovery</span>}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`w-full flex items-center ${sidebarOpen ? 'px-3' : 'justify-center'} py-2.5 rounded-xl transition-all duration-200 hover:bg-gray-100 group ${
                  currentPage === item.id
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 border border-blue-200'
                    : 'text-gray-700'
                }`}
              >
                <span className={`text-lg ${sidebarOpen ? 'mr-3' : ''}`}>{item.icon}</span>
                {sidebarOpen && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by Client ID, CASA No, or File No..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </form>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Notification Center */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative hover:bg-gray-100">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80" align="end" forceMount>
                <DropdownMenuLabel className="font-semibold border-b pb-2">
                  <div className="flex items-center justify-between">
                    <span>Notifications</span>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <Badge variant="secondary" className="text-xs">{unreadCount} new</Badge>
                      )}
                      {unreadCount > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={handleMarkAllAsRead}
                          className="h-6 px-2 text-xs hover:bg-gray-100"
                          title="Mark all as read"
                        >
                          <CheckCheck className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </DropdownMenuLabel>
                
                {/* Notification Items */}
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <DropdownMenuItem 
                        key={notification.id}
                        className={`flex-col items-start p-4 cursor-pointer transition-colors ${
                          notification.read 
                            ? 'hover:bg-gray-50 opacity-75' 
                            : `hover:bg-${notification.color}-50`
                        }`}
                        onClick={() => handleNotificationClick(notification.id)}
                      >
                        <div className="flex items-start gap-3 w-full">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            notification.read 
                              ? 'bg-gray-300' 
                              : `bg-${notification.color}-500`
                          }`}></div>
                          <div className="flex-1">
                            <h4 className={`font-medium text-sm ${
                              notification.read ? 'text-gray-600' : 'text-gray-900'
                            }`}>
                              {notification.title}
                            </h4>
                            <p className={`text-xs mt-1 ${
                              notification.read ? 'text-gray-500' : 'text-gray-600'
                            }`}>
                              {notification.message}
                            </p>
                            <span className="text-xs text-gray-500 mt-2 block">{notification.time}</span>
                          </div>
                          {!notification.read && (
                            <div className={`w-2 h-2 bg-${notification.color}-500 rounded-full flex-shrink-0 mt-1`}></div>
                          )}
                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No notifications</p>
                    </div>
                  )}
                </div>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-center py-3 text-blue-600 hover:bg-blue-50 cursor-pointer"
                  onClick={handleViewAllNotifications}
                >
                  <div className="flex items-center justify-center gap-2 w-full">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm font-medium">View All Notifications</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>{user?.name?.split(' ').map(n => n[0]).join('') || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Shield className="h-3 w-3" />
                      <Badge variant={isAdmin ? 'default' : 'secondary'} className="text-xs">
                        {isAdmin ? 'Administrator' : 'Agent'}
                      </Badge>
                      {!isAdmin && user?.assignedBanks && (
                        <Badge variant="outline" className="text-xs">
                          {user.assignedBanks.join(', ')}
                        </Badge>
                      )}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onPageChange('settings')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}