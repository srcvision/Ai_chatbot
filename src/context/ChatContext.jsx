import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { loadAllSessions, saveAllSessions } from "../utils/Storage";
import { callLLM } from "../utils/Api";

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
};

const makeId = () => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
};

export const ChatProvider = ({ children }) => {
  const [sessions, setSessions] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef(null);

  useEffect(() => {
    const loaded = loadAllSessions();
    if (loaded?.sessions?.length) {
      setSessions(loaded.sessions);
      setActiveId(loaded.activeId || loaded.sessions[0].id);
    } else {
      const id = makeId();
      const newSession = {
        id,
        title: "New Chat 1",
        createdAt: Date.now(),
        messages: [],
      };
      setSessions([newSession]);
      setActiveId(id);
    }
  }, []);

  useEffect(() => {
    if (sessions.length > 0) {
      saveAllSessions({ sessions, activeId });
    }
  }, [sessions, activeId]);

  const createSession = (title) => {
    const id = makeId();
    const newSession = {
      id,
      title: title || `New Chat ${sessions.length + 1}`,
      createdAt: Date.now(),
      messages: [],
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveId(id);
    return id;
  };

  const deleteSession = (id) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeId === id) {
      setActiveId(sessions.length > 1 ? sessions[0].id : null);
    }
  };

  const renameSession = (id, title) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title } : s))
    );
  };

  const addMessage = (id, msg) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, messages: [...(s.messages || []), msg] } : s
      )
    );
  };

  const updateMessage = (id, msgId, patch) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        return {
          ...s,
          messages: (s.messages || []).map((m) =>
            m.id === msgId ? { ...m, ...patch } : m
          ),
        };
      })
    );
  };

  const sendMessageToAi = async ({ sessionId, userText }) => {
    if (!sessionId || !userText.trim()) return;

    const msgId = makeId();
    const userMsg = {
      id: msgId,
      role: "user",
      text: userText,
      timestamp: Date.now(),
      status: "sent",
    };
    addMessage(sessionId, userMsg);

    const assistantId = makeId();
    const assistantPlaceholder = {
      id: assistantId,
      role: "assistant",
      text: "",
      timestamp: Date.now(),
      status: "loading",
    };
    addMessage(sessionId, assistantPlaceholder);

    setLoading(true);
    if (abortRef.current) abortRef.current.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const sess = sessions.find((s) => s.id === sessionId) || { messages: [] };
      const history = [...(sess.messages || []), userMsg].map((m) => ({
        role: m.role,
        content: m.text,
      }));


      const resultText = await callLLM(history, { signal: controller.signal });


      updateMessage(sessionId, assistantId, {
        text: resultText,
        status: "received",
        timestamp: Date.now(),
      });
    } catch (err) {
      console.error("LLM error", err);
      updateMessage(sessionId, assistantId, {
        text: `Error: ${err.message}`,
        status: "failed",
        timestamp: Date.now(),
      });
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  const retryMessage = async (sessionId, failedMessage) => {
    const sess = sessions.find((s) => s.id === sessionId);
    if (!sess) return;

    const ix = sess.messages.findIndex((m) => m.id === failedMessage.id);
    let userMsg = null;


    if (ix > 0) {
      for (let i = ix - 1; i >= 0; i--) {
        if (sess.messages[i].role === "user") {
          userMsg = sess.messages[i];
          break;
        }
      }
    }

    if (!userMsg) return;

    updateMessage(sessionId, failedMessage.id, { status: "loading", text: "" });

    try {
      setLoading(true);
      const controller = new AbortController();
      abortRef.current = controller;

      const history = (sess.messages || [])
        .map((m) => ({ role: m.role, content: m.text }))
        .concat([{ role: "user", content: userMsg.text }]);

      const resultText = await callLLM(history, { signal: controller.signal });

      updateMessage(sessionId, failedMessage.id, {
        text: resultText,
        status: "received",
        timestamp: Date.now(),
      });
    } catch (err) {
      updateMessage(sessionId, failedMessage.id, {
        text: `Error: ${err.message}`,
        status: "failed",
        timestamp: Date.now(),
      });
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  const exportSessionAsJSON = (id) => {
    const s = sessions.find((x) => x.id === id);
    if (!s) return;

    const payload = {
      id: s.id,
      title: s.title,
      createdAt: new Date(s.createdAt).toISOString(),
      exportedAt: new Date().toISOString(),
      totalMessages: s.messages?.length || 0,
      messages: s.messages || [],
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat_${s.title.replace(/\s+/g, "_")}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ChatContext.Provider
      value={{
        sessions,
        activeId,
        setActiveId,
        createSession,
        deleteSession,
        renameSession,
        addMessage,
        sendMessageToAi,
        retryMessage,
        exportSessionAsJSON,
        loading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};