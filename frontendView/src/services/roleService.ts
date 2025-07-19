import api from './api';

export interface Role {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at?: string;
}

export class RoleService {
  static async getAvailableRoles(): Promise<Role[]> {
    const response = await api.get<Role[]>('/roles');
    return response.data;
  }

  static async getAllRoles(): Promise<Role[]> {
    const response = await api.get<Role[]>('/roles/all');
    return response.data;
  }

  static async getRoleById(id: number): Promise<Role> {
    const response = await api.get<Role>(`/roles/${id}`);
    return response.data;
  }
}

export default RoleService; 