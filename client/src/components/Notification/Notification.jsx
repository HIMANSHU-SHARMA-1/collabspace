import React, { useEffect, useState, useRef } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";

const Notification = () => {
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const dropdownRef = useRef(null);

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

    // Close dropdown on outside click
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ceramic-theme-toggle"
        title="Notifications"
        style={{ position: "relative" }}
      >
        <span className="material-symbols-outlined">notifications</span>
        {unreadCount > 0 && (
          <span
            className="indicator-light danger"
            style={{
              position: "absolute",
              top: "0px",
              right: "0px",
              width: "12px",
              height: "12px",
              border: "2px solid var(--panel-bg)",
            }}
          ></span>
        )}
      </button>

      {isOpen && (
        <div
          className="ceramic-card"
          style={{
            position: "absolute",
            top: "50px",
            right: "0",
            width: "320px",
            maxHeight: "400px",
            overflowY: "auto",
            zIndex: 1010,
            padding: "20px",
            boxShadow: "var(--shadow-outset)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
              borderBottom: "1px solid var(--border-color)",
              paddingBottom: "10px",
            }}
          >
            <h4 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700 }}>Notifications</h4>
            {unreadCount > 0 && (
              <span className="skill-tag" style={{ background: "var(--accent-glow)", color: "var(--accent-primary)" }}>
                {unreadCount} New
              </span>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {notifications.length === 0 ? (
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", textAlign: "center", padding: "16px 0" }}>
                No notifications yet.
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => !notification.isRead && isRead(notification._id)}
                  style={{
                    padding: "12px",
                    borderRadius: "12px",
                    background: notification.isRead ? "transparent" : "var(--tag-bg)",
                    border: "1px solid var(--border-color)",
                    cursor: notification.isRead ? "default" : "pointer",
                    fontSize: "0.85rem",
                    lineHeight: 1.4,
                    color: notification.isRead ? "var(--text-secondary)" : "var(--text-primary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span
                    className="indicator-light"
                    style={{
                      width: "6px",
                      height: "6px",
                      background: notification.isRead ? "var(--text-secondary)" : "var(--accent-primary)",
                      boxShadow: "none",
                      flexShrink: 0,
                    }}
                  ></span>
                  <div style={{ flexGrow: 1 }}>{notification.message}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;