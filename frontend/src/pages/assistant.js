import { useRef, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setTitle,
  setPatientId,
  setAudioBlob,
  setAudioUrl,
  setSelectedFileMetadata,  // Updated to use metadata
  setTranscription,
  setFormattedReport,
  setIsRecording,
  setLoading,
  resetForm,
} from "@/redux/slices/audioSlice";
import { uploadAudio } from "./api/audio";
import Layout from "@/components/Layout";


import { showToast } from "@/components/Toast";
import AudioControls from "@/components/AudioControl";
import AuthContext from "@/context/AuthContext";

const Assistant = () => {
  const dispatch = useDispatch();
  const { title, patientId, audioBlob, audioUrl, selectedFileMetadata, transcription, formattedReport, isRecording, loading } = useSelector((state) => state.audio);
  const { token, user } = useContext(AuthContext);

  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const [selectedFile, setSelectedFile] = useState(null); // Local state for the file

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunks.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: "audio/wav" });
        dispatch(setAudioBlob(blob));
        dispatch(setAudioUrl(URL.createObjectURL(blob)));
        audioChunks.current = [];
      };
      mediaRecorderRef.current.start();
      dispatch(setIsRecording(true));
      showToast("info", "Recording started...");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      showToast("error", "Microphone access denied or unavailable.");
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      dispatch(setIsRecording(false));

      // Create the Blob and generate URL
      const blob = new Blob(audioChunks.current, { type: "audio/wav" });
      const url = URL.createObjectURL(blob);

      // Store the URL instead of the Blob
      dispatch(setAudioUrl(url));
      dispatch(setAudioBlob(blob));
      audioChunks.current = [];

      showToast("info", "Recording stopped.");
    }
  };

  // Handles file selection (choose audio file)
  const handleFileSelection = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file); // Store the actual file in local state
      dispatch(setSelectedFileMetadata({
        name: file.name,
        size: file.size,
        type: file.type,
      })); // Store only the metadata in Redux
      showToast("info", "File selected.");
    }
  };

  // Upload to backend
  const handleUploadToBackend = async () => {
    if (!title.trim() || !patientId.trim() || !user?._id) {
      showToast("error", "Please provide all required fields.");
      return;
    }

    dispatch(setLoading(true));

    const blob = selectedFile || audioBlob;

    if (!blob) {
      showToast("error", "No file selected or recorded.");
      dispatch(setLoading(false));
      return;
    }

    try {
      const response = await uploadAudio(blob, token, user._id, patientId, title);
      if (response?.data) {
        dispatch(setTranscription(response.data.transcript));
        dispatch(setFormattedReport(response.data.formattedReport));
        showToast("success", "File uploaded successfully!");

        // Reset form after successful upload to prepare for the next request
        dispatch(resetForm());
      } else {
        showToast("error", "Error: No transcript received from server.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      showToast("error", "Error uploading audio.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (!token || !user) {
    showToast("error", "Session expired. Please log in again.");
  }

  // Copy to Clipboard
  const handleCopyToClipboard = () => {
    const combinedText = `📄 Formatted Report:\n${formattedReport || "No report available."}\n\n🎤 Transcription:\n${transcription || "No transcription available."}`;
    navigator.clipboard.writeText(combinedText)
      .then(() => message.success("Copied to clipboard!"))
      .catch(() => message.error("Failed to copy."));
  };

  // Download as .txt file
  const handleDownloadReport = () => {
    const combinedText = `📄 Formatted Report:\n${formattedReport || "No report available."}\n\n🎤 Transcription:\n${transcription || "No transcription available."}`;
    const blob = new Blob([combinedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Transcription_Report.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
        <h1 className="text-3xl font-bold text-purple-600 mb-6">Dentist’s Assistant</h1>
        <div className="bg-white shadow-lg p-6 rounded-xl w-full max-w-3xl">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-4 mb-4">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => dispatch(setTitle(e.target.value))}
                className="z-0 border p-2 w-full sm:w-1/3 rounded mb-2 sm:mb-0 input-field"
              />
              <input
                type="text"
                placeholder="Patient ID"
                value={patientId}
                onChange={(e) => dispatch(setPatientId(e.target.value))}
                className="border p-2 w-full sm:w-1/3 rounded input-field"
              />
            </div>

            <div className="flex flex-col">
              <h3 className="text-purple-600 p-2">Transcription & Formatted Report</h3>
              <textarea
  value={`📄 Formatted Report:\n${formattedReport || "No report available."}\n\n🎤 Transcription:\n${transcription || "No transcription available."}`}
  rows={15}
  onClick={(e) => e.target.select()}
  readOnly
  className="w-full p-4 border rounded-lg border-gray-300 bg-white text-gray-700  resize-none"
/>
            </div>

            <div className="flex flex-row justify-between items-start sm:items-center mt-2 p-2 gap-2">
              <div className="flex flex-row items-start gap-1 w-full md:w-auto">
                <AudioControls
                  isRecording={isRecording}
                  startRecording={startRecording}
                  stopRecording={stopRecording}
                  onUpload={handleFileSelection} // File selection handler
                  loading={loading}
                />
                <button
                  onClick={handleUploadToBackend} // Upload file and other data to backend
                  disabled={loading}
                  className="btn-size btn-color btn-color-hover"
                >
                  {loading ? <span>Uploading... </span> : 'send'}
                </button>
              </div>

              <div className="flex flex-row justify-start text-purple-600 gap-2 md:w-auto">
                <button onClick={handleCopyToClipboard} className="btn-color-hover btn-color btn-size">Copy</button>
                <button onClick={handleDownloadReport} className="btn-size btn-color-hover btn-color">Save</button>
              </div>
            </div>

            {audioUrl && <audio controls src={audioUrl} className="w-2/3 mt-2" />}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Assistant;
