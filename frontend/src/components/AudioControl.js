import React, { memo, useCallback } from "react";
import { BsRecord2, BsUpload, BsStopFill } from "react-icons/bs";
import { FaRecordVinyl } from "react-icons/fa6";
import { FiLoader } from "react-icons/fi";

// Memoize the upload button component
const UploadButton = memo(({ loading, onUpload }) => (
  <div className="relative group">
    <label 
      className={`
        flex items-center justify-center gap-1.5 px-3 py-2
        bg-gradient-to-r from-purple-600 to-indigo-600 
        text-white rounded-lg text-sm font-medium 
        shadow-md hover:shadow-lg
        transform hover:-translate-y-0.5 
        transition-all duration-200 cursor-pointer
        ${loading ? 'opacity-80 cursor-wait' : 'hover:scale-[1.02]'}
      `}
      role="button"
      aria-label={loading ? "Uploading..." : "Upload audio file"}
    >
      {loading ? (
        <>
          <FiLoader className="w-4 h-4 animate-spin" />
          <span>Uploading...</span>
        </>
      ) : (
        <>
          <BsUpload className="w-4 h-4" />
          <span>Upload</span>
        </>
      )}
      <input 
        type="file" 
        accept="audio/*" 
        className="hidden" 
        onChange={onUpload}
        disabled={loading} 
        aria-label="Upload audio file"
      />
    </label>
  </div>
));

// Memoize the record button component
const RecordButton = memo(({ isRecording, onToggleRecording, loading }) => (
  <div className="relative group">
    <button
      onClick={onToggleRecording}
      disabled={loading}
      className={`
        flex items-center justify-center p-2.5 rounded-lg text-sm font-medium 
        shadow-md hover:shadow-lg transform hover:-translate-y-0.5 
        transition-all duration-200 relative
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isRecording 
          ? "bg-gradient-to-r from-red-500 to-red-600 text-white" 
          : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:scale-[1.02]"
        }
      `}
      aria-label={isRecording ? "Stop Recording" : "Start Recording"}
    >
      {/* Recording Indicator */}
      {isRecording && (
        <div className="absolute inset-0 rounded-lg bg-red-500/20 
          animate-ping pointer-events-none"/>
      )}
      
      {isRecording ? (
        <BsStopFill className="w-4 h-4" />
      ) : (
        <BsRecord2 className="w-4 h-4" />
      )}
    </button>
  </div>
));

// Memoize the recording status component
const RecordingStatus = memo(() => (
  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 
    text-red-600 rounded-lg text-xs font-medium animate-pulse">
    <FaRecordVinyl className="w-3.5 h-3.5" />
    Recording...
  </div>
));

const AudioControls = ({ isRecording, startRecording, stopRecording, onUpload, loading }) => {
  // Memoize the toggle recording handler
  const handleToggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  return (
    <div className="flex items-center gap-2">
      <UploadButton loading={loading} onUpload={onUpload} />
      <RecordButton 
        isRecording={isRecording} 
        onToggleRecording={handleToggleRecording}
        loading={loading}
      />
      {isRecording && <RecordingStatus />}
    </div>
  );
};

export default memo(AudioControls);
