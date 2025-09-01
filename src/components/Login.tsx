import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Alert, AlertDescription } from './ui/alert';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [showDemo, setShowDemo] = useState(false);
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    const success = await login(email);
    if (!success) {
      setError('Invalid email address. Please check your credentials or contact your administrator.');
    }
  };

  const demoUsers = [
    { email: 'admin@bankrecovery.com', role: 'Administrator', description: 'Full system access' },
    { email: 'manager@bankrecovery.com', role: 'Manager', description: 'Administrative access' },
    { email: 'priya.singh@company.com', role: 'Agent', description: 'DBBL & One Bank' },
    { email: 'raj.kumar@company.com', role: 'Agent', description: 'One Bank' },
    { email: 'amit.sharma@company.com', role: 'Agent', description: 'DBBL' }
  ];

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">BR</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Bank Recovery System</h1>
          <p className="text-gray-600 mt-2">Sign in to access your dashboard</p>
        </div>

        {/* Login Form */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">Welcome Back</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </div>
                )}
              </Button>
            </form>

            {/* Demo Accounts Toggle */}
            <div className="pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDemo(!showDemo)}
                className="w-full"
              >
                {showDemo ? 'Hide' : 'Show'} Demo Accounts
              </Button>
            </div>

            {/* Demo Accounts */}
            {showDemo && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Demo Accounts:</h4>
                <div className="space-y-2">
                  {demoUsers.map((user, index) => (
                    <div
                      key={index}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleDemoLogin(user.email)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.role}</div>
                          <div className="text-xs text-gray-600">{user.email}</div>
                          <div className="text-xs text-gray-500">{user.description}</div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-xs">
                          Use
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Access is restricted to authorized personnel only. 
            <br />
            Contact your administrator for account access.
          </p>
        </div>
      </div>
    </div>
  );
}