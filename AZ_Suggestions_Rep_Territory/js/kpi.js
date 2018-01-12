(function(global) {
    function KeyPerformanceIndicator() {
     // Constructor
    };
    
    KeyPerformanceIndicator.prototype.bindKpiEvents = function() {
        var _this = this,
            $document = $(document);
        $document.on('click', '[data-account-id]', function(e) {
            var $this = $(this);
               
        });
    }
    
    KeyPerformanceIndicator.prototype.renderKpi = function(container, kpiName) {
        var _this = this;
        //fillTemplate(container, templateObj, object, appendFlag, callback)
        _this.fillTemplate(container, componentsTemplate[_this.kpiListTemplatePath], resource[_this.kpiDataPath][kpiName], false);
    }
    
    KeyPerformanceIndicator.prototype.buildKpi = function() {
        var _this = this;
            _this.kpiListTemplatePath = 'kpi-list';
            _this.kpiDataPath = '/staticJson/kpi.json';
        
        $.ajax({
            method: 'GET',
            url: _this.kpiDataPath,
            type: 'json',
            success: function(data) {
                var path = this.url;
                resource[this.url] = data;
                _this.kpi.kpiContainer.each(function(index, element) {
                    var $container = $(element);
                    _this.addSpinner($container);
                    _this.renderKpi($container, $container.attr('data-kpi-name'));
                });
                
            },

            error: function(err) {
            }
        });
    }
    
    KeyPerformanceIndicator.prototype.init = function() {
        var _this = this;
        _this.kpi = {};
        _this.kpi.kpiContainer = $('.kpi-container');
        _this.buildKpi();
            
    }
    
    _.extend(KeyPerformanceIndicator.prototype, Util.prototype);
    global.KeyPerformanceIndicator = KeyPerformanceIndicator;
}(this));

$(function() {
    var Kpi = new KeyPerformanceIndicator();
    Kpi.init();
});