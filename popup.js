const state = { type: "url", data: "" };
const fields = document.getElementById("fields");
const qr = document.getElementById("qr");
const emptyState = document.getElementById("emptyState");
const status = document.getElementById("status");

const templates = {
  url: () => `
    <div class="field"><label>URL</label>
      <input id="url" type="url" placeholder="https://example.com" autofocus>
    </div>`,
  text: () => `
    <div class="field"><label>Text</label>
      <textarea id="text" placeholder="Type anything..."></textarea>
    </div>`,
  wifi: () => `
    <div class="field"><label>Network name (SSID)</label><input id="ssid" placeholder="My Wi-Fi"></div>
    <div class="field"><label>Password</label><input id="password" type="password" placeholder="Password"></div>
    <div class="field"><label>Security</label>
      <select id="security"><option value="WPA">WPA/WPA2</option><option value="WEP">WEP</option><option value="">None</option></select>
    </div>`,
  email: () => `
    <div class="field"><label>Email address</label><input id="email" type="email" placeholder="name@example.com"></div>
    <div class="field"><label>Subject</label><input id="subject" placeholder="Hello"></div>
    <div class="field"><label>Message</label><textarea id="message" placeholder="Your message..."></textarea></div>`,
  phone: () => `
    <div class="field"><label>Phone number</label><input id="phone" type="tel" placeholder="+91 98765 43210"></div>`
};

function esc(value) {
  return String(value).replace(/([\\;,:"])/g, "\\$1");
}

function getData() {
  if (state.type === "url") return document.getElementById("url")?.value.trim() || "";
  if (state.type === "text") return document.getElementById("text")?.value || "";
  if (state.type === "phone") {
    const v = document.getElementById("phone")?.value.trim() || "";
    return v ? `tel:${v}` : "";
  }
  if (state.type === "email") {
    const to = document.getElementById("email")?.value.trim() || "";
    const subject = document.getElementById("subject")?.value || "";
    const message = document.getElementById("message")?.value || "";
    if (!to) return "";
    return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  }
  if (state.type === "wifi") {
    const ssid = document.getElementById("ssid")?.value || "";
    const password = document.getElementById("password")?.value || "";
    const security = document.getElementById("security")?.value || "";
    if (!ssid) return "";
    return `WIFI:T:${security};S:${esc(ssid)};P:${esc(password)};;`;
  }
  return "";
}

function generate() {
  const data = getData();
  state.data = data;
  qr.innerHTML = "";
  if (!data) {
    emptyState.hidden = false;
    status.textContent = "Waiting for input";
    return;
  }
  emptyState.hidden = true;
  try {
    new QRCode(qr, {
      text: data,
      width: 190,
      height: 190,
      colorDark: "#111827",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M
    });
    status.textContent = "QR updated";
  } catch (e) {
    status.textContent = "Data is too long";
  }
}

function renderType(type) {
  state.type = type;
  document.querySelectorAll(".type").forEach(b => b.classList.toggle("active", b.dataset.type === type));
  fields.innerHTML = templates[type]();
  fields.querySelectorAll("input, textarea, select").forEach(el => el.addEventListener("input", generate));
  generate();
  fields.querySelector("input, textarea")?.focus();
}

document.querySelectorAll(".type").forEach(btn => {
  btn.addEventListener("click", () => renderType(btn.dataset.type));
});

document.getElementById("currentTabBtn").addEventListener("click", async () => {
  try {
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    if (!tab?.url) return;
    renderType("url");
    document.getElementById("url").value = tab.url;
    generate();
  } catch {
    status.textContent = "Could not read current tab";
  }
});

document.getElementById("downloadPng").addEventListener("click", () => {
  const canvas = qr.querySelector("canvas");
  if (!canvas) {
    status.textContent = "Generate a QR first";
    return;
  }
  const a = document.createElement("a");
  a.download = "quickqr.png";
  a.href = canvas.toDataURL("image/png");
  a.click();
  status.textContent = "PNG downloaded";
});

document.getElementById("copyText").addEventListener("click", async () => {
  if (!state.data) {
    status.textContent = "Nothing to copy";
    return;
  }
  try {
    await navigator.clipboard.writeText(state.data);
    status.textContent = "Data copied";
  } catch {
    status.textContent = "Copy failed";
  }
});

renderType("url");
