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
      <div style={{ flexGrow: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", paddingRight: "4px" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
            <span className="indicator-light"></span>
          </div>
        ) : error ? (
          <p style={{ color: "var(--danger)", fontSize: "0.85rem", textAlign: "center" }}>{error}</p>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.sender._id === user.id;
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isMe ? "flex-end" : "flex-start",
                }}
              >
                {!isMe && (
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "4px", paddingLeft: "6px" }}>
                    {msg.sender.username}
                  </span>
                )}
                <div
                  style={{
                    padding: "10px 16px",
                    maxWidth: "85%",
                    fontSize: "0.9rem",
                    lineHeight: 1.5,
                    borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    background: isMe ? "var(--accent-primary)" : "var(--tag-bg)",
                    color: isMe ? "white" : "var(--text-primary)",
                    boxShadow: isMe ? "0 4px 12px var(--accent-glow)" : "none",
                    border: isMe ? "none" : "1px solid var(--border-color)",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            );
          })
        )}
        <div ref={messageEndRef} />
      </div>

      {/* Input controls */}
      <div style={{ display: "flex", gap: "10px", marginTop: "16px", borderTop: "1px solid var(--border-color)", paddingTop: "12px" }}>
        <input
          type="text"
          value={newMessages}
          onChange={(e) => setNewMessages(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Write a message..."
          className="ceramic-input"
          style={{ flexGrow: 1, padding: "10px 16px", borderRadius: "12px" }}
        />
        <button
          onClick={sendMessage}
          className="ceramic-btn primary"
          style={{ padding: "10px 16px", borderRadius: "12px", minWidth: "50px" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>send</span>
        </button>
      </div>
    </div>
  );
};

export default Chat;
