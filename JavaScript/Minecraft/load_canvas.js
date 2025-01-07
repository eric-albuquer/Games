const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");

canvas.addEventListener("click", () => {
    canvas.requestPointerLock();
  });