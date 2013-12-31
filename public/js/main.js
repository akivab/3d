$(function () {
  var $firstMoment = $('.moment').first();

  var $mainPerspective = $('.perspective.primary:first'),
      $mainVideo = $mainPerspective.find('video');
      mainVideo = $mainVideo.get(0);

  var $secondaryPerspectives = $('.perspective.secondary'),
      $secondaryVideos = $secondaryPerspectives.find('video'),
      secondarySources = $secondaryVideos.map(function () { return this.src; });

  var newSeekTime = 0;

  $firstMoment.on('click', '.perspective.secondary', function (e) {
    var clickedVideo = $(this).find('video').get(0);
    newSeekTime = clickedVideo.currentTime;

    $secondaryPerspectives.removeClass('playing');
    $(this).addClass('playing');

    mainVideo.src = clickedVideo.src;
    mainVideo.load();
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

    if (newSeekTime) {
      this.currentTime = newSeekTime;
    }
    this.play();
  });

  $mainVideo.on('playing', function (e) {
    console.log('playing', e);
    var elapsedTime = this.currentTime;

    $secondaryVideos.each(function () {
      this.currentTime = elapsedTime;
      this.play();
    });
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
  $secondaryPerspectives = $('.perspective.secondary').first().addClass('playing');
  mainVideo.src = secondarySources[0];
  mainVideo.load();
});
