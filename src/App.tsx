import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { ParentDashboard } from '@/components/dashboard/ParentDashboard'
import { AdminDashboard } from '@/components/dashboard/AdminDashboard'
import { ScheduleManagement } from '@/components/schedule/ScheduleManagement'
import { RealtimeMessaging } from '@/components/messaging/RealtimeMessaging'
import { NotificationCenter } from '@/components/notifications/NotificationCenter'
import { ProfileManagement } from '@/components/profile/ProfileManagement'
import { Toaster } from '@/components/ui/toaster'
import blink from '@/blink/client'

function App() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [unreadNotifications, setUnreadNotifications] = useState(3)

  // Authentication state management
  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  // Handle navigation
  const handleNavigate = (page: string) => {
    setCurrentPage(page)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center mx-auto">
            <span className="text-primary-foreground font-bold text-lg">🏫</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Loading School Pickup System</h2>
            <p className="text-muted-foreground">Please wait while we set up your dashboard...</p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  // Authentication required
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-card rounded-lg shadow-lg p-8 text-center space-y-6">
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center mx-auto">
              <span className="text-primary-foreground font-bold text-2xl">🏫</span>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">Oakwood Elementary</h1>
              <h2 className="text-lg font-semibold text-primary">School Pickup Management</h2>
              <p className="text-muted-foreground">
                Secure access to pickup schedules, real-time messaging, and notifications
              </p>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => blink.auth.login()}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Sign In to Continue
              </button>
              <div className="text-sm text-muted-foreground">
                <p>For parents and authorized pickup persons</p>
                <p className="mt-1">
                  <strong>Need help?</strong> Contact the school office at (555) 123-4567
                </p>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <div className="text-2xl">📅</div>
                  <p className="text-xs text-muted-foreground">Schedule Management</p>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl">💬</div>
                  <p className="text-xs text-muted-foreground">Real-time Messaging</p>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl">🔔</div>
                  <p className="text-xs text-muted-foreground">Instant Notifications</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main application
  return (
    <div className="min-h-screen bg-slate-50">
      <Header 
        user={user} 
        unreadNotifications={unreadNotifications}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />
      
      <main className="container mx-auto px-4 py-6">
        {currentPage === 'dashboard' && user.role === 'parent' && (
          <ParentDashboard user={user} onNavigate={handleNavigate} />
        )}
        
        {currentPage === 'dashboard' && user.role === 'admin' && (
          <AdminDashboard user={user} onNavigate={handleNavigate} />
        )}
        
        {currentPage === 'admin-dashboard' && user.role === 'admin' && (
          <AdminDashboard user={user} onNavigate={handleNavigate} />
        )}
        
        {currentPage === 'schedule' && (
          <ScheduleManagement user={user} />
        )}
        
        {currentPage === 'messages' && (
          <RealtimeMessaging user={user} />
        )}
        
        {currentPage === 'notifications' && (
          <NotificationCenter user={user} />
        )}
        
        {currentPage === 'profile' && (
          <ProfileManagement user={user} />
        )}

        {/* Admin-only pages */}
        {currentPage === 'attendance' && user.role === 'admin' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Attendance Tracking</h1>
              <p className="text-muted-foreground">
                Monitor student pickup status and generate attendance reports
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 text-center">
              <h3 className="text-lg font-semibold mb-2">Attendance Tracking System</h3>
              <p className="text-muted-foreground">
                This feature allows administrators to track which students have been picked up, 
                by whom, and when, ensuring complete accountability and security.
              </p>
            </div>
          </div>
        )}

        {currentPage === 'reports' && user.role === 'admin' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
              <p className="text-muted-foreground">
                Generate detailed reports on pickup activities and performance metrics
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 text-center">
              <h3 className="text-lg font-semibold mb-2">Reporting Dashboard</h3>
              <p className="text-muted-foreground">
                Access comprehensive reports on pickup patterns, efficiency metrics, 
                security incidents, and operational analytics.
              </p>
            </div>
          </div>
        )}

        {currentPage === 'settings' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
              <p className="text-muted-foreground">
                Configure your application preferences and account settings
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 text-center">
              <h3 className="text-lg font-semibold mb-2">Application Settings</h3>
              <p className="text-muted-foreground">
                Customize notification preferences, language settings, and security options.
              </p>
            </div>
          </div>
        )}
      </main>

      <Toaster />
    </div>
  )
}

export default App