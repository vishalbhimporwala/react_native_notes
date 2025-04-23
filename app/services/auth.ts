import api from "./api";

export const loginUser = async (payload: Record<string, any>) => {
    const response = await api.post('/user/login', payload);
    return response;
  };
  