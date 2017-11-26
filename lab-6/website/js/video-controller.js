var videoController = {
    data: {
        config: null
    },
    uiElements: {
        videoCardTemplate: null,
        videoList: null,
        loadingIndicator: null,
        profileButton: null        
    },
    init: function (config) {
        this.uiElements.videoCardTemplate = $('#video-template');
        this.uiElements.videoList = $('#video-list');
        this.uiElements.loadingIndicator = $('#loading-indicator');
        this.uiElements.profileButton = $('#user-profile');
        
        this.data.config = config;

        this.connectToFirebase();
    },
    addVideoToScreen: function (videoId, videoObj) {
        var that = this;
        
        // clone the template video element
        var newVideoElement = this.uiElements.videoCardTemplate.clone().attr('id', videoId);

        newVideoElement.click(function() {
            // the user has clicked on the delete video button
            var isDelete = false;
            var targetID = $(event.target).get(0).id;
            if (targetID == $('#delete-video-button').get(0).id
                || targetID == $('#delete').get(0).id) {
                isDelete = true;
            }

            // the user has clicked on the video... let's play it, or pause it depending on state
            var video = newVideoElement.find('video').get(0);

            if (newVideoElement.is('.video-playing')) {
                video.pause();
                $(video).removeAttr('controls'); // remove controls
                newVideoElement.removeClass('video-playing');
            }
            else {
                if (!isDelete) {
                    newVideoElement.addClass('video-playing');
                    $(video).attr('controls', ''); // show controls
                    video.play();
                }
            }

            // call delete function
            if (isDelete) {
                that.deleteVideo(nvideoElement);
            }
        });

        this.updateVideoOnScreen(newVideoElement, videoObj);

        this.uiElements.videoList.prepend(newVideoElement);
    },
    deleteVideo: function (videoElement) {
        // get video id to be deleted
        var videoId = videoElement.get(0).id;
        
        // get delete video button and hide
        var deleteButton = videoElement.find('#delete-video-button');
        deleteButton.hide()

        var apiUrl = this.data.config.apiBaseUrl + '/delete-video?id=' + encodeURI(videoId);
        $.ajax({
            url: apiUrl,
            type: 'DELETE',
        }).always(function (response) {
            console.log('Call delete video API done.');
            console.log(response);
            // show delete video button
            deleteButton.css('display', 'inline-block');                
        });
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

            // show delete video button
            if (that.uiElements.profileButton.is(':visible')) {                
                videoElement.find('#delete-video-button').css('display', 'inline-block');
            }
        }

        // set the video URL
        videoElement.find('video').attr('src', videoObj.source);
    },
    getElementForVideo: function(videoId) {
        return $('#' + videoId);
    },
    connectToFirebase: function () {
        var that = this;

        firebase.initializeApp(that.data.config.firebase);
        
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
                that.getElementForVideo(childSnapshot.key).remove();
            });
    }
};
