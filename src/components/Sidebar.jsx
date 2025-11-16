import React, { useState } from "react";
import { useChat } from "../context/ChatContext";
import { X, Plus, Download, Check } from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const {
    sessions,
    activeId,
    setActiveId,
    createSession,
    deleteSession,
    renameSession,
    exportSessionAsJSON,
  } = useChat();

  const [copied, setCopied] = useState(null);

  const handleRename = (id, title) => {
    const newTitle = prompt("New name:", title);
    if (newTitle?.trim()) {
      renameSession(id, newTitle);
    }
  };

  const handleCopySession = (id) => {
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <>


      <aside
        className={`h-screen pointer-events-auto bg-linear-to-b from-gray-900 via-gray-800 to-gray-900 text-white 
    w-64 border-r border-gray-700 transition-all duration-300
      ${isOpen ? "translate-x-0 lg:static" : "-translate-x-64"}
      fixed z-20`}
      >
    
        <div className="p-4 border-b border-gray-700 sticky top-0 bg-gray-900">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              AI Chat
            </h1>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-700 rounded"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>
          <button
            onClick={() => {
              createSession();
              onClose();
            }}
            className="w-full flex items-center gap-2 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 px-4 py-2 rounded-lg font-medium transition transform hover:scale-105"
          >
            <Plus size={18} /> New Chat
          </button>
        </div>


        <div className="p-3 space-y-2">
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">No sessions yet</p>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className={`group p-3 rounded-lg cursor-pointer transition ${
                  session.id === activeId
                    ? "bg-linear-to-r from-blue-600 to-blue-500 shadow-lg"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
                onClick={() => {
                  setActiveId(session.id);
                  onClose();
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {session.title}
                    </p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(session.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs opacity-60 mt-0.5">
                      {session.messages?.length || 0} messages
                    </p>
                  </div>
                </div>

                <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRename(session.id, session.title);
                    }}
                    className="flex-1 text-md px-1 py-1 bg-gray-700 hover:bg-gray-600 rounded-full transition"
                    title="Rename"
                  >
                    ✎
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      exportSessionAsJSON(session.id);
                      handleCopySession(session.id);
                    }}
                    className="flex-1 text-md px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded-full transition flex items-center justify-center gap-1"
                    title="Export"
                  >
                    {copied === session.id ? (
                      <>
                        <Check size={18} />
                      </>
                    ) : (
                      <>
                        <Download size={18} />
                      </>
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Delete this chat?")) {
                        deleteSession(session.id);
                      }
                    }}
                    className="flex-1 text-md px-2 py-1 bg-red-700 hover:bg-red-900 text-white rounded-full transition"
                    title="Delete"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
