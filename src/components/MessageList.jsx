import React, { useEffect, useRef } from "react";
import MessageItem from "./MessageItem";

const MessageList = ({ messages, sessionId }) => {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 from-slate-50 to-white safe-area-bottom">
      <div className="max-w-4xl mx-auto w-full space-y-3">
        {messages.map((msg, i) => (
          <MessageItem
            key={msg.id}
            message={msg}
            sessionId={sessionId}
            isLast={i === messages.length - 1}
          />
        ))}
      </div>

      <div ref={endRef} className="h-6 sm:h-8" />
    </div>
  );
};

export default MessageList;
