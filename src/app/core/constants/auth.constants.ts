import { UserRole } from '../models/user.model';

export const SUPER_ROLES = [UserRole.GOD, UserRole.BOSS, UserRole.ADMIN];

export const ROLE_NAMES: Record<UserRole, string> = {
  [UserRole.GOD]: 'ROLE_GOD',
  [UserRole.BOSS]: 'ROLE_BOSS',
  [UserRole.ADMIN]: 'ROLE_ADMIN',
  [UserRole.USER_COMMON]: 'ROLE_COMMON'
};

export const ROUTE_PERMISSIONS = {
  HOME: 'home.read',
  NOVELS: 'novels.read',
  PROFILE: 'profile.read',
  PROFILE_EDIT: 'profile.edit'
};