import api from './api';
import { User } from '../types';

export interface UpdateProfileData {
  username?: string;
  email?: string;
  password?: string;
}

class UserService {
  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await api.put<User>('/users/profile', data);
    return response.data;
  }

  async uploadProfilePicture(file: File): Promise<{ _id: string; profilePicture: string }> {
    const formData = new FormData();
    formData.append('profilePicture', file);

    const response = await api.post<{ _id: string; profilePicture: string }>(
      '/users/profile/picture',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  async searchUsers(query: string): Promise<User[]> {
    const response = await api.get<User[]>('/users/search', {
      params: { query },
    });
    return response.data;
  }
}

export default new UserService(); 