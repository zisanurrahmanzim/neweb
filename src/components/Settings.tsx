import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Settings as SettingsIcon, User, Bell, Shield, Database, Palette, Globe, Save, Upload } from 'lucide-react';

export function Settings() {
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
    expiryAlerts: true,
    collectionReminders: true
  });

  const [userSettings, setUserSettings] = useState({
    name: 'John Administrator',
    email: 'admin@bankrecovery.com',
    phone: '+91 9876543210',
    role: 'System Administrator',
    department: 'Operations',
    timezone: 'Asia/Kolkata'
  });

  const [systemSettings, setSystemSettings] = useState({
    defaultCurrency: 'BDT',
    dateFormat: 'DD/MM/YYYY',
    language: 'English',
    sessionTimeout: '30',
    autoBackup: true,
    maintenanceMode: false
  });

  const handleSaveProfile = () => {
    console.log('Saving profile settings:', userSettings);
    // In a real app, this would make an API call
  };

  const handleSaveNotifications = () => {
    console.log('Saving notification settings:', notifications);
    // In a real app, this would make an API call
  };

  const handleSaveSystem = () => {
    console.log('Saving system settings:', systemSettings);
    // In a real app, this would make an API call
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account and application preferences</p>
        </div>
      </div>

      {/* Settings Tabs */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          <Tabs defaultValue="profile" className="w-full">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100 px-6 py-4">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-white/50 backdrop-blur-sm p-1 rounded-xl">
                <TabsTrigger value="profile" className="flex items-center gap-2 px-3 py-2 rounded-lg">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2 px-3 py-2 rounded-lg">
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2 px-3 py-2 rounded-lg">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Security</span>
                </TabsTrigger>
                <TabsTrigger value="system" className="flex items-center gap-2 px-3 py-2 rounded-lg">
                  <Database className="h-4 w-4" />
                  <span className="hidden sm:inline">System</span>
                </TabsTrigger>
                <TabsTrigger value="appearance" className="flex items-center gap-2 px-3 py-2 rounded-lg">
                  <Palette className="h-4 w-4" />
                  <span className="hidden sm:inline">Appearance</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              {/* Profile Settings */}
              <TabsContent value="profile" className="mt-0 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
                  <div className="flex items-center gap-6 mb-6">
                    <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                      <AvatarImage src="/api/placeholder/80/80" alt="Profile" />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-semibold">
                        JA
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Change Avatar
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max size 2MB</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={userSettings.name}
                      onChange={(e) => setUserSettings({...userSettings, name: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userSettings.email}
                      onChange={(e) => setUserSettings({...userSettings, email: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={userSettings.phone}
                      onChange={(e) => setUserSettings({...userSettings, phone: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={userSettings.role}
                      disabled
                      className="mt-1 bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select value={userSettings.department} onValueChange={(value) => setUserSettings({...userSettings, department: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Operations">Operations</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="IT">IT</SelectItem>
                        <SelectItem value="Management">Management</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={userSettings.timezone} onValueChange={(value) => setUserSettings({...userSettings, timezone: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                        <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                        <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleSaveProfile} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Profile
                </Button>
              </TabsContent>

              {/* Notification Settings */}
              <TabsContent value="notifications" className="mt-0 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                  <p className="text-gray-600 mb-6">Choose how you want to be notified about important events.</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">General Notifications</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="email-alerts">Email Alerts</Label>
                          <p className="text-sm text-gray-600">Receive important updates via email</p>
                        </div>
                        <Switch
                          id="email-alerts"
                          checked={notifications.emailAlerts}
                          onCheckedChange={(checked) => setNotifications({...notifications, emailAlerts: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="sms-notifications">SMS Notifications</Label>
                          <p className="text-sm text-gray-600">Get critical alerts via SMS</p>
                        </div>
                        <Switch
                          id="sms-notifications"
                          checked={notifications.smsNotifications}
                          onCheckedChange={(checked) => setNotifications({...notifications, smsNotifications: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="push-notifications">Push Notifications</Label>
                          <p className="text-sm text-gray-600">Receive browser notifications</p>
                        </div>
                        <Switch
                          id="push-notifications"
                          checked={notifications.pushNotifications}
                          onCheckedChange={(checked) => setNotifications({...notifications, pushNotifications: checked})}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Recovery Alerts</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="expiry-alerts">Expiry Alerts</Label>
                          <p className="text-sm text-gray-600">Get notified when files are about to expire</p>
                        </div>
                        <Switch
                          id="expiry-alerts"
                          checked={notifications.expiryAlerts}
                          onCheckedChange={(checked) => setNotifications({...notifications, expiryAlerts: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="collection-reminders">Collection Reminders</Label>
                          <p className="text-sm text-gray-600">Reminders for pending collections</p>
                        </div>
                        <Switch
                          id="collection-reminders"
                          checked={notifications.collectionReminders}
                          onCheckedChange={(checked) => setNotifications({...notifications, collectionReminders: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="weekly-reports">Weekly Reports</Label>
                          <p className="text-sm text-gray-600">Receive weekly performance summaries</p>
                        </div>
                        <Switch
                          id="weekly-reports"
                          checked={notifications.weeklyReports}
                          onCheckedChange={(checked) => setNotifications({...notifications, weeklyReports: checked})}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Button onClick={handleSaveNotifications} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Notification Settings
                </Button>
              </TabsContent>

              {/* Security Settings */}
              <TabsContent value="security" className="mt-0 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
                  <p className="text-gray-600 mb-6">Manage your account security and access controls.</p>
                </div>

                <div className="space-y-6">
                  <Card className="bg-gray-50">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Change Password</h4>
                      <p className="text-sm text-gray-600 mb-4">Update your password to keep your account secure.</p>
                      <div className="space-y-3">
                        <Input type="password" placeholder="Current password" />
                        <Input type="password" placeholder="New password" />
                        <Input type="password" placeholder="Confirm new password" />
                        <Button variant="outline" size="sm">Update Password</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-50">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600 mb-4">Add an extra layer of security to your account.</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="destructive">Disabled</Badge>
                        <Button variant="outline" size="sm">Enable 2FA</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-50">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Active Sessions</h4>
                      <p className="text-sm text-gray-600 mb-4">Manage your active login sessions.</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Current Session</p>
                            <p className="text-xs text-gray-500">Chrome on Windows • 192.168.1.100</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                        <Button variant="destructive" size="sm">Sign Out All Other Sessions</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* System Settings */}
              <TabsContent value="system" className="mt-0 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">System Configuration</h3>
                  <p className="text-gray-600 mb-6">Configure system-wide settings and preferences.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="currency">Default Currency</Label>
                    <Select value={systemSettings.defaultCurrency} onValueChange={(value) => setSystemSettings({...systemSettings, defaultCurrency: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BDT">BDT (৳)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="date-format">Date Format</Label>
                    <Select value={systemSettings.dateFormat} onValueChange={(value) => setSystemSettings({...systemSettings, dateFormat: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select value={systemSettings.language} onValueChange={(value) => setSystemSettings({...systemSettings, language: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Bengali">Bengali (বাংলা)</SelectItem>
                        <SelectItem value="Hindi">Hindi</SelectItem>
                        <SelectItem value="Urdu">Urdu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <Input
                      id="session-timeout"
                      type="number"
                      value={systemSettings.sessionTimeout}
                      onChange={(e) => setSystemSettings({...systemSettings, sessionTimeout: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-backup">Automatic Backup</Label>
                      <p className="text-sm text-gray-600">Enable daily automatic data backups</p>
                    </div>
                    <Switch
                      id="auto-backup"
                      checked={systemSettings.autoBackup}
                      onCheckedChange={(checked) => setSystemSettings({...systemSettings, autoBackup: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                      <p className="text-sm text-gray-600">Enable maintenance mode for system updates</p>
                    </div>
                    <Switch
                      id="maintenance-mode"
                      checked={systemSettings.maintenanceMode}
                      onCheckedChange={(checked) => setSystemSettings({...systemSettings, maintenanceMode: checked})}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveSystem} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save System Settings
                </Button>
              </TabsContent>

              {/* Appearance Settings */}
              <TabsContent value="appearance" className="mt-0 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance & Theme</h3>
                  <p className="text-gray-600 mb-6">Customize the look and feel of your application.</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label>Theme</Label>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <div className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50 cursor-pointer">
                        <div className="w-full h-20 bg-white rounded mb-2"></div>
                        <p className="text-sm font-medium text-center">Light</p>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg cursor-pointer">
                        <div className="w-full h-20 bg-gray-800 rounded mb-2"></div>
                        <p className="text-sm font-medium text-center">Dark</p>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg cursor-pointer">
                        <div className="w-full h-20 bg-gradient-to-br from-gray-800 to-white rounded mb-2"></div>
                        <p className="text-sm font-medium text-center">Auto</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Accent Color</Label>
                    <div className="flex gap-3 mt-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500 cursor-pointer border-2 border-blue-200"></div>
                      <div className="w-8 h-8 rounded-full bg-purple-500 cursor-pointer"></div>
                      <div className="w-8 h-8 rounded-full bg-green-500 cursor-pointer"></div>
                      <div className="w-8 h-8 rounded-full bg-red-500 cursor-pointer"></div>
                      <div className="w-8 h-8 rounded-full bg-orange-500 cursor-pointer"></div>
                    </div>
                  </div>

                  <div>
                    <Label>Display Density</Label>
                    <Select defaultValue="comfortable">
                      <SelectTrigger className="mt-1 w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compact">Compact</SelectItem>
                        <SelectItem value="comfortable">Comfortable</SelectItem>
                        <SelectItem value="spacious">Spacious</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Appearance Settings
                </Button>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}