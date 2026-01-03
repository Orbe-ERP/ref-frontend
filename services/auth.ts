import { api } from '@/services/api';

export interface SignInParams {
  email: string;
  password: string;
}

export interface LoginPayload {
  token: string;
  expiresAt: string;
  role: string;
  name: string;
  email: string;
  id: string;
  plan?: string | null;
}

export interface LoginResponse {
  payload: LoginPayload;
}

export interface DefaultResponse {
  message: string;
}

export async function signIn(
  params: SignInParams
): Promise<LoginResponse> {
  try {
    const { data } = await api.post<LoginResponse>('/signin', params);
    return data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('E-mail ou senha inválidos');
    }

    throw new Error(
      error.response?.data?.message || 'Erro ao realizar login'
    );
  }
}

export async function validateToken(): Promise<boolean> {
  try {
    await api.post('/validateToken');
    return true;
  } catch {
    return false;
  }
}

export async function confirmEmail(
  token: string
): Promise<DefaultResponse> {
  try {
    const { data } = await api.get<DefaultResponse>(
      `/confirm-email?token=${token}`
    );
    return data;
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Error(
        error.response.data?.message || 'Token inválido ou expirado'
      );
    }

    throw new Error('Erro ao confirmar e-mail');
  }
}

export async function resendConfirmEmail(
  email: string
): Promise<DefaultResponse> {
  try {
    const { data } = await api.post<DefaultResponse>(
      '/resend-confirm-email',
      { email }
    );
    return data;
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Error(
        error.response.data?.message || 'E-mail já confirmado'
      );
    }

    throw new Error('Erro ao reenviar confirmação de e-mail');
  }
}

export async function requestPasswordReset(
  email: string
): Promise<DefaultResponse> {
  try {
    const { data } = await api.post<DefaultResponse>(
      '/request-password-reset',
      { email }
    );
    return data;
  } catch {
    return {
      message:
        'Se o e-mail existir, você receberá um link para redefinir a senha',
    };
  }
}

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<DefaultResponse> {
  try {
    const { data } = await api.post<DefaultResponse>(
      '/reset-password',
      { token, newPassword }
    );
    return data;
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Error(
        error.response.data?.message || 'Token inválido ou expirado'
      );
    }

    throw new Error('Erro ao redefinir senha');
  }
}
