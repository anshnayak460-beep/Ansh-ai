const $ = id => document.getElementById(id);

const form = $("chatForm");
const promptInput = $("prompt");
const messages = $("messages");
const welcome = $("welcome");
const provider = $("provider");
const model = $("model");
const imageInput = $("imageInput");
const preview = $("attachmentPreview");

let selectedImage = null;
let chatHistory = [];
let busy = false;

const models = {
groq: [
["llama-3.3-70b-versatile", "Llama 3.3 70B"],
["openai/gpt-oss-120b", "GPT OSS 120B"]
],
openai: [
["gpt-4.1-mini", "GPT-4.1 Mini"],
["gpt-4.1", "GPT-4.1"]
]
};

function updateModels() {
model.innerHTML = "";
models[provider.value].forEach(([id, name]) => {
const option = document.createElement("option");
option.value = id;
option.textContent = name;
model.appendChild(option);
});
}

provider.addEventListener("change", updateModels);
updateModels();

function addMessage(role, text, imageURL = null) {
welcome.style.display = "none";

const row = document.createElement("div");
row.className = "message " +
(role === "user" ? "user-message" : "assistant-message");

const avatar = document.createElement("div");
avatar.className = "avatar";
avatar.textContent = role === "user" ? "U" : "A";

const content = document.createElement("div");
content.className = "message-content";

if (imageURL) {
const img = document.createElement("img");
img.src = imageURL;
content.appendChild(img);
}

const textNode = document.createElement("div");
textNode.textContent = text;
content.appendChild(textNode);

row.append(avatar, content);
messages.appendChild(row);

$("chatArea").scrollTop = $("chatArea").scrollHeight;

return textNode;
}

function resetChat() {
messages.innerHTML = "";
chatHistory = [];
welcome.style.display = "block";
selectedImage = null;
preview.textContent = "";
imageInput.value = "";
}

$("newChat").addEventListener("click", resetChat);
$("clearChat").addEventListener("click", resetChat);

$("menuBtn").addEventListener("click", () => {
$("sidebar").classList.toggle("open");
});

$("uploadBtn").addEventListener("click", () => {
imageInput.click();
});

imageInput.addEventListener("change", () => {
const file = imageInput.files[0];

if (!file) return;

if (!file.type.startsWith("image/")) {
alert("Please select an image.");
return;
}

if (file.size > 5 * 1024 * 1024) {
alert("Image must be smaller than 5 MB.");
imageInput.value = "";
return;
}

selectedImage = file;
preview.textContent = "📷 Selected: " + file.name;
});

$("sidebar").addEventListener("click", e => {
const button = e.target.closest("[data-mode]");
if (!button) return;

const mode = button.dataset.mode;

$("modeTitle").textContent =
mode === "chat" ? "AI Chat" :
mode === "code" ? "Coding Assistant" :
mode === "image" ? "Image Studio" :
"Study Assistant";

document.querySelectorAll(".side-item").forEach(b =>
b.classList.toggle("active", b === button)
);

if (mode === "code") {
promptInput.value = "Help me write code for: ";
} else if (mode === "study") {
promptInput.value = "Explain this topic in simple Hindi: ";
} else if (mode === "image") {
promptInput.value = "Help me with image generation or editing: ";
} else {
promptInput.value = "";
}

$("sidebar").classList.remove("open");
promptInput.focus();
});

document.querySelectorAll(".suggestion").forEach(button => {
button.addEventListener("click", () => {
if (button.dataset.mode === "image") {
$("modeTitle").textContent = "Image Studio";
promptInput.value = "Help me create or edit an image: ";
} else {
promptInput.value = button.dataset.prompt;
}
promptInput.focus();
});
});

form.addEventListener("submit", async e => {
e.preventDefault();

if (busy) return;

const text = promptInput.value.trim();

if (!text && !selectedImage) return;

// Backend will be connected in the next step.
alert("Frontend ready! Next step: connect the Cloudflare Worker API.");
});

promptInput.addEventListener("input", () => {
promptInput.style.height = "auto";
promptInput.style.height =
Math.min(promptInput.scrollHeight, 150) + "px";
});
