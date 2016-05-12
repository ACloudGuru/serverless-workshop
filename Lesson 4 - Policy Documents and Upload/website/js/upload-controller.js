var uploadController = {
  data: {
    config: null
  },
  uiElements: {
    uploadButton: null
  },
	init: function(configConstants) {
    this.data.config = configConstants;
    this.uiElements.uploadButton = $('#upload');

    this.wireEvents();
	},
  wireEvents: function() {
    var that = this;

    this.uiElements.uploadButton.on('change', function(result){
      var file = $('#upload').get(0).files[0];
      var requestDocumentUrl = that.data.config.apiBaseUrl + '/s3-policy-document?filename=' + encodeURI(file.name);

      $.get(requestDocumentUrl, function(data, status){
				that.upload(file, data)
			});
    });
  },
  upload: function(file, data) {
    var fd = new FormData();
    fd.append('key', data.key)
    fd.append('acl', 'private');
    fd.append('Content-Type', file.type);
    fd.append('AWSAccessKeyId', data.access_key);
    fd.append('policy', data.encoded_policy)
    fd.append('signature',data.signature);
    fd.append('file', file, file.name);

    $.ajax({
      url: data.upload_url,
      type: 'POST',
      data: fd,
      processData: false,
      contentType: false,
      xhr: this.progress,
      beforeSend : function(req) {
        req.setRequestHeader('Authorization', '');
      }
    }).done(function(response){
      alert('Uploaded Finished');
    }).fail(function(response){
      alert('Failed to upload');
    })
  },
  progress: function() {
    var xhr = $.ajaxSettings.xhr();
    xhr.upload.onprogress = function(evt){ console.log('progress', evt.loaded/evt.total*100) };
    return xhr;
  }
}
