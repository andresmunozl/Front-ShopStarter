import api from '../utils/axios';

interface ReviewResponse {
  id: string;
  client: string;
  rating: number;
  review_text?: string;
  created_at: string;
}

interface ReviewsSummary {
  average: number;
  total: number;
  reviews?: ReviewResponse[];
}

export const submitReview = async (
  vendorId: string,
  rating: number,
  reviewText: string,
  token?: string
): Promise<ReviewResponse> => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await api.post(
      `vendors/${vendorId}/reviews/`,
      {
        rating,
        review_text: reviewText,
      },
      {
        headers,
      }
    );

    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.detail ||
      error?.message ||
      'Error al enviar la reseña.';
    throw new Error(message);
  }
};

export const getVendorReviews = async (
  vendorId: string
): Promise<ReviewsSummary> => {
  try {
    const response = await api.get(`vendors/${vendorId}/reviews/`);
    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.detail ||
      error?.message ||
      'No fue posible cargar las reseñas.';
    throw new Error(message);
  }
};
export const updateReview = async (
  reviewId: string,
  rating: number,
  reviewText: string,
  token?: string
): Promise<ReviewResponse> => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await api.patch(
      `reviews/edit/${reviewId}/`,
      {
        rating,
        review_text: reviewText,
      },
      {
        headers,
      }
    );
    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.detail ||
      error?.message ||
      'Error al actualizar la reseña.';
    throw new Error(message);
  }
};