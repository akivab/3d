$(function () {
  var $firstMoment = $('.moment').first();

  var $mainPerspective = $('.perspective.primary:first'),
      $mainVideo = $mainPerspective.find('video');
      mainVideo = $mainVideo.get(0);

  var mainVideoIndex = 0;

  var $secondaryPerspectives = $('.perspective.secondary'),
      $secondaryVideos = $secondaryPerspectives.find('video'),
      secondarySources = $secondaryVideos.map(function () { return this.src; });

  function reset() {
    var durations = $secondaryVideos.map(function () { return this.duration  });
    var starttimes = $secondaryPerspectives.map(function() { return $(this).data('starttime') / 1000; });

    var latestStart = starttimes[0];
    for (var i = 1; i < starttimes.length; ++i) {
      if (starttimes[i] > latestStart) latestStart = starttimes[i];
    }

    $secondaryVideos.map(function(i) {
      var newStart = starttimes[i];
      var timeDiff = latestStart - newStart;
      if (timeDiff > durations[i])
        return;

      this.play();
      if (i === mainVideoIndex) {
        mainVideo.currentTime = timeDiff;
      }
      
      this.currentTime = timeDiff;

      console.log('Video stuff', this.currentTime, timeDiff, newStart, durations[i], starttimes[i]);
    });
  }

  $firstMoment.on('click', '.perspective.secondary', function (e) {
    var clickedVideo = $(this).find('video').get(0);
    $secondaryPerspectives.removeClass('playing');
    $(this).addClass('playing');

    mainVideoIndex = $(this).data('index');
    mainVideo.src = clickedVideo.src;
    mainVideo.load();
    setTimeout(reset, 100);
  });

  $firstMoment.on('click', '.perspective.primary', function (e) {
    var clickedVideo = $(this).find('video').get(0);

    if (clickedVideo.paused) {
      clickedVideo.play();
    } else {
      clickedVideo.pause();
    }
  });

  $mainVideo.on('error', 'video', function (e) {
    console.log('There was an error: ', e);
  });

  $mainVideo.on('canplay', function (e) {
    console.log('canplay', e);

    this.play();
  });

  $mainVideo.on('playing', function (e) {
    console.log('playing', e);
    // var elapsedTime = this.currentTime;

    $secondaryVideos.each(function () {
      // this.currentTime = elapsedTime;
      this.play();
    });
    setTimeout(reset, 100);
  });

  $mainVideo.on('pause', function (e) {
    console.log('pause', e);
    $secondaryVideos.each(function () {
      this.pause();
    });
  });

  $mainVideo.on('ended', function (e) {
    console.log('ended', e);
    this.currentTime = 0;
    this.play();
  });

  // Start the things
  mainVideo.src = secondarySources[0];
  mainVideo.load();
});
