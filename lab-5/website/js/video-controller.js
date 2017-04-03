var videoController = {
    data: {
        config: null
    },
    uiElements: {
        videoCardTemplate: null,
        videoList: null,
        loadingIndicator: null
    },
    init: function (config) {
        this.uiElements.videoCardTemplate = $('#video-template');
        this.uiElements.videoList = $('#video-list');
        this.uiElements.loadingIndicator = $('#loading-indicator');

        this.data.config = config;

        this.connectToFirebase();
    },
    addVideoToScreen: function (videoId, videoObj) {
        // clone the template video element
        var newVideoElement = this.uiElements.videoCardTemplate.clone().attr('id', videoId);

        newVideoElement.click(function() {
            // the user has clicked on the video... let's play it, or pause it depending on state
            var video = newVideoElement.find('video').get(0);

            if (newVideoElement.is('.video-playing')) {
                video.pause();
                $(video).removeAttr('controls'); // remove controls
            }
            else {
                $(video).attr('controls', ''); // show controls
                video.play();
            }

            newVideoElement.toggleClass('video-playing');

        });

        this.updateVideoOnScreen(newVideoElement, videoObj);

        this.uiElements.videoList.prepend(newVideoElement);
    },
    updateVideoOnScreen: function(videoElement, videoObj) {

        if (videoObj.transcoding) {
            // the video is currently transcoding... hide the video and show the spinner
            videoElement.find('video').hide();
            videoElement.find('.transcoding-indicator').show();
        } else {
            // the video is not transcoding... show the video and hide the spinner
            videoElement.find('video').show();
            videoElement.find('.transcoding-indicator').hide();
        }

        // set the video URL
        videoElement.find('video').attr('src', videoObj.source);
    },
    getElementForVideo: function(videoId) {
        return $('#' + videoId);
    },
    connectToFirebase: function () {
        var that = this;

        /* PASTE CONFIG HERE */
        // var config = {
        //   apiKey: "",
        //   authDomain: "",
        //   databaseURL: "",
        //   storageBucket: "",
        // };

        firebase.initializeApp(config);

        var firebaseRef = firebase.database().ref();

        var firebaseVideoNodeRef = firebaseRef.child('videos');

        // fired when a new movie is added to firebase
        firebaseVideoNodeRef
            .on('child_added', function (childSnapshot, prevChildKey) {
                that.uiElements.loadingIndicator.hide();

                // add elements to the screen for the new video
                that.addVideoToScreen(childSnapshot.key, childSnapshot.val());
            });

        // fired when a movie is updated
        firebaseVideoNodeRef
            .on('child_changed', function (childSnapshot, prevChildKey) {

                // update the video object on screen with the new video details from firebase
                that.updateVideoOnScreen(that.getElementForVideo(childSnapshot.key), childSnapshot.val());
            });

        firebaseVideoNodeRef
            .on('child_removed', function (childSnapshot, prevChildKey) {

                // update the video object on screen with the new video details from firebase
                that.getElementForVideo(childSnapshot.key.remove());
            });
    }
};
