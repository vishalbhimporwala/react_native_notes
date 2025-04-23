import api from "./api";

export const notelist = async () => {
    const response = await api.get('/note/fetch');
    return response.data;
  };

  export const addNoteApi = async (payload : Record<string,any>) => {
    const response = await api.post('/note/create',payload);
    return response.data;
  };

  export const updateNoteApi = async (payload : Record<string,any>) => {
    const response = await api.post('/note/update',payload);
    return response.data;
  };

  export const deleteNoteApi = async (noteId : string) => {
    const response = await api.delete(`/note/delete/${noteId}`);
    return response.data;
  };