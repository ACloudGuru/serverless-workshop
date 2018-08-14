var userController = {
    data: {
        auth0Lock: null,
        config: null
    },
    uiElements: {
        loginButton: null,
        logoutButton: null,
        profileButton: null,
        profileNameLabel: null,
        profileImage: null,
        uploadButton: null
    },
    init: function (config) {
        this.uiElements.loginButton = $('#auth0-login');
        this.uiElements.logoutButton = $('#auth0-logout');
        this.uiElements.profileButton = $('#user-profile');
        this.uiElements.profileNameLabel = $('#profilename');
        this.uiElements.profileImage = $('#profilepicture');
        this.uiElements.uploadButton = $('#upload-video-button');

        this.data.config = config;
        var params = {
            autoclose: true,
            auth: {
                params: {
                    scope: 'openid profile email user_metadata picture'
                },
                responseType: 'id_token token'
            }
        };
        this.data.auth0Lock = new Auth0Lock(config.auth0.clientId, config.auth0.domain, params);

        // check to see if the user has previously logged in
        var accessToken = localStorage.getItem('accessToken');
        var idToken = localStorage.getItem('idToken');

        this.wireEvents();

        if (accessToken && idToken) {
            this.getUserProfile(accessToken, idToken);
        }
    },
    configureAuthenticatedRequests: function () {
        $.ajaxSetup({
            'beforeSend': function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('idToken'));
            }
        });
    },
    getUserProfile: function (accessToken, idToken) {
        var that = this;
        this.data.auth0Lock.getUserInfo(accessToken, function (error, profile) {

            if (error) {
                return alert('There was an error getting the profile: ' + error.message);
            }

            that.configureAuthenticatedRequests();
            that.showUserAuthenticationDetails(profile);

        });
    },
    showUserAuthenticationDetails: function (profile) {
        var showAuthenticationElements = !!profile;

        if (showAuthenticationElements) {
            this.uiElements.profileNameLabel.text(profile.nickname);
            this.uiElements.profileImage.attr('src', profile.picture);
            this.uiElements.uploadButton.css('display', 'inline-block');
        }

        this.uiElements.loginButton.toggle(!showAuthenticationElements);
        this.uiElements.logoutButton.toggle(showAuthenticationElements);
        this.uiElements.profileButton.toggle(showAuthenticationElements);
    },
    wireEvents: function () {
        var that = this;

        this.uiElements.loginButton.click(function (e) {
            that.data.auth0Lock.show();
        });

        this.uiElements.logoutButton.click(function (e) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('idToken');

            that.uiElements.logoutButton.hide();
            that.uiElements.profileButton.hide();
            that.uiElements.loginButton.show();
            that.uiElements.uploadButton.hide();
        });

        this.data.auth0Lock.on('authenticated', function (authResult) {
            localStorage.setItem('accessToken', authResult.accessToken);
            localStorage.setItem('idToken', authResult.idToken);
            that.getUserProfile(authResult.accessToken, authResult.idToken);
        });

        this.uiElements.profileButton.click(function (e) {

            var url = that.data.config.apiBaseUrl + '/user-profile';
            var accessToken = localStorage.getItem('accessToken');
            var data = {
                accessToken: accessToken
            };
            var button = $(this);
            button.button('loading');

            $.get(url, data).done(function (data, status) {
                // save user profile data in the modal
                $('#user-profile-raw-json').text(JSON.stringify(data, null, 2));
                $('#user-profile-modal').modal();
                button.button('reset');
            }).fail(function (error) {
                alert('Can\'t retreive user information');
                button.button('reset');
                console.error(error);
            });
        });
    }
};
