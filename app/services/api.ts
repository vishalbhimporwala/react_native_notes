import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios"

const BASE_URL ="https://node-js-notes-three.vercel.app/api/v1"

const api = axios.create(
    {
        baseURL:BASE_URL,
        timeout:50000 // 50 second
    }
)


api.interceptors.request.use(
    async (config) => {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );
  

export default api;