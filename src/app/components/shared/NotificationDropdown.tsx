import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
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
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  };

  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClose = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener("scroll", updatePosition, true);
    document.addEventListener("mousedown", handleClose);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      document.removeEventListener("mousedown", handleClose);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  const isDark = variant === "dark";

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full flex items-center justify-center relative transition-all active:scale-90"
        style={{ background: isDark ? "rgba(255,255,255,0.2)" : "#F5F5F5" }}
      >
        <Bell size={19} color={isDark ? "white" : "#595959"} />
        {unreadCount > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white flex items-center justify-center"
            style={{ background: "#EA4E0D", fontSize: "0.6rem", fontWeight: 700 }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[9998]" onClick={() => setIsOpen(false)} />

          <div
            ref={dropdownRef}
            className="fixed w-80 rounded-2xl z-[9999] overflow-hidden bg-white"
            style={{
              top: dropdownPos.top,
              right: dropdownPos.right,
              maxHeight: "400px",
              display: "flex",
              flexDirection: "column",
              border: "1px solid #F0F0F0",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            }}
          >
            <div className="px-4 py-3 flex-shrink-0 flex items-center justify-between"
              style={{ borderBottom: "1px solid #F0F0F0" }}>
              <p style={{ fontWeight: 700, color: "#242424", fontSize: "0.9rem" }}>Notifikasi</p>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: "#EEF4FF", color: "#1677FF" }}>
                  {unreadCount} baru
                </span>
              )}
            </div>

            <div className="overflow-y-auto"
              style={{ flex: 1, scrollbarWidth: "thin", scrollbarColor: "#D9D9D9 transparent" }}>
              {notifications.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <Bell size={32} color="#D9D9D9" className="mx-auto mb-2" />
                  <p style={{ fontSize: "0.82rem", color: "#8C8C8C" }}>Tidak ada notifikasi</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className="px-4 py-3 flex gap-3 cursor-pointer transition-colors"
                    style={{ background: n.unread ? "#EEF4FF" : "white", borderBottom: "1px solid #F8F8F8" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F7FA")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = n.unread ? "#EEF4FF" : "white")}
                    onClick={() => { onNotificationClick?.(n.id); }}
                  >
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                      style={{ background: n.unread ? "#1677FF" : "#D9D9D9" }} />
                    <div className="flex-1">
                      <p style={{ fontSize: "0.82rem", color: "#242424", lineHeight: 1.4 }}>{n.text}</p>
                      <p style={{ fontSize: "0.72rem", color: "#8C8C8C", marginTop: "4px" }}>{n.time}</p>
                    </div>
                    {n.unread && (
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2"
                        style={{ background: "#1677FF" }} />
                    )}
                  </div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div
                className="px-4 py-2.5 text-center cursor-pointer flex-shrink-0 transition-colors hover:bg-gray-50"
                style={{ borderTop: "1px solid #F0F0F0" }}
                onClick={() => setIsOpen(false)}
              >
                <p style={{ fontSize: "0.75rem", color: "#1677FF", fontWeight: 600 }}>
                  Lihat Semua Notifikasi
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
