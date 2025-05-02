import api from './api';
import { Resume } from '../types';

class ResumeService {
  async getResumes(): Promise<Resume[]> {
    const response = await api.get<Resume[]>('/resumes');
    return response.data;
  }

  async getResumeById(id: string): Promise<Resume> {
    const response = await api.get<Resume>(`/resumes/${id}`);
    return response.data;
  }

  async createResume(resumeData: Partial<Resume>): Promise<Resume> {
    const response = await api.post<Resume>('/resumes', resumeData);
    return response.data;
  }

  async updateResume(id: string, resumeData: Partial<Resume>): Promise<Resume> {
    const response = await api.put<Resume>(`/resumes/${id}`, resumeData);
    return response.data;
  }

  async deleteResume(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/resumes/${id}`);
    return response.data;
  }

  async addCollaborator(resumeId: string, collaboratorId: string): Promise<Resume> {
    const response = await api.post<Resume>(`/resumes/${resumeId}/collaborators`, { collaboratorId });
    return response.data;
  }

  async removeCollaborator(resumeId: string, collaboratorId: string): Promise<Resume> {
    const response = await api.delete<Resume>(`/resumes/${resumeId}/collaborators/${collaboratorId}`);
    return response.data;
  }

  // Export PDF method will be implemented in the component
  // because it requires access to the Canvas element
}

export default new ResumeService(); 