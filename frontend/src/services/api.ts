import { PromptRequest, PromptResponse, DebugPromptResponse, HealthResponse, ApiError } from '../types/api';

// Use /api for Docker deployment, localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8000');
const API_TOKEN = process.env.REACT_APP_API_TOKEN || 'your_secret_key_here';

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async checkHealth(): Promise<HealthResponse> {
    return this.makeRequest<HealthResponse>('/health');
  }

  async submitPrompt(request: PromptRequest): Promise<PromptResponse> {
    return this.makeRequest<PromptResponse>('/prompt', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async submitPromptDebug(request: PromptRequest): Promise<DebugPromptResponse> {
    return this.makeRequest<DebugPromptResponse>('/prompt/debug', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getAnalytics(): Promise<any> {
    return this.makeRequest<any>('/analytics/stats');
  }
}

export const apiService = new ApiService(); 