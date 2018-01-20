//initialize the promise library
$q = window.Q;
//console.log('q.js initialized');

//Queries Object
(function(global) {
	function Queries() {
		this.clm = com.veeva.clm;
        this.ds = ds;
	};
	
    Queries.prototype.getCurrentObjectId = function(objectName, id) {
        var deferred = $q.defer();
        try {
            ds.getDataForCurrentObject(objectName, id).then(function(result) {
                deferred.resolve(result);
            });
        } catch (e) {
            _this.consoleLog('getCurrentObjectId - error', e);
        }

        return deferred.promise;
    };
    
    Queries.prototype.dsQueryRecord = function(queryObject, field, fieldValue, collections, condition) {
        var _this = this,
            deferred = $q.defer(),
            queryConfig = {object: 'Account', fields: ['FirstName', 'LastName'], where: '', sort: [], limit: '2'};
        _this.consoleLog('dsQueryRecord - entering');
        _this.consoleLog('dsQueryRecord', queryObject);
        try {
            ds.queryRecord(queryConfig).then(function(result) {
                _this.consoleLog('dsQueryRecord resolved ');
                deferred.resolve(result.data);
            });
        } catch (e) {
            _this.consoleLog('dsQueryRecord - error', e);
        }

        _this.consoleLog('dsQueryRecord returns ');
        return deferred.promise;
    
    };

	Queries.prototype.dsRunQuery = function(queryObject, field, fieldValue, collections, condition) {
		var _this = this,
            deferred = $q.defer();
        _this.consoleLog('queryRecord - entering');
        _this.consoleLog('queryObject', queryObject);
		if (collections) {
			queryObject.where += ds.getInStatement(collection); //where: 'TerritoryId IN ' + inTerr //where: 'Account_vod__c =\''+ accountId +'\''
		}

		if (condition) {
            queryObject.where += condition + '\''; //where: 'UserId = '' + userId + '''
		}
        
        try {
            ds.runQuery(queryObject).then(function(result) {
                _this.consoleLog('queryRecord resolved ');
                deferred.resolve(result.data);
            });
        } catch (e) {
            _this.consoleLog('dsRunQuery - error', e);
        }

        _this.consoleLog('queryRecord returns ');
        return deferred.promise;
	}
    
    Queries.prototype.clmQueryRecord = function(queryObject, callback) {
		var _this = this,
            deferred = $q.defer();
        _this.consoleLog('clmQueryRecord - entering');
        _this.consoleLog('queryObject', queryObject);
        console.log('callback :');
        console.log(callback);
        /*_this.consoleLog('callback', callback);*/
        try {
            _this.clm.queryRecord(queryObject.object, queryObject.fields, queryObject.where, queryObject.sort, queryObject.limit, callback).then(function(result) {
                _this.consoleLog('queryRecord resolved ');
                deferred.resolve(result.data);
            });
        } catch (e) {
            _this.consoleLog('clmQueryRecord - error', e);
        }

        _this.consoleLog('queryRecord returns ');
        return deferred.promise;
	}
    
    Queries.prototype.viewRecord = function(configObject) {
		var _this = this,
            deferred = $q.defer();
        _this.consoleLog('viewRecord - entering');
        _this.consoleLog('configObject', configObject);
        try {
            ds.viewRecord(configObject).then(function(resp) {}, function(err) {});
        } catch (e) {
            _this.consoleLog('viewRecord - error', e);
        }
      /*  ds.viewRecord(configObject).then(function(resp) {
            _this.consoleLog('viewRecord resolved - success ' + resp);
            deferred.resolve(resp);
            },function(err) {
            _this.consoleLog('viewRecord resolved - error', err);
           deferred.resolve(err);
        });
        
        _this.consoleLog('viewRecord returns ');
        return deferred.promise;*/
	};
    
    Queries.prototype.newRecord = function(configObject) {
		var _this = this,
            deferred = $q.defer();
        _this.consoleLog('newRecord - entering');
        _this.consoleLog('configObject', configObject);
        try {
            ds.newRecord(configObject).then(function(resp) {}, function(err) {});
        } catch (e) {
            _this.consoleLog('newRecord - error', e);
        }
        /*
        ds.newRecord(configObject).then(function(resp) {
            _this.consoleLog('newRecord resolved - success ' + resp);
            deferred.resolve(resp);
        }, function(err) {
            _this.consoleLog('newRecord resolved - error', err);
            deferred.resolve(err);
        });
        
        _this.consoleLog('newRecord returns ');
        return deferred.promise;
        */
	};
    
/*    Queries.prototype.init = function() {
        var _this = this;
        _this.clm = com.veeva.clm;
        _this.ds = ds;
    }*/
    
	//jscs:disable
	Queries.prototype.queryConfig = {
		suggestions: {
	        object: 'Suggestion_vod__c',
	        fields: ['OwnerId', 'Account_vod__c','CreatedDate', 'RecordTypeId', 'Id', 'Marked_As_Complete_vod__c', 'Actioned_vod__c', 'Dismissed_vod__c', 'Title_vod__c', 'Reason_vod__c', 'Posted_Date_vod__c', 'Expiration_Date_vod__c'],
	        where: '',
            sort: [],
            limit: ''
	    },
	    recordTypes: {
	        object: 'RecordType',
	        fields: ['Id', 'DeveloperName'],
	        where: 'SobjectType IN '
	    },
	    suggestionFeedback: {
	        object: 'Suggestion_Feedback_vod__c',
	        fields: ['Suggestion_vod__c'],
	        where: '',
            sort: [],
            limit: ''
        },
	    suggestionTags: {
	        object: 'Suggestion_Tag_vod__c',
	        fields: ['Product_Name__c', 'Suggestion_vod__c', 'Driver_vod__c'],
	        where: 'Suggestion_vod__c IN ',
            sort: [],
            limit: ''
	    },
        accounts: {
            object: 'Account',
            fields: ['Name', 'Id', 'FirstName', 'LastName'],
            where: '',
            sort: [],
            limit: ''
        }
	};
    //jscs:enable
    
	$.extend(Queries.prototype, Util.prototype);
    global.Queries = Queries;

})(this);

/*$(function() {
    var queries = new Queries();
    queries.init();
});*/