import React from "react";
import { BsRecord2 } from "react-icons/bs";
import { FaRecordVinyl } from "react-icons/fa6";



const AudioControls = ({ isRecording, startRecording, stopRecording, onUpload, loading }) => (
  <div className="flex flex-row items-center gap-2">
    {/* 📂 File Upload */}
    <label className="cursor-pointer bg-gray-100 border-2 border-purple-200 btn-size  btn-color btn-color-hover rounded">
      Upload
      <input type="file" accept="audio/*" className="hidden" onChange={onUpload} />
    </label>
    
    {/* 🎙️ Record Button */}
    <button
    
      className={`p-2 hover:shadow-lg hover:shadow-gray-700  rounded-lg mr-2 ${isRecording ? "!bg-red-500 text-white" : "bg-green-500  text-white"}`}
      onClick={isRecording ? stopRecording : startRecording}
    >
      {isRecording ? <FaRecordVinyl  /> :<BsRecord2/>}
    </button>
  </div>
);

export default AudioControls;
