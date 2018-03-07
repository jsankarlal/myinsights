//initialize the promise library
$q = window.Q;
//console.log('q.js initialized');

//Queries Object
(function(global) {
	function Queries() {
		this.clm = com.veeva.clm;
        this.ds = ds;
	};
//jscs:disable	
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
        _this.consoleLog('dsRunQuery - entering');
        _this.consoleLog('queryObject', queryObject);
		if (collections) {
			queryObject.where += ds.getInStatement(collection); //where: 'TerritoryId IN ' + inTerr //where: 'Account_vod__c =\''+ accountId +'\''
		}

		if (condition) {
            queryObject.where += condition + '\''; //where: 'UserId = '' + userId + '''
		}

        try {
            ds.runQuery(queryObject).then(function(result) {
                _this.consoleLog('dsRunQuery resolved ');
                deferred.resolve(result.data);
            });
        } catch (e) {
            _this.consoleLog('dsRunQuery - error', e);
        }

        _this.consoleLog('dsRunQuery returns ');
        return deferred.promise;
    }
    
    Queries.prototype.parseAccounts = function(accounts) {
        var _this = this;
       // _this.consoleLog('inside: parseAccounts :', accounts);
        try {
            resource['hcp'] = [];
            resource['accountIdList'] = [];
            if (accounts.length > 0) {
                for (var i = 0; i < accounts.length; i++) {
                //    _this.consoleLog('inside: parseAccounts - loop :', accounts[i]);
                    var currentAccount = {
                        id: accounts[i].Id.value,
                        accountName: accounts[i].Name.value,
                        firstName: accounts[i].FirstName.value,
                        lastName: accounts[i].LastName.value,
                        gender: 'male',
                        name: accounts[i].Name.value,
                        type: i % 2 == 0 ? 'person' : 'business',
                        email: 'test@gmail.com',
                        address: 'No.199, Liangjing Road, Pudong New District Shanghai,China 201203',
                        language: 'English',
                        therapyArea: 'Oncology',
                        product: 'Lynparza',
                        jobTitle: 'Medical officer',
                        hcmSpeciality: 'Medical Officer',
                        metric:{
                            academic:{
                                rating: 5,
                                percentage: '90'
                            },
                            internet:{
                                rating: 4,
                                percentage: '24'
                            },
                            society:{
                                rating: 3,
                                percentage: '8'
                            }
                        }
                    };
                    _this.consoleLog('inside: parseAccounts - loop :', currentAccount);
                    resource.hcp[i] = currentAccount;
                    resource.accountIdList[i] = currentAccount.id;
                }
            }

        } catch (err) {
            _this.consoleLog('parse suggestion errror', err);
        }  
        $(document).trigger('hcp-parsed');
    }

    Queries.prototype.parseSuggestions = function(suggestions) {
        var _this = this,
            accountIds = [];

        _this.consoleLog('inside: parseSuggestions :');
        try {
            resource['suggestions'] = [];
            if (suggestions.length > 0) {
                for (var i = 0; i < suggestions.length; i++) {
                    var currentSuggestion = {
                        markedCompleted: suggestions[i].Marked_As_Complete_vod__c.value,
                        dissmissed: suggestions[i].Dismissed_vod__c.value,
                        actioned: suggestions[i].Actioned_vod__c.value,
                        recordTypeId: suggestions[i].RecordTypeId.value,
                        id: suggestions[i].Id.value,
                        createdDate: suggestions[i].CreatedDate.value,
                        ownerId: suggestions[i].OwnerId.value,
                        title: suggestions[i].Title_vod__c.value,
                        reason: suggestions[i].Reason_vod__c.value,
                        postedDate: suggestions[i].Posted_Date_vod__c.value,
                        expirationDate: suggestions[i].Expiration_Date_vod__c.value,
                        accountId: suggestions[i].Account_vod__c.value,
                        lastStatusUpdatedBy: '',
                        status: '',
                        accountName: '',
                        productTags: [],
                        driverTags: []
                    };
                                    
    //	     currentSuggestion.LastStatusUpdatedBy = currentSuggestion.Actioned_By_AZ_US__c || currentSuggestion.Completed_By_AZ_US__c || currentSuggestion.Dismissed_By_AZ_US__c || '';
                    currentSuggestion.status = currentSuggestion.actioned ? 'Actioned' : currentSuggestion.markedCompleted ? 'Marked as Complete' : currentSuggestion.dissmissed ? 'Dismissed' : 'Pending';
                    accountIds[i] = suggestions[i].Account_vod__c.value;
                    resource.suggestions[i] = currentSuggestion;
                }
            }
            
            resource.accountIdList = accountIds.filter(function(item, i, ar) { return ar.indexOf(item) === i; });
        } catch (err) {
            _this.consoleLog('parse suggestion errror', err);
        }    
        $(document).trigger('suggestion-parsed');
    }
    
    Queries.prototype.attachAccountIds = function() {
		var _this = this,
            $suggestionElements = $('.navigate-to-native');
        
        _this.consoleLog('attachAccountIds - entering');
        _this.consoleLog('resource.accountIdList.length- ', resource.accountIdList.length);
        
        $suggestionElements.each(function(index, element) {
            var temp = index >= resource.accountIdList.length ? resource.accountIdList.length - 1 : index,
                type = (index + 1) % 2 == 1 ? 'view' : 'call';
            $(element).attr('data-account-id', resource.accountIdList[temp]);
            $(element).attr('data-suggestion-type', type);
            
        });
    };
    
    Queries.prototype.navigateToAccount = function(eventData) {
		var _this = this,
            accountId = eventData.accountId;
            configObject = {},
            type = eventData.type;
        if (accountId != '') {
            if (type == 'view') {
                configObject = {object: 'Account', fields: {Id: accountId }};
                _this.viewRecord(configObject).then(function(response) {
                });
            } else if (type == 'call') {
                configObject = {object: 'Call2_vod__c', fields: {Account_vod__c: accountId }};
                _this.newRecord(configObject).then(function(response) {
                });
            }
        } else {
            _this.consoleLog('Null account Id');
        }
             
	};
    
    Queries.prototype.clmQueryRecord = function(queryObject, callback) {
		var _this = this,
            deferred = $q.defer();
        _this.consoleLog('clmQueryRecord - entering');
        _this.consoleLog('queryObject', queryObject);
        console.log('callback :');
        console.log(callback);
        /*_this.consoleLog('callback', callback);*/
        try {
            _this.clm.queryRecord(queryObject.object, queryObject.fields, queryObject.where, queryObject.sort, queryObject.limit, function(response) {
                _this.consoleLog('clmQueryRecord resolved - response.success ', response.success);
                _this.consoleLog('clmQueryRecord resolved - response ', response);
                if (response.success) {
                    _this.consoleLog('clmQueryRecord resolved - response.' + queryObject.object, response[queryObject.object].length);
                    deferred.resolve(response[queryObject.object]);
                } else {
                    _this.consoleLog('clmQueryRecord resolved - response.message', response.message);
                    _this.consoleLog('clmQueryRecord resolved - response.code', response.code);
                }
            });
        } catch (e) {
            _this.consoleLog('clmQueryRecord - error', e);
        }

        _this.consoleLog('clmQueryRecord returns ');
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
	};

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
            fields: ['Name', 'Id', 'FirstName', 'LastName'],// 'Job_Title_AZ__c', 'Language_vod__c', 'Email_Address_AZ_EU__c', 'HCM_Specialty_AZ__c', 'Type_AZ_US__c'],
            where: '',
            sort: [],
            limit: ''
        },
        userTerritory: {
            object: 'UserTerritory',
            fields: ['TerritoryId'],
            where: 'UserId = _userID'
        },
        childTerritories: {
          object: 'Territory',
          fields: ['Id'],
          where: 'ParentTerritoryId = _territoryID'
        },
        userId: {
          object: 'UserTerritory',
          fields: ['UserId'],
          where: 'TerritoryId IN _territoryIDs'
        },
        users: {
          object: 'User',
          fields: ['Name', 'Id'],
          where: ''
        },
        incidents: {
          object: 'MI_Incident_AZ_US__c',
          fields: [
            'Name',
            'CreatedById',
            'LastModifiedById',
            'OwnerId',
            'RecordTypeId'
          ]
        //  where: 'OwnerId IN _userIDs'
        },
        incidentsById: {
          object: 'MI_Incident_AZ_US__c',
          fields: [
            'Name',
            'MI_Trend_AZ_US__c',
            'MI_Account_AZ_US__c',
            'MI_Status_AZ_US__c',
            'MI_Product_AZ_US__c',
            'MI_Date_Opened_AZ_US__c',
            'Incident_Payer_AZ_US__c',
            'Incident_SPP_AZ_US__c',
            'MI_Season_AZ_US__c',
            'CreatedById',
            'LastModifiedById',
            'OwnerId',
            'RecordTypeId'
          ],
          where: 'OwnerId = _userID'
        },
        trends: {
          object: 'MI_Trend_AZ_US__c',
          fields: [
            'Id',
            'Name',
            'MI_Status_AZ_US__c',
            'CreatedById',
            'LastModifiedById',
            'OwnerId',
            'RecordTypeId'
          ],
          where: ''
        },
        callsById: {
          object: 'Call2_vod__c',
          fields: [
            'Id',
            'Account_vod__c',
            'Call_Date_vod__c',
            'Status_vod__c',
            'Detailed_Products_vod__c',
            'Name',
            'Call_Type_AZ_US__c',
            'CreatedByID',
            'LastModifiedById',
            'OwnerId',
            'RecordTypeId'
          ],
          where: 'OwnerId = _userIDs'
        },
        calls: {
          object: 'Call2_vod__c',
          fields: [
            'Id',
            'Account_vod__c',
            'Call_Date_vod__c',
            'Status_vod__c',
            'Detailed_Products_vod__c',
            'Name',
            'Call_Type_AZ_US__c',
            'CreatedByID',
            'LastModifiedById',
            'OwnerId',
            'RecordTypeId'
          ]
        //  where: 'OwnerId IN _userIDs'
        },
        frmAccounts:{
          object: 'Account',
          fields: [
            'ID',
            'Name'
          ],
          where: ''
        },
      
        allTierdAccounts:{
          object: 'Account',
          fields: [
            'ID',
            'Name',
            'MI_Primary_StreetAddress_AZ_US__c',
            'MI_Primary_City_AZ_US__c',
            'MI_Primary_State_AZ_US__c',
            'Phone',
            'MI_MAPS_Tier_AZ_US__c',
            'MI_Oncology_Tier_AZ_US__c',
            'Respiratory_Tier_AZ_US__c',
          ],
          where: 'MI_MAPS_Tier_AZ_US__c = "1" OR MI_Oncology_Tier_AZ_US__c = "1" OR Respiratory_Tier_AZ_US__c = "1"'
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