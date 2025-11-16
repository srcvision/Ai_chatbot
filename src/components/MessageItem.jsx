import React, { useState } from "react";
import { RotateCcw, Copy, Check } from "lucide-react";
import { useChat } from "../context/ChatContext";

const MessageItem = ({ message, sessionId }) => {
  const { retryMessage } = useChat();
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const time = message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }) : "";

  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"} px-2 sm:px-0`}>
      <div
        className={`
          max-w-full sm:max-w-[75%] wrap-break-words
          ${isUser ? "bg-emerald-100 px-4 py-2 text-gray-900" : "bg-white text-gray-900 border border-gray-200"}
          p-3 rounded-2xl shadow-md
          ${isUser ? "rounded-br-none" : "rounded-bl-none"}
        `}
        style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
        aria-live={isUser ? "polite" : "off"}
      >
        <div className="text-sm leading-relaxed">{message.text}</div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="text-[11px] text-gray-500 ">{time}</div>

          <div className="flex items-center gap-2">
            {!isUser && message.status === "received" && (
              <button
                onClick={handleCopy}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-md"
                aria-label="Copy message"
                title="Copy"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            )}

            {message.status === "failed" && (
              <button
                onClick={() => retryMessage(sessionId, message)}
                className="text-red-500 hover:text-red-700 p-1 rounded-md"
                title="Retry"
                aria-label="Retry message"
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
