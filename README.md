# Chat Application with Real-Time Translation

## Overview
This project is a **React Native Chat Application** built with **Expo Router**, **Supabase**, and **TypeScript**. It supports **real-time messaging**, **language translations**, and **optimistic updates**. The app allows users to select their preferred language, translating incoming messages dynamically in real-time.

---

## Features
- **Authentication**: User authentication using Supabase.
- **Real-time Messaging**: Messages are updated instantly without requiring manual refresh.
- **Language Selection**: Users can set their preferred language, and new incoming messages are translated accordingly.
- **Responsive UI**: Works across multiple devices with consistent performance.

---

## Tech Stack
- **Frontend**: React Native (Expo Router)
- **Backend**: Supabase (PostgreSQL + Realtime)
- **State Management**: React Context API
- **Networking**: React Query
- **Styling**: Tailwind CSS
- **Translation API**: Deep Translate Api (for translation)

---

## Folder Structure
```
.
├── src
│   ├── components
│   │   ├── Messages.tsx
│   │   ├── LanguageSelector.tsx
│   │   ├── ui
│   │   │   ├── button.tsx
│   ├── hooks
│   │   ├── useMessages.ts
│   │   ├── useRealtimeMessages.ts
│   ├── providers
│   │   ├── AuthProvider.tsx
│   │   ├── LanguageProvider.tsx
│   ├── utils
│   │   ├── supabase.ts
│   │   ├── translateMessage.ts
│   ├── screens
│   │   ├── ChatScreen.tsx
│   │   ├── LoginScreen.tsx
├── App.tsx
├── README.md
```

---

## Setup Instructions

### Prerequisites
- Node.js installed.
- Expo CLI installed (`npm install -g expo-cli`).
- Supabase account and project configured.

### 1. Clone the Repository
```
git clone https://github.com/Alitariq747/chatty.git
cd chatty
```

### 2. Install Dependencies
```
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add:
```
SUPABASE_URL=<your-supabase-url>
SUPABASE_ANON_KEY=<your-supabase-anon-key>
OPENAI_API_KEY=<your-openai-api-key>
```

### 4. Run the App
```
npm run start
```
Use your emulator or physical device to test the app.

---

## Key Components
### Messages.tsx
Handles displaying messages, sending new ones, and integrating with real-time updates.

### LanguageSelector.tsx
Allows users to select their preferred language from a scrollable list.

### useRealtimeMessages.ts
Listens for new messages or deletions and updates the UI instantly. Translates new messages based on the user's language preference.

---

## Supabase Configuration
1. **Enable Realtime**: Go to the Supabase dashboard -> Database -> Tables -> Enable Realtime for the `messages` table.
2. **Database Schema**: Ensure the following schema exists in your Supabase:
```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID NOT NULL,
    sender_id UUID NOT NULL,
    content TEXT NOT NULL,
    language TEXT DEFAULT 'en',
    translated_content TEXT,
    translated_language TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```



## Contributing
1. Fork the repository.
2. Create a new branch for your feature.
3. Commit your changes.
4. Open a pull request.

---

## Future Enhancements
- **Voice Messages**: Enable voice-to-text messaging.
- **File Attachments**: Allow users to send files and images.
- **Push Notifications**: Notify users about new messages.
- **Offline Mode**: Cache messages locally for offline viewing.

---




