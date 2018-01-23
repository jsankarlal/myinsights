//Util Object
(function(global) {
	function Util() {
        
    };
    
    Util.prototype.addSpinner = function(container) {
        var _this = this;
        if (container) {
            container.html('<div class="ab-pos-center text-center"><div><span class="fa fa-spinner fa-pulse fa-3x fa-fw"></span></div><div class="loading-txt"></div></div>');
        } else {
            $('.myinsight-component').each(function(index, element) {
                $(element).html('<div class="ab-pos-center text-center"><div><span class="fa fa-spinner fa-pulse fa-3x fa-fw"></span></div><div class="loading-txt"></div></div>');
            });
        }
        
    };
    
    Util.prototype.setDataAdapter = function() {
        var _this = this;
        _this.application = window.location.host.indexOf('localhost:') == 0 || window.location.host.indexOf('test-myinsights.herokuapp.com') == 0 ? 'localhost' : 'iRep';
        _this.consoleLog('Current Application', _this.application);
    };
    
    Util.prototype.fetchResource = function(path, type) {
        var _this = this,
         deferred = $q.defer();
        _this.consoleLog('fetchResource - entering');
        _this.consoleLog('path', path);

        $.ajax({
            method: 'GET',
            url: path,
            type: type,
            success: function(data) {
                var path = this.url;
                resource[this.url] = data;
                deferred.resolve(data);
            },

            error: function(err) {
                deferred.resolve(err);
            }
        });
        
        return deferred.promise;
    }
    
    Util.prototype.renderRelationshipCharts = function() {
        var _this = this,
        // create an array with hcps
        hcps = new vis.DataSet([
            {id: 1, label: 'hcp 1'},
            {id: 2, label: 'hcp 2'},
            {id: 3, label: 'hcp 3'},
            {id: 4, label: 'hcp 4'},
            {id: 5, label: 'hcp 5'},
            {id: 6, label: 'hcp 6'}
        ]),
        // create an array with edges
        edges = new vis.DataSet([
            {from: 1, to: 2, dashes: true},
            {from: 2, to: 3, dashes: [5, 5]},
            {from: 2, to: 4, dashes: [5, 5, 3, 3]},
            {from: 2, to: 5, dashes: [2, 2, 10, 10]},
            {from: 2, to: 6, dashes: false}
        ]),
        // create a network
        //var container = document.getElementById('mynetwork');
        containers = document.querySelectorAll('.relationship-chart'),      
        data = {
            nodes: hcps,
            edges: edges
        },
        options = {},
        network = {};

        //  var network = new vis.Network(container, data, options);
        containers.forEach(function(item, index) {
            network[index] = new vis.Network(item, data, options);
        });
    }
    
    Util.prototype.fillTemplate = function(container, templateObj, object, appendFlag, callback) {
         var _this = this,
            template = _.template(templateObj.trim()),
            markup = template({result: object});
        if (_this.appendFlag) {
            container.append(markup);
        } else {
            container.html(markup);
        }
        
        if (callback) {
           callback(); 
        }
        
    }
        
    Util.prototype.consoleLog = function(message, object) {
        if (object) {
            $('#response').append('<pre>' + message + ' - ' + JSON.stringify(object, null, '\t') + ' </pre>');
        } else {
            $('#response').append('<pre>' + message + '</pre>');
        }
        
    };
 
    global.Util = Util;
	
})(this);

$(function() {
	var util = new Util();
    util.addSpinner();
});
