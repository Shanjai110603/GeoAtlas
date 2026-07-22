export interface NotificationItem {
  id: string;
  userId: string;
  type: 'edit_approved' | 'edit_rejected' | 'badge_unlocked' | 'level_up' | 'comment_reply';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    userId: 'u_current',
    type: 'edit_approved',
    title: 'Contribution Approved! (+50 XP)',
    message: 'Your edit for Apollo Speciality Hospital was approved by a moderator.',
    isRead: false,
    createdAt: '10 mins ago',
    link: '/contribute',
  },
  {
    id: 'n2',
    userId: 'u_current',
    type: 'badge_unlocked',
    title: 'New Achievement Unlocked!',
    message: 'You earned the "Boundary Surveyor" badge (+500 XP threshold).',
    isRead: false,
    createdAt: '1 hour ago',
    link: '/profile',
  },
  {
    id: 'n3',
    userId: 'u_current',
    type: 'edit_approved',
    title: 'Storefront Photo Verified (+30 XP)',
    message: 'Your storefront photo upload for Chennai Tech Park was verified.',
    isRead: true,
    createdAt: '1 day ago',
    link: '/business/00000000-0000-0000-0000-000000000003',
  },
];
