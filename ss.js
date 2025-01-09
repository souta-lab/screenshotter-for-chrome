
chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, tabs => {

document.getElementById("screenShotButton").addEventListener("click", async () => {
    var capturing = chrome.tabs.captureVisibleTab({format: "png", quality: 100});
    capturing.then(clipboard);
});
});

function clipboard (datauri) {
    var blob = dataURItoBlob(datauri);
    navigator.clipboard.write([
        new ClipboardItem({
            "image/png": blob
        })
    ]);
}

function dataURItoBlob(dataURI) {

    var byteString = atob(dataURI.split(',')[1]);
  

    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  

    var ab = new ArrayBuffer(byteString.length);
  

    var ia = new Uint8Array(ab);
  

    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
  
    var blob = new Blob([ab], {type: mimeString});
    return blob;
  
  }