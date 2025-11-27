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
    const {
      clientId,
      clientSecret,
      redirectUri,
      tokens,
      to,
      subject,
      messageHtml
    } = req.body;

    if (!clientId || !clientSecret || !redirectUri || !tokens || !to || !subject || !messageHtml) {
      return res.status(400).json({ error: "missing required fields" });
    }

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    oauth2Client.setCredentials(tokens);

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const raw = [
      `To: ${to}`,
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      'Content-Type: text/html; charset="UTF-8"',
      "",
      messageHtml
    ].join("\r\n");

    // base64url encode
    const encodedMessage = Buffer.from(raw).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

    const sendRes = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage
      }
    });

    return res.status(200).json({ success: true, sendRes: sendRes.data });
  } catch (err) {
    console.error("send-email error:", err);
    return res.status(500).json({ error: err.message || String(err) });
  }
}
