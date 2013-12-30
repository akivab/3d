console.log('I love Israel!');

$(document).ready(function () {
        var $mainVideo = $(".perspective.primary video");
        var videos = $(".perspective.secondary video");
        var previousTime = 0;
        var isPlaying = false;

        $mainVideo.bind("play", videoPlayHandler);
        $mainVideo.bind("pause", videoPauseHandler);
        $mainVideo.bind("canplay", videoSwitchHandler);
        $mainVideo.bind("seeked", videoSeekedHandler);
        $mainVideo.bind("ended", videoEndedHandler);
        //$mainVideo.bind("timeupdate", videoTimedUpdateHandler);

        $(".perspective-holder").on("click","video", function() {
          changevideo(this.src);
        });

        function updateVideoTime(currentTime) {
          for (var i = 0; i < videos.length; i++) {
            var video = videos[i];
            video.currentTime = currentTime;
          }
        }

        function videoPlayHandler(e) {
            var mainVideo = $mainVideo.get(0);
            updateVideoTime(mainVideo.currentTime);
            for (var i = 0; i < videos.length; i++) {
              var video = videos[i];
              video.play();
            }
            isPlaying = true;
        }

        function videoPauseHandler(e) {
            for (var i = 0; i < videos.length; i++) {
              var video = videos[i];
              video.pause();
            }
        }

        function changevideo(video) { 
            var mainVideo = $mainVideo.get(0);
            previousTime = mainVideo.currentTime;
            mainVideo.src = video;
        }

        function videoSwitchHandler()
        {
            var mainVideo = $mainVideo.get(0);
            mainVideo.currentTime = previousTime;
            mainVideo.play();
            updateVideoTime(previousTime);
        }

        function videoSeekedHandler()
        {
            var mainVideo = $mainVideo.get(0);
            updateVideoTime(mainVideo.currentTime);
        }

        function videoTimedUpdateHandler()
        {
            var mainVideo = $mainVideo.get(0);
            updateVideoTime(mainVideo.currentTime);
        }

        function videoEndedHandler() 
        {
           // alert("Ended");
        }
    });
