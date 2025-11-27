import { google } from "googleapis";

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { code, clientId, clientSecret, redirectUri } = req.body;

    if (!code || !clientId || !clientSecret || !redirectUri) {
      return res.status(400).json({ error: "code, clientId, clientSecret, redirectUri required" });
    }

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

    const { tokens } = await oauth2Client.getToken(code);

    // tokens contain access_token, refresh_token, expiry_date, etc.
    return res.status(200).json({ tokens });
  } catch (err) {
    console.error("oauth-callback error:", err);
    return res.status(500).json({ error: err.message || String(err) });
  }
}
