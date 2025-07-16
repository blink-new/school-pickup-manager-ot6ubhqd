import { useState } from 'react'
import { Bell, AlertTriangle, Clock, CheckCircle, X, Eye, EyeOff } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { format, isToday, isYesterday } from 'date-fns'

interface NotificationCenterProps {
  user: any
}

export function NotificationCenter({ user }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Emma is ready for pickup',
      message: 'Emma Johnson is ready for pickup at the front entrance. Please proceed to the designated area.',
      type: 'pickup_ready',
      priority: 'high',
      isRead: false,
      actionUrl: '/messages',
      createdAt: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
    },
    {
      id: '2',
      title: 'Schedule Change Notification',
      message: 'Your pickup schedule for Liam Johnson has been updated. New pickup time: 3:30 PM at Side Entrance.',
      type: 'schedule_change',
      priority: 'normal',
      isRead: false,
      actionUrl: '/schedule',
      createdAt: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
    },
    {
      id: '3',
      title: 'Weather Alert',
      message: 'Due to light rain, pickup operations may be delayed by 5-10 minutes. Please wait in your vehicle.',
      type: 'general',
      priority: 'normal',
      isRead: true,
      actionUrl: null,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
      id: '4',
      title: 'Emergency Contact Update Required',
      message: 'Please update your emergency contact information in your profile settings.',
      type: 'general',
      priority: 'low',
      isRead: true,
      actionUrl: '/profile',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
    },
    {
      id: '5',
      title: 'Pickup Completed',
      message: 'Emma Johnson was successfully picked up by Sarah Johnson at 3:15 PM from Front Entrance.',
      type: 'general',
      priority: 'low',
      isRead: true,
      actionUrl: null,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    }
  ])

  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    sms: false,
    pickupReady: true,
    scheduleChanges: true,
    emergencyAlerts: true,
    generalUpdates: false
  })

  const getNotificationIcon = (type: string, priority: string) => {
    if (priority === 'emergency') return <AlertTriangle className="h-5 w-5 text-destructive" />
    
    switch (type) {
      case 'pickup_ready': return <Bell className="h-5 w-5 text-green-600" />
      case 'schedule_change': return <Clock className="h-5 w-5 text-primary" />
      case 'emergency': return <AlertTriangle className="h-5 w-5 text-destructive" />
      case 'delay': return <Clock className="h-5 w-5 text-orange-600" />
      default: return <Bell className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'destructive'
      case 'high': return 'default'
      case 'normal': return 'secondary'
      case 'low': return 'outline'
      default: return 'outline'
    }
  }

  const getTimeDisplay = (date: Date) => {
    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, 'h:mm a')}`
    } else {
      return format(date, 'MMM d, yyyy \'at\' h:mm a')
    }
  }

  const markAsRead = (notificationId: string) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })))
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(notifications.filter(n => n.id !== notificationId))
  }

  const unreadCount = notifications.filter(n => !n.isRead).length
  const emergencyNotifications = notifications.filter(n => n.priority === 'emergency')
  const highPriorityNotifications = notifications.filter(n => n.priority === 'high' && !n.isRead)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with pickup alerts and school communications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-2">
            <Bell className="h-3 w-3" />
            {unreadCount} unread
          </Badge>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Emergency Alerts */}
      {emergencyNotifications.length > 0 && (
        <Alert className="border-destructive/20 bg-destructive/5">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-foreground">
            <strong>Emergency Alert:</strong> You have {emergencyNotifications.length} emergency notification{emergencyNotifications.length > 1 ? 's' : ''} that require immediate attention.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="relative">
            All
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread ({unreadCount})
          </TabsTrigger>
          <TabsTrigger value="high-priority">
            High Priority ({highPriorityNotifications.length})
          </TabsTrigger>
          <TabsTrigger value="settings">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Notifications</CardTitle>
              <CardDescription>Complete history of your notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border transition-colors ${
                        !notification.isRead ? 'bg-muted/50 border-border' : 'bg-card border-border'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          {getNotificationIcon(notification.type, notification.priority)}
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-sm">{notification.title}</h4>
                              <Badge variant={getPriorityColor(notification.priority)} className="text-xs">
                                {notification.priority}
                              </Badge>
                              {!notification.isRead && (
                                <div className="w-2 h-2 rounded-full bg-primary"></div>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{notification.message}</p>
                            <p className="text-xs text-muted-foreground">
                              {getTimeDisplay(notification.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => markAsRead(notification.id)}
                              title="Mark as read"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteNotification(notification.id)}
                            title="Delete notification"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {notification.actionUrl && (
                        <div className="mt-3 pl-8">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Unread Notifications</CardTitle>
              <CardDescription>Notifications that require your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {notifications.filter(n => !n.isRead).map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 rounded-lg border bg-muted/50 border-border"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          {getNotificationIcon(notification.type, notification.priority)}
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-sm">{notification.title}</h4>
                              <Badge variant={getPriorityColor(notification.priority)} className="text-xs">
                                {notification.priority}
                              </Badge>
                              <div className="w-2 h-2 rounded-full bg-primary"></div>
                            </div>
                            <p className="text-sm text-muted-foreground">{notification.message}</p>
                            <p className="text-xs text-muted-foreground">
                              {getTimeDisplay(notification.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => markAsRead(notification.id)}
                            title="Mark as read"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteNotification(notification.id)}
                            title="Delete notification"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {notification.actionUrl && (
                        <div className="mt-3 pl-8">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                  {notifications.filter(n => !n.isRead).length === 0 && (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 mx-auto text-green-600 mb-4" />
                      <p className="text-muted-foreground">All caught up! No unread notifications.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="high-priority" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>High Priority Notifications</CardTitle>
              <CardDescription>Important notifications that need immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {notifications.filter(n => n.priority === 'high' || n.priority === 'emergency').map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border ${
                        notification.priority === 'emergency' 
                          ? 'bg-destructive/5 border-destructive/20' 
                          : !notification.isRead 
                            ? 'bg-muted/50 border-border' 
                            : 'bg-card border-border'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          {getNotificationIcon(notification.type, notification.priority)}
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-sm">{notification.title}</h4>
                              <Badge variant={getPriorityColor(notification.priority)} className="text-xs">
                                {notification.priority}
                              </Badge>
                              {!notification.isRead && (
                                <div className="w-2 h-2 rounded-full bg-primary"></div>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{notification.message}</p>
                            <p className="text-xs text-muted-foreground">
                              {getTimeDisplay(notification.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => markAsRead(notification.id)}
                              title="Mark as read"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteNotification(notification.id)}
                            title="Delete notification"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {notification.actionUrl && (
                        <div className="mt-3 pl-8">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Customize how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Delivery Methods</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={notificationSettings.email}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, email: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={notificationSettings.push}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, push: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
                    </div>
                    <Switch
                      id="sms-notifications"
                      checked={notificationSettings.sms}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, sms: checked})
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Notification Types</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="pickup-ready">Pickup Ready Alerts</Label>
                      <p className="text-sm text-muted-foreground">When your child is ready for pickup</p>
                    </div>
                    <Switch
                      id="pickup-ready"
                      checked={notificationSettings.pickupReady}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, pickupReady: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="schedule-changes">Schedule Changes</Label>
                      <p className="text-sm text-muted-foreground">When pickup schedules are modified</p>
                    </div>
                    <Switch
                      id="schedule-changes"
                      checked={notificationSettings.scheduleChanges}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, scheduleChanges: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emergency-alerts">Emergency Alerts</Label>
                      <p className="text-sm text-muted-foreground">Critical emergency notifications (cannot be disabled)</p>
                    </div>
                    <Switch
                      id="emergency-alerts"
                      checked={true}
                      disabled={true}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="general-updates">General Updates</Label>
                      <p className="text-sm text-muted-foreground">School announcements and general information</p>
                    </div>
                    <Switch
                      id="general-updates"
                      checked={notificationSettings.generalUpdates}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, generalUpdates: checked})
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button className="w-full">Save Notification Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}