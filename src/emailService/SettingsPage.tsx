import React, { useCallback, useState } from "react";
import AddUsersByEmail from "./AddUsersByEmail";
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

const DUMMY_USERS = [
  {
    id: "1",
    userName: "Brooklyn Simmons",
    email: "email@example.long.com",
    status: "Active" as const,
    addedOn: "July 10, 2023",
    role: "Admin" as const,
  },
  {
    id: "2",
    userName: "Jane Doe",
    email: "jane@example.com",
    status: "Active" as const,
    addedOn: "Aug 1, 2023",
    role: "Member" as const,
  },
];

/**
 * Full Settings / Users page: sidebar, tabs, user table, and email input area.
 * Renders the AddUsersByEmail component and demonstrates parent ↔ child communication.
 */
const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"Users" | "Nav Item">("Users");
  const [lastAddedEmails, setLastAddedEmails] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const handleEmailsChange = useCallback((emails: string[]) => {
    setLastAddedEmails(emails);
  }, []);

  const handleSubmit = useCallback((emails: string[]) => {
    console.log("Add users submit:", emails);
    setToast("Users / User Added successfully toast");
    setTimeout(() => setToast(null), 3000);
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
        {toast && (
          <div
            style={{
              position: "fixed",
              top: 16,
              left: 256,
              padding: "12px 20px",
              backgroundColor: "#111",
              color: "#fff",
              borderRadius: "8px",
              fontSize: "14px",
              zIndex: 100,
            }}
          >
            {toast}
          </div>
        )}

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
            {/* User table */}
            <div
              style={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                overflow: "hidden",
                marginBottom: "24px",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <thead>
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
                  {DUMMY_USERS.map((row) => (
                    <tr key={row.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "12px 16px", color: "#111" }}>{row.userName}</td>
                      <td style={{ padding: "12px 16px", color: "#6b7280" }}>{row.email}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            padding: "2px 8px",
                            borderRadius: "999px",
                            backgroundColor: "#d1fae5",
                            color: "#065f46",
                            fontSize: "12px",
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
                          aria-label="Delete user"
                          style={{
                            padding: 4,
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                            color: "#6b7280",
                          }}
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Email input area - the AddUsersByEmail component */}
            <div style={{ backgroundColor: "#fff", padding: "16px", border: "1px solid #e5e7eb", borderRadius: "8px" }}>
              <AddUsersByEmail onEmailsChange={handleEmailsChange} onSubmit={handleSubmit} />
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
