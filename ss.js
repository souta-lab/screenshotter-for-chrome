
document.getElementById("screenShotButton").addEventListener("click", async () => {
  try {
    const dataUrl = await chrome.tabs.captureVisibleTab({
      format: "png",
      quality: 100,
    });
    const blob = dataURItoBlob(dataUrl);

    // Copy to clipboard (best-effort: log but don't block download)
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
    } catch (err) {
      console.warn("Clipboard write failed:", err);
    }

    if (document.getElementById("something").checked) {
      const now = new Date();
      const yyyymmdd = now.toISOString().slice(0, 10);
      const time = now
        .toLocaleTimeString("ja-JP", { hour12: false })
        .split(":")
        .join("-");
      const filename = `${yyyymmdd}_${time}.png`;
      const objectUrl = URL.createObjectURL(blob);
      try {
        await chrome.downloads.download({ url: objectUrl, filename });
      } finally {
        // Give the download a moment to start before revoking
        setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);
      }
    }
  } catch (err) {
    console.error("Screenshot failed:", err);
  }
});

function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeString });
}
