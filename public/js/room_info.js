// fetch room details and display join info
fetch("/api/room/details")
  .then((response) => response.json())
  .then((data) => {
    const joinInfoSpan = document.getElementById("join-info");
    joinInfoSpan.innerHTML = `other people can join at http://${data.serverIP}:${data.port}`;
  })
  .catch((error) => {
    console.error("Error fetching room details:", error);
  });
