import { useState } from 'react'
import { Users, Car, Clock, AlertTriangle, TrendingUp, MapPin, MessageSquare, Shield } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { format } from 'date-fns'

interface AdminDashboardProps {
  user: any
  onNavigate: (page: string) => void
}

export function AdminDashboard({ user, onNavigate }: AdminDashboardProps) {
  // Mock data - in real app this would come from the database
  const [stats] = useState({
    totalStudents: 342,
    studentsPickedUp: 156,
    pendingPickups: 186,
    emergencyAlerts: 2,
    averagePickupTime: '12 min',
    trafficLevel: 'moderate'
  })

  const [recentActivities] = useState([
    {
      id: '1',
      type: 'pickup_completed',
      student: 'Emma Johnson',
      location: 'Front Entrance',
      time: '3:15 PM',
      pickedUpBy: 'Sarah Johnson',
      verificationMethod: 'digital_auth'
    },
    {
      id: '2',
      type: 'emergency_alert',
      student: 'Michael Chen',
      location: 'Nurse Office',
      time: '2:45 PM',
      details: 'Minor injury - parent notified',
      priority: 'high'
    },
    {
      id: '3',
      type: 'unauthorized_attempt',
      student: 'Sophia Davis',
      location: 'Side Entrance',
      time: '2:30 PM',
      details: 'Unauthorized person attempted pickup - security notified',
      priority: 'emergency'
    }
  ])

  const [locationStats] = useState([
    { name: 'Front Entrance', current: 45, capacity: 60, efficiency: 75 },
    { name: 'Side Entrance', current: 32, capacity: 40, efficiency: 80 },
    { name: 'Gymnasium', current: 18, capacity: 25, efficiency: 72 },
    { name: 'Cafeteria', current: 12, capacity: 20, efficiency: 60 }
  ])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'pickup_completed': return <Car className="h-4 w-4 text-green-600" />
      case 'emergency_alert': return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'unauthorized_attempt': return <Shield className="h-4 w-4 text-red-600" />
      default: return <Clock className="h-4 w-4 text-blue-600" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'pickup_completed': return 'border-gray-200 bg-white'
      case 'emergency_alert': return 'border-gray-200 bg-white'
      case 'unauthorized_attempt': return 'border-gray-200 bg-white'
      default: return 'border-gray-200 bg-white'
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Pickup operations for {format(new Date(), 'EEEE, MMMM do, yyyy')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => onNavigate('messages')} variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" />
            Broadcast Message
          </Button>
          <Button onClick={() => onNavigate('reports')} className="bg-blue-600 hover:bg-blue-700">
            <TrendingUp className="mr-2 h-4 w-4" />
            View Reports
          </Button>
        </div>
      </div>

      {/* Emergency Alerts */}
      {stats.emergencyAlerts > 0 && (
        <Alert className="border-gray-200 bg-white">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-gray-800">
            <strong>{stats.emergencyAlerts} Emergency Alert{stats.emergencyAlerts > 1 ? 's' : ''}:</strong> 
            Unauthorized pickup attempt at Side Entrance. Security has been notified.
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">enrolled students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Picked Up</CardTitle>
            <Car className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.studentsPickedUp}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.studentsPickedUp / stats.totalStudents) * 100)}% completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Pickups</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pendingPickups}</div>
            <p className="text-xs text-muted-foreground">awaiting pickup</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Pickup Time</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averagePickupTime}</div>
            <p className="text-xs text-muted-foreground">per student</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Location Traffic Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Pickup Location Status
            </CardTitle>
            <CardDescription>Real-time capacity and efficiency monitoring</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {locationStats.map((location) => (
              <div key={location.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{location.name}</span>
                  <Badge variant={location.current > location.capacity * 0.8 ? 'destructive' : 'secondary'}>
                    {location.current}/{location.capacity}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <Progress 
                    value={(location.current / location.capacity) * 100} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Capacity: {Math.round((location.current / location.capacity) * 100)}%</span>
                    <span>Efficiency: {location.efficiency}%</span>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full" onClick={() => onNavigate('traffic-management')}>
              Manage Traffic Flow
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activities
            </CardTitle>
            <CardDescription>Latest pickup activities and security events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className={`p-3 rounded-lg border ${getActivityColor(activity.type)}`}>
                <div className="flex items-start space-x-3">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{activity.student}</p>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.location}</p>
                    {activity.type === 'pickup_completed' && (
                      <p className="text-xs">
                        Picked up by: {activity.pickedUpBy} • 
                        Verified via: {activity.verificationMethod}
                      </p>
                    )}
                    {activity.details && (
                      <p className="text-xs font-medium">{activity.details}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full" onClick={() => onNavigate('attendance')}>
              View Full Activity Log
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('attendance')}>
          <CardHeader className="text-center">
            <Users className="h-8 w-8 mx-auto text-blue-600" />
            <CardTitle className="text-lg">Attendance Tracking</CardTitle>
            <CardDescription>Monitor student pickup status and generate attendance reports</CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('security')}>
          <CardHeader className="text-center">
            <Shield className="h-8 w-8 mx-auto text-green-600" />
            <CardTitle className="text-lg">Security Management</CardTitle>
            <CardDescription>Manage authorized pickups and security verification procedures</CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('reports')}>
          <CardHeader className="text-center">
            <TrendingUp className="h-8 w-8 mx-auto text-purple-600" />
            <CardTitle className="text-lg">Reports & Analytics</CardTitle>
            <CardDescription>Generate detailed reports on pickup activities and performance metrics</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}