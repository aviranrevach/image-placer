```
  ___                            ____  _
 |_ _|_ __ ___   __ _  __ _  ___|  _ \| | __ _  ___ ___ _ __
  | || '_ ` _ \ / _` |/ _` |/ _ \ |_) | |/ _` |/ __/ _ \ '__|
  | || | | | | | (_| | (_| |  __/  __/| | (_| | (_|  __/ |
 |___|_| |_| |_|\__,_|\__, |\___|_|   |_|\__,_|\___\___|_|
                       |___/
```

# Image Placer

A Google Sheets add-on that lets you insert images into multiple cells at once — something Google Sheets doesn't support natively.

## Features

- **Batch insert** — select multiple cells, pick images, one click to fill them all
- **Live sync** — cell range auto-updates as you select cells in the sheet
- **3 image sources:**
  - **Drive** — browse and search your Google Drive images with thumbnail grid
  - **Upload** — drag-and-drop or browse local files (auto-uploaded to Drive)
  - **URL** — paste any public image URL
- **Numbered selection** — green badges show the order images will be placed
- **Sidebar UI** — clean, Material-style panel that stays open while you work

## How It Works

```
 1. Select cells    ──→  Range auto-syncs to sidebar
 2. Pick images     ──→  Click thumbnails from Drive / Upload / URL
 3. Insert Images   ──→  Each cell gets =IMAGE("url")
```

Uploaded files are saved to an `ImageSetPlace_Uploads` folder in your Drive. All images are made publicly viewable so the `=IMAGE()` formula can render them.

## Installation

### Manual Setup
1. Open a Google Sheet
2. Go to **Extensions → Apps Script**
3. Create the following files and paste the code from this repo:
   - `Code.gs`
   - `DriveUploader.gs`
   - `Sidebar.html`
4. Open **Project Settings** (gear icon) → enable **Show 'appsscript.json' manifest file in editor**
5. Replace `appsscript.json` contents with the one from this repo
6. Save all files and reload the Google Sheet
7. Grant permissions when prompted

### Using clasp
```bash
npm install -g @google/clasp
clasp login
clasp create --type sheets --title "Image Placer"
clasp push
clasp open
```

## Usage

1. Click **Image Placer → Open Sidebar** in the menu bar
2. Select cells in your sheet — the range auto-fills in the sidebar
3. Pick images from the Drive grid (or use Upload / URL tabs)
4. Click **Insert Images**

Uncheck **"Live sync with sheet"** if you want to type a range manually.

## Project Structure

| File | Description |
|---|---|
| `Code.gs` | Menu, sidebar, cell range parsing, Drive image search, `=IMAGE()` insertion |
| `DriveUploader.gs` | Local file upload to Google Drive with public sharing |
| `Sidebar.html` | Complete sidebar UI — HTML, CSS, and JavaScript in one file |
| `appsscript.json` | Apps Script manifest with required OAuth scopes |

## Required Permissions

| Scope | Reason |
|---|---|
| `spreadsheets.currentonly` | Read selected cells and write `=IMAGE()` formulas |
| `drive.file` | Upload images to Google Drive |
| `drive.readonly` | Browse existing Drive images |
| `script.container.ui` | Display the sidebar |

## License

MIT
