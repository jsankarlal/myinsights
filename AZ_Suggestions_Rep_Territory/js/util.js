var sampleNetwork = {};
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
            {
                id: 1,
                label: 'hcp 1',
                value:50
            },
            {id: 2, label: 'hcp 2', value:100},
            {id: 3, label: 'hcp 3', value:75},
            {id: 4, label: 'hcp 4', value:50},
            {id: 5, label: 'hcp 5', value:200},
            {id: 6, label: 'hcp 6', value:300}
        ]),
        // create an array with edges
        edges = new vis.DataSet([
            {from: 1, to: 2, dashes: false},
            {from: 2, to: 3, dashes: false},
            {from: 2, to: 4, dashes: false},
            {from: 2, to: 5, dashes: false},
            {from: 2, to: 6, dashes: false}
        ]),
        // create a network
        //var container = document.getElementById('mynetwork');
        containers = document.querySelectorAll('.relationship-chart'),      
        data = {
            nodes: hcps,
            edges: edges
        },
        network = {},
        options = {
            nodes: {
                shape: 'circle',
                borderWidth:1,
                color: {
                    border: 'red',
                    background: 'orange'
                },
                font:{color:'#333'},
                scaling:{
                    min:25,
                    max:600,
                    label:false
                }
            },
            edges: {
              color: 'lightblue'
            }
        };

        //  var network = new vis.Network(container, data, options);
        containers.forEach(function(item, index) {
            network[index] = new vis.Network(item, data, options).on('click', function(properties) {
                console.log(properties);
                console.log('clicked nodes:', properties.nodes);
                event.preventDefault();
                event.stopImmediatePropagation();
                $(document).trigger('navigate-to-native', {accountId:'0010E00000FOr7gQAD', type:'view'});
            });
        });

        sampleNetwork = network;
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
