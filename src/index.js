import swURL from "sw:../service-worker.js";

// Register the service worker
if ("serviceWorker" in navigator) {
  // Wait for the 'load' event to not block other work
  window.addEventListener("load", async () => {
    // Try to register the service worker.
    try {
      const reg = await navigator.serviceWorker.register(swURL);
      console.log("Service worker registered! 😎", reg);
    } catch (err) {
      console.log("😥 Service worker registration failed: ", err);
    }
  });
}
export default (cb) => (e) => {
  e.preventDefault();
  const form = e.target;

  if (!form) {
    console.warn("No form detected by formie");
    return;
  }

  const rawChildren = form.querySelectorAll("*");
  const children = Array.prototype.slice.call(rawChildren);
  const inputs = children.filter((node) => (node.type === "radio" ? node.checked : Boolean(node.name)));

  let result = {};

  inputs.forEach((input) => {
    let value;

    if (input.type === "checkbox") {
      value = input.checked;
    } else if (input.type === "file") {
      value = input.files;
    } else if (input.type === "select-multiple") {
      value = Array.prototype.slice
        .call(input.options)
        .filter((option) => option.selected)
        .map((option) => option.value);
    } else {
      value = input.value;
    }

    result[input.name] = value;
  });

  cb(result);
};
