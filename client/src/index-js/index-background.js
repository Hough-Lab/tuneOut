import 'regenerator-runtime/runtime';
import { defaultOptions, identify_v2 } from '../Arc-api/audio-request.js'


let recorder;
let streamObject;
let previousRequest;

const error = {
  noAudibleTab: 'Please select an audible tab',
}

function handleCapture (stream, muteTab) {
  return new Promise(resolve => {
    const options = { mimeType: 'audio/webm; codecs=opus' };
    recorder = new MediaRecorder(stream, options);
    streamObject = stream;
    recorder.start();
    setTimeout(() => {
      recorder.stop();
      streamObject.getAudioTracks()[0].stop();
    }, 8000);
    recorder.ondataavailable = function(e) {
      let blob = new Blob([e.data], { type: 'audio/mp3' });
      const data = uploadStream(blob);
      resolve(data);
    }
  })
}

function uploadStream (stream) {
  return new Promise(resolve => {
    toBuffer(stream);
    identify_v2(stream, defaultOptions, function (body, httpResponse, err) {
        if (err) console.log();
        resolve(body);
    })
  })
}

function toBuffer (stream) {
  let buffer = Buffer.alloc(stream.size);
  let view = new Uint8Array(stream);
  for (let i = 0; i < buffer.length; ++i) {
    buffer[i] = view[i];
  }
  return buffer;
}

export function captureTab (tabId) {
  return new Promise(resolve => {
    chrome.tabCapture.capture({ audio: true }, function(stream) {
      let audio = new Audio();
      audio.srcObject = stream;
      audio.play();
      const data = handleCapture(stream);
      previousRequest = data;
      resolve(data);
    })
  })
}

export function sendHistory () {
  return new Promise(resolve => {
    resolve(previousRequest);
  })
}
