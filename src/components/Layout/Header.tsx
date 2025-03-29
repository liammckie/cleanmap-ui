import { useEffect, useState } from 'react'
import { Bell, Search, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface HeaderProps {
  title: string
}

const Header = ({ title }: HeaderProps) => {
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New contract assigned', isRead: false, time: '10 min ago' },
    { id: 2, text: 'Schedule update for tomorrow', isRead: false, time: '1 hour ago' },
    { id: 3, text: 'Client feedback received', isRead: true, time: '3 hours ago' },
  ])

  const [isScrolled, setIsScrolled] = useState(false)

  // Add scroll event listener to add shadow when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  return (
    <header
      className={`sticky top-0 z-30 w-full px-4 py-3 bg-white dark:bg-gray-900 border-b transition-shadow duration-200 ${
        isScrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white animate-slide-in">
          {title}
        </h1>

        <div className="flex items-center gap-4">
          <div className="relative w-64 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 h-9 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-3 w-3 rounded-full bg-red-500 animate-fade-in" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={`flex flex-col items-start p-3 cursor-default ${notification.isRead ? '' : 'bg-blue-50 dark:bg-blue-900/20'}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={`text-sm ${notification.isRead ? 'text-gray-600 dark:text-gray-400' : 'font-semibold'}`}
                      >
                        {notification.text}
                      </span>
                      {!notification.isRead && (
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                      )}
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{notification.time}</span>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="py-4 text-center text-sm text-gray-500">No notifications</div>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center">
                <Button variant="ghost" size="sm" className="text-blue-500 w-full">
                  Mark all as read
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>

          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-300 dark:border-gray-600">
            <span className="text-xs font-medium">AU</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
