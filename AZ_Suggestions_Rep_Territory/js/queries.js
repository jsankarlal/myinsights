//initialize the promise library
$q = window.Q;
//console.log("q.js initialized");

//Queries Object
(function(global) {
	function Queries () {
		
	};
	
	Queries.prototype.queryRecord = function(queryObject, field, fieldValue, collections, condition) {
		var _this = this,
		    deferred = $q.defer();
        _this.consoleLog('queryRecord - entering');
        _this.consoleLog('queryObject-' , queryObject);
        
		if (collections) {
			queryObject.where += ds.getInStatement(collection); //where: 'TerritoryId IN ' + inTerr //where: 'Account_vod__c =\''+ accountId +'\''
		}
		
		if (condition) {
			queryObject.where += condition + '\'';  //where: "UserId = '" + userId + "'"
		} 
		
	    ds.runQuery(queryObject)
	        .then(function(result) {
	            //console.log(result);
	            deferred.resolve(result.data);
	        });
	
	    return deferred.promise;
	}
    
    Queries.prototype.viewRecord = function(object, id) {
		var _this = this,
		    deferred = $q.defer(),
		    configObject = {object: object, fields: {Id: id }};
        _this.consoleLog('viewRecord - entering');
        _this.consoleLog('configObject-' , configObject);

        ds.viewRecord(configObject).then(function(result) {
           deferred.resolve(result);
        });
	
	    return deferred.promise;
	}
	
	Queries.prototype.queryConfig = {
		suggestions: {
	        object: 'Suggestion_vod__c',
	        fields: ['OwnerId', 'Account_Name_Stamp_AZ_US__c', 'Owner_District_AZ_US__c', 'Actioned_By_AZ_US__c', 'Completed_By_AZ_US__c', 'Dismissed_By_AZ_US__c', 'Account_vod__c','CreatedDate', 'RecordTypeId', 'Id', 'Marked_As_Complete_vod__c', 'Actioned_vod__c', 'Dismissed_vod__c', 'Title_vod__c', 'Reason_vod__c', 'Posted_Date_vod__c', 'Expiration_Date_vod__c'],
	        where: '' 
            //where: 'Account_vod__c =\''+ accountId +'\''
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
            where: 'Id IN '
        }
	};
    
	$.extend(Queries.prototype, Util.prototype);
    global.Queries = Queries;

})(this);