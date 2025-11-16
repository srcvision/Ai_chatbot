import React, { useState, useRef, useEffect } from "react";
import { useChat } from "../context/ChatContext";
import { Send, Loader } from "lucide-react";

const MessageInput = ({ sessionId, loading }) => {
  const { sendMessageToAi } = useChat();
  const [text, setText] = useState("");
  const taRef = useRef();

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;

    ta.style.height = "auto";
    ta.style.height = ta.scrollHeight + "px";
  }, [text]);

  const handleSend = async () => {
    if (!text.trim()) return;
    await sendMessageToAi({ sessionId, userText: text });
    setText("");
  };
  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-3 bg-white safe-area-bottom">
      <div className="max-w-4xl mx-auto flex items-end gap-3">
      
        <div className="flex-1 relative">
          <textarea
            ref={taRef}
            value={text}
            onKeyDown={onKeyDown}
            onChange={(e) => setText(e.target.value)}
            rows={1}
            placeholder="Type a message..."
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none overflow-hidden text-base leading-6 transition-all max-h-56 shadow-sm"
            style={{ minHeight: "48px"}}
          />
        
          <div className="pointer-events-none absolute right-3 bottom-3 text-xs text-gray-400 hidden sm:block">
            {text.length}/2000
          </div>
        </div>

     
        <button
          disabled={!text.trim() || loading}
          onClick={handleSend}
          className="p-3 bg-black rounded-full mb-[11px] text-white hover:bg-gray-900 cursor-pointer disabled:opacity-40 flex items-center justify-center"
          aria-label="Send message"
        >
          {loading ? (
            <Loader size={18} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
