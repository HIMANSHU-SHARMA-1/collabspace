import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { useSocket } from "../../context/SocketContext";

const Chat = ({ projectId, members }) => {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [newMessages, setNewMessages] = useState("");
  const messageEndRef = useRef(null);

  const fetchMessage = async (projectId) => {
    try {
      setLoading(true);
      const messageData = await api.get(`/api/message/${projectId}`);
      setMessages(messageData.data.data);
      setLoading(false);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Message Fetching failed");
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessages.trim()) return;
    socket.emit("sendMessage", {
      projectId,
      senderId: user.id,
      content: newMessages,
    });
    setNewMessages("");
  };

  useEffect(() => {
    if (!socket) return;
    socket.emit("joinRoom", projectId);
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    fetchMessage(projectId);

    return () => {
      socket.off("receiveMessage");
    };
  }, [socket, projectId]);

  useEffect(() => {
    // Scroll to bottom on new messages
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Messages List Area */}
      <div style={{ flexGrow: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "6px", paddingRight: "4px", fontFamily: "'Fira Code', 'Courier New', monospace" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
            <span className="indicator-light"></span>
          </div>
        ) : error ? (
          <p style={{ color: "var(--danger)", fontSize: "0.85rem", textAlign: "center" }}>{error}</p>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.sender?._id === user?.id;
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "flex-start",
                  fontSize: "0.85rem",
                  lineHeight: 1.4,
                }}
              >
                <span style={{ color: isMe ? "#34d399" : "#38bdf8", flexShrink: 0, fontWeight: 600 }}>
                  [{msg.sender?.username || "Unknown"}]
                </span>
                <span style={{ color: "#c9d1d9", wordBreak: "break-word" }}>
                  {msg.content}
                </span>
              </div>
            );
          })
        )}
        <div ref={messageEndRef} />
      </div>

      {/* Input controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "12px", borderTop: "1px solid #2a2a35", paddingTop: "12px", fontFamily: "'Fira Code', 'Courier New', monospace" }}>
        <span style={{ color: "#34d399", fontWeight: 700 }}>~</span>
        <span style={{ color: "#ff5f56", fontWeight: 700 }}>$</span>
        <input
          type="text"
          value={newMessages}
          onChange={(e) => setNewMessages(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="write a message..."
          style={{ 
            flexGrow: 1, 
            background: "transparent", 
            border: "none", 
            outline: "none", 
            color: "#c9d1d9",
            fontFamily: "'Fira Code', 'Courier New', monospace",
            fontSize: "0.85rem"
          }}
        />
        <button
          onClick={sendMessage}
          style={{ 
            background: "transparent", 
            border: "none", 
            color: "#38bdf8", 
            cursor: "pointer",
            display: "flex",
            alignItems: "center"
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>keyboard_return</span>
        </button>
      </div>
    </div>
  );
};

export default Chat;
