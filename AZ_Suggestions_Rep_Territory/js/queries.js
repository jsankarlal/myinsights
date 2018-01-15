//initialize the promise library
$q = window.Q;
//console.log("q.js initialized");

//Queries Object
(function(global) {
	function Queries() {
		
	};
	
    Queries.prototype.getCurrentObjectId = function(objectName, id) {
        var deferred = $q.defer();
        ds.getDataForCurrentObject(objectName, id).then(function(result) {
            deferred.resolve(result);
        });

        return deferred.promise;
    };
    
	Queries.prototype.queryRecord = function(queryObject, field, fieldValue, collections, condition) {
		var _this = this,
            deferred = $q.defer();
        _this.consoleLog('queryRecord - entering');
        _this.consoleLog('queryObject', queryObject);
		if (collections) {
			queryObject.where += ds.getInStatement(collection); //where: 'TerritoryId IN ' + inTerr //where: 'Account_vod__c =\''+ accountId +'\''
		}

		if (condition) {
            queryObject.where += condition + '\''; //where: "UserId = '" + userId + "'"
		}
        
        ds.runQuery(queryObject).then(function(result) {
            _this.consoleLog('queryRecord resolved ');
            deferred.resolve(result.data);
        });

        _this.consoleLog('queryRecord returns ');
        return deferred.promise;
	}
    
    Queries.prototype.viewRecord = function(configObject) {
		var _this = this,
            deferred = $q.defer();
        _this.consoleLog('viewRecord - entering');
        _this.consoleLog('configObject', configObject);
        ds.viewRecord(configObject).then(function(resp) {}, function(err) {});

/*        ds.viewRecord(configObject).then(function(resp) {
            _this.consoleLog('viewRecord resolved - success ' + resp);
            deferred.resolve(resp);
            },function(err) {
            _this.consoleLog('viewRecord resolved - error', err);
           deferred.resolve(err);
        });
        */
        _this.consoleLog('viewRecord returns ');
        return deferred.promise;
	};
    
    Queries.prototype.newRecord = function(configObject) {
		var _this = this,
            deferred = $q.defer();
        _this.consoleLog('newRecord - entering');
        _this.consoleLog('configObject', configObject);
        
        ds.newRecord(configObject).then(function(resp) {}, function(err) {});
        /*
        ds.newRecord(configObject).then(function(resp) {
            _this.consoleLog('newRecord resolved - success ' + resp);
            deferred.resolve(resp);
        }, function(err) {
            _this.consoleLog('newRecord resolved - error', err);
            deferred.resolve(err);
        });
*/        
        _this.consoleLog('newRecord returns ');
        return deferred.promise;
	};
    
	//jscs:disable
	Queries.prototype.queryConfig = {
		suggestions: {
	        object: 'Suggestion_vod__c',
	        fields: ['OwnerId', 'Account_vod__c','CreatedDate', 'RecordTypeId', 'Id', 'Marked_As_Complete_vod__c', 'Actioned_vod__c', 'Dismissed_vod__c', 'Title_vod__c', 'Reason_vod__c', 'Posted_Date_vod__c', 'Expiration_Date_vod__c'],
	        where: ''
	    },
	    recordTypes: {
	        object: 'RecordType',
	        fields: ['Id', 'DeveloperName'],
	        where: 'SobjectType IN '
	    },
	    suggestionFeedback: {
	        object: 'Suggestion_Feedback_vod__c',
	        fields: ['Suggestion_vod__c'],
	        where: ''
        },
	    suggestionTags: {
	        object: 'Suggestion_Tag_vod__c',
	        fields: ['Product_Name__c', 'Suggestion_vod__c', 'Driver_vod__c'],
	        where: 'Suggestion_vod__c IN '
	    },
        accounts: {
            object: 'Account',
            fields: ['Name', 'Id'],
            where: ' '
        }
	};
    //jscs:enable
    
	$.extend(Queries.prototype, Util.prototype);
    global.Queries = Queries;

})(this);