export interface NavigationChild {
  id?: string;
  label: string;
  title?: string;
  path: string;
  order?: number;
  isActive?: boolean;
  permission?: string;
}

export interface NavigationItem {
  id?: string;
  label: string;
  title?: string;
  path?: string;
  icon?: string;
  order?: number;
  permission?: string;
  isActive?: boolean;
  children: NavigationChild[];
}
