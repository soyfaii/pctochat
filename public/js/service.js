const sendButton = document.querySelector("button#send");
const username =
  new URLSearchParams(window.location.search).get("u") || "Anonymous";

sendButton.addEventListener("click", send);

function send() {
  const data = canvas.toDataURL("image/png");
  const messageText = window.getCurrentText ? window.getCurrentText() : "";
  const payload = {
    from: username,
    text: messageText,
    doodle: data,
    timestamp: new Date().toISOString(),
  };
  fetch("/api/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  // clear canvas after sending
  canvas.width = canvas.width;
  window.clearCurrentText();
}

function addToChatLog(msg) {
  const chatLog = document.getElementById("chat-log");

  const messageBox = document.createElement("div");
  messageBox.className = "message-box";

  const messageHeader = document.createElement("div");
  messageHeader.className = "message-header";

  const usernameSpan = document.createElement("span");
  usernameSpan.className = "username";
  usernameSpan.textContent = msg.from;

  messageHeader.appendChild(usernameSpan);
  messageBox.appendChild(messageHeader);

  const canvasDiv = document.createElement("div");
  canvasDiv.className = "canvas";

  const messageTextSpan = document.createElement("span");
  messageTextSpan.className = "message-text";
  messageTextSpan.innerHTML = msg.text.replace(/\n/g, "<br>");

  canvasDiv.appendChild(messageTextSpan);

  if (msg.doodle) {
    const img = document.createElement("img");
    img.src = msg.doodle;
    img.width = 214;
    img.height = 78;
    canvasDiv.appendChild(img);
  }

  messageBox.appendChild(canvasDiv);

  animatePreviousMessages(chatLog, false);

  chatLog.insertBefore(messageBox, chatLog.firstChild);
}

function addSystemMessageToChatLog(content) {
  const chatLog = document.getElementById("chat-log");

  const messageBox = document.createElement("div");
  messageBox.className = "system-message-box";
  messageBox.innerHTML = content;

  animatePreviousMessages(chatLog, true);

  chatLog.insertBefore(messageBox, chatLog.firstChild);
}

function animatePreviousMessages(chatLog, newIsSystem) {
  const previousMessages = chatLog.querySelectorAll(
    ".message-box, .system-message-box"
  );

  previousMessages.forEach((message) => {
    const prevIsSystem = message.classList.contains("system-message-box");
    const startTranslate = prevIsSystem
      ? newIsSystem
        ? "translateY(calc(100% + 5px))"
        : "translateY(calc(500% + 5px))"
      : newIsSystem
      ? "translateY(calc(20% + 5px))"
      : "translateY(calc(100% + 5px))";

    message.animate(
      [{ transform: startTranslate }, { transform: "translateY(0%)" }],
      {
        duration: 100,
        easing: "linear",
        fill: "forwards",
      }
    );
  });
}

// run when a new message is received from the server
function handleMessage(msg) {
  const data = JSON.parse(msg);
  if (data.type === "system") {
    addSystemMessageToChatLog(data.content);
    return;
  }
  addToChatLog(data);
}

// listens for new messages from the server
async function listen() {
  try {
    const response = await fetch("/api/messages");
    if (response.status === 200) {
      const msg = await response.text();
      handleMessage(msg);
    }
  } catch (err) {
    console.error("error listening messages:", err);
  } finally {
    // goes back to listening just after receiving a message or on error
    setTimeout(listen, 50); // small delay to avoid stack overflow
  }
}

// start listening for messages right after loading the app
listen();

// sets the username label in the user message box
const usernameLabel = document.querySelector(
  "#user-message-box > .message-header > .username"
);
usernameLabel.innerHTML = username;
