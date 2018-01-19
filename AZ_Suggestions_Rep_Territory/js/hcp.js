(function(global) {
    function Hcp() {
     // Constructor
    };
    
    Hcp.prototype.bindHcpEvents = function() {
        var _this = this,
            $document = $(document);
        $document.on('click', '[data-account-id]', function(e) {
            var $this = $(this);
               
        });
    }
    
    Hcp.prototype.renderHcp = function() {
        var _this = this;
        //fillTemplate(container, templateObj, object, appendFlag, callback)
        _this.fillTemplate(_this.hcp.detailsContainer, componentsTemplate[_this.hcpDetailTemplatePath], resource[_this.hcpDataPath], false);
        _this.fillTemplate(_this.hcp.listContainer, componentsTemplate[_this.hcpListTemplatePath], resource[_this.hcpDataPath], false);
        _this.attachAccountIds();
    }
    
    Hcp.prototype.buildHcp = function() {
        var _this = this;
            _this.hcpListTemplatePath = 'hcp-list';
            _this.hcpDetailTemplatePath = 'hcp-detail';
            _this.hcpDataPath = '/staticJson/hcp.json';
       /* _this.fetchResource(_this.hcpDataPath, 'json').then(function() {
            _this.renderHcp();
        });
        */
        
        $.ajax({
            method: 'GET',
            url: _this.hcpDataPath,
            type: 'json',
            success: function(data) {
                var path = this.url;
                resource[this.url] = data;
                _this.renderHcp();
            },

            error: function(err) {
            }
        });
    }
    
    Hcp.prototype.attachAccountIds = function() {
		var _this = this,
            $suggestionElements = $('.navigate-to-native');
        
        _this.consoleLog('attachAccountIds - entering');
        _this.consoleLog('appData.accountIdList.length- ', appData.accountIdList.length);
        
        $suggestionElements.each(function(index, element) {
            var temp = index >= appData.accountIdList.length ? appData.accountIdList.length - 1 : index,
                type = (index + 1) % 2 == 1 ? 'view' : 'call';
            $(element).attr('data-account-id', appData.accountIdList[temp]);
            $(element).attr('data-suggestion-type', type);
            
        });
    };
    
    Hcp.prototype.init = function() {
        var _this = this;
        _this.hcp = {};
        _this.hcp.listContainer = $('#hcp-list');
        _this.hcp.detailsContainer = $('#hcp-details');
        _this.addSpinner(_this.hcp.listContainer);
        _this.addSpinner(_this.hcp.detailsContainer);
        if (_this.application != 'iRep') {
            _this.buildHcp();
        }
            
    }
    
    _.extend(Hcp.prototype, MyInsight.prototype);
    global.Hcp = Hcp;
}(this));

$(function() {
    var hcp = new Hcp();
    hcp.init();
});