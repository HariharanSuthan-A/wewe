# Quick Deployment Guide

## 5-Minute Setup

### Step 1: Create Google OAuth Credentials (5 min)

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Enable **Gmail API**:
   - Search for "Gmail API"
   - Click "Enable"
4. Create OAuth 2.0 credentials:
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
   - Choose "Web application"
   - Add authorized redirect URI: `https://your-project.vercel.app/callback.html` (use a placeholder for now)
   - Click "Create"
5. Copy your **Client ID** and **Client Secret**

### Step 2: Deploy to Vercel (2 min)

#### Using GitHub (Recommended)

1. Push this project to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Click "Deploy"
6. Wait for deployment to complete

#### Using Vercel CLI

```bash
npm install -g vercel
cd project-root
vercel
```

### Step 3: Update Google OAuth Redirect URI (1 min)

1. After deployment, note your Vercel URL (e.g., `https://my-project.vercel.app`)
2. Go back to [Google Cloud Console](https://console.cloud.google.com/)
3. Update the OAuth redirect URI to: `https://my-project.vercel.app/callback.html`
4. Save changes

### Step 4: Test It! (2 min)

1. Open your Vercel URL
2. Enter your Client ID and Client Secret
3. Click "Open Google Consent Screen"
4. Authorize the app
5. Send a test email

## Troubleshooting

### "Redirect URI mismatch" error
- Make sure the redirect URI in Google Cloud Console exactly matches your Vercel URL + `/callback.html`
- No trailing slashes!

### "Invalid Client ID" error
- Copy the Client ID directly from Google Cloud Console
- Make sure it's the Web application credentials, not Desktop/Mobile

### "Token exchange failed" error
- Verify your Client Secret is correct
- Check that Gmail API is enabled in Google Cloud Console

### Email not sending
- Ensure you've completed the OAuth authorization flow
- Check that the recipient email is valid
- Verify Gmail API is enabled

## File Structure

```
project/
├── api/
│   ├── auth/
│   │   ├── generate-url.js       # OAuth URL generator
│   │   └── oauth-callback.js     # Token exchange
│   └── send-email.js             # Email sender
├── public/
│   ├── index.html                # Main page
│   ├── callback.html             # OAuth callback
│   └── gmail.js                  # Frontend logic
├── package.json                  # Dependencies
├── vercel.json                   # Vercel config
└── README.md                     # Full documentation
```

## Key Features

✅ User-provided Google credentials (no backend secrets)  
✅ Tokens stored in browser localStorage  
✅ Beautiful, responsive UI  
✅ Real-time status messages  
✅ Comprehensive error handling  
✅ Works out-of-the-box on Vercel  

## API Endpoints

- `GET /api/auth/generate-url` - Generate OAuth URL
- `POST /api/auth/oauth-callback` - Exchange code for tokens
- `POST /api/send-email` - Send email via Gmail API

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Update Google OAuth redirect URI
3. ✅ Test the OAuth flow
4. ✅ Send a test email
5. ✅ Share with users!

---

**Questions?** Check the full README.md for detailed documentation.
