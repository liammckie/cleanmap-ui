
/**
 * Notification Schema
 * 
 * This file defines the data structures for system notifications.
 */

/**
 * Notifications - System notifications for users
 */
export interface Notification {
  id: number;
  user_id: number; // Foreign key to User
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  read: boolean;
  read_at?: Date;
  link?: string;
  created_at: Date;
  updated_at: Date;
}
