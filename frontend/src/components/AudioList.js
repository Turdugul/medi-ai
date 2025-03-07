// AudioList.js
import React, { useState, useEffect, useContext, useCallback, memo, useMemo } from "react";
import AuthContext from "@/context/AuthContext";
import { fetchAudioRecords, fetchAudioRecordById, deleteAudioRecord, updateAudioRecord, downloadAudioFile } from "@/pages/api/audio";
import { FaSearch, FaUserAlt, FaCalendar, FaExternalLinkAlt, FaDownload, FaTimes, FaEllipsisV, FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Modal from "./Modal";
import { LoadingContent, ErrorContent, ConfirmationContent, FormContent } from "./ModalContents";
import SearchInput from "./common/SearchInput";
import { TableHeader, TableRow, RowActionsMenu } from "./common/Table";
import Pagination from "./common/Pagination";
import { showToast } from "./Toast";

// Define table columns
const TABLE_COLUMNS = [
  { key: 'createdDate', label: 'Date', align: 'left' },
  { key: 'createdTime', label: 'Time', align: 'left' },
  { key: 'patientId', label: 'Patient ID', align: 'left' },
  { key: 'title', label: 'Title', align: 'left' },
  { key: '_id', label: 'Record ID', align: 'left' },
  { key: 'actions', label: 'Actions', align: 'right', width: '40' }
];

// Memoize the record details component
const RecordDetails = memo(({ record }) => (
  <div className="space-y-6 animate-scale">
    <div className="animate-fade-in-up">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">{record.title}</h2>
      <p className="text-gray-600">Detailed session information</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[
        { label: 'Patient ID', value: record.patientId },
        { label: 'Date', value: record.createdDate },
        { label: 'Time', value: record.createdTime }
      ].map(({ label, value }) => (
        <div key={label} className="card p-4 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md animate-fade-in-up">
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="font-medium text-gray-800">{value}</p>
        </div>
      ))}
    </div>

    <div className="space-y-2 animate-fade-in-up">
      <h3 className="text-lg font-medium text-gray-800">Report</h3>
      <pre className="card p-6 max-h-96 overflow-auto whitespace-pre-wrap font-mono text-gray-700 text-sm
        transform transition-all duration-300 hover:shadow-md">
        {record.formattedReport}
      </pre>
    </div>
  </div>
));

const AudioList = () => {
  const { token } = useContext(AuthContext);
  const [audioRecords, setAudioRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [deletingRecord, setDeletingRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);
  const recordsPerPage = 10;

  // Load audio records
  const loadAudioRecords = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const records = await fetchAudioRecords(token);
      setAudioRecords(records);
    } catch (error) {
      console.error("Failed to load records:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadAudioRecords();
  }, [loadAudioRecords]);

  // Memoize handlers
  const handleViewDetails = useCallback(async (recordId) => {
    if (!token) return;
    setIsLoading(true);
    try {
      const record = await fetchAudioRecordById(recordId, token);
      setSelectedRecord(record);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch record:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const handleEditRecord = useCallback((record) => {
    setEditingRecord(record);
    setOpenMenuId(null);
  }, []);

  const handleDeleteRecord = useCallback(async (recordId) => {
    setIsLoading(true);
    try {
      await deleteAudioRecord(recordId, token);
      setAudioRecords(prev => prev.filter(r => r._id !== recordId));
      setDeletingRecord(null);
      showToast("success", "Record deleted successfully");
    } catch (error) {
      showToast("error", error.message || "Failed to delete record. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const handleUpdateRecord = useCallback(async (updatedData) => {
    try {
      const response = await updateAudioRecord(editingRecord._id, token, updatedData);
      setAudioRecords(prev => 
        prev.map(record => 
          record._id === editingRecord._id ? { ...record, ...updatedData } : record
        )
      );
      setEditingRecord(null);
      showToast("success", "Record updated successfully");
    } catch (error) {
      showToast("error", error.message || "Failed to update record. Please try again.");
    }
  }, [editingRecord, token]);

  // Memoize filtered records with pagination
  const { paginatedRecords, totalPages } = useMemo(() => {
    const filtered = audioRecords.filter((record) => record._id.includes(searchId));
    const total = Math.ceil(filtered.length / recordsPerPage);
    const start = (currentPage - 1) * recordsPerPage;
    const paginated = filtered.slice(start, start + recordsPerPage);
    return { paginatedRecords: paginated, totalPages: total };
  }, [audioRecords, searchId, currentPage]);

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
    <div className="flex items-center justify-end gap-2 relative">
      <button
        onClick={() => handleViewDetails(record._id)}
        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200"
        aria-label="View details"
      >
        <FaExternalLinkAlt className="w-4 h-4" />
      </button>
      <button
        onClick={() => downloadAudioFile(record._id, token, record.filename)}
        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all duration-200"
        aria-label="Download audio"
      >
        <FaDownload className="w-4 h-4" />
      </button>
      <div className="relative">
        <button
          onClick={() => setOpenMenuId(openMenuId === record._id ? null : record._id)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          aria-label="More actions"
          aria-expanded={openMenuId === record._id}
          aria-haspopup="true"
        >
          <FaEllipsisV className="w-4 h-4" />
        </button>
        {openMenuId === record._id && (
          <div className="absolute right-0 mt-2 z-50">
            <RowActionsMenu
              isOpen={true}
              onClose={() => setOpenMenuId(null)}
              actions={getRowActions(record)}
            />
          </div>
        )}
      </div>
    </div>
  ), [openMenuId, token, handleViewDetails, getRowActions]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Title Section */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
          Audio Record List
        </h1>
        <p className="text-gray-600">
          Manage and view all your audio records
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <SearchInput
          icon={FaSearch}
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Search by Record ID"
          onClear={() => setSearchId("")}
        />
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
          <div className="flex items-center gap-2">
            <FaUserAlt className="text-blue-500" />
            <span className="text-gray-700">
              Total Records: <span className="font-semibold text-blue-600">{audioRecords.length}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <TableHeader columns={TABLE_COLUMNS} />
          <tbody>
            {paginatedRecords.map((record) => (
              <TableRow
                key={record._id}
                data={record}
                columns={TABLE_COLUMNS.slice(0, -1)}
                actions={renderRowActions(record)}
              />
            ))}
          </tbody>
        </table>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {isLoading ? <LoadingContent /> : selectedRecord && <RecordDetails record={selectedRecord} />}
      </Modal>

      {/* Edit Modal */}
      <Modal 
        isOpen={!!editingRecord} 
        onClose={() => setEditingRecord(null)}
        className="z-50 relative"
      >
        {editingRecord && (
          <FormContent
            title="Edit Record"
            primaryAction={() => handleUpdateRecord({
              title: editingRecord.title,
              patientId: editingRecord.patientId
            })}
            secondaryAction={() => setEditingRecord(null)}
            primaryLabel="Save Changes"
            secondaryLabel="Cancel"
          >
            {['title', 'patientId'].map(field => (
              <div key={field} className="space-y-4">
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
          </FormContent>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={!!deletingRecord} 
        onClose={() => setDeletingRecord(null)}
        className="z-50 relative"
      >
        {deletingRecord && (
          <ConfirmationContent
            title="Delete Record"
            message={`Are you sure you want to delete the record "${deletingRecord.title}"? This action cannot be undone.`}
            icon={FaTrash}
            primaryAction={() => handleDeleteRecord(deletingRecord._id)}
            secondaryAction={() => setDeletingRecord(null)}
            primaryLabel="Delete"
            secondaryLabel="Cancel"
            primaryVariant="danger"
            isLoading={isLoading}
          />
        )}
      </Modal>
    </div>
  );
};

export default memo(AudioList);
