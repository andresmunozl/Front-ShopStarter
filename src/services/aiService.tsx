import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api/ai';

// ─── Helper: lee el token de localStorage O sessionStorage ───
function getToken(): string | null {
  return localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface SmartSearchFilters {
  categoria: string | null;
  precio_max: number | null;
  cerca: boolean;
}

export interface SmartSearchResponse {
  success: boolean;
  data: {
    query: string;
    filters: SmartSearchFilters;
  };
  error?: string;
}

export interface DescriptionResponse {
  success: boolean;
  data: {
    caption: string;
    descripcion: string;
  };
  error?: string;
}

export const aiService = {
  /**
   * Envía una búsqueda en lenguaje natural y recibe filtros estructurados.
   */
  smartSearch: async (query: string): Promise<SmartSearchResponse> => {
    try {
      const response = await axios.post<SmartSearchResponse>(
        `${BASE_URL}/search/`,
        { query }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error in smartSearch:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Sube una imagen de producto para autogenerar su descripción.
   */
  generateProductDescription: async (imagen: File): Promise<DescriptionResponse> => {
    try {
      const formData = new FormData();
      formData.append('imagen', imagen);

      const response = await axios.post<DescriptionResponse>(
        `${BASE_URL}/description/`,
        formData,
        {
          timeout: 120000, // 2 minutos para procesamiento de IA
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error in generateProductDescription:', error);
      throw error.response?.data || error;
    }
  }
};
