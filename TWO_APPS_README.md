# Two Separate Apps

This folder (**office add-in-example**) contains only the **Word Search Add-in**.

The **Email Service App** is a separate app in a different folder.

---

## 1. Word Search Add-in (this folder)

- **Entry file:** `src/taskpane/index.tsx` → renders Search only
- **Run:** From this folder:
  ```bash
  npm run dev-server
  npm run start:desktop
  ```
- **URL:** https://localhost:3000 (inside Word task pane)

---

## 2. Email Service App (different folder)

- **Location:** `c:\Users\sapir\Desktop\Chamelio\email-service-app\`
- **Entry file:** `email-service-app/src/index.tsx` → renders SettingsPage (email service UI)
- **Run:** Open a terminal and run:
  ```bash
  cd "c:\Users\sapir\Desktop\Chamelio\email-service-app"
  npm start
  ```
- **Then:** Open your browser at **http://localhost:3001** (server does not auto-open to avoid Node 16 crash)
- **URL:** http://localhost:3001

---

## Summary

| App              | Folder                    | Entry (index)           | Command      | URL              |
|------------------|---------------------------|-------------------------|-------------|------------------|
| Word Search      | office add-in-example     | src/taskpane/index.tsx  | npm run start:desktop | localhost:3000 (in Word) |
| Email Service    | Chamelio/email-service-app | src/index.tsx           | npm start   | http://localhost:3001 |

You have to **cd into email-service-app** to run the email app; it is not inside office add-in-example.
