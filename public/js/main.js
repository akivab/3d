console.log('I love Israel!');

$(document).ready(function () {
        var $mainVideo = $(".perspective primary");
        var videos = $(".perspective secondary");
        var percentComplete = 0;
        
        //$mainVideo.bind("play", videoPlayHandler);
        $mainVideo.bind("pause", videoPauseHandler);
        $mainVideo.bind("canplay", videoSwitchHandler);
        $mainVideo.bind("seeked", videoSeekedHandler);
        $mainVideo.bind("ended", videoEndedHandler);
        //$mainVideo.bind("timeupdate", videoTimedUpdateHandler);

        $(".perspective-holder").on("click","video", function() {
          var sources = this.getElementsByTagName('source');
          changevideo(sources[0].src);
        });

        function updateVideoTime(percent) {
          for (var i = 0; i < videos.length; i++) {
            var video = videos[i].get(0);
            video.currentTime = percent * video.duration;
          }
        }

        function videoPlayHandler(e) {
            var mainVideo = $mainVideo.get(0);
            var percent = mainVideo.currentTime / mainVideo.duration;
            updateVideoTime(percent);
            for (var i = 0; i < videos.length; i++) {
              var video = videos[i].get(0);
              video.play();
            }
        }

        function videoPauseHandler(e) {
            for (var i = 0; i < videos.length; i++) {
              var video = videos[i].get(0);
              video.pause();
            }
        }

        function changevideo(video) { 
            var mainVideo = $mainVideo.get(0);
            percentComplete = mainVideo.currentTime / mainVideo.duration;
            mainVideo.src = video;
        }

        function videoSwitchHandler()
        {
            var mainVideo = $mainVideo.get(0);
            mainVideo.currentTime = percentComplete * mainVideo.duration;
            mainVideo.play();
            updateVideoTime(percentComplete);
        }

        function videoSeekedHandler()
        {
            var mainVideo = $mainVideo.get(0);
            var percent = mainVideo.currentTime / mainVideo.duration;
            updateVideoTime(percent);
        }

        function videoTimedUpdateHandler()
        {
            var mainVideo = $mainVideo.get(0);
            var percent = mainVideo.currentTime / mainVideo.duration;
            updateVideoTime(percent);
        }

        function videoEndedHandler() 
        {
            alert("Ended");
        }
    });
