import { useState } from 'react'
import { Calendar, Clock, MapPin, Plus, Edit, Trash2, Users, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { format, addDays, isSameDay } from 'date-fns'

interface ScheduleManagementProps {
  user: any
}

export function ScheduleManagement({ user }: ScheduleManagementProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<any>(null)

  // Mock data
  const [children] = useState([
    { id: '1', firstName: 'Emma', lastName: 'Johnson', grade: '3rd Grade' },
    { id: '2', firstName: 'Liam', lastName: 'Johnson', grade: '1st Grade' }
  ])

  const [pickupLocations] = useState([
    { id: 'front', name: 'Front Entrance', description: 'Main entrance of the school' },
    { id: 'side', name: 'Side Entrance', description: 'Side entrance near playground' },
    { id: 'gym', name: 'Gymnasium', description: 'Pickup at school gymnasium' },
    { id: 'cafeteria', name: 'Cafeteria', description: 'Pickup at school cafeteria' }
  ])

  const [authorizedPersons] = useState([
    { id: '1', name: 'Sarah Johnson', relationship: 'Mother', phone: '(555) 123-4567' },
    { id: '2', name: 'Mike Johnson', relationship: 'Father', phone: '(555) 123-4568' },
    { id: '3', name: 'Mary Smith', relationship: 'Grandmother', phone: '(555) 123-4569' },
    { id: '4', name: 'Tom Wilson', relationship: 'Family Friend', phone: '(555) 123-4570' }
  ])

  const [schedules, setSchedules] = useState([
    {
      id: '1',
      childId: '1',
      childName: 'Emma Johnson',
      pickupDate: new Date(),
      pickupTime: '15:15',
      pickupLocation: 'front',
      pickupLocationName: 'Front Entrance',
      pickupPersonName: 'Sarah Johnson',
      pickupPersonPhone: '(555) 123-4567',
      isRecurring: true,
      recurringPattern: 'daily',
      status: 'scheduled',
      notes: 'Regular pickup after school'
    },
    {
      id: '2',
      childId: '2',
      childName: 'Liam Johnson',
      pickupDate: new Date(),
      pickupTime: '15:00',
      pickupLocation: 'side',
      pickupLocationName: 'Side Entrance',
      pickupPersonName: 'Sarah Johnson',
      pickupPersonPhone: '(555) 123-4567',
      isRecurring: true,
      recurringPattern: 'daily',
      status: 'scheduled',
      notes: 'Pickup after kindergarten'
    },
    {
      id: '3',
      childId: '1',
      childName: 'Emma Johnson',
      pickupDate: addDays(new Date(), 1),
      pickupTime: '16:00',
      pickupLocation: 'gym',
      pickupLocationName: 'Gymnasium',
      pickupPersonName: 'Mary Smith',
      pickupPersonPhone: '(555) 123-4569',
      isRecurring: false,
      recurringPattern: null,
      status: 'scheduled',
      notes: 'Grandmother picking up after basketball practice'
    }
  ])

  const [newSchedule, setNewSchedule] = useState({
    childId: '',
    pickupDate: new Date(),
    pickupTime: '',
    pickupLocation: '',
    pickupPersonName: '',
    pickupPersonPhone: '',
    isRecurring: false,
    recurringPattern: '',
    notes: ''
  })

  const getSchedulesForDate = (date: Date) => {
    return schedules.filter(schedule => 
      isSameDay(new Date(schedule.pickupDate), date) ||
      (schedule.isRecurring && schedule.recurringPattern === 'daily')
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default'
      case 'in_progress': return 'secondary'
      case 'cancelled': return 'destructive'
      default: return 'outline'
    }
  }

  const handleCreateSchedule = () => {
    const child = children.find(c => c.id === newSchedule.childId)
    const location = pickupLocations.find(l => l.id === newSchedule.pickupLocation)
    
    const schedule = {
      id: Date.now().toString(),
      childId: newSchedule.childId,
      childName: `${child?.firstName} ${child?.lastName}`,
      pickupDate: newSchedule.pickupDate,
      pickupTime: newSchedule.pickupTime,
      pickupLocation: newSchedule.pickupLocation,
      pickupLocationName: location?.name || '',
      pickupPersonName: newSchedule.pickupPersonName,
      pickupPersonPhone: newSchedule.pickupPersonPhone,
      isRecurring: newSchedule.isRecurring,
      recurringPattern: newSchedule.recurringPattern,
      status: 'scheduled',
      notes: newSchedule.notes
    }

    setSchedules([...schedules, schedule])
    setIsCreateDialogOpen(false)
    setNewSchedule({
      childId: '',
      pickupDate: new Date(),
      pickupTime: '',
      pickupLocation: '',
      pickupPersonName: '',
      pickupPersonPhone: '',
      isRecurring: false,
      recurringPattern: '',
      notes: ''
    })
  }

  const handleEditSchedule = (schedule: any) => {
    setEditingSchedule(schedule)
    setIsEditDialogOpen(true)
  }

  const handleDeleteSchedule = (scheduleId: string) => {
    setSchedules(schedules.filter(s => s.id !== scheduleId))
  }

  const selectedDateSchedules = getSchedulesForDate(selectedDate)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schedule Management</h1>
          <p className="text-muted-foreground">
            Manage pickup schedules for your children
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              New Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Pickup Schedule</DialogTitle>
              <DialogDescription>
                Schedule a pickup for one of your children
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="child">Child</Label>
                <Select value={newSchedule.childId} onValueChange={(value) => setNewSchedule({...newSchedule, childId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a child" />
                  </SelectTrigger>
                  <SelectContent>
                    {children.map((child) => (
                      <SelectItem key={child.id} value={child.id}>
                        {child.firstName} {child.lastName} - {child.grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Pickup Date</Label>
                  <Input
                    type="date"
                    value={format(newSchedule.pickupDate, 'yyyy-MM-dd')}
                    onChange={(e) => setNewSchedule({...newSchedule, pickupDate: new Date(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Pickup Time</Label>
                  <Input
                    type="time"
                    value={newSchedule.pickupTime}
                    onChange={(e) => setNewSchedule({...newSchedule, pickupTime: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Pickup Location</Label>
                <Select value={newSchedule.pickupLocation} onValueChange={(value) => setNewSchedule({...newSchedule, pickupLocation: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pickup location" />
                  </SelectTrigger>
                  <SelectContent>
                    {pickupLocations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name} - {location.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="person">Authorized Pickup Person</Label>
                <Select value={newSchedule.pickupPersonName} onValueChange={(value) => {
                  const person = authorizedPersons.find(p => p.name === value)
                  setNewSchedule({
                    ...newSchedule, 
                    pickupPersonName: value,
                    pickupPersonPhone: person?.phone || ''
                  })
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select authorized person" />
                  </SelectTrigger>
                  <SelectContent>
                    {authorizedPersons.map((person) => (
                      <SelectItem key={person.id} value={person.name}>
                        {person.name} - {person.relationship}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="recurring"
                  checked={newSchedule.isRecurring}
                  onCheckedChange={(checked) => setNewSchedule({...newSchedule, isRecurring: checked})}
                />
                <Label htmlFor="recurring">Recurring pickup</Label>
              </div>

              {newSchedule.isRecurring && (
                <div className="space-y-2">
                  <Label htmlFor="pattern">Recurring Pattern</Label>
                  <Select value={newSchedule.recurringPattern} onValueChange={(value) => setNewSchedule({...newSchedule, recurringPattern: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pattern" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  placeholder="Any special instructions or notes..."
                  value={newSchedule.notes}
                  onChange={(e) => setNewSchedule({...newSchedule, notes: e.target.value})}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateSchedule}>
                  Create Schedule
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Schedule Conflict Alert */}
      {selectedDateSchedules.length > 1 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-foreground">
            <strong>Schedule Conflict Detected:</strong> Multiple pickups scheduled for the same time period. 
            Please review and adjust timing to avoid conflicts.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {/* Calendar */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Calendar
            </CardTitle>
            <CardDescription>Select a date to view schedules</CardDescription>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span>Scheduled pickups</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Completed pickups</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-destructive"></div>
                <span>Cancelled pickups</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Schedules for {format(selectedDate, 'EEEE, MMMM do, yyyy')}
            </CardTitle>
            <CardDescription>
              {selectedDateSchedules.length} pickup{selectedDateSchedules.length !== 1 ? 's' : ''} scheduled
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDateSchedules.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No pickups scheduled for this date</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule Pickup
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDateSchedules.map((schedule) => (
                  <div key={schedule.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col items-center">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{schedule.pickupTime}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{schedule.childName}</h4>
                          <Badge variant={getStatusColor(schedule.status)}>
                            {schedule.status}
                          </Badge>
                          {schedule.isRecurring && (
                            <Badge variant="outline" className="text-xs">
                              {schedule.recurringPattern}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {schedule.pickupLocationName}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {schedule.pickupPersonName}
                          </div>
                        </div>
                        {schedule.notes && (
                          <p className="text-xs text-muted-foreground">{schedule.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditSchedule(schedule)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteSchedule(schedule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}