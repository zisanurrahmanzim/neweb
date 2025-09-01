import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { 
  User, 
  FileText, 
  TrendingUp, 
  Target, 
  Calendar, 
  Phone, 
  MapPin, 
  Clock,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function AgentDashboard() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Agent's personal data (in a real app, this would come from API)
  const agentData = {
    currentFiles: 145,
    monthlyTarget: 500000,
    currentCollections: 387500,
    visitRate: 91,
    collectionRate: 87,
    totalClients: 89,
    completedToday: 12,
    pendingVisits: 23,
    phoneCallsMade: 45,
    performanceRating: 4.8,
    ranking: 2,
    totalAgents: 15
  };

  const recentActivities = [
    {
      id: 1,
      type: 'collection',
      client: 'John Doe',
      amount: 25000,
      status: 'success',
      time: '2 hours ago',
      description: 'Partial payment collected'
    },
    {
      id: 2,
      type: 'visit',
      client: 'Sarah Wilson',
      status: 'completed',
      time: '4 hours ago',
      description: 'Field visit completed - No contact'
    },
    {
      id: 3,
      type: 'call',
      client: 'Mike Johnson',
      status: 'follow-up',
      time: '6 hours ago',
      description: 'Phone call - Promised payment next week'
    },
    {
      id: 4,
      type: 'collection',
      client: 'Lisa Brown',
      amount: 15000,
      status: 'success',
      time: '1 day ago',
      description: 'Full settlement received'
    }
  ];

  const upcomingTasks = [
    {
      id: 1,
      client: 'Robert Smith',
      type: 'visit',
      time: '10:00 AM',
      address: '123 Main St, Downtown',
      priority: 'high'
    },
    {
      id: 2,
      client: 'Emma Davis',
      type: 'call',
      time: '2:00 PM',
      phone: '+91 9876543210',
      priority: 'medium'
    },
    {
      id: 3,
      client: 'David Wilson',
      type: 'visit',
      time: '4:30 PM',
      address: '456 Oak Ave, Suburb',
      priority: 'low'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'collection': return <DollarSign className="h-4 w-4 text-green-600" />;
      case 'visit': return <MapPin className="h-4 w-4 text-blue-600" />;
      case 'call': return <Phone className="h-4 w-4 text-purple-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case 'follow-up':
        return <Badge className="bg-yellow-100 text-yellow-800">Follow-up</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const completionPercentage = (agentData.currentCollections / agentData.monthlyTarget) * 100;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-4 border-white">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="bg-white text-blue-600 font-bold text-lg">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'A'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
            <p className="text-blue-100">
              {user?.assignedBanks?.join(' • ')} • Agent Dashboard
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Star className="h-4 w-4 text-yellow-300" />
              <span className="text-sm">Rating: {agentData.performanceRating}/5.0</span>
              <span className="text-sm">• Rank #{agentData.ranking} of {agentData.totalAgents}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600" />
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-100">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Current Files</h3>
            </div>
            <span className="text-2xl font-bold text-gray-900">{agentData.currentFiles}</span>
            <p className="text-xs text-gray-500 mt-1">Active cases assigned</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <div className="h-2 bg-gradient-to-r from-green-500 to-green-600" />
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-100">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Collections</h3>
            </div>
            <span className="text-2xl font-bold text-gray-900">
              ৳{agentData.currentCollections.toLocaleString()}
            </span>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-600" />
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-100">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Success Rate</h3>
            </div>
            <span className="text-2xl font-bold text-gray-900">{agentData.collectionRate}%</span>
            <p className="text-xs text-gray-500 mt-1">Collection efficiency</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-600" />
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-orange-100">
                <CheckCircle className="h-5 w-5 text-orange-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Today's Progress</h3>
            </div>
            <span className="text-2xl font-bold text-gray-900">{agentData.completedToday}</span>
            <p className="text-xs text-gray-500 mt-1">Tasks completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Target Progress */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Monthly Target Progress
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                ৳{agentData.currentCollections.toLocaleString()} of ৳{agentData.monthlyTarget.toLocaleString()}
              </p>
            </div>
            <Badge variant={completionPercentage >= 100 ? 'default' : 'secondary'}>
              {completionPercentage.toFixed(0)}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={completionPercentage} className="h-3" />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>Target: ৳{agentData.monthlyTarget.toLocaleString()}</span>
            <span>Remaining: ৳{(agentData.monthlyTarget - agentData.currentCollections).toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Today's Tasks and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTasks.map((task) => (
              <div key={task.id} className={`p-4 border-l-4 ${getPriorityColor(task.priority)} bg-gray-50 rounded-r-lg`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{task.client}</h4>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{task.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {task.type === 'visit' ? (
                    <>
                      <MapPin className="h-4 w-4" />
                      <span>{task.address}</span>
                    </>
                  ) : (
                    <>
                      <Phone className="h-4 w-4" />
                      <span>{task.phone}</span>
                    </>
                  )}
                </div>
                <Badge variant="outline" className={`mt-2 text-xs ${
                  task.priority === 'high' ? 'border-red-200 text-red-700' :
                  task.priority === 'medium' ? 'border-yellow-200 text-yellow-700' :
                  'border-green-200 text-green-700'
                }`}>
                  {task.priority} priority
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                <div className="p-2 rounded-lg bg-gray-100">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900 truncate">{activity.client}</h4>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(activity.status)}
                    {activity.amount && (
                      <span className="text-sm font-medium text-green-600">
                        ৳{activity.amount.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-16 flex-col gap-2 bg-blue-600 hover:bg-blue-700">
              <FileText className="h-5 w-5" />
              <span>View Files</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Phone className="h-5 w-5" />
              <span>Make Call</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <MapPin className="h-5 w-5" />
              <span>Plan Visit</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <TrendingUp className="h-5 w-5" />
              <span>Performance</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}