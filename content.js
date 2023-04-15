chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { pixelSize } = message;

  const createPixelatedImage = (img) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0, img.width / pixelSize, img.height / pixelSize);
    ctx.drawImage(canvas, 0, 0, img.width / pixelSize, img.height / pixelSize, 0, 0, img.width, img.height);

    img.src = canvas.toDataURL();
  };

  const selectImageToPixelate = (e) => {
    if (e.target.tagName === "IMG") {
      createPixelatedImage(e.target);
      document.removeEventListener("click", selectImageToPixelate);
    }
  };

  document.addEventListener("click", selectImageToPixelate, { once: true });
});
