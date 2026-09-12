(function () {
  'use strict';

  const stage = document.querySelector('.stage, .videoWrap');
  const controls = document.querySelector('.controls');
  const video = document.querySelector('video');
  const canvas = document.querySelector('canvas');
  if (!stage || !video || !canvas) return;

  // Ensure mobile browsers use the inline rear-facing camera presentation.
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');

  const fullButton = document.createElement('button');
  fullButton.id = 'scannerFullscreenButton';
  fullButton.type = 'button';
  fullButton.textContent = '⛶ Full Screen Scanner';

  const exitButton = document.createElement('button');
  exitButton.id = 'scannerFullscreenExit';
  exitButton.type = 'button';
  exitButton.setAttribute('aria-label', 'Exit full screen scanner');
  exitButton.textContent = '×';
  document.body.appendChild(exitButton);

  if (controls) controls.appendChild(fullButton);

  function enterScannerFullscreen() {
    document.body.classList.add('scanner-fullscreen');
    if (stage.requestFullscreen) {
      stage.requestFullscreen({ navigationUI: 'hide' }).catch(function () {});
    } else if (stage.webkitRequestFullscreen) {
      stage.webkitRequestFullscreen();
    }
  }

  function exitScannerFullscreen() {
    document.body.classList.remove('scanner-fullscreen');
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(function () {});
    } else if (document.webkitFullscreenElement && document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }

  fullButton.addEventListener('click', enterScannerFullscreen);
  exitButton.addEventListener('click', exitScannerFullscreen);
  document.addEventListener('fullscreenchange', function () {
    if (!document.fullscreenElement) document.body.classList.remove('scanner-fullscreen');
  });
  document.addEventListener('webkitfullscreenchange', function () {
    if (!document.webkitFullscreenElement) document.body.classList.remove('scanner-fullscreen');
  });

  // Recalculate canvas dimensions when the camera starts or the phone rotates.
  function syncCanvasSize() {
    if (video.videoWidth && video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }
  }
  video.addEventListener('loadedmetadata', syncCanvasSize);
  window.addEventListener('orientationchange', function () {
    setTimeout(syncCanvasSize, 250);
  });
  window.addEventListener('resize', syncCanvasSize);
}());
