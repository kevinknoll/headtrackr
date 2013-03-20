var opts = {
  tryNative: true,
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
  swffile: "getUserMedia.js/dist/fallback/jscam_canvas_only.swf",

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
  onSave: function (data) {
    var col = data.split(';'),
        img = app.image,
        tmp = null,
        w = opts.width,
        h = opts.height;

    for (var i = 0; i < w; i++) {
      tmp = parseInt(col[i], 10);
      img.data[app.pos + 0] = (tmp >> 16) & 0xff;
      img.data[app.pos + 1] = (tmp >> 8) & 0xff;
      img.data[app.pos + 2] = tmp & 0xff;
      img.data[app.pos + 3] = 0xff;
      app.pos += 4;
    }

    if (app.pos >= 4 * w * h) { 
      app.ctx.putImageData(img, 0, 0);
      app.pos = 0;
    }
  },
  onLoad: function () {}
};

var app = {
  pos: 0,
  cam: null,
  filter_on: false,
  filter_id: 0,
  canvas: document.getElementById("inputCanvas"),
  img: new Image()
};
app.ctx = app.canvas.getContext("2d");
app.ctx.clearRect(0, 0, opts.width, opts.height);
app.image = app.ctx.getImageData(0, 0, opts.width, opts.height);

// Initialize webcam options for fallback
window.webcam = opts;
getUserMedia(opts, function(stream){
  if (opts.context === 'webrtc') {
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
    opts.context = 'flash';
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
    app.ctx.drawImage(opts.videoEl, 0, 0, opts.width, opts.height);

  // Otherwise, if the context is Flash, we ask the shim to
  // directly call window.webcam, where our shim is located
  // and ask it to capture for us.
  } else if(opts.context === 'flash'){
    window.webcam.capture();
    // flash
  }
  else{
    //alert('No context was supplied to getSnapshot()');
  }
};
setInterval(getSnapshot, 500);