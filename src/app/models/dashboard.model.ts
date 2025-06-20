export interface DashboardMenuItem {
  id: string;
  title: string;
  description?: string;
  icon: string;
  route: string;
  notification?: number;
  category: string;
  isActive?: boolean;
  isNew?: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  icon: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeReservations: number;
  pendingPayments: number;
  unreadNotifications: number;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  route: string;
}
