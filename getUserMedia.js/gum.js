var opts = {
  "audio": false,
  "video": true,

  // the element (by id) you wish to use for 
  // displaying the stream from a camera
  el: "webcam",

  extern: null,
  append: true,

  // height and width of the output stream
  // container

  width: 320,
  height: 240,

  // the recommended mode to be used is 
  // 'callback ' where a callback is executed 
  // once data is available
  mode: "callback",

  // the flash fallback Url
  swffile: "fallback/jscam_canvas_only.swf",

  // quality of the fallback stream
  quality: 85,

  // a debugger callback is available if needed
  debug: function () {},

  // callback for capturing the fallback stream
  onCapture: function () {
      window.webcam.save();
  },

  // callback for saving the stream, useful for
  // relaying data further.
  onSave: function (data) {},
  onLoad: function () {}
};
getUserMedia(opts, function(stream){
  if (true) {
    var video = opts.videoEl;

    if ((typeof MediaStream !== "undefined" && MediaStream !== null) && stream instanceof MediaStream) {
      if (video.mozSrcObject !== undefined) { //FF18a
        video.mozSrcObject = stream;
      } else { //FF16a, 17a
        video.src = stream;
      }
      return video.play();
    } else {
      var vendorURL = window.URL || window.webkitURL;
      video.src = vendorURL ? vendorURL.createObjectURL(stream) : stream;
    }
    video.onerror = function () {
      stream.stop();
      streamError();
    };
  } else{
    // flash context
  }
}, function(){
  console.log('error');
});
getSnapshot = function () {
  // If the current context is WebRTC/getUserMedia (something
  // passed back from the shim to avoid doing further feature
  // detection), we handle getting video/images for our canvas 
  // from our HTML5 <video> element.
  if (opts.context === 'webrtc') {
    var video = opts.videoEl,
        canvas = document.getElementById('inputCanvas');
    canvas.getContext('2d').drawImage(video, 0, 0, opts.width, opts.height);

  // Otherwise, if the context is Flash, we ask the shim to
  // directly call window.webcam, where our shim is located
  // and ask it to capture for us.
  } else if(App.options.context === 'flash'){
    // flash
  }
  else{
      alert('No context was supplied to getSnapshot()');
  }
};
setInterval(getSnapshot, 500);