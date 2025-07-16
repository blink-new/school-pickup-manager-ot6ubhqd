import { useState } from 'react'
import { Bell, Menu, User, LogOut, Settings, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import blink from '@/blink/client'

interface HeaderProps {
  user: any
  unreadNotifications: number
  onNavigate: (page: string) => void
  currentPage: string
}

export function Header({ user, unreadNotifications, onNavigate, currentPage }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    blink.auth.logout()
  }

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'schedule', label: 'Schedule', icon: '📅' },
    { id: 'messages', label: 'Messages', icon: '💬' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    ...(user?.role === 'admin' ? [
      { id: 'admin-dashboard', label: 'Admin Dashboard', icon: '⚙️' },
      { id: 'attendance', label: 'Attendance', icon: '📊' },
      { id: 'reports', label: 'Reports', icon: '📈' }
    ] : [])
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo and School Name */}
        <div className="flex items-center space-x-4">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <div className="flex flex-col space-y-4 mt-8">
                {navigationItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={currentPage === item.id ? "default" : "ghost"}
                    className="justify-start"
                    onClick={() => {
                      onNavigate(item.id)
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">🏫</span>
            </div>
            <div>
              <h1 className="font-semibold text-lg">Oakwood Elementary</h1>
              <p className="text-xs text-muted-foreground">Pickup Management</p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant={currentPage === item.id ? "default" : "ghost"}
              size="sm"
              onClick={() => onNavigate(item.id)}
              className="relative"
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
              {item.id === 'notifications' && unreadNotifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                  {unreadNotifications}
                </Badge>
              )}
            </Button>
          ))}
        </nav>

        {/* User Menu */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => onNavigate('notifications')}
          >
            <Bell className="h-5 w-5" />
            {unreadNotifications > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                {unreadNotifications}
              </Badge>
            )}
          </Button>

          {/* Messages */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('messages')}
          >
            <MessageSquare className="h-5 w-5" />
          </Button>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profileImageUrl} alt={user?.displayName} />
                  <AvatarFallback>
                    {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                  <Badge variant="secondary" className="w-fit text-xs">
                    {user?.role === 'admin' ? 'Administrator' : 'Parent'}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onNavigate('profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate('settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}