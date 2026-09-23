# NOUN Tracker

A free, mobile-friendly web app for organizing your National Open University of Nigeria (NOUN) course materials. Keep your courses, lecturer names, and weekly documents in one place, and open them from your phone or laptop.

It runs on Google Apps Script. Your files are stored in your own Google Drive and your course details in your own Google Sheet, so it costs nothing and needs no server or credit card.

## Features

- Organized by level (200, 300, 400) and semester (1st, 2nd)
- Add courses with a code, title, and lecturer name
- Six weekly slots per course, matching the NOUN course layout
- Upload documents to any week (PDF, DOCX, slides, and more), several at once
- Tap a file to open it in Drive and read it on any device
- Progress strip on each course showing which weeks have files
- Works on phone and laptop, with automatic light and dark mode
- Private by design: each person who signs in gets their own tracker and their own Drive folders

## How it works

| Part | Where it lives |
|---|---|
| Web page | `Index.html`, served by Apps Script |
| Backend logic | `Code.gs`, running on Google's servers |
| Course and file records | A Google Sheet called **NOUN Tracker Data**, created automatically on first use |
| Uploaded files | Drive folders: `NOUN / 200 Level / 1st Semester / COURSE CODE` |

Uploaded files are renamed like `ECN211_Week1_notes.pdf` so they stay easy to find.

## Setup

1. Go to [script.google.com](https://script.google.com) and create a **New project**.
2. Replace the default code with the contents of `Code.gs`.
3. Click **+** next to *Files*, choose **HTML**, name it exactly `Index` (capital I, no extension), and paste in the contents of `Index.html`.
4. Click **Deploy > New deployment > Web app**.
   - **Execute as:** User accessing the web app
   - **Who has access:** Anyone with Google account (or *Only myself* if it is just for you)
5. Click **Deploy** and approve the permissions. Google shows an "unverified app" warning for personal scripts. Click **Advanced > Go to (your project) > Allow**.
6. Open the web app link on your phone and laptop, signed in with the same Google account.

Tip: on your phone, use your browser's **Add to Home screen** so it opens like an app.

## Updating

After changing the code, publish it with **Deploy > Manage deployments > pencil icon > New version > Deploy**. This keeps the same link. Clicking *New deployment* creates a new link instead.

Your data is not affected by code updates. Do not rename or delete the **NOUN Tracker Data** sheet, its `Courses` and `Files` tabs, or the `NOUN` folder in Drive.

## Sharing

Set the deployment to *Execute as: User accessing the web app* and *Anyone with Google account*. Each person then gets a private tracker. Do not use *Execute as: Me* with public access, because everyone would share your data and uploads would land in your Drive.

## Limits

- Files up to about 25 MB can be uploaded through the page. Larger files can be added to Drive directly.
- Six weeks per course.
- Deleting a course removes it from the tracker only. Its files stay in Drive. Deleting a file moves it to the Drive trash.
- Subject to Google Apps Script daily quotas, which are far above normal student use.

## Project structure

```
noun-tracker/
├── Code.gs      Backend: Drive folders, Sheet database, upload handling
├── Index.html   Front end: layout, styles, and interactions
└── README.md
```

## Disclaimer

This is an independent student project. It is not affiliated with or endorsed by the National Open University of Nigeria.
