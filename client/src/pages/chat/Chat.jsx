import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { io } from "socket.io-client";
import api from "../../api/axios";
const socket = io("http://localhost:5000");

const Chat = ({ projectId, members }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [newMessages, setNewMessages] = useState("");

  const fetchMessage = async (projectId) => {
    try {
      setLoading(true);
      const messageData = await api.get(`/api/message/${projectId}`);
      console.log(messageData.data);
      setMessages(messageData.data.data);
      setLoading(false);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Message Fetching failed",
      );
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
    socket.emit("joinRoom", projectId);
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    fetchMessage(projectId);

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  return (
    <>
      <div
        style={{
          position: "fixed",
          right: 0,
          top: 0,
          width: "300px",
          height: "100vh",
          border: "2px solid black",
          display: "flex",
          flexDirection: "column",
          background: "white",
          zIndex: 100,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "10px",
            borderBottom: "1px solid black",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <h3>Project chat</h3>
        </div>

        {/* messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
          {loading ? (
            <p>Loading.....</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            messages &&
            messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "10px",
                  textAlign: msg.sender === user.id ? "right" : "left",
                }}
              >
                <p
                  style={{
                    display: "inline-block",
                    padding: "5px 10px",
                    background: msg.sender === user.id ? "#007bff" : "#f0f0f0",
                    color: msg.sender === user.id ? "white" : "black",
                    borderRadius: "10px",
                  }}
                >
                  {msg.content}
                </p>
              </div>
            ))
          )}
        </div>

        {/* input */}
        <div
          style={{
            padding: "10px",
            borderTop: "1px solid black",
            display: "flex",
          }}
        >
          <input
            type="text"
            value={newMessages}
            onChange={(e) => {
              setNewMessages(e.target.value);
            }}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            style={{ flex: 1, marginRight: "5px" }}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </>
  );
};

export default Chat;
