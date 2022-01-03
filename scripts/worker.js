const longWait = () => {
  for (let i = 0; i < 5000000000; i++);
};

onmessage = function (e) {
  switch (e.data) {
    case "startLongWait":
      postMessage("Waiting...");
      longWait();
      postMessage("Wait over");
    default:
      postMessage("Invalid request");
  }
};
