// Configuration
const siteOrigin = window.location.origin;
const REDIRECT_URI = siteOrigin + "/callback.html";

// Initialize
document.getElementById("redirectHint").innerText = REDIRECT_URI;
checkAuthStatus();

// Helper: Display status message
function showStatus(elementId, type, message) {
  const el = document.getElementById(elementId);
  el.className = `status ${type}`;
  el.textContent = message;
}

// Helper: Clear status message
function clearStatus(elementId) {
  const el = document.getElementById(elementId);
  el.className = "status";
  el.textContent = "";
}

// Helper: Check and display auth status
function checkAuthStatus() {
  const tokens = localStorage.getItem("gmail_tokens");
  const authStatusEl = document.getElementById("authStatus");
  
  if (tokens) {
    authStatusEl.className = "auth-status authenticated";
    authStatusEl.textContent = "✅ Authenticated";
  } else {
    authStatusEl.className = "auth-status";
    authStatusEl.textContent = "Not authenticated";
  }
}

// Auth button handler
document.getElementById("authBtn").addEventListener("click", async () => {
  const clientId = document.getElementById("clientId").value.trim();
  const clientSecret = document.getElementById("clientSecret").value.trim();
  const authBtn = document.getElementById("authBtn");

  if (!clientId || !clientSecret) {
    showStatus("authStatusMsg", "error", "⚠️ Please enter both Client ID and Client Secret.");
    return;
  }

  // Store credentials for callback.html
  localStorage.setItem("gmail_client_id", clientId);
  localStorage.setItem("gmail_client_secret", clientSecret);
  localStorage.setItem("gmail_redirect_uri", REDIRECT_URI);

  authBtn.disabled = true;
  showStatus("authStatusMsg", "info", "🔄 Redirecting to Google...");

  try {
    // Try to get auth URL from backend
    const urlRes = await fetch(`/api/auth/generate-url?clientId=${encodeURIComponent(clientId)}&redirectUri=${encodeURIComponent(REDIRECT_URI)}`);
    const j = await urlRes.json();
    
    if (!urlRes.ok) {
      throw new Error(j.error || "Failed to generate auth URL");
    }
    
    window.location.href = j.authUrl;
  } catch (err) {
    console.warn("Backend generate-url failed; building client-side.", err);
    
    // Fallback: build URL client-side
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

// Send email button handler
document.getElementById("sendBtn").addEventListener("click", async () => {
  const to = document.getElementById("to").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const messageHtml = document.getElementById("message").value.trim();
  const sendBtn = document.getElementById("sendBtn");

  // Validation
  if (!to || !subject || !messageHtml) {
    showStatus("sendStatusMsg", "error", "⚠️ Please fill in recipient, subject, and message.");
    return;
  }

  if (!to.includes("@")) {
    showStatus("sendStatusMsg", "error", "⚠️ Please enter a valid email address.");
    return;
  }

  // Check authentication
  const clientId = localStorage.getItem("gmail_client_id");
  const clientSecret = localStorage.getItem("gmail_client_secret");
  const redirectUri = localStorage.getItem("gmail_redirect_uri");
  const tokens = JSON.parse(localStorage.getItem("gmail_tokens") || "null");

  if (!clientId || !clientSecret || !redirectUri || !tokens) {
    showStatus("sendStatusMsg", "error", "⚠️ You must complete authorization first. Click 'Open Google Consent Screen'.");
    return;
  }

  // Send email
  sendBtn.disabled = true;
  showStatus("sendStatusMsg", "info", "📤 Sending email...");

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
      throw new Error(data.error || "Failed to send email");
    }

    showStatus("sendStatusMsg", "success", "✅ Email sent successfully!");
    console.log("Email sent:", data);
    
    // Clear form
    document.getElementById("to").value = "";
    document.getElementById("subject").value = "";
    document.getElementById("message").value = "";
  } catch (err) {
    showStatus("sendStatusMsg", "error", `❌ Error: ${err.message}`);
    console.error("Send error:", err);
  } finally {
    sendBtn.disabled = false;
  }
});
