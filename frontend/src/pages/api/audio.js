import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const uploadAudio = async (file, token, userId, patientId, title) => {
  try {
    const formData = new FormData();
    formData.append("audio", file);
    formData.append("userId", userId); 
    formData.append("patientId", patientId);
    formData.append("title", title);

    const response = await axios.post(`${API_BASE_URL}/api/audio/upload`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to upload audio");
  }
};

// 📌 Fetch all audio records with token authorization
export const fetchAudioRecords = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/audio/files`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    // Ensure we have data and it's an array
    const records = response?.data?.data || response?.data || [];
    return { data: Array.isArray(records) ? records : [] };
  } catch (error) {
    console.error('Error fetching audio records:', error);
    throw error;
  }
};

export const fetchAudioRecordById = async (recordId, token) => {
  try {

    const response = await axios.get(`${API_BASE_URL}/api/audio/file/${recordId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });



    if (response && response.data && response.data.data) {
      return response.data.data; 
    } else {
      throw new Error('No data found in the API response');
    }
  } catch (error) {
    throw error;
  }
};



// 📌 Get the download link for an audio file
export const getDownloadLink = (filename) => {
  return `${API_BASE_URL}/api/audio/file/${filename}`;
};

export const downloadAudioFile = async (fileId, token, filename) => {
  try {
    const downloadLink = `${API_BASE_URL}/api/audio/file/${fileId}`;
    const response = await axios.get(downloadLink, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      responseType: 'blob', 
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename); 
    document.body.appendChild(link);
    link.click();  
    document.body.removeChild(link);
  } catch (error) {
   
  }
};

// 📌 Update an audio record (Edit Title/Patient ID)
export const updateAudioRecord = async (recordId, token, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/audio/file/${recordId}`, updatedData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message || "Failed to update record");

  }
};

// 📌 Delete an audio record
export const deleteAudioRecord = async (recordId, token) => {
  try {
    await axios.delete(`${API_BASE_URL}/api/audio/file/${recordId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    return { success: true, message: "Audio record deleted successfully" };
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to delete record");
  }
};