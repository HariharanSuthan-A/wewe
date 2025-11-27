# Gmail OAuth Sender - Vercel Deployment

A complete Gmail OAuth + Email Sender application that runs on Vercel with a static frontend and serverless backend. Each user provides their own Google OAuth credentials (Client ID and Client Secret) to send emails.

## Features

✅ **User-Owned Credentials** - Each user provides their own Google OAuth credentials  
✅ **No Backend Database** - All tokens stored in browser localStorage  
✅ **Vercel Serverless** - Backend API runs on Vercel Edge Functions  
✅ **Beautiful UI** - Modern, responsive interface with real-time status updates  
✅ **Error Handling** - Comprehensive error messages and recovery flows  
✅ **Production Ready** - Works out-of-the-box when deployed  

## Project Structure

```
project-root/
├── api/
│   └── auth/
│       ├── generate-url.js      # Generates Google OAuth URL
│       └── oauth-callback.js    # Exchanges code for tokens
├── api/
│   └── send-email.js            # Sends emails via Gmail API
├── public/
│   ├── index.html               # Main login & email form
│   ├── callback.html            # OAuth callback handler
│   └── gmail.js                 # Frontend logic
├── package.json                 # Dependencies
├── vercel.json                  # Vercel configuration
└── README.md                    # This file
```

## Setup Instructions

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the **Gmail API**
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `https://your-vercel-domain.vercel.app/callback.html`
5. Copy your **Client ID** and **Client Secret**

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts to deploy. Your app will be available at `https://your-project.vercel.app`

#### Option B: Using GitHub

1. Push this project to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect the configuration and deploy

### 3. Update Redirect URI

After deployment, update your Google OAuth credentials:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Update the redirect URI to: `https://your-vercel-domain.vercel.app/callback.html`

## How It Works

### OAuth Flow

1. **User enters credentials** - Client ID and Client Secret on the home page
2. **Frontend stores credentials** - Saved to localStorage for callback.html
3. **Redirect to Google** - User is redirected to Google's consent screen
4. **User authorizes** - User grants permission to send emails
5. **Callback handler** - callback.html exchanges code for tokens
6. **Tokens stored** - Access and refresh tokens saved to localStorage

### Email Sending

1. **User fills form** - Enters recipient, subject, and message
2. **Frontend validates** - Checks for required fields and valid email
3. **Backend sends** - Calls `/api/send-email` with user's tokens
4. **Gmail API** - Backend uses Gmail API to send the email
5. **Success feedback** - User sees confirmation message

## API Endpoints

### `GET /api/auth/generate-url`

Generates a Google OAuth URL.

**Query Parameters:**
- `clientId` - Google OAuth Client ID
- `redirectUri` - Callback URL (e.g., `https://your-domain.vercel.app/callback.html`)

**Response:**
```json
{
  "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?..."
}
```

### `POST /api/auth/oauth-callback`

Exchanges authorization code for tokens.

**Request Body:**
```json
{
  "code": "authorization_code_from_google",
  "clientId": "your_client_id",
  "clientSecret": "your_client_secret",
  "redirectUri": "https://your-domain.vercel.app/callback.html"
}
```

**Response:**
```json
{
  "tokens": {
    "access_token": "...",
    "refresh_token": "...",
    "expiry_date": 1234567890
  }
}
```

### `POST /api/send-email`

Sends an email using Gmail API.

**Request Body:**
```json
{
  "clientId": "your_client_id",
  "clientSecret": "your_client_secret",
  "redirectUri": "https://your-domain.vercel.app/callback.html",
  "tokens": { "access_token": "...", "refresh_token": "..." },
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "messageHtml": "<p>Email body in HTML</p>"
}
```

**Response:**
```json
{
  "success": true,
  "sendRes": { "id": "message_id", ... }
}
```

## Environment Variables

This project does **not** require environment variables. All credentials are provided by users at runtime.

However, if you want to add optional configuration:

```bash
# .env.local (for local development)
# No required variables
```

## Local Development

### Install Dependencies

```bash
npm install
```

### Run Locally

```bash
# Install Vercel CLI
npm install -g vercel

# Run locally
vercel dev
```

Your app will be available at `http://localhost:3000`

### Testing

1. Open `http://localhost:3000`
2. Enter your Google OAuth credentials
3. Click "Open Google Consent Screen"
4. Authorize the app
5. Send a test email

## Troubleshooting

### "Invalid Client ID"
- Check that your Client ID is correct
- Ensure the Client ID is for a Web application (not Desktop/Mobile)

### "Redirect URI mismatch"
- Update your Google OAuth credentials with the correct redirect URI
- Format: `https://your-vercel-domain.vercel.app/callback.html`

### "Missing Credentials in localStorage"
- Clear browser cache and localStorage
- Start the authorization flow again

### "Token exchange failed"
- Check that your Client Secret is correct
- Verify the redirect URI matches exactly in Google Cloud Console

### "Failed to send email"
- Ensure you've authorized the app (completed OAuth flow)
- Check that the Gmail API is enabled in Google Cloud Console
- Verify the recipient email address is valid

## Security Considerations

⚠️ **Important:**

1. **Client Secret in Browser** - This app stores the Client Secret in localStorage. This is acceptable for user-owned credentials but not recommended for shared/backend credentials.

2. **HTTPS Only** - Always use HTTPS in production. Vercel provides free HTTPS.

3. **Token Storage** - Tokens are stored in localStorage and can be accessed by JavaScript. Consider using httpOnly cookies for higher security.

4. **Scope Limitations** - The app requests only `gmail.send`, `gmail.readonly`, and `userinfo.email` scopes.

## Production Checklist

- [ ] Deploy to Vercel
- [ ] Update Google OAuth redirect URI
- [ ] Test OAuth flow end-to-end
- [ ] Test email sending
- [ ] Monitor Vercel logs for errors
- [ ] Set up error tracking (optional)

## Dependencies

- **googleapis** - Google APIs client library
- **cors** - CORS middleware (for local development)

## License

MIT

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Vercel logs: `vercel logs`
3. Check browser console for JavaScript errors
4. Verify Google Cloud Console settings

---

**Ready to deploy?** Push to GitHub or run `vercel` to get started! 🚀
