var resource = {};
//Util Object
(function(global) {
	function Util() {
        
    };
    
    Util.prototype.addSpinner = function(container) {
        container.html('<div class="ab-pos-center text-center"><div><span class="fa fa-spinner fa-pulse fa-3x fa-fw"></span></div><div class="loading-txt"></div></div>');
    };
    
    Util.prototype.setDataAdapter = function() {
        var _this = this;
        _this.application = window.location.host.indexOf('localhost:') == 0 || window.location.host.indexOf('test-myinsights.herokuapp.com') == 0 ? 'localhost' : 'iRep';
        _this.consoleLog('Current Application', _this.application);
    };
    
    Util.prototype.fetchResource = function(path, type) {
        var _this = this,
         deferred = $q.defer();
        _this.consoleLog('fetchResource - entering');
        _this.consoleLog('path', path);

        $.ajax({
            method: 'GET',
            url: path,
            type: type,
            success: function(data) {
                var path = this.url;
                resource[this.url] = data;
                deferred.resolve(data);
            },

            error: function(err) {
                deferred.resolve(err);
            }
        });
        
        return deferred.promise;
    }
    
    Util.prototype.fillTemplate = function(container, templateObj, object, appendFlag, callback) {
         var _this = this,
            template = _.template(templateObj.trim()),
            markup = template({result: object});
        if (_this.appendFlag) {
            container.append(markup);
        } else {
            container.html(markup);
        }
        
        if (callback) {
           callback(); 
        }
        
    }   
        
    Util.prototype.consoleLog = function(message, object) {
        if (object) {
            $('#response').append('<pre>' + message + ' - ' + JSON.stringify(object, null, '\t') + ' </pre>');
        } else {
            $('#response').append('<pre>' + message + '</pre>');
        }
        
    };
 
    global.Util = Util;
	
})(this);