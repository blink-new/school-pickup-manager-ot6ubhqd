import { useState } from 'react'
import { Calendar, Clock, MapPin, MessageSquare, Bell, Users, Car, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { format } from 'date-fns'

interface ParentDashboardProps {
  user: any
  onNavigate: (page: string) => void
}

export function ParentDashboard({ user, onNavigate }: ParentDashboardProps) {
  // Mock data - in real app this would come from the database
  const [children] = useState([
    {
      id: '1',
      firstName: 'Emma',
      lastName: 'Johnson',
      grade: '3rd Grade',
      classRoom: 'Room 12A',
      photoUrl: '',
      nextPickup: {
        date: new Date(),
        time: '3:15 PM',
        location: 'Front Entrance',
        status: 'scheduled'
      }
    },
    {
      id: '2',
      firstName: 'Liam',
      lastName: 'Johnson',
      grade: '1st Grade',
      classRoom: 'Room 8B',
      photoUrl: '',
      nextPickup: {
        date: new Date(),
        time: '3:00 PM',
        location: 'Side Entrance',
        status: 'ready'
      }
    }
  ])

  const [recentMessages] = useState([
    {
      id: '1',
      from: 'Front Office',
      content: 'Emma is ready for pickup at the front entrance',
      time: '2:45 PM',
      type: 'pickup_ready',
      priority: 'high'
    },
    {
      id: '2',
      from: 'Mrs. Smith',
      content: 'Liam will be 10 minutes late due to after-school activity',
      time: '2:30 PM',
      type: 'delay',
      priority: 'normal'
    }
  ])

  const [todaySchedule] = useState([
    {
      id: '1',
      childName: 'Emma Johnson',
      time: '3:15 PM',
      location: 'Front Entrance',
      status: 'scheduled',
      pickupPerson: 'Sarah Johnson (Mom)'
    },
    {
      id: '2',
      childName: 'Liam Johnson',
      time: '3:00 PM',
      location: 'Side Entrance',
      status: 'ready',
      pickupPerson: 'Sarah Johnson (Mom)'
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-500'
      case 'in_progress': return 'bg-blue-500'
      case 'completed': return 'bg-primary'
      case 'delayed': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'destructive'
      case 'high': return 'default'
      case 'normal': return 'secondary'
      default: return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.displayName?.split(' ')[0]}!</h1>
          <p className="text-muted-foreground">
            Today is {format(new Date(), 'EEEE, MMMM do, yyyy')}
          </p>
        </div>
        <Button onClick={() => onNavigate('messages')} className="bg-primary hover:bg-primary/90">
          <MessageSquare className="mr-2 h-4 w-4" />
          Send Message
        </Button>
      </div>

      {/* Emergency Alert */}
      <Alert className="border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-foreground">
          <strong>Weather Alert:</strong> Due to light rain, pickup may be delayed by 5-10 minutes. 
          Please wait in your vehicle.
        </AlertDescription>
      </Alert>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('schedule')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">View Schedule</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaySchedule.length}</div>
            <p className="text-xs text-muted-foreground">pickups today</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('messages')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentMessages.length}</div>
            <p className="text-xs text-muted-foreground">unread messages</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('notifications')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">new notifications</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('profile')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Authorized Pickups</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">authorized persons</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Children Cards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              My Children
            </CardTitle>
            <CardDescription>Current pickup status and next scheduled pickups</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {children.map((child) => (
              <div key={child.id} className="flex items-center space-x-4 p-4 rounded-lg border">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={child.photoUrl} />
                  <AvatarFallback>{child.firstName[0]}{child.lastName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{child.firstName} {child.lastName}</h4>
                    <Badge variant={child.nextPickup.status === 'ready' ? 'default' : 'secondary'}>
                      {child.nextPickup.status === 'ready' ? 'Ready for Pickup' : 'Scheduled'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{child.grade} • {child.classRoom}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {child.nextPickup.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {child.nextPickup.location}
                    </div>
                  </div>
                </div>
                {child.nextPickup.status === 'ready' && (
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                    <Car className="mr-1 h-3 w-3" />
                    I'm Here
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Recent Messages
            </CardTitle>
            <CardDescription>Latest communications from school staff</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentMessages.map((message) => (
              <div key={message.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                <div className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(message.type)}`} />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{message.from}</p>
                    <Badge variant={getPriorityColor(message.priority)} className="text-xs">
                      {message.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{message.content}</p>
                  <p className="text-xs text-muted-foreground">{message.time}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full" onClick={() => onNavigate('messages')}>
              View All Messages
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Pickup Schedule
          </CardTitle>
          <CardDescription>All scheduled pickups for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todaySchedule.map((pickup) => (
              <div key={pickup.id} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(pickup.status)}`} />
                  <div>
                    <p className="font-medium">{pickup.childName}</p>
                    <p className="text-sm text-muted-foreground">{pickup.pickupPerson}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{pickup.time}</p>
                  <p className="text-sm text-muted-foreground">{pickup.location}</p>
                </div>
                <Badge variant={pickup.status === 'ready' ? 'default' : 'secondary'}>
                  {pickup.status === 'ready' ? 'Ready' : 'Scheduled'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}