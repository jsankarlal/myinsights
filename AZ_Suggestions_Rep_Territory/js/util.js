//Util Object
(function(global) {
	function Util() {

    };

    Util.prototype.consoleLog = function(message, object) {
        if (object) {
            $('#response').append('<pre>' + message + ' - ' + JSON.stringify(object, null, '\t') + ' </pre>');
        } else {
            $('#response').append('<pre>' + message + '</pre>');
        }
    };
 
    global.Util = Util;
	
})(this);