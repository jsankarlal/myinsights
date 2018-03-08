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
        var _this = this,
            deferred = $q.defer();
        _this.consoleLog('FRM Testing::INI');
        try {
            // _this.getCurrentObjectId('User', 'Id').then(function(result) {
            //     _this.consoleLog('getCurrentObjectId :', JSON.stringify(result, null, '\t'));
            // });
			_this.consoleLog('getDataForCurrentObject STARTS :', result);
			
            ds.getDataForCurrentObject('User', 'Id').then(function(result) {
				//console.log(result);
                _this.consoleLog('getDataForCurrentObject Response :', result);
				_this.consoleLog('getDataForCurrentObject Response :', result.User.Id);
				deferred.resolve(result.User.Id);
            });
			
			_this.consoleLog('After getDataForCurrentObject :');

            // _this.getCurrentObjectId('User', 'Id').then(function(result) {
            //     _this.consoleLog('getCurrentObjectId :', result.User.Id);
            // });

            _this.dsRunQuery(_this.queryConfig.incidents).then(function(incidents) {
                 _this.consoleLog('Incidents Response :', incidents.length);
            });

            _this.dsRunQuery(_this.queryConfig.calls).then(function(calls) {
                 _this.consoleLog('calls Response : ', calls.length);
            });
			
			/* _this.dsRunQuery(_this.queryConfig.incidentsById).then(function(incidents) {
                 _this.consoleLog('incidentsById Response : ', incidents.length);
            });
			
			_this.dsRunQuery(_this.queryConfig.callsById).then(function(calls) {
                 _this.consoleLog('callsById Response : ', calls.length);
            }); */

            _this.dsRunQuery(_this.queryConfig.accounts).then(function(accounts) {
                _this.consoleLog('accounts Response length : ', accounts.length);
           
            });

            _this.dsRunQuery(_this.queryConfig.users).then(function(users) {
                _this.consoleLog('users Response :', users.length);
           
            });

            _this.dsRunQuery(_this.queryConfig.trends).then(function(trends) {
                _this.consoleLog('trends Response : ', trends.length);
           
            });

            _this.dsRunQuery(_this.queryConfig.frmAccounts).then(function(frmAccounts) {
                _this.consoleLog('frmAccounts Response :', frmAccounts.length);
           
            });

            // _this.dsRunQuery(_this.queryConfig.allTierdAccounts).then(function(allTierdAccounts) {
            //     _this.consoleLog('allTierdAccounts Response length:', allTierdAccounts.length);
           
            // });
            
        } catch (error) {
            _this.consoleLog('Error in FRM :', JSON.stringify(error, null, '\t'));
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
