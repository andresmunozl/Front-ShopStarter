export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    username: string;
    role: string;
    is_active: boolean;
  };
}

export const loginUser = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await fetch("https://shop-starter.onrender.com/api/auth/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.non_field_errors?.[0] || data?.detail || "Credenciales inválidas"
    );
  }

  return data;
};