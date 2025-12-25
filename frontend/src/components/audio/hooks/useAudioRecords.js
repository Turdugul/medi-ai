import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchAudioRecords } from '@/pages/api/audio';
import { showToast } from '@/components/Toast';

export const useAudioRecords = (token) => {
  const [audioRecords, setAudioRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const loadAudioRecords = useCallback(async () => {
    if (!token) {
      setAudioRecords([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchAudioRecords(token);
      const records = response?.data;
      setAudioRecords(Array.isArray(records) ? records : []);
    } catch (error) {
      console.error('Failed to load records:', error);
      setError(error.message || 'Failed to load records');
      setAudioRecords([]);
      showToast('error', 'Failed to load audio records');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      loadAudioRecords();
    }
  }, [loadAudioRecords, token]);

  const { paginatedRecords, totalPages } = useMemo(() => {
    if (!audioRecords.length) {
      return { paginatedRecords: [], totalPages: 0 };
    }

    try {
      const filtered = audioRecords.filter(record => 
        record?._id?.toString().toLowerCase().includes(searchId.toLowerCase())
      );

      const sortedRecords = [...filtered].sort((a, b) => {
        if (!a?.createdDate || !b?.createdDate) return 0;
        const dateA = new Date(`${a.createdDate} ${a.createdTime || ''}`);
        const dateB = new Date(`${b.createdDate} ${b.createdTime || ''}`);
        return dateB - dateA;
      });
      
      const total = Math.ceil(sortedRecords.length / recordsPerPage);
      const start = (currentPage - 1) * recordsPerPage;
      const paginated = sortedRecords.slice(start, start + recordsPerPage);
      
      return { 
        paginatedRecords: paginated, 
        totalPages: Math.max(1, total)
      };
    } catch (error) {
      console.error('Error in pagination calculation:', error);
      return { paginatedRecords: [], totalPages: 0 };
    }
  }, [audioRecords, searchId, currentPage]);

  return {
    audioRecords: paginatedRecords,
    totalRecords: audioRecords.length,
    isLoading,
    error,
    searchId,
    setSearchId,
    currentPage,
    setCurrentPage,
    totalPages,
    refresh: loadAudioRecords
  };
}; 