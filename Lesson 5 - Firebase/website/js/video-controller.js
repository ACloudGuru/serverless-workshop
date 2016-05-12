var videoController = {
    data: {
        config: null
    },
    uiElements: {
        videoCardTemplate: null,
        videoList: null
    },
    init: function (config) {
        this.uiElements.videoCardTemplate = $('#video-template');
        this.uiElements.videoList = $('#video-list');

        this.data.config = config;

        this.wireEvents();

        this.connectToFirebase();
    },
    addVideoToScreen: function (videoObj) {
        // clone the template video element
        var newVideoElement = this.uiElements.videoCardTemplate.clone().removeAttr('id');

        // set the video URL
        newVideoElement.find('source').attr('src', videoObj.source);

        this.uiElements.videoList.prepend(newVideoElement);
    },
    connectToFirebase: function () {
        var that = this;

        var firebaseRef = new Firebase(this.data.config.firebaseUrl);

        // fired when a new movie is added to firebase
        firebaseRef.child('videos')
            .on('child_added', function (childSnapshot, prevChildKey) {
                var videoObj = childSnapshot.val();

                that.addVideoToScreen(videoObj);
            });
    },
    wireEvents: function () {
        var that = this;

        /*this.uiElements.profileButton.click(function (e) {
         var url = that.data.config.apiBaseUrl + 'user-profile';

         $.get(url, function (data, status) {
         // save user profile data in the modal
         $('#user-profile-raw-json').text(JSON.stringify(data, null, 2));
         $('#user-profile-modal').modal();
         })
         });*/
    }
};
