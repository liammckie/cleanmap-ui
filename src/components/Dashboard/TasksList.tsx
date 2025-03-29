
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { Link } from 'react-router-dom'

interface Task {
  id: string
  title: string
  description?: string
  status: string
  priority: string
  due_date: string
  scheduled_start?: string
  sites?: {
    site_name: string
    client_id: string
    clients?: {
      company_name: string
    }
  }
}

interface TasksListProps {
  tasks: Task[]
}

const TasksList: React.FC<TasksListProps> = ({ tasks }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'in progress':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDueDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return formatDistanceToNow(date, { addSuffix: true })
    } catch (error) {
      return 'Invalid date'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No pending tasks found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">
                    <Link to={`/operations/work-orders/${task.id}`} className="hover:text-brand-blue">
                      {task.title}
                    </Link>
                  </h3>
                  <div className="flex gap-2">
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                    <Badge className={getStatusColor(task.status)}>
                      {task.status}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-1 mb-1">
                  {task.description || 'No description provided'}
                </p>
                
                <div className="flex flex-col sm:flex-row sm:justify-between text-xs mt-2">
                  <div className="text-muted-foreground">
                    <span>Site: </span>
                    <span className="font-medium">{task.sites?.site_name || 'Unknown'}</span>
                    {task.sites?.clients?.company_name && (
                      <>
                        <span> (</span>
                        <span>{task.sites.clients.company_name}</span>
                        <span>)</span>
                      </>
                    )}
                  </div>
                  <div className={`${new Date(task.due_date) < new Date() ? 'text-red-600' : 'text-muted-foreground'}`}>
                    Due {formatDueDate(task.due_date)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default TasksList
