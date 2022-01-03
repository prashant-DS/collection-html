// web workers let us create new thread for parallel execution.
// Communication between this thread and the main process utilizes events
// i.e., postMessage and onMessage events

const workBtn = document.querySelector("#workBtn");
workBtn.addEventListener("click", () => {
  const myWorker = new Worker("scripts/worker.js");
  myWorker.postMessage("startLongWait");
  myWorker.onmessage = function (e) {
    document.querySelector("#output").innerHTML = e.data;
  };
});
const randomBtn = document.querySelector("#btn");
randomBtn.addEventListener("click", () => {
  document.querySelector("#random").innerHTML =
    "random: " + Math.round(Math.random() * 100);
});
