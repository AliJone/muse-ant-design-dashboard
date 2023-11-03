import { apiClient } from '../utilities/apiClient';

export const getAllParameters = async () => {
    try {
        const response = await apiClient.get('/api/Parameters');
        if (response?.status === 200) {
            return {error:false, data: response?.data}; 
        } else {
            return {error:true, data:`Unexpected status code ${response?.status}` }; 
        }
    } catch (error) {
        return {error:true, data: `Error logging in: ${error}`}; 
    }
};
export const createParameter = async (userData) => {
    try {
        const response = await apiClient.post('/api/Parameters',userData);
        if (response?.status === 201) {
            return {error:false, data: response?.data}; 
        } else {
            return {error:true, data:`Unexpected status code ${response?.status}` }; 
        }
    }catch(error) {
        if (error.response) {
        return {error:true, data: `Error: ${error.response?.data}`}; 
        } else {
          return {error:true, data: `Error logging in: ${error}`}; 
        }
      }
};
export const updateParameter = async (applicationUserId, userData) => {
    try {
        const response = await apiClient.put(`/api/Parameters/${applicationUserId}`,userData);  
        if (response?.status === 202) {
            return {error:false, data: response?.data}; 
        } else {
            return {error:true, data:`Unexpected status code ${response?.status}` }; 
        }
    } 
    catch(error) {
        if (error.response) {
        return {error:true, data: `Error: ${error.response?.data}`}; 
        } else {
          return {error:true, data: `Error logging in: ${error}`}; 
        }
      }
};
export const getParameterDetails = async (applicationUserId) => {
    try {
        const response = await apiClient.get(`/api/Parameters/${applicationUserId}`);  
        if (response?.status === 200) {
            return {error:false, data: response?.data}; 
        } else {
            return {error:true, data:`Unexpected status code ${response?.status}` }; 
        }
    } catch (error) {
        return {error:true, data: `Error logging in: ${error}`}; 
    }
};
export const deleteParameter = async (makeId, status) => {
    try {
        const response = await apiClient.delete(`/api/Parameters/${makeId}`);
        if (response?.status === 202) {
            return {error:false, data: response?.data};
        } else {
            return {error:true, data:`Unexpected status code ${response?.status}`};
        }
    } 
    catch(error) {
        if (error.response) {
            return {error:true, data: `Error: ${error.response?.data}`};
        } else {
            return {error:true, data: `Error updating status: ${error}`};
        }
    }
};