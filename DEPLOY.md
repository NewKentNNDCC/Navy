# NKHS NJROTC — GitHub + Cloudflare Deployment Guide

## How it works
- Code lives in a GitHub repository
- Every time you push a change to GitHub, it automatically deploys to Cloudflare
- No command line needed after initial setup

## Your repo structure
  njrotc/                          ← your GitHub repository
    worker.js                      ← Worker code (API + asset serving)
    wrangler.toml                  ← Cloudflare config (KV ID already set)
    public/
      index.html                   ← The full app
    .github/
      workflows/
        deploy.yml                 ← Auto-deploy on every git push

---

## ONE-TIME SETUP

### STEP 1 — Create a GitHub account
Go to https://github.com and sign up (free).

### STEP 2 — Create a new repository
1. Click the + button → New repository
2. Name it: njrotc  (or anything you like)
3. Set it to Private
4. Click Create repository

### STEP 3 — Upload these files to GitHub
1. In your new repo click "uploading an existing file"
2. Upload ALL files maintaining the folder structure:
   - worker.js  (drag in directly)
   - wrangler.toml  (drag in directly)
   - public/index.html  (create public folder first)
   - .github/workflows/deploy.yml  (create folders first)
3. Click "Commit changes"

  TIP: To create a folder when uploading, type the folder name
  followed by / in the filename field, e.g. "public/index.html"

### STEP 4 — Get your Cloudflare API token
1. Go to dash.cloudflare.com → My Profile (top right) → API Tokens
2. Click Create Token
3. Select the "Edit Cloudflare Workers" template
4. Click Continue to summary → Create Token
5. COPY the token — you only see it once

### STEP 5 — Get your Cloudflare Account ID
1. Go to dash.cloudflare.com
2. Click Workers & Pages in the left sidebar
3. Your Account ID is shown on the right side of the page
4. Copy it

### STEP 6 — Add secrets to GitHub
1. In your GitHub repo → Settings → Secrets and variables → Actions
2. Click New repository secret
3. Add this secret:
   Name:  CLOUDFLARE_API_TOKEN
   Value: (paste the token from Step 4)
4. Click Add secret
5. Add another secret:
   Name:  CLOUDFLARE_ACCOUNT_ID
   Value: (paste the account ID from Step 5)
6. Click Add secret

### STEP 7 — Add KV binding in Cloudflare dashboard
After your first deploy completes (check Actions tab in GitHub):
1. Go to dash.cloudflare.com → Workers & Pages → njrotc
2. Click Settings → Bindings
3. Click Add binding → KV Namespace
4. Variable name: NJROTC_KV
5. Select your KV namespace from the dropdown
6. Click Save

---

## YOUR SITE IS LIVE
URL: https://njrotc.YOUR-SUBDOMAIN.workers.dev
(shown in the GitHub Actions log after first deploy)

---

## UPDATING THE APP IN FUTURE
When you get a new version of the HTML file:
1. Go to your GitHub repo → public → index.html
2. Click the pencil (edit) icon
3. Select all text, delete it, paste in the new file contents
4. Click Commit changes
5. GitHub automatically deploys — live in about 30 seconds

OR simply drag and drop the new index.html file onto the
public/ folder in GitHub and commit.

---

## Optional — Custom domain (e.g. nkhs-njrotc.com)
1. Buy domain from Namecheap (~$10/year)
2. Go to Cloudflare → Workers & Pages → njrotc → Settings → Domains & Routes
3. Click Add → Custom Domain
4. Enter your domain and follow the instructions
Cloudflare handles SSL automatically.

---

## If something goes wrong
- Check the Actions tab in your GitHub repo to see deploy logs
- Make sure both secrets are set correctly (Step 6)
- Make sure the KV binding is added (Step 7)
- Token in worker.js and index.html must both be: 1234567890
