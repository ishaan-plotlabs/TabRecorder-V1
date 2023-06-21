let recorder = null;
let streamId;
let chunks;

const start = (streamId) => {
  navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: "tab",
        chromeMediaSourceId: streamId
      }
    }
  })
    .then((stream) => {
      console.log(stream);
      recorder = new MediaRecorder(stream);
      chunks = [];

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = (e) => {
        running = false;
        const blob = new Blob(chunks, { type: "video/webm;codecs=vp9" });
        url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.download = "download.webm";
        a.href = url;
        a.click();
      }

      recorder.start();
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);
  switch (message.command) {
    case "start":
      if (message.streamId != "") {
        streamId = message.streamId;
      }
      if (recorder == null) {
        start(streamId);
      }
      else if (recorder.state == "inactive") {
        chunks = [];
        recorder.start();
      }
      break;
    case "stop":
      recorder.stop();
      break;
  }
});