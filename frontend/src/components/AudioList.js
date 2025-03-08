// AudioList.js
import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import AuthContext from "@/context/AuthContext";
import { fetchAudioRecords, fetchAudioRecordById, deleteAudioRecord, updateAudioRecord, downloadAudioFile } from "@/pages/api/audio";
import { FaSpinner } from "react-icons/fa";
import Modal from "./Modal";
import { LoadingContent } from "./ModalContents";
import { showToast } from "./Toast";

// Import components
import RecordDetails from './audio/RecordDetails';
import RecordActions from './audio/RecordActions';
import AudioListHeader from './audio/AudioListHeader';
import AudioListTable from './audio/AudioListTable';

const AudioList = () => {
  const { token } = useContext(AuthContext);
  const [audioRecords, setAudioRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [deletingRecord, setDeletingRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchId, setSearchId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const recordsPerPage = 10;

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load audio records
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
      const records = response?.data || [];
      setAudioRecords(Array.isArray(records) ? records : []);
    } catch (error) {
      console.error("Failed to load records:", error);
      setError(error.message || "Failed to load records");
      setAudioRecords([]);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isMounted && token) {
      loadAudioRecords();
    }
  }, [loadAudioRecords, isMounted, token]);

  // Memoize handlers
  const handleViewDetails = useCallback(async (recordId) => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await fetchAudioRecordById(recordId, token);
      const record = response?.data || null;
      setSelectedRecord(record);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch record:", error);
      showToast("error", "Failed to fetch record details");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const handleEditRecord = useCallback((record) => {
    setEditingRecord(record);
    setOpenMenuId(null);
  }, []);

  const handleDeleteRecord = useCallback(async (recordId) => {
    if (!token || !recordId) return;
    setIsLoading(true);
    try {
      await deleteAudioRecord(recordId, token);
      setAudioRecords(prev => {
        if (!Array.isArray(prev)) return [];
        return prev.filter(r => r?._id !== recordId);
      });
      setDeletingRecord(null);
      showToast("success", "Record deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      showToast("error", error.message || "Failed to delete record. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const handleUpdateRecord = useCallback(async (updatedData) => {
    if (!token || !editingRecord?._id) return;
    try {
      const response = await updateAudioRecord(editingRecord._id, token, updatedData);
      const updatedRecord = response?.data || null;
      
      if (updatedRecord) {
        setAudioRecords(prev => {
          if (!Array.isArray(prev)) return [];
          return prev.map(record => 
            record?._id === editingRecord._id 
              ? { ...record, ...updatedData }
              : record
          );
        });
        setEditingRecord(null);
        showToast("success", "Record updated successfully");
      } else {
        throw new Error("Failed to update record");
      }
    } catch (error) {
      console.error("Update error:", error);
      showToast("error", error.message || "Failed to update record. Please try again.");
    }
  }, [editingRecord, token]);

  // Memoize filtered records with pagination
  const { paginatedRecords, totalPages } = useMemo(() => {
    if (!Array.isArray(audioRecords) || audioRecords.length === 0) {
      return { paginatedRecords: [], totalPages: 0 };
    }

    try {
      const sortedRecords = [...audioRecords].sort((a, b) => {
        if (!a?.createdDate || !b?.createdDate) return 0;
        const dateA = new Date(`${a.createdDate} ${a.createdTime || ''}`);
        const dateB = new Date(`${b.createdDate} ${b.createdTime || ''}`);
        return dateB - dateA;
      });
      
      const filtered = sortedRecords.filter((record) => 
        record?._id?.toString().toLowerCase().includes((searchId || '').toLowerCase())
      );
      
      const total = Math.ceil(filtered.length / recordsPerPage);
      const start = (currentPage - 1) * recordsPerPage;
      const paginated = filtered.slice(start, start + recordsPerPage);
      
      return { 
        paginatedRecords: paginated, 
        totalPages: Math.max(1, total)
      };
    } catch (error) {
      console.error('Error in pagination calculation:', error);
      return { paginatedRecords: [], totalPages: 0 };
    }
  }, [audioRecords, searchId, currentPage, recordsPerPage]);

  // Row actions configuration
  const getRowActions = useCallback((record) => [
    {
      key: 'edit',
      label: 'Edit Record',
      icon: FaEdit,
      onClick: () => handleEditRecord(record),
      variant: 'primary'
    },
    {
      key: 'delete',
      label: 'Delete Record',
      icon: FaTrash,
      onClick: () => {
        setDeletingRecord(record);
        setOpenMenuId(null);
      },
      variant: 'danger'
    }
  ], [handleEditRecord]);

  // Render row actions
  const renderRowActions = useCallback((record) => (
    <RecordActions
      record={record}
      token={token}
      openMenuId={openMenuId}
      onViewDetails={handleViewDetails}
      onDownload={downloadAudioFile}
      onMenuToggle={(id) => setOpenMenuId(openMenuId === id ? null : id)}
      onMenuClose={() => setOpenMenuId(null)}
      getRowActions={getRowActions}
    />
  ), [openMenuId, token, handleViewDetails, getRowActions]);

  // Only render content after component is mounted
  if (!isMounted) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <AudioListHeader
          searchId=""
          onSearchChange={() => {}}
          onSearchClear={() => {}}
          totalRecords={0}
        />
        <p className="text-gray-600 text-center">Loading...</p>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <AudioListHeader
          searchId={searchId}
          onSearchChange={() => {}}
          onSearchClear={() => {}}
          totalRecords={0}
        />
        <div className="flex items-center justify-center gap-2">
          <FaSpinner className="w-5 h-5 animate-spin text-blue-500" />
          <span className="text-gray-600">Loading records...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <AudioListHeader
          searchId={searchId}
          onSearchChange={() => {}}
          onSearchClear={() => {}}
          totalRecords={0}
        />
        <div className="text-center space-y-2">
          <div className="text-red-500 text-lg font-semibold">Error loading records</div>
          <div className="text-gray-600">{error}</div>
          <button
            onClick={loadAudioRecords}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Main content
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <AudioListHeader
        searchId={searchId}
        onSearchChange={(e) => setSearchId(e.target.value)}
        onSearchClear={() => setSearchId("")}
        totalRecords={audioRecords?.length || 0}
      />

      {!audioRecords || audioRecords.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <p className="text-gray-600">No audio records found</p>
        </div>
      ) : (
        <AudioListTable
          paginatedRecords={paginatedRecords}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          renderRowActions={renderRowActions}
        />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {isLoading ? <LoadingContent /> : selectedRecord && <RecordDetails record={selectedRecord} />}
      </Modal>

      {/* Edit Modal */}
      {editingRecord && (
        <Modal 
          isOpen={true} 
          onClose={() => setEditingRecord(null)}
          className="z-50 relative"
        >
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Edit Record</h2>
            <div className="space-y-4">
              {['title', 'patientId'].map(field => (
                <div key={field} className="space-y-2">
                  <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                    {field === 'title' ? 'Title' : 'Patient ID'}
                  </label>
                  <input
                    type="text"
                    id={field}
                    value={editingRecord[field]}
                    onChange={(e) => setEditingRecord(prev => ({ ...prev, [field]: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder={`Enter ${field === 'title' ? 'new title' : 'patient ID'}`}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setEditingRecord(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateRecord({
                  title: editingRecord.title,
                  patientId: editingRecord.patientId
                })}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deletingRecord && (
        <Modal
          isOpen={true}
          onClose={() => setDeletingRecord(null)}
          className="z-50 relative"
        >
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-red-600">Delete Record</h2>
            <p className="text-gray-600">
              Are you sure you want to delete "{deletingRecord.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeletingRecord(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteRecord(deletingRecord._id)}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete</span>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AudioList;
