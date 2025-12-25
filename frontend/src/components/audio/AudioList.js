import React, { useContext } from 'react';
import AuthContext from '@/context/AuthContext';
import { Table } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { useAudioRecords } from './hooks/useAudioRecords';
import { useAudioActions } from './hooks/useAudioActions';
import { FaSearch, FaTimes } from 'react-icons/fa';
import Modal from '@/components/Modal';
import RecordDetails from './RecordDetails';
import RecordActions from './RecordActions';

// Table columns configuration
const COLUMNS = [
  {
    key: '_id',
    header: 'Record ID',
    width: '20%',
    render: (record) => (
      <span className="font-mono text-sm">{record._id}</span>
    )
  },
  {
    key: 'createdDate',
    header: 'Created',
    width: '20%',
    render: (record) => (
      <span>
        {record.createdDate} {record.createdTime}
      </span>
    )
  },
  {
    key: 'duration',
    header: 'Duration',
    width: '15%',
    render: (record) => (
      <span>{record.duration || 'N/A'}</span>
    )
  },
  {
    key: 'actions',
    header: 'Actions',
    width: '15%',
    render: (record) => (
      <RecordActions
        record={record}
        onViewDetails={actions.viewDetails}
        onEdit={actions.editRecord}
        onDelete={() => actions.setDeletingRecord(record)}
      />
    )
  }
];

// Search bar component
function SearchBar({ searchId, setSearchId, totalRecords }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="relative flex-1 max-w-xs">
        <input
          type="text"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Search by Record ID"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        {searchId && (
          <button
            onClick={() => setSearchId('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        )}
      </div>
      <div className="text-sm text-gray-500">
        Total Records: {totalRecords}
      </div>
    </div>
  );
}

SearchBar.displayName = 'SearchBar';

function AudioList() {
  const { token } = useContext(AuthContext);
  
  const {
    audioRecords,
    totalRecords,
    isLoading,
    error,
    searchId,
    setSearchId,
    currentPage,
    setCurrentPage,
    totalPages,
    refresh
  } = useAudioRecords(token);

  const {
    selectedRecord,
    editingRecord,
    deletingRecord,
    isModalOpen,
    actions
  } = useAudioActions(token, refresh);

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <SearchBar 
        searchId={searchId}
        setSearchId={setSearchId}
        totalRecords={totalRecords}
      />
      
      <Table
        columns={COLUMNS}
        data={audioRecords}
        isLoading={isLoading}
        emptyMessage="No audio records found"
      />
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* View Details Modal */}
      {isModalOpen && selectedRecord && (
        <Modal
          isOpen={isModalOpen}
          onClose={actions.closeModal}
          title="Record Details"
        >
          <RecordDetails record={selectedRecord} />
        </Modal>
      )}

      {/* Edit Record Modal */}
      {editingRecord && (
        <Modal
          isOpen={!!editingRecord}
          onClose={() => actions.editRecord(null)}
          title="Edit Record"
        >
          <RecordDetails
            record={editingRecord}
            onSave={actions.updateRecord}
            isEditing
          />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deletingRecord && (
        <Modal
          isOpen={!!deletingRecord}
          onClose={() => actions.setDeletingRecord(null)}
          title="Confirm Delete"
        >
          <div className="p-6">
            <p className="mb-4">
              Are you sure you want to delete this record?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => actions.setDeletingRecord(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => actions.deleteRecord(deletingRecord._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

AudioList.displayName = 'AudioList';

export default AudioList; 