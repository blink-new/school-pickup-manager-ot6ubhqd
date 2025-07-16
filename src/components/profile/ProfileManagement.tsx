import { useState } from 'react'
import { User, Phone, Mail, Users, Plus, Edit, Trash2, Camera, Shield, Globe } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ProfileManagementProps {
  user: any
}

export function ProfileManagement({ user }: ProfileManagementProps) {
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isAddingChild, setIsAddingChild] = useState(false)
  const [isAddingAuthorized, setIsAddingAuthorized] = useState(false)

  // Mock data
  const [profile, setProfile] = useState({
    displayName: user?.displayName || 'Sarah Johnson',
    email: user?.email || 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    emergencyContactName: 'Mike Johnson',
    emergencyContactPhone: '(555) 123-4568',
    profileImageUrl: '',
    languagePreference: 'en',
    address: '123 Main Street, Anytown, ST 12345'
  })

  const [children, setChildren] = useState([
    {
      id: '1',
      firstName: 'Emma',
      lastName: 'Johnson',
      grade: '3rd Grade',
      classRoom: 'Room 12A',
      studentId: 'STU001',
      photoUrl: '',
      medicalNotes: 'No known allergies',
      pickupInstructions: 'Prefers front entrance pickup'
    },
    {
      id: '2',
      firstName: 'Liam',
      lastName: 'Johnson',
      grade: '1st Grade',
      classRoom: 'Room 8B',
      studentId: 'STU002',
      photoUrl: '',
      medicalNotes: 'Mild asthma - inhaler in nurse office',
      pickupInstructions: 'Side entrance is closer to classroom'
    }
  ])

  const [authorizedPersons, setAuthorizedPersons] = useState([
    {
      id: '1',
      name: 'Sarah Johnson',
      relationship: 'Mother',
      phone: '(555) 123-4567',
      email: 'sarah.johnson@email.com',
      photoUrl: '',
      isActive: true,
      authorizedFor: ['1', '2'] // Child IDs
    },
    {
      id: '2',
      name: 'Mike Johnson',
      relationship: 'Father',
      phone: '(555) 123-4568',
      email: 'mike.johnson@email.com',
      photoUrl: '',
      isActive: true,
      authorizedFor: ['1', '2']
    },
    {
      id: '3',
      name: 'Mary Smith',
      relationship: 'Grandmother',
      phone: '(555) 123-4569',
      email: 'mary.smith@email.com',
      photoUrl: '',
      isActive: true,
      authorizedFor: ['1']
    },
    {
      id: '4',
      name: 'Tom Wilson',
      relationship: 'Family Friend',
      phone: '(555) 123-4570',
      email: 'tom.wilson@email.com',
      photoUrl: '',
      isActive: false,
      authorizedFor: ['2']
    }
  ])

  const [newChild, setNewChild] = useState({
    firstName: '',
    lastName: '',
    grade: '',
    classRoom: '',
    studentId: '',
    medicalNotes: '',
    pickupInstructions: ''
  })

  const [newAuthorized, setNewAuthorized] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: '',
    authorizedFor: [] as string[]
  })

  const handleSaveProfile = () => {
    // In real app, this would save to database
    setIsEditingProfile(false)
  }

  const handleAddChild = () => {
    const child = {
      id: Date.now().toString(),
      ...newChild,
      photoUrl: ''
    }
    setChildren([...children, child])
    setNewChild({
      firstName: '',
      lastName: '',
      grade: '',
      classRoom: '',
      studentId: '',
      medicalNotes: '',
      pickupInstructions: ''
    })
    setIsAddingChild(false)
  }

  const handleAddAuthorized = () => {
    const authorized = {
      id: Date.now().toString(),
      ...newAuthorized,
      photoUrl: '',
      isActive: true
    }
    setAuthorizedPersons([...authorizedPersons, authorized])
    setNewAuthorized({
      name: '',
      relationship: '',
      phone: '',
      email: '',
      authorizedFor: []
    })
    setIsAddingAuthorized(false)
  }

  const toggleAuthorizedStatus = (id: string) => {
    setAuthorizedPersons(authorizedPersons.map(person =>
      person.id === id ? { ...person, isActive: !person.isActive } : person
    ))
  }

  const deleteAuthorized = (id: string) => {
    setAuthorizedPersons(authorizedPersons.filter(person => person.id !== id))
  }

  const getChildName = (childId: string) => {
    const child = children.find(c => c.id === childId)
    return child ? `${child.firstName} ${child.lastName}` : 'Unknown'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Management</h1>
          <p className="text-muted-foreground">
            Manage your account, children, and authorized pickup persons
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">My Profile</TabsTrigger>
          <TabsTrigger value="children">My Children</TabsTrigger>
          <TabsTrigger value="authorized">Authorized Pickups</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Update your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile.profileImageUrl} />
                  <AvatarFallback className="text-lg">
                    {profile.displayName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">
                    <Camera className="mr-2 h-4 w-4" />
                    Change Photo
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Upload a clear photo for security verification
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Full Name</Label>
                  <Input
                    id="displayName"
                    value={profile.displayName}
                    onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                    disabled={!isEditingProfile}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    disabled={!isEditingProfile}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    disabled={!isEditingProfile}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language Preference</Label>
                  <Select 
                    value={profile.languagePreference} 
                    onValueChange={(value) => setProfile({...profile, languagePreference: value})}
                    disabled={!isEditingProfile}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Home Address</Label>
                <Textarea
                  id="address"
                  value={profile.address}
                  onChange={(e) => setProfile({...profile, address: e.target.value})}
                  disabled={!isEditingProfile}
                  rows={2}
                />
              </div>

              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Emergency Contact
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyName">Emergency Contact Name</Label>
                    <Input
                      id="emergencyName"
                      value={profile.emergencyContactName}
                      onChange={(e) => setProfile({...profile, emergencyContactName: e.target.value})}
                      disabled={!isEditingProfile}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                    <Input
                      id="emergencyPhone"
                      value={profile.emergencyContactPhone}
                      onChange={(e) => setProfile({...profile, emergencyContactPhone: e.target.value})}
                      disabled={!isEditingProfile}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                {isEditingProfile ? (
                  <>
                    <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile}>
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditingProfile(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="children" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    My Children
                  </CardTitle>
                  <CardDescription>Manage information for your children</CardDescription>
                </div>
                <Dialog open={isAddingChild} onOpenChange={setIsAddingChild}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Child
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Add New Child</DialogTitle>
                      <DialogDescription>
                        Add a child to your account for pickup management
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={newChild.firstName}
                            onChange={(e) => setNewChild({...newChild, firstName: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={newChild.lastName}
                            onChange={(e) => setNewChild({...newChild, lastName: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="grade">Grade</Label>
                          <Input
                            id="grade"
                            value={newChild.grade}
                            onChange={(e) => setNewChild({...newChild, grade: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="classRoom">Classroom</Label>
                          <Input
                            id="classRoom"
                            value={newChild.classRoom}
                            onChange={(e) => setNewChild({...newChild, classRoom: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="studentId">Student ID</Label>
                        <Input
                          id="studentId"
                          value={newChild.studentId}
                          onChange={(e) => setNewChild({...newChild, studentId: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="medicalNotes">Medical Notes</Label>
                        <Textarea
                          id="medicalNotes"
                          placeholder="Any medical conditions, allergies, or special needs..."
                          value={newChild.medicalNotes}
                          onChange={(e) => setNewChild({...newChild, medicalNotes: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pickupInstructions">Pickup Instructions</Label>
                        <Textarea
                          id="pickupInstructions"
                          placeholder="Special pickup instructions or preferences..."
                          value={newChild.pickupInstructions}
                          onChange={(e) => setNewChild({...newChild, pickupInstructions: e.target.value})}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsAddingChild(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddChild}>
                          Add Child
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {children.map((child) => (
                  <div key={child.id} className="p-4 rounded-lg border">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={child.photoUrl} />
                          <AvatarFallback>
                            {child.firstName[0]}{child.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h4 className="font-semibold">{child.firstName} {child.lastName}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{child.grade}</span>
                            <span>{child.classRoom}</span>
                            <span>ID: {child.studentId}</span>
                          </div>
                          {child.medicalNotes && (
                            <p className="text-sm text-orange-600">
                              <strong>Medical:</strong> {child.medicalNotes}
                            </p>
                          )}
                          {child.pickupInstructions && (
                            <p className="text-sm text-blue-600">
                              <strong>Pickup:</strong> {child.pickupInstructions}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="authorized" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Authorized Pickup Persons
                  </CardTitle>
                  <CardDescription>Manage who can pick up your children</CardDescription>
                </div>
                <Dialog open={isAddingAuthorized} onOpenChange={setIsAddingAuthorized}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Person
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Add Authorized Person</DialogTitle>
                      <DialogDescription>
                        Add someone who can pick up your children
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={newAuthorized.name}
                          onChange={(e) => setNewAuthorized({...newAuthorized, name: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="relationship">Relationship</Label>
                          <Select 
                            value={newAuthorized.relationship} 
                            onValueChange={(value) => setNewAuthorized({...newAuthorized, relationship: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select relationship" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="parent">Parent</SelectItem>
                              <SelectItem value="grandparent">Grandparent</SelectItem>
                              <SelectItem value="sibling">Sibling</SelectItem>
                              <SelectItem value="relative">Other Relative</SelectItem>
                              <SelectItem value="friend">Family Friend</SelectItem>
                              <SelectItem value="caregiver">Caregiver</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={newAuthorized.phone}
                            onChange={(e) => setNewAuthorized({...newAuthorized, phone: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newAuthorized.email}
                          onChange={(e) => setNewAuthorized({...newAuthorized, email: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Authorized to pick up</Label>
                        <div className="space-y-2">
                          {children.map((child) => (
                            <div key={child.id} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`child-${child.id}`}
                                checked={newAuthorized.authorizedFor.includes(child.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNewAuthorized({
                                      ...newAuthorized,
                                      authorizedFor: [...newAuthorized.authorizedFor, child.id]
                                    })
                                  } else {
                                    setNewAuthorized({
                                      ...newAuthorized,
                                      authorizedFor: newAuthorized.authorizedFor.filter(id => id !== child.id)
                                    })
                                  }
                                }}
                              />
                              <Label htmlFor={`child-${child.id}`}>
                                {child.firstName} {child.lastName}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsAddingAuthorized(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddAuthorized}>
                          Add Person
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  All authorized persons must provide valid ID when picking up children. 
                  School staff will verify identity before releasing any student.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                {authorizedPersons.map((person) => (
                  <div key={person.id} className="p-4 rounded-lg border">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={person.photoUrl} />
                          <AvatarFallback>
                            {person.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{person.name}</h4>
                            <Badge variant={person.isActive ? 'default' : 'secondary'}>
                              {person.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{person.relationship}</span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {person.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {person.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Authorized for:</span>
                            {person.authorizedFor.map((childId) => (
                              <Badge key={childId} variant="outline" className="text-xs">
                                {getChildName(childId)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleAuthorizedStatus(person.id)}
                          title={person.isActive ? 'Deactivate' : 'Activate'}
                        >
                          <Shield className={`h-4 w-4 ${person.isActive ? 'text-green-600' : 'text-gray-400'}`} />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteAuthorized(person.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
  )
}