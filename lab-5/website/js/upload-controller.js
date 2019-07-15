var uploadController = {
    data: {
        config: null
    },
    uiElements: {
        uploadButton: null,
        uploadProgressBar: null
    },
    init: function (configConstants) {
        this.data.config = configConstants;
        this.uiElements.uploadButton = $('#upload');
        this.uiElements.uploadButtonContainer = $('#upload-video-button');
        this.uiElements.uploadProgressBar = $('#upload-progress');

        this.wireEvents();
    },
    wireEvents: function () {
        var that = this;

        this.uiElements.uploadButton.on('change', function (result) {
            var file = $('#upload').get(0).files[0];
            var requestDocumentUrl = that.data.config.apiBaseUrl + '/s3-upload-link?filename=' + encodeURI(file.name) + '&filetype=' + encodeURI(file.type);

            $.get(requestDocumentUrl, function (data, status) {
                console.log(data);
                that.upload(file, data, that)
            });

            this.value = null;
        });
    },
    upload: function (file, data, that) {
        this.uiElements.uploadButtonContainer.hide();
        this.uiElements.uploadProgressBar.show();
        this.uiElements.uploadProgressBar.find('.progress-bar').css('width', '0');

        var fd = new FormData();
        for (var key in data.fields) {
            if (data.fields.hasOwnProperty(key)) {
                var value = data.fields[key];
                fd.append(key, value);
            }
        }
        fd.append('acl', 'private');
        fd.append('file', file);

        $.ajax({
            url: data.url,
            type: 'POST',
            data: fd,
            processData: false,
            contentType: false,
            xhr: this.progress,
            beforeSend: function (req) {
                req.setRequestHeader('Authorization', '');
            }
        }).done(function (response) {
            that.uiElements.uploadButtonContainer.show();
            that.uiElements.uploadProgressBar.hide();
            alert('Uploaded Finished');
        }).fail(function (response) {
            that.uiElements.uploadButtonContainer.show();
            that.uiElements.uploadProgressBar.hide();
            alert('Failed to upload');
        })
    },
    progress: function () {
        var xhr = $.ajaxSettings.xhr();
        xhr.upload.onprogress = function (evt) {
            var percentage = evt.loaded / evt.total * 100;
            $('#upload-progress').find('.progress-bar').css('width', percentage + '%');
        };
        return xhr;
    }
}
