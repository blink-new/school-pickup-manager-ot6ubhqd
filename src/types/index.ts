export interface User {
  id: string
  email: string
  displayName: string
  role: 'parent' | 'admin'
  phone?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  profileImageUrl?: string
  languagePreference: string
  notificationPreferences: {
    email: boolean
    push: boolean
    sms: boolean
  }
  createdAt: string
  updatedAt: string
}

export interface Child {
  id: string
  parentId: string
  firstName: string
  lastName: string
  grade?: string
  classRoom?: string
  studentId?: string
  photoUrl?: string
  medicalNotes?: string
  pickupInstructions?: string
  createdAt: string
  updatedAt: string
}

export interface AuthorizedPickup {
  id: string
  childId: string
  authorizedPersonName: string
  authorizedPersonPhone?: string
  authorizedPersonEmail?: string
  relationship?: string
  photoUrl?: string
  isActive: boolean
  createdAt: string
}

export interface PickupSchedule {
  id: string
  childId: string
  pickupDate: string
  pickupTime: string
  pickupLocation: string
  pickupPersonName: string
  pickupPersonPhone?: string
  isRecurring: boolean
  recurringPattern?: 'daily' | 'weekly' | 'monthly'
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  notes?: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: string
  senderId: string
  recipientId?: string
  childId?: string
  messageType: 'pickup_request' | 'location_update' | 'emergency' | 'general' | 'broadcast'
  subject?: string
  content: string
  pickupLocation?: string
  priority: 'low' | 'normal' | 'high' | 'emergency'
  isRead: boolean
  createdAt: string
}

export interface PickupActivity {
  id: string
  childId: string
  scheduleId?: string
  pickupPersonName: string
  pickupPersonPhone?: string
  pickupLocation: string
  checkInTime?: string
  checkOutTime?: string
  gpsLocation?: string
  verificationMethod?: 'id_check' | 'digital_auth' | 'parent_confirmation'
  status: 'pending' | 'verified' | 'completed' | 'cancelled'
  notes?: string
  createdBy: string
  createdAt: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'schedule_change' | 'pickup_ready' | 'emergency' | 'delay' | 'general'
  priority: 'low' | 'normal' | 'high' | 'emergency'
  isRead: boolean
  actionUrl?: string
  createdAt: string
}

export interface PickupLocation {
  id: string
  name: string
  description?: string
  gpsCoordinates?: string
  capacity: number
  isActive: boolean
  createdAt: string
}