# AI Chatbot – React + Gemini API

A fully responsive AI chatbot web application built using **React**, **Context API**, and **Google Gemini API**, featuring persistent chat sessions, message history, responsive sidebar navigation, and a clean mobile-first UI.

---

## 🚀 Features

- Create multiple chat sessions
- Switch between sessions
- Persistent chat history using **localStorage**
- Fully responsive UI (Desktop + Mobile)
- Hamburger menu for mobile sidebar
- User and AI messages styled differently
- Typing indicator while AI responds
- Download chat session as **JSON**
- Enter → send message
- Shift + Enter → new line
- Secure API calls using `.env`
- Error handling + retry support
- Auto restore chats on page reload

## 🚀 Additional Features
- **Toggle button for sidebar in desktop mode**
- **Copy button on bot response**
- **Expandable user input area**
- **Display total number of messages in current chat**
- **Rename, export, and delete chat sessions**

---

## 🛠️ Tech Stack

- **React.js**
- **Tailwind CSS**
- **Context API**
- **Google Gemini API (gemini-2.5-flash)**
- **LocalStorage**
- **Vite / CRA**

---

## 📁 Project Structure

src/
├── components/
│   ├── Sidebar.jsx
│   ├── ChatWindow.jsx
│   ├── MessageList.jsx
│   ├── MessageItem.jsx
│   ├── MessageInput.jsx
├── context/
│   └── ChatContext.jsx
├── utils/
│   └── api.js
├── App.jsx
└── main.jsx

---

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/srcvision/Ai_chatbot.git
   cd Ai_chatbot
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Create a .env file**
   Add your Gemini API key:
   ```ini
   VITE_GEMINI_API_KEY=your_api_key_here
   # or (for CRA)
   REACT_APP_GEMINI_API_KEY=your_api_key_here
   ```
4. **Run the application**
   For Vite:
   ```bash
   npm run dev
   ```
   For CRA:
   ```bash
   npm start
   ```

---

## 💬 How the App Works

- **Chat Sessions:**
  - Create, rename, export, and delete sessions
  - Switch sessions anytime
  - Stores messages in localStorage
  - Saves active session on reload
- **Sending Messages:**
  - Enter = send
  - Shift + Enter = new line
  - Real-time typing indicator while waiting
  - AI response shown below user message
  - Copy button on bot responses
- **Sidebar:**
  - Toggle button for desktop mode
  - Hamburger menu for mobile
- **User Input:**
  - Expandable input area for long messages
- **Message Count:**
  - Displays total number of messages in current chat
- **Export:**
  - Download chat history as JSON

---

## 🎨 Responsive UI

- **Desktop:** Sidebar visible, chat window on the right
- **Mobile:** Sidebar hidden, opens using hamburger menu, chat window takes full width

---

## 🧠 Design Decisions & Assumptions

- Context API for clean global state
- LocalStorage for persistent sessions/messages
- Gemini API (free, fast, reliable model)
- Mobile-first design since most users chat on phones
- Export chat as JSON for backups/debugging
- .env file is mandatory for API key security
- Sidebar toggle for desktop improves usability
- Copy button for bot responses for convenience
- Expandable input for better UX
- Message count for quick reference


## 🤝 Contributing
Contributions are welcome! For significant changes, open an issue first to discuss what you’d like to modify.

## 📝 License
This project is open-source and available under the MIT License.