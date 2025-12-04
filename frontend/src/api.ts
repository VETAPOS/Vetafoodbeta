const API_BASE = 'http://localhost:3000';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Error ${response.status}`);
  }

  return response.json();
}

export type PermissionDto = {
  id: string;
  code: string;
  name: string;
  module: string;
};

export type RoleDto = {
  id: string;
  name: string;
  companyId: string;
  permissions: PermissionDto[];
};

export type UserDto = {
  id: string;
  email: string;
  roleId: string | null;
  role: RoleDto | null;
  companyId: string;
  pinEnabled: boolean;
  grantPermissionIds: string[];
  denyPermissionIds: string[];
  effectivePermissions: string[];
};

export function fetchSession() {
  return request<UserDto>('/auth/me');
}

export function fetchRoles() {
  return request<RoleDto[]>('/settings/roles');
}

export function fetchRole(id: string) {
  return request<RoleDto>(`/settings/roles/${id}`);
}

export function updateRole(id: string, data: { name?: string; permissionIds?: string[] }) {
  return request<RoleDto>(`/settings/roles/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function fetchPermissions() {
  return request<PermissionDto[]>('/settings/permissions');
}

export function fetchUsers() {
  return request<UserDto[]>('/settings/users');
}

export function fetchUser(id: string) {
  return request<UserDto>(`/settings/users/${id}`);
}

export function updateUser(
  id: string,
  data: {
    email?: string;
    password?: string;
    roleId?: string | null;
    pinEnabled?: boolean;
    grantPermissionIds?: string[];
    denyPermissionIds?: string[];
  },
) {
  return request<UserDto>(`/settings/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function updateUserPin(id: string, pin?: string) {
  return request<{ pin: string; user: UserDto }>(`/settings/users/${id}/pin`, {
    method: 'POST',
    body: JSON.stringify({ pin }),
  });
}
