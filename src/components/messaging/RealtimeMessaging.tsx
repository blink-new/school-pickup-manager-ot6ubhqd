import { useState, useEffect, useRef } from 'react'
import { Send, MapPin, AlertTriangle, Clock, Users, Phone, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import blink from '@/blink/client'
import { format } from 'date-fns'

interface RealtimeMessagingProps {
  user: any
}

export function RealtimeMessaging({ user }: RealtimeMessagingProps) {
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedChild, setSelectedChild] = useState('')
  const [messageType, setMessageType] = useState('general')
  const [priority, setPriority] = useState('normal')
  const [onlineUsers, setOnlineUsers] = useState<any[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mock data
  const [children] = useState([
    { id: '1', firstName: 'Emma', lastName: 'Johnson', grade: '3rd Grade' },
    { id: '2', firstName: 'Liam', lastName: 'Johnson', grade: '1st Grade' }
  ])

  const [pickupLocations] = useState([
    { id: 'front', name: 'Front Entrance', description: 'Main entrance' },
    { id: 'side', name: 'Side Entrance', description: 'Near playground' },
    { id: 'gym', name: 'Gymnasium', description: 'School gymnasium' },
    { id: 'cafeteria', name: 'Cafeteria', description: 'School cafeteria' },
    { id: 'library', name: 'Library', description: 'School library' }
  ])

  // Mock initial messages
  useEffect(() => {
    const initialMessages = [
      {
        id: '1',
        senderId: 'admin1',
        senderName: 'Front Office',
        senderRole: 'admin',
        content: 'Good afternoon! Pickup operations are now active. Please follow the designated pickup locations.',
        messageType: 'broadcast',
        priority: 'normal',
        pickupLocation: null,
        childId: null,
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        isRead: true
      },
      {
        id: '2',
        senderId: 'admin2',
        senderName: 'Mrs. Rodriguez',
        senderRole: 'admin',
        content: 'Emma Johnson is ready for pickup at the front entrance.',
        messageType: 'pickup_request',
        priority: 'high',
        pickupLocation: 'front',
        childId: '1',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        isRead: false
      },
      {
        id: '3',
        senderId: user?.id,
        senderName: user?.displayName,
        senderRole: 'parent',
        content: 'I\'m on my way to pick up Emma. ETA 5 minutes.',
        messageType: 'location_update',
        priority: 'normal',
        pickupLocation: 'front',
        childId: '1',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        isRead: true
      }
    ]
    setMessages(initialMessages)
  }, [user])

  // Mock online users
  useEffect(() => {
    const mockOnlineUsers = [
      { id: 'admin1', name: 'Front Office', role: 'admin', status: 'online' },
      { id: 'admin2', name: 'Mrs. Rodriguez', role: 'admin', status: 'online' },
      { id: 'parent1', name: 'Mike Johnson', role: 'parent', status: 'online' },
      { id: 'parent2', name: 'Lisa Chen', role: 'parent', status: 'away' }
    ]
    setOnlineUsers(mockOnlineUsers)
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Simulate real-time messaging with Blink SDK
  useEffect(() => {
    if (!user?.id) return

    let channel: any = null

    const setupRealtime = async () => {
      try {
        channel = blink.realtime.channel('school-pickup-messages')
        await channel.subscribe({
          userId: user.id,
          metadata: { 
            displayName: user.displayName, 
            role: user.role,
            status: 'online'
          }
        })

        // Listen for new messages
        channel.onMessage((message: any) => {
          if (message.type === 'chat' && message.userId !== user.id) {
            const newMessage = {
              id: message.id,
              senderId: message.userId,
              senderName: message.metadata?.displayName || 'Unknown',
              senderRole: message.metadata?.role || 'parent',
              content: message.data.content,
              messageType: message.data.messageType || 'general',
              priority: message.data.priority || 'normal',
              pickupLocation: message.data.pickupLocation,
              childId: message.data.childId,
              timestamp: new Date(message.timestamp),
              isRead: false
            }
            setMessages(prev => [...prev, newMessage])
          }
        })

        // Listen for presence changes
        channel.onPresence((users: any[]) => {
          setOnlineUsers(users.map(u => ({
            id: u.userId,
            name: u.metadata?.displayName || 'Unknown',
            role: u.metadata?.role || 'parent',
            status: u.metadata?.status || 'online'
          })))
        })
      } catch (error) {
        console.error('Failed to setup realtime messaging:', error)
      }
    }

    setupRealtime()

    return () => {
      channel?.unsubscribe()
    }
  }, [user?.id, user?.displayName, user?.role])

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    const messageData = {
      content: newMessage,
      messageType,
      priority,
      pickupLocation: selectedLocation || null,
      childId: selectedChild || null,
      timestamp: Date.now()
    }

    try {
      // Send via Blink realtime
      await blink.realtime.publish('school-pickup-messages', 'chat', messageData, {
        userId: user.id,
        metadata: { 
          displayName: user.displayName, 
          role: user.role,
          status: 'online'
        }
      })

      // Add to local messages
      const message = {
        id: Date.now().toString(),
        senderId: user.id,
        senderName: user.displayName,
        senderRole: user.role,
        content: newMessage,
        messageType,
        priority,
        pickupLocation: selectedLocation || null,
        childId: selectedChild || null,
        timestamp: new Date(),
        isRead: true
      }

      setMessages(prev => [...prev, message])
      setNewMessage('')
      setSelectedLocation('')
      setSelectedChild('')
      setMessageType('general')
      setPriority('normal')
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'pickup_request': return <Users className="h-4 w-4 text-primary" />
      case 'location_update': return <MapPin className="h-4 w-4 text-green-600" />
      case 'emergency': return <AlertTriangle className="h-4 w-4 text-destructive" />
      case 'broadcast': return <MessageSquare className="h-4 w-4 text-purple-600" />
      default: return <MessageSquare className="h-4 w-4 text-muted-foreground" />
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'away': return 'bg-orange-500'
      case 'busy': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Real-time Messaging</h1>
          <p className="text-muted-foreground">
            Communicate with school staff and coordinate pickups
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          {onlineUsers.filter(u => u.status === 'online').length} online
        </Badge>
      </div>

      {/* Emergency Alert */}
      <Alert className="border-destructive/20 bg-destructive/5">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <AlertDescription className="text-foreground">
          <strong>Emergency Contact:</strong> For urgent matters, call the main office at (555) 123-4567
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Online Users Sidebar */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Online Now
            </CardTitle>
            <CardDescription>{onlineUsers.length} users active</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {onlineUsers.map((user) => (
                  <div key={user.id} className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(user.status)}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {user.role} • {user.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Main Chat Area */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              School Pickup Chat
            </CardTitle>
            <CardDescription>Real-time communication with school staff</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Messages */}
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${message.senderId === user?.id ? 'order-2' : 'order-1'}`}>
                      <div className={`rounded-lg p-3 ${
                        message.senderId === user?.id 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-foreground'
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          {getMessageIcon(message.messageType)}
                          <span className="text-xs font-medium">
                            {message.senderId === user?.id ? 'You' : message.senderName}
                          </span>
                          <Badge 
                            variant={getPriorityColor(message.priority)} 
                            className="text-xs"
                          >
                            {message.priority}
                          </Badge>
                        </div>
                        <p className="text-sm">{message.content}</p>
                        {message.pickupLocation && (
                          <div className="flex items-center gap-1 mt-2 text-xs opacity-75">
                            <MapPin className="h-3 w-3" />
                            {pickupLocations.find(l => l.id === message.pickupLocation)?.name}
                          </div>
                        )}
                        {message.childId && (
                          <div className="flex items-center gap-1 mt-1 text-xs opacity-75">
                            <Users className="h-3 w-3" />
                            {children.find(c => c.id === message.childId)?.firstName} {children.find(c => c.id === message.childId)?.lastName}
                          </div>
                        )}
                        <p className="text-xs opacity-75 mt-2">
                          {format(message.timestamp, 'h:mm a')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Composer */}
            <div className="space-y-4 border-t pt-4">
              <Tabs defaultValue="quick" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="quick">Quick Message</TabsTrigger>
                  <TabsTrigger value="detailed">Detailed Message</TabsTrigger>
                </TabsList>
                
                <TabsContent value="quick" className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="detailed" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="messageType">Message Type</Label>
                      <Select value={messageType} onValueChange={setMessageType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Message</SelectItem>
                          <SelectItem value="pickup_request">Pickup Request</SelectItem>
                          <SelectItem value="location_update">Location Update</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={priority} onValueChange={setPriority}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {(messageType === 'pickup_request' || messageType === 'location_update') && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="child">Child (Optional)</Label>
                        <Select value={selectedChild} onValueChange={setSelectedChild}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select child" />
                          </SelectTrigger>
                          <SelectContent>
                            {children.map((child) => (
                              <SelectItem key={child.id} value={child.id}>
                                {child.firstName} {child.lastName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Pickup Location</Label>
                        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            {pickupLocations.map((location) => (
                              <SelectItem key={location.id} value={location.id}>
                                {location.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      placeholder="Type your detailed message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}