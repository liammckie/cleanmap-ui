import { useState } from 'react'
import { Check, Clock, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'

interface Task {
  id: string
  title: string
  description: string
  location: string
  dueDate: string
  isCompleted: boolean
  priority: 'low' | 'medium' | 'high'
}

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Office Cleaning - 5th Floor',
    description: 'Complete full cleaning routine for 5th floor offices',
    location: 'Tech Center Building',
    dueDate: 'Today, 5:00 PM',
    isCompleted: false,
    priority: 'high',
  },
  {
    id: '2',
    title: 'Restroom Maintenance',
    description: 'Check and restock supplies in all restrooms',
    location: 'Business Plaza',
    dueDate: 'Today, 3:30 PM',
    isCompleted: false,
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Carpet Cleaning',
    description: 'Deep clean carpets in the main conference room',
    location: 'Corporate Headquarters',
    dueDate: 'Tomorrow, 9:00 AM',
    isCompleted: false,
    priority: 'low',
  },
  {
    id: '4',
    title: 'Window Cleaning',
    description: 'Clean exterior windows on first and second floors',
    location: 'Riverside Office',
    dueDate: 'Tomorrow, 2:00 PM',
    isCompleted: false,
    priority: 'medium',
  },
]

const TasksList = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  const toggleTaskCompletion = (id: string) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, isCompleted: !task.isCompleted } : task)),
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-100 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Tasks</h3>
        <Button variant="outline" size="sm" className="text-sm">
          View All
        </Button>
      </div>

      <div className="overflow-hidden">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={cn(
                'px-6 py-4 transition-colors duration-200',
                task.isCompleted
                  ? 'bg-gray-50 dark:bg-gray-800/60'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/60',
              )}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.isCompleted}
                  onCheckedChange={() => toggleTaskCompletion(task.id)}
                  className="mt-1"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'text-sm font-medium',
                        task.isCompleted
                          ? 'text-gray-500 dark:text-gray-400 line-through'
                          : 'text-gray-900 dark:text-white',
                      )}
                    >
                      {task.title}
                    </span>
                    <span
                      className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                        getPriorityColor(task.priority),
                      )}
                    >
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </div>

                  <p
                    className={cn(
                      'text-sm',
                      task.isCompleted
                        ? 'text-gray-500 dark:text-gray-400 line-through'
                        : 'text-gray-700 dark:text-gray-300',
                    )}
                  >
                    {task.description}
                  </p>

                  <div className="mt-1 flex items-center gap-4 text-xs">
                    <div className="text-gray-500 dark:text-gray-400">📍 {task.location}</div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <Clock className="mr-1 h-3 w-3" />
                      {task.dueDate}
                    </div>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View details</DropdownMenuItem>
                    <DropdownMenuItem>Assign to staff</DropdownMenuItem>
                    <DropdownMenuItem>Reschedule</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600 dark:text-red-400">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default TasksList
