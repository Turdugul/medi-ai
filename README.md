
# Medi Mate - Dentist’s Assistant Web App

## Overview
Medi Mate is a full-stack web application designed to help dentists by allowing them to upload and transcribe audio recordings into structured dental reports. Built with **Next.js (React)** for the frontend, **Node.js (Express)** for the backend, and **MongoDB** for data storage.

## Features
- **Audio Recording/Upload**: Record or upload audio files (MP3, WAV).
- **Transcription**: Transcribe speech into text using Whisper API.
- **Report Generation**: Use GPT-4o-mini to generate structured dental reports.
- **Audio List**: View, search, and download previously uploaded audio recordings.

## Tech Stack
- **Frontend**: Next.js, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB, GridFS
- **Authentication**: JWT
- **APIs**: Whisper for transcription, GPT-4o-mini for report generation

## Setup

### Prerequisites
- Node.js
- MongoDB (local or cloud)
- OpenAI API Key (for Whisper & GPT-4o-mini)
# Dentist Assistant App

## 1. Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Turdugul/medi-ai.git
   cd dentist-assistant-ai
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

4. Set up environment variables:
   - `Backend: .env (MongoDB URI, OpenAI API Key, JWT Secret)`
   - `Frontend: .env.local (API endpoints)`

5. Start the development server:
   ```bash
   cd backend
   npm run dev
   ```

   ```bash
   cd frontend
   npm run dev
   ```

---

## 2. API Documentation

### 2.1 **Register User**
- **Endpoint**: `POST /api/auth/register`
- **Body**:
   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123"
   }
   ```

- **Response**:
   ```json
   {
     "success": true,
     "message": "User registered successfully",
     "token": "JWT_TOKEN",
     "user": {
       "id": "USER_ID",
       "name": "John Doe",
       "email": "john@example.com"
     }
   }
   ```

### 2.2 **Login User**
- **Endpoint**: `POST /api/auth/login`
- **Body**:
   ```json
   {
     "email": "john@example.com",
     "password": "password123"
   }
   ```

- **Response**:
   ```json
   {
     "message": "Login successful",
     "token": "JWT_TOKEN",
     "user": {
       "id": "USER_ID",
       "name": "John Doe",
       "email": "john@example.com"
     }
   }
   ```

### 2.3 **Get User Profile**
- **Endpoint**: `GET /api/auth/profile`
- **Authorization**: `Bearer JWT Token`
- **Response**:
   ```json
   {
     "id": "USER_ID",
     "name": "John Doe",
     "email": "john@example.com"
   }
   ```

### 2.4 **Upload Audio**
- **Endpoint**: `POST /api/audio/upload`
- **Body** (multipart/form-data):
   ```json
   {
     "userId": "USER_ID",
     "patientId": "PATIENT_ID",
     "title": "Audio Title",
     "audio": "<audio_file>"
   }
   ```

- **Response**:
   ```json
   {
     "message": "Audio uploaded and processed successfully",
     "data": {
       "userId": "USER_ID",
       "patientId": "PATIENT_ID",
       "title": "Audio Title",
       "transcript": "Transcribed text",
       "formattedReport": "Structured dental report"
     }
   }
   ```

### 2.5 **Get Audio Files**
- **Endpoint**: `GET /api/audio/files`
- **Response**:
   ```json
   {
     "message": "Audio records retrieved successfully",
     "data": [
       {
         "id": "RECORD_ID",
         "title": "Audio Title",
         "filename": "file.mp3",
         "createdDate": "Feb 20, 2025",
         "createdTime": "2:30 PM"
       }
     ]
   }
   ```

### 2.6 **Get Audio File By ID**
- **Endpoint**: `GET /api/audio/file/:id`
- **Response**:
   ```json
   {
     "message": "✅ Audio record retrieved successfully",
     "data": {
       "id": "RECORD_ID",
       "userId": "USER_ID",
       "patientId": "PATIENT_ID",
       "title": "Audio Title",
       "filename": "file.mp3",
       "transcript": "Transcribed text",
       "formattedReport": "Structured dental report",
       "createdDate": "Feb 20, 2025",
       "createdTime": "2:30 PM",
       "file": {
         "_id": "FILE_ID",
         "filename": "file.mp3",
         "contentType": "audio/mp3",
         "length": 123456,
         "uploadDate": "2025-02-20T14:30:00Z"
       }
     }
   }
   ```
## 3. About

### Medi Mate - Dentist's Assistant Web App

 ### Live App: https://medi-ai-frontend.onrender.com 

# medi-ai
