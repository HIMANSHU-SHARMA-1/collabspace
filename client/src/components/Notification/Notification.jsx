import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";

const Notification = () => {
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const allNotifications = await api.get("/api/notifications/getAll");
      setNotifications(allNotifications.data.data);
      setLoading(false);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Notification fetching failed");
      setLoading(false);
    }
  };

  const isRead = async (notificationId) => {
    try {
      await api.patch(`/api/notifications/read/${notificationId}`);
      fetchNotifications();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Marking read failed");
    }
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("newNotification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });
    return () => {
      socket.off("newNotification");
    };
  }, [socket]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <>
      <div style={{ maxWidth: "750px", margin: "0 auto" }}>
        <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "2rem", fontWeight: 700 }}>
              Notifications
            </h1>
            <p style={{ color: "#888", marginTop: "4px" }}>
              Alerts and team join requests
            </p>
          </div>
          {unreadCount > 0 && (
            <span className="terminal-skill-tag" style={{ background: "rgba(56, 189, 248, 0.1)", color: "#38bdf8" }}>
              {unreadCount} New
            </span>
          )}
        </div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "80px 0" }}>
            <span className="indicator-light"></span>
            <div style={{ color: "#bd93f9", fontWeight: 700, fontFamily: "'Fira Code', monospace" }}>Fetching data...</div>
          </div>
        ) : error ? (
          <div className="terminal-card" style={{ textAlign: "center", color: "#ff5f56" }}>
            <p>{error}</p>
          </div>
        ) : (
          <div className="terminal-card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {notifications.length === 0 ? (
                <p style={{ fontSize: "0.9rem", color: "#888", textAlign: "center", padding: "32px 0" }}>
                  No notifications yet.
                </p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => !notification.isRead && isRead(notification._id)}
                    style={{
                      padding: "16px",
                      borderRadius: "4px",
                      background: notification.isRead ? "transparent" : "#111116",
                      border: "1px solid #2a2a35",
                      borderLeft: notification.isRead ? "1px solid #2a2a35" : "3px solid #38bdf8",
                      cursor: notification.isRead ? "default" : "pointer",
                      fontSize: "0.9rem",
                      lineHeight: 1.5,
                      color: notification.isRead ? "#888" : "#c9d1d9",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {!notification.isRead && (
                      <span
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "#38bdf8",
                          flexShrink: 0,
                        }}
                      ></span>
                    )}
                    <div style={{ flexGrow: 1, fontFamily: notification.isRead ? "inherit" : "'Fira Code', monospace" }}>
                      {notification.message}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Notification;