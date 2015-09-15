Starter_Services
.factory('Camera', ['$q', function($q) {

    return {
        getPicture: function(options) {
            var q = $q.defer();

            navigator.camera.getPicture(function(result) {
                q.resolve(result);
            }, function(err) {
                q.reject(err);
            }, options);
            return q.promise;
        }
    }
}])

    .factory('fileReader', function($q) {

        return {
            readAsDataUrl: function(filePath) {

                var deferred = $q.defer();

                function gotFileEntry(fileEntry) {
                    fileEntry.file(gotFile, fail);
                }

                function gotFile(file){
                    readDataUrl(file);
                }

                function readDataUrl(file) {
                    var reader = new FileReader();
                    reader.onloadend = function(evt) {
                        console.log("Read as data URL");
                        fileContent = evt.target.result;
                        deferred.resolve(fileContent);

                    };
                    reader.readAsArrayBuffer(file);
                }

                function fail(evt) {
                    console.log(evt.target.error.code);
                }

                window.resolveLocalFileSystemURI(filePath, gotFileEntry, fail);

                return deferred.promise;
            }
        };
    })

    .factory('formDataObject', function() {
        return function(data) {
            var fd = new FormData();
            angular.forEach(data, function(value, key) {
                if(key == "file"){
                    fd.append(key,  new Blob([ value ], { type: "image/jpeg" }),"image.jpeg");
                }else{
                    fd.append(key, value);
                }

            });
            return fd;
        };
    });
