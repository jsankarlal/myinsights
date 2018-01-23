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

        $document.on('hcp-parsed', function(e) {
            //    _this.renderHcp();
        });

        $document.on('hcp-loaded', function(e) {
        //    _this.renderRelationshipCharts();
        });

        $document.on('shown.bs.modal', '#popup-modal', function() {
            _this.renderRelationshipCharts();
        });
    }
    
    Hcp.prototype.renderHcp = function() {
        var _this = this;
        //fillTemplate(container, templateObj, object, appendFlag, callback)
        _this.fillTemplate(_this.hcp.detailsContainer, componentsTemplate[_this.hcpDetailTemplatePath], resource.hcp, false);
        _this.fillTemplate(_this.hcp.listContainer, componentsTemplate[_this.hcpListTemplatePath], resource.hcp, false);
        _this.fillTemplate(_this.hospital.detailsContainer, componentsTemplate[_this.hcpDetailTemplatePath], resource.hcp, false);
        _this.fillTemplate(_this.hospital.listContainer, componentsTemplate[_this.hcpListTemplatePath], resource.hcp, false);
        $(document).trigger('hcp-loaded');
    }
    
    Hcp.prototype.buildHcp = function() {
        var _this = this;
            _this.hcpDataPath = '/staticJson/hcp.json';
        
        $.ajax({
            method: 'GET',
            url: _this.hcpDataPath,
            type: 'json',
            success: function(data) {
                var path = this.url;
                resource.hcp = data;
                _this.renderHcp();
            },

            error: function(err) {
            }
        });
    }
    
    Hcp.prototype.init = function() {
        var _this = this;
        _this.hcp = {};
        _this.hospital = {};
        _this.hcp.listContainer = $('#hcp-list');
        _this.hcp.detailsContainer = $('#hcp-details');
        _this.hospital.listContainer = $('#hospital-list');
        _this.hospital.detailsContainer = $('#hospital-details');
        _this.hcpListTemplatePath = 'hcp-list';
        _this.hcpDetailTemplatePath = 'hcp-detail';
        _this.addSpinner(_this.hcp.listContainer);
        _this.addSpinner(_this.hcp.detailsContainer);
        if (_this.application != 'iRep') {
        //    _this.getHcps();
            _this.buildHcp();
            try {
                _this.clmQueryRecord(_this.queryConfig.account, _this.parseAccounts(accounts));
            } catch (error) {
                _this.consoleLog('Error', error);
            }
            
        }

        _this.bindHcpEvents();
            
    }
    
    _.extend(Hcp.prototype, Queries.prototype);
    global.Hcp = Hcp;
}(this));

$(function() {
    var hcp = new Hcp();
    hcp.init();
});