import { apiClient } from '../utilities/apiClient';

export const getAllParameterTypes = async () => {
    try {
        const response = await apiClient.get('/api/ParameterTypes');
        if (response?.status === 200) {
            return {error:false, data: response?.data}; 
        } else {
            return {error:true, data:`Unexpected status code ${response?.status}` }; 
        }
    } catch (error) {
        return {error:true, data: `Error logging in: ${error}`}; 
    }
};
export const createParameterType = async (userData) => {
    try {
        const response = await apiClient.post('/api/ParameterTypes',userData);
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
export const updateParameterType = async (applicationUserId, userData) => {
    try {
        const response = await apiClient.put(`/api/ParameterTypes/${applicationUserId}`,userData);  
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
export const getParameterTypeDetails = async (applicationUserId) => {
    try {
        const response = await apiClient.get(`/api/ParameterTypes/${applicationUserId}`);  
        if (response?.status === 200) {
            return {error:false, data: response?.data}; 
        } else {
            return {error:true, data:`Unexpected status code ${response?.status}` }; 
        }
    } catch (error) {
        return {error:true, data: `Error logging in: ${error}`}; 
    }
};
export const deleteParameterType = async (makeId, status) => {
    try {
        const response = await apiClient.delete(`/api/ParameterTypes/${makeId}`);
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