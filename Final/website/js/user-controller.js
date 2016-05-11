var userController = {
	settings: {
		lock: null,
		login: null,
		logout: null
	},
	init: function(lock) {
		this.login = $('#auth0-login');
		this.logout = $('#auth0-logout');

		this.lock = new Auth0Lock('lXdInlGEHmKqFF2d60I6VpSS41uvpIHM', 'samkroon.auth0.com');

		if (localStorage.getItem('userToken')) {
			this.configureAuthenticatedRequests();

			this.login.hide();
			this.logout.show();
		}

		this.wireEvents();
	},
	configureAuthenticatedRequests: function(){
		$.ajaxSetup({
		  'beforeSend': function(xhr) {
		      xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('userToken'));
		  }
		});
	},
	wireEvents: function() {
		var that = this;

		this.login.click(function(e){
			var params = {
				authParams: {
					scope: 'openid email user_metadata picture'
				}
			};

		  	that.lock.show(params, function(err, profile, token) {
			    if (err) {
			      // Error callback
			      alert('There was an error');
			    } else {
			      // Save the JWT token.
			      localStorage.setItem('userToken', token);

			      that.configureAuthenticatedRequests();

			      that.login.hide();
			      that.logout.show();
			    }
	  		});
		});

		this.logout.click(function(e){
			localStorage.removeItem('userToken');

			that.logout.hide();
			that.login.show();
		});
	}
};
