const messageTextElement = document.querySelector(".canvas > .message-text");
let currentText = "";

document.addEventListener("keydown", (event) => {
  if (event.key.length === 1) {
    // this is a printable character
    currentText += event.key;
  } else if (event.key === "Backspace") {
    currentText = currentText.slice(0, -1);
  } else if (event.key === "Enter") {
    currentText += "\n";
  }
  messageTextElement.innerHTML = currentText;
});

function getCurrentText() {
  return currentText;
}

function clearCurrentText() {
  currentText = "";
  messageTextElement.innerHTML = "";
}

function setCurrentText(text) {
  currentText = text;
  messageTextElement.innerHTML = currentText.replace(/\n/g, "<br>");
}

/* expose functions to global scope */
window.getCurrentText = getCurrentText;
window.clearCurrentText = clearCurrentText;
window.setCurrentText = setCurrentText;
