var videoController = {
	settings: {
		data: {}
	},
	init: function(lock) {
		this.getVideoList();
	},
	getVideoList: function() {
		var that = this;
		var url = 'https://tlzyo7a7o9.execute-api.us-east-1.amazonaws.com/dev/videos';

		$.get(url, function(data, status){
			that.settings.data = data;
			that.updateVideoFrontpage();
		});
	},
	updateVideoFrontpage: function() {
		var baseUrl = this.settings.data.domain;
		var bucket = this.settings.data.bucket;
		var fragment = $('.sample');

		for (var i = 0; i < this.settings.data.files.length; i++) {
				var video = this.settings.data.files[i];

				var clone = fragment.clone()
														.removeClass('sample')
														.removeClass('hidden');

				clone.find('source')
						 .attr('src', baseUrl + '/' + bucket + '/' + video.filename);

				console.log(baseUrl + '/' + bucket + '/' + video.filename);

				$('#videos').prepend(clone);
		}
	}
}
