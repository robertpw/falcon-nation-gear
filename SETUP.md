# Falcon Nation Gear — setup

You (Preston) create and own the Sheet and the backend. Jen just gets a
normal "shared with you" Google Sheet at the end — no Apps Script, no
GitHub, nothing technical for her to touch.

## 1. Create the order sheet

1. Go to sheets.new. Name it something like "Falcon Nation Gear Orders".
2. Grab the Sheet ID from its URL — the long string between `/d/` and
   `/edit`:
   `https://docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit`

## 2. Deploy the backend

1. In that same Sheet, go to Extensions → Apps Script. Delete any starter
   code in the editor.
2. Open `apps-script/Code.gs` from this folder, copy all of it, and paste
   it into the Apps Script editor. Save (disk icon or Cmd+S).
3. Replace `PASTE_JENS_SHEET_ID_HERE` near the top with the Sheet ID from
   step 1.2. (It'll be the same sheet the script is sitting in, but
   `openById` doesn't care — this way the code works unchanged if you ever
   move it to a standalone script later.)
4. In the function dropdown at the top of the editor, select `setup`,
   click Run. First time, it'll ask you to authorize — approve it. This
   creates the "Orders" and "Line Items" tabs with headers and a Paid
   checkbox column.
5. Deploy → New deployment → gear icon → **Web app**. Set:
   - Execute as: **Me**
   - Who has access: **Anyone**
   Deploy, authorize again if asked, and copy the **Web app URL**
   (ends in `/exec`).

## 3. Point the order form at the backend

1. Open `index.html` in a text editor.
2. Find `CONFIG.scriptUrl` near the top of the `<script>` block (search
   `REPLACE_WITH_APPS_SCRIPT_WEB_APP_URL`) and paste in the Web app URL
   from step 2.5.
3. Double-check `CONFIG.venmoHandle` (`SkyridgeFootball2032`) and
   `CONFIG.orderDeadline` (`2026-08-21`) are right.

## 4. Host it — GitHub Pages

Create a repo (public is fine — nothing in this page is sensitive; the
Apps Script URL being visible in the page source is normal for this kind
of no-login setup and isn't a real risk for a 20-family team order), push
`index.html` to it, then in the repo's **Settings → Pages**, set the
source to your main branch. GitHub gives you a
`https://<you>.github.io/<repo>/` URL within a minute or two — that's the
link to text/email to parents.

Updating later is just a normal `git push` — no re-uploading required.

(If you'd rather skip git entirely, netlify.com/drop lets you drag the
single `index.html` file in and get a URL in seconds, no account needed —
but then updates mean dragging the file in again each time.)

## 5. Test before sending it out

Place one real test order through the live page. Confirm:
- A row lands in the **Orders** tab of the sheet, and matching rows in
  **Line Items**.
- The confirmation screen's "Pay with Venmo" button opens Venmo (test on
  your phone) with the amount and note pre-filled.
- Delete your test row from the sheet afterward.

## 6. Share the sheet with Jen

Open the Sheet, click **Share**, add Jen's Google account as **Editor**
(so she can check the Paid boxes). That's it — she never needs anything
else.

## How Jen uses it day-to-day

She only ever opens the Sheet. In the **Orders** tab, she checks the
**Paid** box once a Venmo payment comes in (the note on each payment
reads "Falcon Nation Gear - [Last Name]" so it's easy to match to a row).
The **Line Items** tab is what she hands to the printer or uses to tally
total quantities per size/color.

## Changing products or prices later

Edit the `PRODUCTS` array near the top of the `<script>` block in
`index.html`, then push the updated file to GitHub (Pages picks it up
automatically) or re-drag it to Netlify.
