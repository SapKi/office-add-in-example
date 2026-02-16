# How to Clear Add-in Cache and Remove Debug Dialog

The "Debug Event-based handler" dialog appears because Office cached the old add-in with event handlers. Follow these steps:

## Step 1: Remove the Add-in from Word

1. Open Word
2. Go to **File** → **Options** → **Trust Center** → **Trust Center Settings** → **Trusted Add-in Catalogs**
3. Or go to **Insert** → **Add-ins** → **My Add-ins**
4. Find your add-in and click **Remove** or **Delete**

## Step 2: Clear Office Cache

1. Close Word completely
2. Press `Win + R` to open Run dialog
3. Type: `%LOCALAPPDATA%\Microsoft\Office\16.0\Wef\`
4. Delete all folders/files in that directory (or just the folder with your add-in ID: `a52edf4e-84f0-4e90-8cca-abcabcabcabc`)

## Step 3: Rebuild and Reload

1. Rebuild the add-in:
   ```bash
   npm run build:dev
   ```

2. Reload the add-in:
   ```bash
   npm run start:desktop
   ```

3. The dialog should no longer appear since event handlers are removed.

---

## Alternative: Click Cancel Once

If you don't want to clear cache, just **click "Cancel" (ביטול)** once when the dialog appears. According to the dialog message, clicking Cancel will prevent it from appearing again.

---

## What Was Changed

- ✅ Removed `Office.actions.associate()` from `commands.ts` (commented out)
- ✅ Removed `commands` entry from webpack.config.js
- ✅ Removed `FunctionFile` reference from manifest.xml
- ✅ Removed old `commands.js` files from dist folder

The add-in no longer registers any event handlers, so the dialog shouldn't appear after clearing cache or clicking Cancel once.
