# How to Push Your Project to GitHub: A Step-by-Step Guide

This guide covers everything you need to know to initialize, upload, and maintain your project on GitHub using Git.

---

## Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [First-Time Git Configuration](#2-first-time-git-configuration)
3. [Preparing Your Project (.gitignore)](#3-preparing-your-project-gitignore)
4. [Pushing a New Local Project to GitHub](#4-pushing-a-new-local-project-to-github)
5. [Daily Workflow: Updating Your Code](#5-daily-workflow-updating-your-code)
6. [Deploying to Vercel](#6-deploying-to-vercel)
7. [Best Practices & Security Tips](#7-best-practices--security-tips)
8. [Useful Git Commands Cheatsheet](#8-useful-git-commands-cheatsheet)

---

## 1. Prerequisites

Before getting started, make sure you have:
1. **Git installed**: Check by running:
   ```bash
   git --version
   ```
2. **A GitHub Account**: Sign up at [github.com](https://github.com/).
3. **Repository URL**:
   `https://github.com/poatelol-afk/FeedMe.git`

---

## 2. First-Time Git Configuration

Configure your name and email:
```bash
git config --global user.name "poatelol-afk"
git config --global user.email "poatelol@gmail.com"
```

---

## 3. Pushing a New Local Project to GitHub

```bash
# Initialize local Git repository
git init -b main

# Stage all files
git add .

# Create initial commit
git commit -m "feat: initial commit with FeedMe ecosystem"

# Add remote repository
git remote add origin https://github.com/poatelol-afk/FeedMe.git

# Push to GitHub
git push -u origin main
```

---

## 4. Daily Workflow: Updating Your Code

```bash
# Check modified files
git status

# Stage changes
git add .

# Commit with a descriptive message
git commit -m "feat: description of changes"

# Push to GitHub
git push
```

---

## 5. Deploying to Vercel

### Method 1: Import via Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com/) and log in with GitHub.
2. Click **"Add New..."** > **"Project"**.
3. Import the `FeedMe` repository (`https://github.com/poatelol-afk/FeedMe`).
4. **Root Directory**: Select `feedme-website`.
5. Framework Preset: **Next.js**.
6. Click **Deploy**.
7. Every future `git push` to `main` will automatically trigger a new deployment.

### Method 2: Deploy via Vercel CLI
```bash
cd feedme-website
npx vercel
# For production:
npx vercel --prod
```
