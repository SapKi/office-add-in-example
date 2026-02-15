import React, { useCallback, useState } from "react";
import AddUsersByEmail from "./AddUsersByEmail";
import type { UserRow } from "./types";
import {
  IconHome,
  IconInvoices,
  IconContracts,
  IconCompliance,
  IconLegalAgent,
  IconLegalCenter,
  IconSettings,
} from "./components/SidebarIcons";

const SIDEBAR_STYLE: React.CSSProperties = {
  width: "240px",
  minHeight: "100vh",
  backgroundColor: "#fff",
  borderRight: "1px solid #e5e7eb",
  padding: "16px 0",
};

const initialUsers: UserRow[] = [
  {
    id: "1",
    userName: "Brooklyn Simmons",
    email: "email@example.long.com",
    status: "Active",
    addedOn: "July 10, 2023",
    role: "Admin",
  },
  {
    id: "2",
    userName: "Jane Doe",
    email: "jane@example.com",
    status: "Active",
    addedOn: "Aug 1, 2023",
    role: "Member",
  },
];

function formatAddedOn(): string {
  const d = new Date();
  const months = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function generateUserId(): string {
  return "u-" + Math.random().toString(36).slice(2, 11);
}

/**
 * Full Settings / Users page: sidebar, tabs, user table, and email input area.
 * Renders the AddUsersByEmail component and demonstrates parent ↔ child communication.
 */
const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"Users" | "Nav Item">("Users");
  const [users, setUsers] = useState<UserRow[]>(initialUsers);

  const handleEmailsChange = useCallback((_emails: string[]) => {}, []);

  const handleSubmit = useCallback((emails: string[]) => {
    const addedOn = formatAddedOn();
    const newRows: UserRow[] = emails.map((email) => ({
      id: generateUserId(),
      userName: email,
      email,
      status: "Active",
      addedOn,
      role: "Member",
    }));
    setUsers((prev) => [...prev, ...newRows]);
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      {/* Sidebar */}
      <aside style={SIDEBAR_STYLE}>
        <div style={{ padding: "0 20px 16px", fontSize: "18px", fontWeight: 600, color: "#111" }}>
          chamelio
        </div>
        <nav className="sidebar-nav-wrap">
          <button type="button" className="sidebar-nav-btn">
            <IconHome />
            <span>Home</span>
          </button>
          <button type="button" className="sidebar-nav-btn">
            <IconInvoices />
            <span>Invoices</span>
          </button>
          <button type="button" className="sidebar-nav-btn">
            <IconContracts />
            <span>Contracts</span>
          </button>
          <div className="sidebar-nav-sub-group">
            <button type="button" className="sidebar-nav-btn sidebar-nav-sub">Contracts Repository</button>
            <button type="button" className="sidebar-nav-btn sidebar-nav-sub">Insights</button>
            <button type="button" className="sidebar-nav-btn sidebar-nav-sub" data-sub-active="true">
              Playbooks
            </button>
          </div>
          <button type="button" className="sidebar-nav-btn">
            <IconCompliance />
            <span>Compliance</span>
          </button>
          <button type="button" className="sidebar-nav-btn">
            <IconLegalAgent />
            <span>Legal Agent</span>
          </button>
          <button type="button" className="sidebar-nav-btn">
            <IconLegalCenter />
            <span>Legal Center</span>
          </button>
          <button type="button" className="sidebar-nav-btn" data-primary-active="true">
            <IconSettings />
            <span>Settings</span>
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: "24px" }}>
        <div style={{ marginBottom: "8px", fontSize: "13px", color: "#6b7280" }}>
          Contracts &gt; Playbooks &gt; Master Service Agreement V1
        </div>
        <h1 style={{ margin: "0 0 20px", fontSize: "24px", fontWeight: 600, color: "#111" }}>
          Settings
        </h1>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "24px", borderBottom: "1px solid #e5e7eb" }}>
          <button
            type="button"
            onClick={() => setActiveTab("Users")}
            style={{
              padding: "10px 16px",
              border: "none",
              borderBottom: activeTab === "Users" ? "2px solid #2563eb" : "2px solid transparent",
              background: "none",
              fontSize: "14px",
              fontWeight: 500,
              color: activeTab === "Users" ? "#2563eb" : "#6b7280",
              cursor: "pointer",
            }}
          >
            Users
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("Nav Item")}
            style={{
              padding: "10px 16px",
              border: "none",
              borderBottom: activeTab === "Nav Item" ? "2px solid #2563eb" : "2px solid transparent",
              background: "none",
              fontSize: "14px",
              fontWeight: 500,
              color: activeTab === "Nav Item" ? "#2563eb" : "#6b7280",
              cursor: "pointer",
            }}
          >
            Nav Item
          </button>
        </div>

        {activeTab === "Users" && (
          <>
            {/* User table - scroll after 6 rows */}
            <div
              style={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                marginBottom: "24px",
                maxHeight: "340px",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <thead style={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "#f9fafb", boxShadow: "0 1px 0 0 #e5e7eb" }}>
                  <tr style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 500, color: "#374151" }}>
                      User Name
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 500, color: "#374151" }}>
                      Email
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 500, color: "#374151" }}>
                      Status
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 500, color: "#374151" }}>
                      Added On
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 500, color: "#374151" }}>
                      Role
                    </th>
                    <th style={{ padding: "12px 16px", width: 48 }} />
                  </tr>
                </thead>
                <tbody>
                  {users.map((row) => (
                    <tr key={row.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "12px 16px", color: "#111" }}>{row.userName}</td>
                      <td style={{ padding: "12px 16px", color: "#6b7280" }}>{row.email}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: "4px",
                            backgroundColor: row.status === "Active" ? "#d1fae5" : "#e5e7eb",
                            color: row.status === "Active" ? "#065f46" : "#6b7280",
                            fontSize: "12px",
                            fontWeight: 500,
                          }}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", color: "#6b7280" }}>{row.addedOn}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <select
                          defaultValue={row.role}
                          style={{
                            padding: "4px 8px",
                            border: "1px solid #d1d5db",
                            borderRadius: "4px",
                            fontSize: "13px",
                          }}
                        >
                          <option value="Admin">Admin</option>
                          <option value="Member">Member</option>
                          <option value="Viewer">Viewer</option>
                        </select>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <button
                          type="button"
                          aria-label={`Delete ${row.userName}`}
                          onClick={() => setUsers((prev) => prev.filter((u) => u.id !== row.id))}
                          style={{
                            padding: 6,
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                            color: "#6b7280",
                            borderRadius: "6px",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#f3f4f6";
                            e.currentTarget.style.color = "#374151";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.color = "#6b7280";
                          }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Email input area - the AddUsersByEmail component */}
            <div style={{ backgroundColor: "#fff", padding: "16px", border: "1px solid #e5e7eb", borderRadius: "8px" }}>
              <AddUsersByEmail
              existingEmails={users.map((u) => u.email)}
              onEmailsChange={handleEmailsChange}
              onSubmit={handleSubmit}
            />
            </div>
          </>
        )}

        {activeTab === "Nav Item" && (
          <div style={{ padding: "24px", color: "#6b7280" }}>Nav Item content (placeholder)</div>
        )}
      </main>
    </div>
  );
};

export default SettingsPage;
