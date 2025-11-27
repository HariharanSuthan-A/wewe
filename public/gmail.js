// Update this redirect to your deployed domain's callback.html
const siteOrigin = window.location.origin; // e.g., https://yourapp.vercel.app or https://username.github.io/repo
const REDIRECT_URI = siteOrigin + "/callback.html";

document.getElementById("redirectHint").innerText = REDIRECT_URI;

document.getElementById("authBtn").addEventListener("click", async () => {
  const clientId = document.getElementById("clientId").value.trim();
  const clientSecret = document.getElementById("clientSecret").value.trim();

  if (!clientId || !clientSecret) {
    return alert("Please enter both Client ID and Client Secret.");
  }

  // Store temporarily so callback.html can access them
  localStorage.setItem("gmail_client_id", clientId);
  localStorage.setItem("gmail_client_secret", clientSecret);
  localStorage.setItem("gmail_redirect_uri", REDIRECT_URI);

  // Option A: call backend to build URL
  try {
    const urlRes = await fetch(`/api/auth/generate-url?clientId=${encodeURIComponent(clientId)}&redirectUri=${encodeURIComponent(REDIRECT_URI)}`);
    const j = await urlRes.json();
    if (!urlRes.ok) {
      throw new Error(j.error || "failed to get auth url");
    }
    window.location.href = j.authUrl;
    return;
  } catch (err) {
    // Fallback: build URL client-side
    console.warn("Backend generate-url failed; building client-side.", err);
    const scope = [
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/userinfo.email",
      "openid"
    ].join(" ");

    const url =
      "https://accounts.google.com/o/oauth2/v2/auth" +
      `?client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent(scope)}` +
      `&access_type=offline` +
      `&prompt=consent`;

    window.location.href = url;
  }
});

document.getElementById("sendBtn").addEventListener("click", async () => {
  const to = document.getElementById("to").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const messageHtml = document.getElementById("message").value;

  if (!to || !subject || !messageHtml) {
    return alert("Fill to, subject and message.");
  }

  const clientId = localStorage.getItem("gmail_client_id");
  const clientSecret = localStorage.getItem("gmail_client_secret");
  const redirectUri = localStorage.getItem("gmail_redirect_uri");
  const tokens = JSON.parse(localStorage.getItem("gmail_tokens") || "null");

  if (!clientId || !clientSecret || !redirectUri || !tokens) {
    return alert("You must complete authorization first (click 'Open Google Consent Screen').");
  }

  try {
    const resp = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId,
        clientSecret,
        redirectUri,
        tokens,
        to,
        subject,
        messageHtml
      })
    });

    const data = await resp.json();
    if (!resp.ok) {
      throw new Error(data.error || JSON.stringify(data));
    }
    alert("Email sent!");
    console.log("send response:", data);
  } catch (err) {
    alert("Send failed: " + err.message);
    console.error(err);
  }
});
