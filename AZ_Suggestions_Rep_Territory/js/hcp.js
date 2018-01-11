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
        _this.fillTemplate(_this.hcp.detailsContainer, resource[_this.hcpDetailTemplatePath], resource[ _this.hcpDataPath], false);
        _this.fillTemplate(_this.hcp.listContainer, resource[_this.hcpListTemplatePath], resource[_this.hcpDataPath], false);
    }
    
    Hcp.prototype.buildHcp = function() {
        var _this = this;
            _this.hcpListTemplatePath = '/templates/components/hcplist.html';
            _this.hcpDetailTemplatePath = '/templates/components/hcpdetail.html';
            _this.hcpDataPath = '/staticJson/hcp.json';
        return _this.fetchResource(_this.hcpDataPath, 'json').then(function() {
            return _this.fetchResource(_this.hcpDetailTemplatePath, 'html');
        }).then(function() {
            _this.fetchResource(_this.hcpListTempatePath, 'html')
        }).then(function() {
            _this.renderHcp();
        });
    }
    
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
    
    _.extend(Hcp.prototype, Util.prototype);
    global.Hcp = Hcp;
}(this));

$(function() {
    var hcp = new Hcp();
    hcp.init();
});