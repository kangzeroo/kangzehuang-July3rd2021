export default {};
self.addEventListener("message", (event) =>
  console.log("Worker received:", event.data)
);
self.postMessage("ping from webworker");
