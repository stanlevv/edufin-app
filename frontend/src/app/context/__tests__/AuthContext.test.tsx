import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import React from "react";

// Mock component to test AuthContext
function AuthConsumer() {
  const { user, isAuthenticated, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="auth-status">{isAuthenticated ? "logged-in" : "logged-out"}</span>
      <span data-testid="user-name">{user?.name || "no-user"}</span>
      <span data-testid="user-role">{user?.role || "no-role"}</span>
      <button data-testid="login-btn" onClick={() => login("siswa@edufin.id", "demo123")}>Login</button>
      <button data-testid="logout-btn" onClick={logout}>Logout</button>
    </div>
  );
}

function renderWithAuth(ui: React.ReactElement) {
  return render(<MemoryRouter><AuthProvider>{ui}</AuthProvider></MemoryRouter>);
}

describe("AuthContext", () => {
  it("starts logged out", () => {
    renderWithAuth(<AuthConsumer />);
    expect(screen.getByTestId("auth-status").textContent).toBe("logged-out");
    expect(screen.getByTestId("user-name").textContent).toBe("no-user");
  });

  it("logs in with demo siswa account", async () => {
    renderWithAuth(<AuthConsumer />);
    fireEvent.click(screen.getByTestId("login-btn"));
    await waitFor(() => {
      expect(screen.getByTestId("auth-status").textContent).toBe("logged-in");
    });
    expect(screen.getByTestId("user-role").textContent).toBe("siswa");
  });

  it("logs out correctly", async () => {
    renderWithAuth(<AuthConsumer />);
    fireEvent.click(screen.getByTestId("login-btn"));
    await waitFor(() => {
      expect(screen.getByTestId("auth-status").textContent).toBe("logged-in");
    });
    fireEvent.click(screen.getByTestId("logout-btn"));
    expect(screen.getByTestId("auth-status").textContent).toBe("logged-out");
  });

  it("returns correct role after login", async () => {
    renderWithAuth(<AuthConsumer />);
    fireEvent.click(screen.getByTestId("login-btn"));
    await waitFor(() => {
      expect(screen.getByTestId("user-role").textContent).toBe("siswa");
    });
  });
});

describe("formatRupiah utility (inline test)", () => {
  function formatRupiah(n: number) {
    return "Rp " + n.toLocaleString("id-ID");
  }
  it("formats 500000 correctly", () => {
    expect(formatRupiah(500000)).toBe("Rp 500.000");
  });
  it("formats 0 correctly", () => {
    expect(formatRupiah(0)).toBe("Rp 0");
  });
  it("formats 1500000 correctly", () => {
    expect(formatRupiah(1500000)).toBe("Rp 1.500.000");
  });
});