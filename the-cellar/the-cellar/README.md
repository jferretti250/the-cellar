# The Cellar — free sommelier study app

The full Cellar app (Wine, CMS, Spirits and Sake: 1,285 flashcards, quiz mode, practice exams,
maps, aroma wheels, blind tasting grids, tasting guides, journal and custom cards), now free:
no paywall, no accounts, no Supabase, no Stripe, no paid AI service.
Everything a user does is saved in their own browser.

## Updating the live site
Your GitHub repo `the-cellar` already has a folder called `the-cellar`, and Vercel's Root Directory points to it.
1. On GitHub, open the repo and click into the **the-cellar** folder.
2. Click **Add file → Upload files**.
3. Unzip this download, open the `the-cellar` folder, select everything inside it and drag it onto the page.
   Files with the same name are replaced.
4. Click **Commit changes**. Vercel rebuilds and publishes automatically in a minute or two.

## What changed from the paid version
- **Paywall removed**: the app opens straight away for everyone.
- **Apple sign-in and cloud sync removed.** Progress, spaced-repetition data, streak, journal and custom cards
  are saved in the browser. The main card progress used to be saved only to the cloud; it's now saved locally too.
- **Backup instead of sync**: Progress → *Download backup* / *Restore backup* lets people move their data between devices.
- **Quiz Mode** builds its multiple-choice options from your own cards (similar cards from the same category)
  instead of calling a paid AI service, so it costs nothing to run. Answer options are longer and no longer cut off mid-word.
- **Disclaimer footer**: independent study aid, not affiliated with WSET or the CMS.
- **Installable**: "Add to Home Screen" on phones, and works offline after the first visit.
- Fixed a duplicated Back button on the Progress screen.

The card content itself is unchanged from your live app.

## Editing content later
All cards and app code are in `src/App.jsx`. On GitHub, open it, click the ✏️ pencil, edit, and commit.

## Running it on your own computer (optional)
Requires Node.js. In the folder: `npm install`, then `npm run dev`.
