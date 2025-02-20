import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: "",
  patientId: "",
  audioBlob: null,
  audioUrl: null,
  selectedFileMetadata: { // Store only metadata (non-serializable data stored in local state)
    name: "",
    size: 0,
    type: "",
  },
  transcription: "",
  formattedReport: "",
  isRecording: false,
  loading: false,
};

const audioSlice = createSlice({
  name: "audio",
  initialState,
  reducers: {
    setTitle: (state, action) => {
      state.title = action.payload;
      state.formattedReport = "";  // Clear formatted report on new title input
      state.transcription = "";
    },
    setPatientId: (state, action) => {
      state.patientId = action.payload;
    },
    setAudioBlob: (state, action) => {
      state.audioBlob = action.payload;
    },
    setAudioUrl: (state, action) => {
      state.audioUrl = action.payload;
    },
    setSelectedFileMetadata: (state, action) => {
      const { name, size, type } = action.payload;
      state.selectedFileMetadata = { name, size, type };
    },
    setTranscription: (state, action) => {
      state.transcription = action.payload;
    },
    setFormattedReport: (state, action) => {
      state.formattedReport = action.payload;
    },
    setIsRecording: (state, action) => {
      state.isRecording = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    resetForm: (state) => {
      state.title = "";
      state.patientId = "";
      state.audioBlob = null;
      state.audioUrl = null;
      state.selectedFileMetadata = { name: "", size: 0, type: "" };
    },
  },
});

export const {
  setTitle,
  setPatientId,
  setAudioBlob,
  setAudioUrl,
  setSelectedFileMetadata, // Updated to use metadata
  setTranscription,
  setFormattedReport,
  setIsRecording,
  setLoading,
  resetForm,
} = audioSlice.actions;

export default audioSlice.reducer;
