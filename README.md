# Avisha Technologies (AvishaTech) — Official Website

High-performance, modern digital engineering website for **Avisha Technologies (AvishaTech)**.

---

## 🚀 How to Deploy on Netlify

This website is engineered with modern web standards and a modular multi-file architecture (`index.html`, `assets/css/styles.css`, `assets/js/*.js`, and `assets/images/*`).

### Option 1: Deploy with GitHub (Recommended & Automated)

1. Push your changes to your GitHub repository:
   ```bash
   git add .
   git commit -m "feat: upgrade UI design and vector brand logo system"
   git push origin master
   ```
2. Log in to [Netlify](https://app.netlify.com/).
3. Click **"Add new site"** > **"Import an existing project"**.
4. Choose **GitHub** and select your repository: `Awnish-sah/AvishTech`.
5. Netlify will automatically detect `netlify.toml`:
   - **Build command**: *(Leave blank)*
   - **Publish directory**: `.` *(Root)*
6. Click **"Deploy site"**. Your site is now live with an SSL certificate and global CDN! Every future `git push` will automatically build and deploy.

---

### Option 2: Netlify Drop (Instant Drag & Drop, No Git Needed)

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop the `AvishTech` folder directly into the browser window.
3. Your site will be live in 10 seconds!

---

### Option 3: Deploy via Netlify CLI

Run the following in PowerShell/terminal from this directory:
```bash
npx netlify deploy --prod --dir=.
```

---

## 📁 Project Structure

```
AvishTech/
├── index.html                    # Production homepage entry point
├── netlify.toml                  # Netlify CDN headers, security & caching config
├── package.json                  # Project metadata and local preview scripts
├── README.md                     # Deployment and documentation guide
└── assets/
    ├── css/
    │   └── styles.css            # Master stylesheet (dark obsidian theme, glassmorphism, responsive)
    ├── js/
    │   ├── main.js               # Nav transitions, scroll reveal, stats counter, process line
    │   ├── contact.js            # EmailJS form submission, validation & clipboard copy
    │   └── chat.js               # Instant virtual assistant chatbot with company knowledge base
    └── images/
        ├── logo.svg              # Full vector brand logo lockup (horizontal)
        ├── logo-mark.svg         # Precision vector geometric "A" brand emblem
        ├── favicon.svg           # Vector browser tab favicon
        └── projects/
            ├── rosy-store.jpg    # Rosy Shopping Store live platform preview
            ├── quickmandu.jpg    # QuickMandu home services live platform preview
            └── daily-janta.jpg   # Daily Janta News portal live platform preview
```

---

## 💻 Local Preview

To preview the website locally on your computer:
- **Method A**: Double-click `index.html` to open it in any web browser.
- **Method B (Local Server)**:
  ```bash
  npm start
  ```
  Then open `http://localhost:3000`.

---

## 🎨 Brand Identity

- **Name**: Avisha Technologies (AvishaTech)
- **Palette**:
  - Deep Obsidian (`#06090E`)
  - Cyan Neon (`#00F5D4`)
  - Teal (`#14B8A6`)
  - Electric Blue (`#2563EB` / `#38BDF8`)
- **Typography**:
  - Headings: `Space Grotesk`
  - Body: `Inter`
  - Tech / Code / Stats: `JetBrains Mono`

---

## 📞 Support & Inquiries
- **Email**: help.avishatech@outlook.com
- **Phone / WhatsApp**: +977 98652 72545
- **Location**: Kathmandu, Nepal

