import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ArrowLeft, Phone, Mail, MapPin, Calendar, IndianRupee, FileText, Clock, User } from 'lucide-react';

interface ClientProfileProps {
  clientId: string;
  onBack: () => void;
}

export function ClientProfile({ clientId, onBack }: ClientProfileProps) {
  const [activeTab, setActiveTab] = useState('account');

  // Mock client data - in real app, this would come from an API
  const clientData = {
    clientId: 'CL001234',
    fileNo: 'FL567890',
    casaNo: 'CA789012',
    name: 'Rajesh Kumar Sharma',
    phone: '+91 9876543210',
    email: 'rajesh.sharma@email.com',
    bank: 'DBBL',
    fileType: 'Credit Card',
    cardNo: '**** **** **** 1234',
    outstanding: 125000,
    overdue: 45000,
    allegationDate: '2024-01-15',
    expiryDate: '2024-12-15',
    agent: 'Priya Singh',
    visitStatus: 'Visited',
    presentAddress: '123 MG Road, Bangalore - 560001',
    permanentAddress: '456 Gandhi Nagar, Delhi - 110001',
    status: 'Active',
    lastPayment: '2024-06-15',
    totalCollected: 75000,
  };

  const paymentHistory = [
    { date: '2024-06-15', amount: 25000, method: 'bKash', status: 'Success' },
    { date: '2024-05-20', amount: 30000, method: 'Bank Transfer', status: 'Success' },
    { date: '2024-04-18', amount: 20000, method: 'Cash', status: 'Success' },
    { date: '2024-03-12', amount: 15000, method: 'Cheque', status: 'Failed' },
  ];

  const visitNotes = [
    { date: '2024-06-20', agent: 'Priya Singh', note: 'Customer contacted via phone. Promised to pay ₹25,000 by month end.', type: 'Phone Call' },
    { date: '2024-06-15', agent: 'Priya Singh', note: 'Visited customer at present address. Customer made partial payment of ₹25,000.', type: 'Field Visit' },
    { date: '2024-06-10', agent: 'Priya Singh', note: 'Customer not available at present address. Left notice.', type: 'Field Visit' },
  ];

  const documents = [
    { name: 'Identity Proof - Aadhaar Card', type: 'PDF', uploadDate: '2024-01-15' },
    { name: 'Address Proof - Utility Bill', type: 'PDF', uploadDate: '2024-01-15' },
    { name: 'Income Certificate', type: 'PDF', uploadDate: '2024-01-15' },
    { name: 'Bank Statement', type: 'PDF', uploadDate: '2024-01-15' },
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      'Active': 'default',
      'Expired': 'destructive',
      'Resolved': 'secondary',
    } as const;
    return <Badge variant={variants[status as keyof typeof variants] || 'default'}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Search
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Client Profile</h1>
          <p className="text-gray-600">Complete overview of client information and history</p>
        </div>
      </div>

      {/* Client Overview Card */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{clientData.name}</h2>
                <p className="text-gray-600">Client ID: {clientData.clientId}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {getStatusBadge(clientData.status)}
              <Badge variant="outline">{clientData.fileType}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                File Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">File No:</span>
                  <span className="font-medium">{clientData.fileNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">CASA No:</span>
                  <span className="font-medium">{clientData.casaNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bank:</span>
                  <span className="font-medium">{clientData.bank}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Card No:</span>
                  <span className="font-medium">{clientData.cardNo}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <IndianRupee className="h-4 w-4" />
                Financial Info
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Outstanding:</span>
                  <span className="font-medium text-red-600">৳{clientData.outstanding.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Overdue:</span>
                  <span className="font-medium text-orange-600">৳{clientData.overdue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Collected:</span>
                  <span className="font-medium text-green-600">৳{clientData.totalCollected.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Payment:</span>
                  <span className="font-medium">{clientData.lastPayment}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Timeline
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Allegation:</span>
                  <span className="font-medium">{clientData.allegationDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expiry:</span>
                  <span className="font-medium">{clientData.expiryDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Agent:</span>
                  <span className="font-medium">{clientData.agent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Visit Status:</span>
                  <Badge variant="secondary" className="text-xs">{clientData.visitStatus}</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Contact Info
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 text-gray-400" />
                  <span className="font-medium">{clientData.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3 text-gray-400" />
                  <span className="font-medium text-xs">{clientData.email}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-3 w-3 text-gray-400 mt-0.5" />
                  <span className="text-xs">{clientData.presentAddress}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 rounded-xl bg-gray-100 p-1">
          <TabsTrigger value="account" className="rounded-lg">Account Info</TabsTrigger>
          <TabsTrigger value="payments" className="rounded-lg">Payment History</TabsTrigger>
          <TabsTrigger value="visits" className="rounded-lg">Visit Notes</TabsTrigger>
          <TabsTrigger value="documents" className="rounded-lg">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-4">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Complete Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Present Address</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{clientData.presentAddress}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Permanent Address</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{clientData.permanentAddress}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paymentHistory.map((payment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <div>
                        <p className="font-medium text-gray-900">৳{payment.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">{payment.date} • {payment.method}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={payment.status === 'Success' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {payment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visits" className="space-y-4">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Visit Notes & Communication</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {visitNotes.map((note, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{note.type}</Badge>
                        <span className="text-sm text-gray-600">{note.agent}</span>
                      </div>
                      <span className="text-sm text-gray-500">{note.date}</span>
                    </div>
                    <p className="text-gray-700">{note.note}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Documents & Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map((doc, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-blue-500" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-sm text-gray-600">{doc.type} • Uploaded {doc.uploadDate}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}