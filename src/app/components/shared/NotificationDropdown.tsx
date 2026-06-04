import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Bell } from "lucide-react";

interface Notification {
  id: string | number;
  text: string;
  time: string;
  unread: boolean;
}

interface NotificationDropdownProps {
  notifications: Notification[];
  unreadCount?: number;
  onNotificationClick?: (id: string | number) => void;
  variant?: "dark" | "light";
}

export function NotificationDropdown({
  notifications,
  unreadCount = 0,
  onNotificationClick,
  variant = "dark",
}: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const calcPos = () => {
    if (buttonRef.current) {
      const r = buttonRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 8, right: window.innerWidth - r.right });
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    calcPos();
    window.addEventListener("resize", calcPos);
    window.addEventListener("scroll", calcPos, true);
    return () => {
      window.removeEventListener("resize", calcPos);
      window.removeEventListener("scroll", calcPos, true);
    };
  }, [isOpen]);

  const isDark = variant === "dark";

  const dropdown = isOpen
    ? createPortal(
        <>
          {/* Backdrop */}
          <div
            style={{ position: "fixed", inset: 0, zIndex: 2147483646 }}
            onClick={() => setIsOpen(false)}
          />
          {/* Dropdown panel */}
          <div
            style={{
              position: "fixed",
              top: pos.top,
              right: pos.right,
              zIndex: 2147483647,
              width: 320,
              maxHeight: 400,
              background: "white",
              borderRadius: 16,
              boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
              border: "1px solid #EFEFEF",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #F0F0F0", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <span style={{ fontWeight: 700, color: "#1a1a2e", fontSize: "0.92rem" }}>Notifikasi</span>
              {unreadCount > 0 && (
                <span style={{ background: "#EEF4FF", color: "#1677FF", fontWeight: 700, fontSize: "0.72rem", padding: "2px 8px", borderRadius: 99 }}>
                  {unreadCount} baru
                </span>
              )}
            </div>

            {/* List */}
            <div style={{ overflowY: "auto", flex: 1 }}>
              {notifications.length === 0 ? (
                <div style={{ padding: "40px 16px", textAlign: "center" }}>
                  <Bell size={32} color="#D9D9D9" style={{ margin: "0 auto 8px" }} />
                  <p style={{ fontSize: "0.82rem", color: "#8C8C8C" }}>Tidak ada notifikasi</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => { onNotificationClick?.(n.id); setIsOpen(false); }}
                    style={{
                      padding: "12px 16px",
                      display: "flex",
                      gap: 12,
                      cursor: "pointer",
                      background: n.unread ? "#EEF4FF" : "white",
                      borderBottom: "1px solid #F8F8F8",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F7FA")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = n.unread ? "#EEF4FF" : "white")}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: n.unread ? "#1677FF" : "#D9D9D9", flexShrink: 0, marginTop: 6 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "0.82rem", color: "#242424", lineHeight: 1.45, margin: 0 }}>{n.text}</p>
                      <p style={{ fontSize: "0.72rem", color: "#8C8C8C", marginTop: 4, marginBottom: 0 }}>{n.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div
                onClick={() => setIsOpen(false)}
                style={{ padding: "10px 16px", textAlign: "center", borderTop: "1px solid #F0F0F0", cursor: "pointer", flexShrink: 0 }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F7FA")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
              >
                <span style={{ fontSize: "0.75rem", color: "#1677FF", fontWeight: 600 }}>Lihat Semua</span>
              </div>
            )}
          </div>
        </>,
        document.body
      )
    : null;

  return (
    <div style={{ position: "relative" }}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: 40, height: 40, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: isDark ? "rgba(255,255,255,0.2)" : "#F5F5F5",
          border: "none", cursor: "pointer", position: "relative",
          transition: "transform 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <Bell size={19} color={isDark ? "white" : "#595959"} />
        {unreadCount > 0 && (
          <span style={{
            position: "absolute", top: -2, right: -2,
            width: 16, height: 16, borderRadius: "50%",
            background: "#EA4E0D", color: "white",
            fontSize: "0.6rem", fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
      {dropdown}
    </div>
  );
}
