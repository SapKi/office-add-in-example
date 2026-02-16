# How to Run the Word Add-in

## Step-by-Step Instructions

### Method 1: Automatic (Recommended)

**Step 1:** Start the dev server in one terminal:
```bash
cd "office add-in-example"
npm run dev-server
```

Wait until you see: `webpack compiled successfully`

**Step 2:** In another terminal, sideload the add-in:
```bash
cd "office add-in-example"
npm run start:desktop
```

**Step 3:** When Word opens:
1. Look at the **Home** tab in the ribbon
2. Find the **"Add-ins"** group (on the right side)
3. Click the **"Show Taskpane"** button
4. The task pane will open on the right side with the Search interface

### Method 2: Manual Sideload

If Method 1 doesn't work:

**Step 1:** Start the dev server:
```bash
npm run dev-server
```

**Step 2:** In Word:
1. Go to **Insert** → **Add-ins** → **My Add-ins**
2. Click **"Upload My Add-in"** (bottom left)
3. Select `manifest.xml` from the `office add-in-example` folder
4. Click **"Show Taskpane"** button in the Home tab → Add-ins group

## Troubleshooting

### Add-in button not visible?
- Make sure the dev server is running (`npm run dev-server`)
- Check that `manifest.xml` was loaded successfully
- Try restarting Word

### Task pane shows blank/error?
- Check browser console (F12) in Word
- Verify `https://localhost:3000/taskpane.html` loads in a browser
- Accept the HTTPS certificate if prompted

### "Show Taskpane" button doesn't work?
- Ensure the dev server is running on port 3000
- Check that the URL in manifest.xml matches: `https://localhost:3000/taskpane.html`
- Try reloading the add-in: Right-click the add-in → Reload

## Quick Check

1. ✅ Dev server running? → Check terminal for "webpack compiled successfully"
2. ✅ Word opened? → Should see Word window
3. ✅ Add-in loaded? → Check Home tab → Add-ins group → "Show Taskpane" button visible
4. ✅ Task pane open? → Click "Show Taskpane" button
