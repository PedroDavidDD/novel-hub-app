import { NavigationItem, NavigationChild } from '../models/navigation.model';
import { dashText } from '../../shared/utils/dash.util';

export class NavigationAdapter {
  static toDomain(raw: any): NavigationItem {
    return {
      id: raw.id || raw._id || '',
      label: dashText(raw.label),
      path: raw.path ?? '',
      icon: raw.icon,
      order: raw.order ?? 0,
      permission: raw.permission,
      isActive: raw.isActive ?? true,
      children: Array.isArray(raw.children)
        ? raw.children.map((child: any): NavigationChild => ({
            id: child.id || child._id || '',
            label: dashText(child.label),
            path: child.path ?? '',
            order: child.order ?? 0,
            isActive: child.isActive ?? true,
            permission: child.permission,
          }))
        : [],
    };
  }

  static toDomainList(rawList: any[]): NavigationItem[] {
    if (!Array.isArray(rawList)) {
      return [];
    }
    return rawList.map(item => NavigationAdapter.toDomain(item));
  }
}
