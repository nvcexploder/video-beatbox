var stream = undefined;
var isRecording = false;

function WebRTC(_options) {
  this.options = _options;
  if(navigator.getUserMedia !== undefined) {
    navigator.getUserMedia(this.options, this.onConnection, this.onError);
  } else {
    alert("Your browser doesn't support WebRTC, this site won't work for you");
  }
}

WebRTC.prototype.onConnection = function(_stream) {
  stream = _stream;
  for(var els = document.getElementsByTagName('video'),i=0;i<els.length;i++) {
    els[i].src = URL.createObjectURL(_stream);
    els[i].addEventListener('click', this.onElClick);
  }
}

WebRTC.prototype.onError = function(_error) {
  console.log("Error: ",_error);
}

WebRTC.prototype.onElClick = function(_ev,index) {
  var elV = _ev.target;
  var elA = _ev.target.getElementsByTagName('audio')[0];
  if (!isRecording && stream != undefined) {
    recordVideo = RecordRTC(stream, {type: 'video'});
    recordAudio = RecordRTC(stream);
    recordVideo.startRecording();
    recordAudio.startRecording();
  } else if (isRecording) {
    recordVideo.stopRecording(function(_url){
      elV.src = _url;
    });
    recordAudio.stopRecording(function(_url) {
      elA.src = _url;
    });
    el.addEventListener('loadeddata', function() {
      setInterval(this.onInterval(_elV,_elA),elV.duration*1000);
    });
  }
  isRecording = !isRecording;
}

WebRTC.prototype.onInterval = function(_elV,_elA) {
  if(navigator.userAgent.search("Firefox")) {
    _elA.play();
    _elV.play();
  } else {
    _elA.currentTime = 0;
    _elV.currentTime = 0;
  }
}