import React, { useEffect, useState, useContext } from "react";
import AuthContext from "@/context/AuthContext";
import { downloadAudioFile, fetchAudioRecordById, fetchAudioRecords } from "@/pages/api/audio";
import Modal from "./Modal"; // Import the Modal component

const AudioList = () => {
  const { token } = useContext(AuthContext);
  const [audioRecords, setAudioRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadAudioRecords = async () => {
      if (token) {
        try {
          const records = await fetchAudioRecords(token);
          setAudioRecords(records);
        } catch (error) {
          console.error("❌ Failed to load records:", error);
        }
      } else {
        console.log("❌ No token found.");
      }
    };
    loadAudioRecords();
  }, [token]);

  const openModal = async (recordId) => {
    if (token) {
      setIsLoading(true);
      try {
        const record = await fetchAudioRecordById(recordId, token);
        setSelectedRecord(record);
        setIsModalOpen(true);
      } catch (error) {
        console.error("❌ Failed to fetch record:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log("❌ No token found.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-purple-600 mb-6">🗃️ Recorded Audio Sessions</h2>

      {/* Table for listing audio records */}
      <div className="overflow-x-auto mb-4">
        <table>
          <thead>
            <tr>
              <th>↗️ Open</th>
              <th>📅 Date</th>
              <th>⏰ Time</th>
              <th>🪪 Patient ID</th>
              <th>🪧 Title</th>
              <th>📥 Download</th>
              <th>🆔 Record ID</th>
            </tr>
          </thead>
          <tbody>
            {audioRecords.map((record) => (
              <tr key={record._id}>
                <td>
                  <button
                    className="btn-color-hover btn-size btn-color"
                    onClick={() => openModal(record._id)}
                  >
                    Open
                  </button>
                </td>
                <td>{record.createdDate}</td>
                <td>{record.createdTime}</td>
                <td>{record.patientId}</td>
                <td>{record.title}</td>
                <td>
                  <button
                    onClick={() => downloadAudioFile(record._id, token, record.filename)}
                    className="btn-size bg-purple-400 hover:bg-purple-500 text-white rounded"
                  >
                    Download
                  </button>
                </td>
                <td>{record._id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for displaying the selected record */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="w-16 h-16 border-4 border-t-4 border-purple-500 rounded-full animate-spin"></div>
          </div>
        ) : selectedRecord ? (
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold capitalize">{selectedRecord.title}</h3>
            <p className="text-lg"><strong>Patient ID:</strong> {selectedRecord.patientId}</p>
            <p className="text-lg"><strong>Date:</strong> {selectedRecord.createdDate}</p>
            <p className="text-lg"><strong>Time:</strong> {selectedRecord.createdTime}</p>
            <pre className="bg-gray-100 p-6 rounded max-h-60 overflow-auto whitespace-pre-wrap">{selectedRecord.formattedReport}</pre>
          </div>
        ) : (
          <p>Record not found.</p>
        )}
      </Modal>
    </div>
  );
};

export default AudioList;
