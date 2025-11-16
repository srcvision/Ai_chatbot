import React from "react";
import { useChat } from "../context/ChatContext";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { Menu, Clock, MessageCircle } from "lucide-react";

const ChatWindow = ({ setSidebarOpen }) => {
  const { sessions, activeId, loading } = useChat();
  const session = sessions.find((s) => s.id === activeId);

  if (!session) {
    return (
      <div className="flex flex-1 items-center justify-center text-gray-500">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-3 rounded-md hover:bg-gray-200"
        >
          <Menu size={22} />
        </button>
        <p>Select a chat to begin</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col w-full overflow-hidden">
      <div className="px-4 py-4 bg-white w-full flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-md hover:bg-gray-200 absolute left-3  -translate-y-1/4"
        >
          <Menu size={22} />
        </button>
        <div className="flex-1 pl-10">
          <h2 className="text-xl font-bold">{session.title}</h2>
          <div className="text-sm text-gray-500 flex gap-4 mt-1">
            <span className="flex items-center gap-1">
              <Clock size={14} />{" "}
              {new Date(session.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle size={14} /> {session.messages.length} messages
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 w-full">
        <MessageList messages={session.messages} sessionId={session.id} />
      </div>

      <MessageInput
        sessionId={session.id}
        disabled={loading}
        loading={loading}
      />
    </div>
  );
};

export default ChatWindow;
