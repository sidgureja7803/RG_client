import api from './api';
import { Template } from '../types';

class TemplateService {
  async getTemplates(category?: string): Promise<Template[]> {
    const params = category ? { category } : {};
    const response = await api.get<Template[]>('/templates', { params });
    return response.data;
  }

  async getTemplateById(id: string): Promise<Template> {
    const response = await api.get<Template>(`/templates/${id}`);
    return response.data;
  }

  async createTemplate(templateData: Partial<Template>): Promise<Template> {
    const response = await api.post<Template>('/templates', templateData);
    return response.data;
  }

  async incrementUsageCount(id: string): Promise<{ success: boolean; usageCount: number }> {
    const response = await api.put<{ success: boolean; usageCount: number }>(`/templates/${id}/usage`);
    return response.data;
  }
}

export default new TemplateService(); 