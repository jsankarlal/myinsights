(function(global) {
    function Suggestions() {
     // Constructor
    };
    
    Suggestions.prototype.bindSuggestionsEvents = function() {
        var _this = this,
            $document = $(document);
        $document.on('click', '[data-account-id]', function(e) {
            var $this = $(this);
               
        });
    }
    
    Suggestions.prototype.renderSuggestions = function() {
        var _this = this;
        //fillTemplate(container, templateObj, object, appendFlag, callback)
        _this.fillTemplate(_this.suggestion.listContainer, componentsTemplate[_this.suggestionListTemplatePath], resource[_this.suggestionDataPath], false);
        _this.fillTemplate(_this.suggestion.detailsContainer, componentsTemplate[_this.suggestionDetailTemplatePath], resource[_this.suggestionDataPath], false);
        $(document).trigger('suggestion-loaded');
    }
    
    Suggestions.prototype.buildSuggestions = function() {
        var _this = this;
            _this.suggestionListTemplatePath = 'suggestion-list';
            _this.suggestionDetailTemplatePath = 'suggestion-detail';
            _this.suggestionDataPath = '/staticJson/suggestions.json';
        /*_this.fetchResource(_this.suggestionDataPath, 'json').then(function() {
            _this.renderSuggestions();
        });*/
        
        $.ajax({
            method: 'GET',
            url: _this.suggestionDataPath,
            type: 'json',
            success: function(data) {
                var path = this.url;
                resource[this.url] = data;
                _this.renderSuggestions();
            },

            error: function(err) {
            }
        });
    }
    
    Suggestions.prototype.attachAccountIds = function() {
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
    
    Suggestions.prototype.init = function() {
        var _this = this;
        _this.suggestion = {};
        _this.suggestion.listContainer = $('#suggestions-list');
        _this.suggestion.detailsContainer = $('#suggestion-details');
        _this.addSpinner(_this.suggestion.listContainer);
        _this.addSpinner(_this.suggestion.detailsContainer);
        if (_this.application != 'iRep') {
            _this.buildSuggestions();
        }
            
    }
    
    _.extend(Suggestions.prototype, Util.prototype);
    global.Suggestions = Suggestions;
}(this));

$(function() {
    var suggestions = new Suggestions();
    suggestions.init();
});