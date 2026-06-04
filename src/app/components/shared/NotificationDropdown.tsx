import React, { useState, useEffect, useRef } from "react";
import { Bell, CheckCircle } from "lucide-react";

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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleScroll = (e: Event) => {
      // Check if scroll is happening inside the dropdown
      if (dropdownRef.current && dropdownRef.current.contains(e.target as Node)) {
        // Scrolling inside dropdown - do nothing, let it scroll naturally
        return;
      }

      // Scrolling outside dropdown - close it
      setIsOpen(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    // Add scroll listener to window and all scrollable parents
    window.addEventListener("scroll", handleScroll, true);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleNotificationClick = (id: string | number) => {
    if (onNotificationClick) {
      onNotificationClick(id);
    }
  };

  const isDark = variant === "dark";

  return (
    <div className="relative z-[9999]">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full flex items-center justify-center relative transition-all"
        style={{
          background: isDark ? "rgba(255,255,255,0.2)" : "#F5F5F5",
        }}
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
        <div
          ref={dropdownRef}
          className="absolute right-0 top-12 w-80 rounded-2xl shadow-2xl z-[10000] overflow-hidden bg-white"
          style={{
            maxHeight: "400px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header - Fixed */}
          <div className="px-4 py-3 flex-shrink-0" style={{ borderBottom: "1px solid #F0F0F0" }}>
            <p style={{ fontWeight: 700, color: "#242424", fontSize: "0.9rem" }}>Notifikasi</p>
          </div>

          {/* Scrollable Content */}
          <div
            className="overflow-y-auto"
            style={{
              flex: 1,
              scrollbarWidth: "thin",
              scrollbarColor: "#D9D9D9 transparent",
            }}
          >
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell size={32} color="#D9D9D9" className="mx-auto mb-2" />
                <p style={{ fontSize: "0.82rem", color: "#8C8C8C" }}>Tidak ada notifikasi</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="px-4 py-3 flex gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  style={{ background: n.unread ? "#EEF4FF" : "white" }}
                  onClick={() => handleNotificationClick(n.id)}
                >
                  <div
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                    style={{ background: n.unread ? "#1677FF" : "#D9D9D9" }}
                  />
                  <div className="flex-1">
                    <p style={{ fontSize: "0.82rem", color: "#242424", lineHeight: 1.4 }}>
                      {n.text}
                    </p>
                    <p style={{ fontSize: "0.72rem", color: "#8C8C8C", marginTop: "4px" }}>
                      {n.time}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer - Fixed (optional) */}
          {notifications.length > 0 && (
            <div
              className="px-4 py-2 text-center border-t cursor-pointer hover:bg-gray-50 transition-colors flex-shrink-0"
              style={{ borderTop: "1px solid #F0F0F0" }}
              onClick={() => {
                setIsOpen(false);
                // Navigate to notifications page if needed
              }}
            >
              <p style={{ fontSize: "0.75rem", color: "#1677FF", fontWeight: 600 }}>
                Lihat Semua Notifikasi
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
