const userColors = [
  "slate",
  "brown",
  "red",
  "pink",
  "orange",
  "yellow",
  "green",
  "emerald",
  "cyan",
  "blue",
  "navy",
  "purple",
  "magenta",
  "fuchsia",
];

var userColor = userColors[Math.floor(Math.random() * userColors.length)];
displayUserColor(userColor);

function displayUserColor(color) {
  const addedClass = `accent-${color}`;
  const userMessageForm = document.getElementById("user-message-form");

  userMessageForm.classList.add(addedClass);
}
