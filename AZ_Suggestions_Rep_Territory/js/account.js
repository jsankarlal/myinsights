(function(global) {
    function Account() {
     // Constructor
    };
    
    Account.prototype.bindAccountEvents = function() {
        var _this = this,
            $document = $(document);
        $document.on('click', '.myaccount-form .update-email', function(e) {
            var $this = $(this);
            _this.clmUpdateRecord();
        });
    }
    
    //jscs:disable	
    Account.prototype.clmUpdateRecord = function(container, kpiName) {
        var _this = this,
            newValues = {
                "Gender_vod__c": "Male",
                "Language_vod__c": "English",
                "PersonTitle": "Mr.",
                "Phone": "9962234889"
            };
        
        _this.consoleLog('clmUpdateRecord:: Resolved', result);
        com.veeva.clm.updateRecord('Account', 'Id', '0010E00000FOr7gQAD', newValues, function(result) {
            _this.consoleLog('clmUpdateRecord:: Resolved', result);
        });
    }
    //jscs:enable	

    Account.prototype.renderAccount = function(container, kpiName) {
        var _this = this;
        //fillTemplate(container, templateObj, object, appendFlag, callback)
        _this.fillTemplate(container, componentsTemplate[_this.kpiListTemplatePath], resource[_this.kpiDataPath][kpiName], false);
    }
    
    Account.prototype.getAccounts = function() {
        var _this = this,
            objectName = 'Account',
            fields = ['Id', 'Name'],
            whereClause = 'WHERE Specialty_1_vod__c = "Cardiology"',
            sortClause = ['Name, ASC'],
            limit = '10';
        _this.consoleLog('getAccounts::Entering');
       _this.clm.queryRecord(objectName, fields, _this.updateAccount);
    }
    
    Account.prototype.getCurrentAccount = function() {
        var _this = this;
        _this.consoleLog('getCurrentAccount:: Entering');
        _this.clm.getDataForCurrentObject('Account', 'Id', _this.updateAccount);
    }
    
    Account.prototype.updateAccount = function(response) {
        var _this = this;
        _this.consoleLog('CLM Testing', response);
       /* if (result.success == true) {
            var newValues = {};
            newValues.My_Custom_Field__c = 'new value';
            newValues.Number_Field_1__c = 42;
            com.veeva.clm.updateRecord('Account', 'Id', result.Account.Id,callBack);
        }*/
    }
    
    Account.prototype.init = function() {
        var _this = this;
        _this.clm = com.veeva.clm;
        _this.consoleLog('CLM Testing::INI');
   //     _this.getCurrentAccount();
   //     _this.getAccounts();
        _this.dsRunQuery(_this.queryConfig.accounts).then(function(accounts) {
            _this.consoleLog('My Accounts - through DS library', accounts);
        });
        
        _this.dsRunQuery(_this.queryConfig.suggestions).then(function(suggestions) {
            _this.consoleLog('My suggestions through DS library', suggestions);
        });
        
        _this.clmQueryRecord(_this.queryConfig.accounts).then(function(accounts) {
            _this.consoleLog('My Accounts through clmQueryRecord', accounts);
        });
        
        _this.clmQueryRecord(_this.queryConfig.suggestions).then(function(suggestions) {
            _this.consoleLog('My suggestions through clmQueryRecord - suggestions.length - ', suggestions.length);
            _this.parseSuggestions(suggestions);
            _this.attachAccountIds();
        });
    }
    
    _.extend(Account.prototype, Queries.prototype);
    global.Account = Account;
}(this));

$(function() {
    var account = new Account();
    account.init();
});