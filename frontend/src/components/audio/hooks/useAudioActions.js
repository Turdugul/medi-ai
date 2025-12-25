import { useState, useCallback } from 'react';
import { fetchAudioRecordById, deleteAudioRecord, updateAudioRecord } from '@/pages/api/audio';
import { showToast } from '@/components/Toast';

export const useAudioActions = (token, onRecordUpdate) => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [deletingRecord, setDeletingRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleViewDetails = useCallback(async (recordId) => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await fetchAudioRecordById(recordId, token);
      const record = response?.data || null;
      setSelectedRecord(record);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch record:', error);
      showToast('error', 'Failed to fetch record details');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const handleEditRecord = useCallback((record) => {
    setEditingRecord(record);
  }, []);

  const handleDeleteRecord = useCallback(async (recordId) => {
    if (!token || !recordId) return;
    setIsLoading(true);
    try {
      await deleteAudioRecord(recordId, token);
      onRecordUpdate();
      setDeletingRecord(null);
      showToast('success', 'Record deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      showToast('error', error.message || 'Failed to delete record');
    } finally {
      setIsLoading(false);
    }
  }, [token, onRecordUpdate]);

  const handleUpdateRecord = useCallback(async (updatedData) => {
    if (!token || !editingRecord?._id) return;
    setIsLoading(true);
    try {
      await updateAudioRecord(editingRecord._id, token, updatedData);
      onRecordUpdate();
      setEditingRecord(null);
      showToast('success', 'Record updated successfully');
    } catch (error) {
      console.error('Update error:', error);
      showToast('error', error.message || 'Failed to update record');
    } finally {
      setIsLoading(false);
    }
  }, [editingRecord, token, onRecordUpdate]);

  return {
    selectedRecord,
    editingRecord,
    deletingRecord,
    isModalOpen,
    isLoading,
    actions: {
      viewDetails: handleViewDetails,
      editRecord: handleEditRecord,
      deleteRecord: handleDeleteRecord,
      updateRecord: handleUpdateRecord,
      closeModal: () => setIsModalOpen(false),
      setDeletingRecord,
    }
  };
}; 