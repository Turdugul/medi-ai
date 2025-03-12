import { useRef, useState, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setTitle,
  setPatientId,
  setAudioBlob,
  setAudioUrl,
  setSelectedFileMetadata,  
  setTranscription,
  setFormattedReport,
  setIsRecording,
  setLoading,
  resetForm,
} from "@/redux/slices/audioSlice";
import { uploadAudio } from "./api/audio";
import Layout from "@/components/Layout";
import { MdScheduleSend, MdOutlineContentCopy, MdOutlineFileDownload } from "react-icons/md";
import { BsSendArrowUp, BsFileEarmarkText, BsMicFill } from "react-icons/bs";
import { showToast } from "@/components/Toast";
import AudioControls from "@/components/AudioControl";
import AuthContext from "@/context/AuthContext";
import { FaSpinner } from "react-icons/fa6";

const Assistant = () => {
  const dispatch = useDispatch();
  const { title, patientId, audioBlob, audioUrl, selectedFileMetadata, transcription, formattedReport, isRecording, loading } = useSelector((state) => state.audio);
  const { token, user } = useContext(AuthContext);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [audioLength, setAudioLength] = useState(0);
  const audioRef = useRef(null);

  // Handle audio metadata loading
  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.addEventListener('loadedmetadata', () => {
        setAudioLength(Math.round(audioRef.current.duration));
      });
    }
  }, [audioUrl]);

  // Format time duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
      showToast("info", "Recording started");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      showToast("error", "Microphone access denied or unavailable");
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current?.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setSelectedFile(null);
      dispatch(setSelectedFileMetadata(null));
      dispatch(setIsRecording(false));
      showToast("info", "Recording stopped");
    }
  };

  // Handle file selection
  const handleFileSelection = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        showToast("error", "File size must be less than 25MB");
        event.target.value = '';
        return;
      }
      dispatch(setAudioBlob(null));
      setSelectedFile(file);
      dispatch(setSelectedFileMetadata({
        name: file.name,
        size: file.size,
        type: file.type,
      }));
      dispatch(setAudioUrl(URL.createObjectURL(file)));
      showToast("info", "File selected");
    }
  };

  // Upload to backend
  const handleUploadToBackend = async () => {
    if (!title.trim() || !patientId.trim() || !user?._id) {
      showToast("error", "Please provide title and patient ID");
      return;
    }

    if (!selectedFile && !audioBlob) {
      showToast("error", "Please record or select an audio file");
      return;
    }

    setIsProcessing(true);
    try {
      const audioToSend = audioBlob || selectedFile;
      const response = await uploadAudio(audioToSend, token, user._id, patientId, title);
      
      if (response?.data) {
        dispatch(setTranscription(response.data.transcript));
        dispatch(setFormattedReport(response.data.formattedReport));
        showToast("success", "Processing complete!");
        
        // Reset file states
        setSelectedFile(null);
        dispatch(setAudioBlob(null));
        dispatch(setAudioUrl(null));
        dispatch(setSelectedFileMetadata(null));
        
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
          fileInput.value = '';
        }

        // Reset audio player if it exists
        const audioPlayer = document.querySelector('audio');
        if (audioPlayer) {
          audioPlayer.src = '';
        }

        // Reset form fields
        dispatch(resetForm());
        
        // Reset audio length
        setAudioLength(0);
        
        // Reset recording state if needed
        if (isRecording) {
          stopRecording();
        }

      } else {
        throw new Error("No response from server");
      }
    } catch (error) {
      console.error("Upload error:", error);
      showToast("error", error.message || "Error processing audio");
    } finally {
      setIsProcessing(false);
    }
  };

  // Copy to clipboard with visual feedback
  const handleCopyToClipboard = async () => {
    const combinedText = `📄 Formatted Report:\n${formattedReport || "No report available."}\n\n🎤 Transcription:\n${transcription || "No transcription available."}`;
    try {
      await navigator.clipboard.writeText(combinedText);
      setCopySuccess(true);
      showToast("success", "Copied to clipboard");
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      showToast("error", "Failed to copy");
    }
  };

  // Download as formatted text file
  const handleDownloadReport = () => {
    const combinedText = `📄 Formatted Report:\n${formattedReport || "No report available."}\n\n🎤 Transcription:\n${transcription || "No transcription available."}`;
    const blob = new Blob([combinedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || 'Report'}_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("success", "Report downloaded");
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
              Dentist's Assistant
            </h1>
            <p className="text-gray-600">
              Record or upload audio for instant transcription and analysis
            </p>
          </div>

          {/* Main Content Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 lg:p-8 space-y-6 border border-gray-100">
            {/* Input Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter session title"
                  value={title}
                  onChange={(e) => dispatch(setTitle(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                    transition-all duration-200 bg-white/50 backdrop-blur-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Patient ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter patient identifier"
                  value={patientId}
                  onChange={(e) => dispatch(setPatientId(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                    transition-all duration-200 bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Audio Controls & Upload Section */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 
              p-4 rounded-xl bg-gray-50/50 border border-gray-100">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <AudioControls
                  isRecording={isRecording}
                  startRecording={startRecording}
                  stopRecording={stopRecording}
                  onUpload={handleFileSelection}
                />
                <button
                  onClick={handleUploadToBackend}
                  disabled={isProcessing || (!audioBlob && !selectedFile)}
                  className={`
                    flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
                    shadow-md hover:shadow-lg transform hover:-translate-y-0.5 
                    transition-all duration-200
                    ${isProcessing || (!audioBlob && !selectedFile)
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-[1.02]'
                    }
                  `}
                >
                  {isProcessing ? (
                    <>
                      <FaSpinner className="animate-spin w-4 h-4" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <BsSendArrowUp className="w-4 h-4" />
                      <span>Process</span>
                    </>
                  )}
                </button>
              </div>

              {/* File Info */}
              {(selectedFileMetadata || audioUrl) && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 
                  bg-blue-50 text-blue-700 rounded-lg text-xs">
                  <BsFileEarmarkText className="w-3.5 h-3.5" />
                  <span className="font-medium">
                    {selectedFileMetadata?.name || 'Recorded Audio'}
                    {audioLength ? ` (${formatDuration(audioLength)})` : ''}
                  </span>
                </div>
              )}
            </div>

            {/* Audio Player */}
            {audioUrl && (
              <div className="space-y-1.5">
                <h3 className="text-xs font-medium text-gray-700">Preview</h3>
                <audio
                  ref={audioRef}
                  controls
                  src={audioUrl}
                  className="w-full h-10 rounded-lg"
                />
              </div>
            )}

            {/* Transcription Area */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-gray-800">
                  Transcription & Report
                </h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleCopyToClipboard}
                    className={`
                      p-1.5 rounded-lg transition-all duration-200
                      ${copySuccess 
                        ? 'bg-green-100 text-green-600' 
                        : 'hover:bg-gray-100 text-gray-600'
                      }
                    `}
                    title="Copy to clipboard"
                  >
                    <MdOutlineContentCopy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleDownloadReport}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 
                      transition-all duration-200"
                    title="Download report"
                  >
                    <MdOutlineFileDownload className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="relative">
              <textarea
                  value={`📄 Formatted Report:\n${formattedReport || "No report available."}\n\n🎤 Transcription:\n${transcription || "No transcription available."}`}
                  rows={12}
                  readOnly
                  className="w-full p-4 rounded-xl border border-gray-200 
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                    transition-all duration-200 bg-white/50 backdrop-blur-sm 
                    font-mono text-gray-700 resize-none"
                />
                {isProcessing && (
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-sm 
                    flex items-center justify-center rounded-xl">
                    <div className="flex items-center gap-3 px-4 py-2 bg-white 
                      rounded-lg shadow-lg">
                      <FaSpinner className="animate-spin text-blue-600" />
                      <span className="text-gray-700 font-medium">
                        Processing audio...
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Assistant;
