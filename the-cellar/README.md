# The Cellar — free sommelier study app

A free, static version of The Cellar. No accounts, no database, no payments.
Study progress is saved in each visitor's own browser.

## Put it live on your existing Vercel site (about 10 minutes, no coding)

### 1. Upload the code to GitHub
1. Go to github.com → click **+** (top right) → **New repository**.
2. Name it `the-cellar`, leave everything else as is, click **Create repository**.
3. On the next page, click **uploading an existing file**.
4. Unzip `the-cellar.zip` on your computer, open the `the-cellar` folder, select **everything inside it**
   (`src`, `public`, `index.html`, `package.json`, etc.) and drag it onto the GitHub page.
5. Click **Commit changes**.

### 2. Connect it to your Vercel project
1. In Vercel, open your **cellar-study** project → **Settings → Git** → **Connect Git Repository**.
2. Choose **GitHub**, allow Vercel access to the `the-cellar` repo if asked, and select it.
3. Go to **Settings → Build and Deployment** (may be called "General" or "Build & Development Settings")
   and make sure it says:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Go to **Deployments** and click **Redeploy** on the newest one (or push any change to GitHub).
   Your site stays at **cellar-study.vercel.app**.

### 3. Clean up
- In Vercel → **Settings → Environment Variables**, delete any Supabase or Stripe keys. The new app doesn't use them.
- Check Vercel → **Settings → Billing**: you should be on the free **Hobby** plan.
- After the new version has been live for a few days with no problems, delete the Supabase project.

## Editing a flashcard later
All cards are in `src/data/cards.js`. On GitHub, open that file, click the ✏️ pencil icon,
make your change and click **Commit changes**. Vercel updates the live site automatically within a minute or two.

## What changed from the original
- **Progress is saved** in the browser (it used to reset on every refresh).
- **Installable**: on a phone, "Add to Home Screen" gives it an app icon, and it works offline.
- **Disclaimer footer**: independent study aid, not affiliated with WSET or the CMS.
- **Shuffle button** now actually reshuffles the deck.
- **Phone layout**: the flashcard no longer spills over the buttons; nav scrolls sideways; tables fit.
- **Content fixes**:
  - WSET L1 #1: grape colours are black and white (not red/white/rosé); removed an unrelated image link.
  - WSET L1 #6: rewritten; alcohol isn't a "taste".
  - WSET L4 #336: Chablis is Burgundy, not the Loire.
  - WSET L4 #340: typo "lyretraining" → "lyre training".
  - CMS Intro #404: the grid has four phases, not three.
  - CMS Certified #506: Muscadet is in the Pays Nantais, not Anjou-Saumur.
  - CMS Advanced #602: the Côte de Nuits Grand Cru list was incomplete and mislabeled as "all".
  - CMS Master #702: Côte d'Or Grand Crus sit on limestone and marl (Kimmeridgian is Chablis).
  - CMS Master #743: garbled Chambertin sentence rewritten.
  - Tasting guides: the CMS scoring weights were stated two different ways; they now match
    and are labeled as a study guide, not the official mark scheme.

## Running it on your own computer (optional)
Requires Node.js. In the folder: `npm install`, then `npm run dev`.
