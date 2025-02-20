
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";


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
    return response.data.data;
  } catch (error) {
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

