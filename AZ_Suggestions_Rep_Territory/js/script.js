appData = {
     product_map: [{
         Id: '',
         Name: ''
     }],
     accountId:'',
     currentUser: {
         Id: '',
         territoryId: ''
     },
     childTerrIds: [],
     subordinateUserIds: [],
     subordinateUsers: [],
     recordtype_map: { //best practice is to actually store this in a unique object per SFDC object
         Call_vod: '',
         Call_Objective_vod: '',
         Email_vod: '',
         Insight_vod: '',
         Driver_vod: '', //for Suggestion tag
         Product_vod: '' //for Suggestion tag
     },
     suggestionIds: [],
     accountIds: [],
     suggestions: [],
     childUserLookup:{},
     ownerIdLookup:{},
     ownerIdList:[],
     usersList:[],
     usersListSet:'',
     filtered:{
        userObject:{
            usersList:[],
            averageData:{}
        },
        myCount:{},
        count:{},
        types:{},
        tableData:[],
        suggestions:[]
     },
     months_to_date: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
 };


//MyInsights Object
(function(global) {
	function MyInsight() {
		
	};
	
    
    MyInsight.prototype.bindEvents = function() {
        var _this = this;
        
        $(document).on('click', '.suggestion-item', function(event){
            var $element = $(this),
                accountId = $element.attr('data-account-id');
            event.preventDefault();
            if (accountId != '') {
                _this.navigateToAccount(accountId);
            } else {
                _this.consoleLog('Null account Id');
            }
            
        });
        
    };
    
    MyInsight.prototype.parseSuggestions = function(suggestions) {
        var _this = this,
            accountIds = [];

        _this.consoleLog('inside: parseSuggestions :');
        appData.ownerIdList = [];
        if (suggestions.length > 0) {
	        for (var i = 0; i < suggestions.length; i++) {
	        	var this_suggestion = {
	                Marked_As_Complete_vod__c: suggestions[i].Marked_As_Complete_vod__c.value,
	                Dismissed_vod__c: suggestions[i].Dismissed_vod__c.value,
	                Actioned_vod__c: suggestions[i].Actioned_vod__c.value,
	                RecordTypeId: suggestions[i].RecordTypeId.value,
	                Id: suggestions[i].Id.value,
	                CreatedDate: suggestions[i].CreatedDate.value,
	                OwnerId: suggestions[i].OwnerId.value,
	                Title_vod__c: suggestions[i].Title_vod__c.value,
	                Reason_vod__c: suggestions[i].Reason_vod__c.value,
	                Posted_Date_vod__c: suggestions[i].Posted_Date_vod__c.value,
					Expiration_Date_vod__c: suggestions[i].Expiration_Date_vod__c.value,
					Account_vod__c: suggestions[i].Account_vod__c.value,
					AccountName: suggestions[i].Account_Name_Stamp_AZ_US__c.value,
					Actioned_By_AZ_US__c: suggestions[i].Actioned_By_AZ_US__c.value,
					Completed_By_AZ_US__c: suggestions[i].Completed_By_AZ_US__c.value,
					Dismissed_By_AZ_US__c: suggestions[i].Dismissed_By_AZ_US__c.value,
					LastStatusUpdatedBy: '',
					Status: '',
					productTags: [],
					driverTags: []
	            };
	        	appData.ownerIdList.push(suggestions[i].OwnerId.value);
	        		            
	            this_suggestion.LastStatusUpdatedBy = this_suggestion.Actioned_By_AZ_US__c || this_suggestion.Completed_By_AZ_US__c || this_suggestion.Dismissed_By_AZ_US__c || '';
	            this_suggestion.Status = this_suggestion.Actioned_vod__c ? 'Actioned' : this_suggestion.Marked_As_Complete_vod__c ? 'Marked as Complete' : this_suggestion.Dismissed_vod__c ? 'Dismissed' : 'Pending';
	            accountIds[i] = suggestions[i].Account_vod__c.value;
	            appData.suggestions[i] = this_suggestion;
	        }
            /*appData.accountIdList = accountIds.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
	        appData.ownerIdList = appData.ownerIdList.filter(function(item, i, ar){ return ar.indexOf(item) === i; });*/
        }
        
        appData.accountIdList = accountIds.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
        appData.ownerIdList = appData.ownerIdList.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
    }
    
    MyInsight.prototype.attachAccountIds = function() {
		var _this = this,
            $suggestionElements = $('.suggestion-item');
        
        _this.consoleLog('attachAccountIds - entering');
        _this.consoleLog('appData.accountIdList - ', appData.accountIdList);
        
        $suggestionElements.each(function(index, element) {
            index = index => appData.accountIdList.length ? appData.accountIdList.length - 1 : index;
           _this.consoleLog(' $(element) - ',  $(element));
           $(element).attr('data-account-id', appData.accountIdList[index]); 
        });
    };
    
   /* MyInsight.prototype.getSuggestions = function() {
		var _this = this;
        _this.consoleLog('getSuggestions - entering');
        
       _this.queryRecord(_this.queryConfig.suggestions).then(function(suggestions){
          appData.suggestions =  suggestions;
       }); 
       _this.consoleLog('appData.suggestions.length - ', appData.suggestions.length);
	};*/
    
    MyInsight.prototype.navigateToAccount = function(accountId) {
		var _this = this;
       _this.viewRecord('Account_Plan_vod__c', accountId).then(function(response){
           _this.consoleLog('navigateToAccount - ' + accountId, response);
       });      
	};
	
	MyInsight.prototype.init = function() {
		var _this = this;
        _this.consoleLog('mainController - entering');
        _this.bindEvents();
        _this.queryRecord(_this.queryConfig.suggestions).then(function(suggestions){
             _this.consoleLog('suggestions.length - ', suggestions.length);
            _this.parseSuggestions(suggestions);
            _this.attachAccountIds();
       });
                
	};
	
	$.extend(MyInsight.prototype, Queries.prototype);
    global.MyInsight = MyInsight;
	
})(this);

$(function() {
	console.log('document ready');
	var myInsight = new MyInsight();
    $('#response').append('<pre>document-ready</pre>');
    
	myInsight.init();
});
