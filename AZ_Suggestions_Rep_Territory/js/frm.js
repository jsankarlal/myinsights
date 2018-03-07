(function(global) {
    function FRM() {
     // Constructor
    };
    
    FRM.prototype.bindFRMEvents = function() {
        var _this = this,
            $document = $(document);
        
    }
    
    FRM.prototype.renderFRM = function(container, kpiName) {
        var _this = this;
        //fillTemplate(container, templateObj, object, appendFlag, callback)
        _this.fillTemplate(container, componentsTemplate[_this.kpiListTemplatePath], resource[_this.kpiDataPath][kpiName], false);
    }

    FRM.prototype.getIncidents = function(container, kpiName) {
        var _this = this;
    }
  
    FRM.prototype.init = function() {
        var _this = this;
        _this.consoleLog('FRM Testing::INI');
        try {
            
            _this.dsRunQuery(_this.queryConfig.incidents).then(function(incidents) {
                _this.consoleLog('Incidents Response', incidents);
            });

            
            _this.dsRunQuery(_this.queryConfig.calls).then(function(calls) {
                _this.consoleLog('Incidents Response', calls);
            });

            _this.dsRunQuery(_this.queryConfig.accounts).then(function(accounts) {
                _this.consoleLog('accounts Response', accounts);
           
            });
            
        } catch (error) {
            _this.consoleLog('Error in FRM', error);
        }
    }
    
    _.extend(FRM.prototype, Queries.prototype);
    global.FRM = FRM;
}(this));

$(function() {
	console.log('document ready');
	var frmObject = new FRM();
    
    $('#response').append('<pre>FRM document-ready</pre>');
    
	frmObject.init();
});
