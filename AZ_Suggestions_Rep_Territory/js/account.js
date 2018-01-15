(function(global) {
    function Account() {
     // Constructor
    };
    
    Account.prototype.bindKpiEvents = function() {
        var _this = this,
            $document = $(document);
        $document.on('click', '[data-account-id]', function(e) {
            var $this = $(this);
               
        });
    }
    
    Account.prototype.renderKpi = function(container, kpiName) {
        var _this = this;
        //fillTemplate(container, templateObj, object, appendFlag, callback)
        _this.fillTemplate(container, componentsTemplate[_this.kpiListTemplatePath], resource[_this.kpiDataPath][kpiName], false);
    }
    
    Account.prototype.getCurrentAccount = function() {
        var _this = this;
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
        _this.getCurrentAccount();
    }
    
    _.extend(Account.prototype, Queries.prototype);
    global.Account = Account;
}(this));

$(function() {
    var account = new Account();
    account.init();
});