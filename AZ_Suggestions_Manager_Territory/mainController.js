

//invoke immediately
	
	//proper color scheme for data visualizations
	//5DA5DA (blue), rgb(93,165,218)
	//FAA43A (orange), rgb(250,164,58)
	//60BD68 (green), rgb(96,189,104)
	//F17CB0 (pink), rgb(241,124,176)
	//DECF3F (yellow), rgb(222,207,63)
	//B276B2 (purple), rgb(178,118,178)
	//4D4D4D (gray), rgb(77,77,77)
	//F15854 (red), rgb(241,88,84)
	//B2912F (brown), rgb(178,145,47)

	var first_run = true;

	let pendingColor = ['rgba(250,164,58, 1)'];
	let dismissedColor = ['rgba(242,227,83, 1)'];
	let completedColor = ['rgba(169,208,94, 1)'];
	let actionedColor = ['rgba(96,189,104, 1)'];

	var pendingColorDisplay = ['rgba(250,164,58, 1)'];
	var dismissedColorDisplay = ['rgba(242,227,83, 1)'];
	var completedColorDisplay = ['rgba(169,208,94, 1)'];
	var actionedColorDisplay = ['rgba(96,189,104, 1)'];
	 var actionedText = 'Actioned',
	    completedText = 'Marked as Complete',
	    pendingText = 'Pending',
	    dismissedText = 'Dismissed';
	    
	var callText = 'Call',
	    callObjectiveText = 'Call Objective',
	    emailText = 'Email',
	    insightText = 'Insight';
	var appData = {
         product_map: [{
             Id: '',
             Name: ''
         }],
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
         suggestions: [{
             Id: '',
             OwnerId: '',
             Dismissed_vod__c: 0,
             Marked_As_Complete_vod__c: 0,
             Actioned_vod__c: 0,
             CreatedDate: '',
             RecordTypeId: '',
             tags: [{
                 RecordTypeId: '',
                 Driver_vod__c: '',
                 Product_Name__c: ''
             }],
             IsPending: 0 //if there are zero suggestion feedback records and the other summary fields equal zero as well
         }],
         ownerIdLookup:{},
         ownerIdList:[],
         usersList:[],
         usersListSet:{},
         filtered:{
         	userObject:{
         		usersList:[],
         		averageData:{}
         	},
         	count:{},
         	types:{},
         	tableData:[],
         	suggestions:[]
         },
         monthly_suggestions: {
             complete: [],
             total: []
         },
         months_to_date: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
         average_data: {
             pending: 0,
             dismissed: 0,
             actioned: 0,
             completed: 0
         },
         suggestions_by_type_data: []
     };

	 var products_master_set = new Set();
	 var drivers_master_set = new Set();
	
	 var selected_drivers = null;
	 var selected_products = null;
	 var selected_users = null;
	//Create Team Chart
	 function createTeamChart(teamData) {

	        $('#team_chart_container').empty();
	        $('#team_chart_container').append('<canvas id="suggestions"></canvas>');
	        if (myChart) {
	            myChart.destroy();
	        }

	        var names = [];
	        var pending = [];
	        var dismissed = [];
	        var completed = [];
	        var actioned = [];

	        for (var i = 0; i < teamData.length; i++) {
	            pendingColorDisplay[i] = 'rgba(250,164,58, 1)';
	            dismissedColorDisplay[i] = 'rgba(242,227,83, 1)';
	            completedColorDisplay[i] = 'rgba(169,208,94, 1)';
	            actionedColorDisplay[i] = 'rgba(96,189,104, 1)';
	            names.push(teamData[i].Name);
	            pending.push(teamData[i].pending);
	            dismissed.push(teamData[i].dismissed);
	            completed.push(teamData[i].completed);
	            actioned.push(teamData[i].actioned);
	        }

	        var myDataSets = [];
	        for (var i = 0; i < completed.length; i++) {

	        }
	        //suggestions chart
	        var ctx = document.getElementById("suggestions");
	        var myChart = new Chart(ctx, {
	            type: 'horizontalBar',
	            data: {
	                labels: names,
	                datasets: [{
	                    label: 'Pending',
	                    data: pending,
	                    backgroundColor: pendingColorDisplay,
	                    borderColor: pendingColorDisplay
	                },{
	                    label: 'Dismissed',
	                    data: dismissed,
	                    backgroundColor: dismissedColorDisplay,
	                    borderColor: dismissedColorDisplay
	                }, {
	                    label: 'Actioned',
	                    data: actioned,
	                    backgroundColor: actionedColorDisplay,
	                    borderColor: actionedColorDisplay
	                },{
	                    label: 'Marked Complete',
	                    data: completed,
	                    backgroundColor: completedColorDisplay,
	                    borderColor: completedColorDisplay
	                }]
	            },
	            options: {
	                maintainAspectRatio: false,
	                responsive: true,
	                title: {
	                    display: false
	                },
	                scales: {
	                    yAxes: [{
	                        display: true,
	                        stacked: true,
	                        ticks: {
	                            beginAtZero: true
	                        },
	                    }],
	                    xAxes: [{
	                        display: true,
	                        stacked: true,
	                    }]
	                },
	                legend: {
	                    display: true,
	                    labels: {
	                        filter: function (legendItem, chartData) {
	                            console.log(legendItem);
	                            console.log(chartData);
	                            
	                            for (var i = 0; i < chartData.datasets.length; i++) {
	                                if (legendItem.text === chartData.datasets[i].label) {
	                                    var hasValue = false;
	                                    for (var j = 0; j < chartData.datasets[i].data.length; j++) {
	                                        if (chartData.datasets[i].data[j] > 0) {
	                                            hasValue = true;
	                                        }
	                                    }
	                                    return hasValue;
	                                }
	                            }
	                            
	                        }
	                    }
	                },
	                tooltips: {
	                    enabled: false
	                },
	                onClick: handleClick,
	                animation: {
	                    onComplete: function() {
	                        var chartInstance = this.chart,
	                        ctx = chartInstance.ctx,
							preset = 0;

	                        ctx.font = Chart.helpers.fontString(10, "bold", Chart.defaults.global.defaultFontFamily);
	                        ctx.textAlign = 'center';
	                        ctx.textBaseline = 'center';

	                        this.data.datasets.forEach(function(dataset, i) {
	                            var meta = chartInstance.controller.getDatasetMeta(i);
	                            meta.data.forEach(function(bar, index) {
	                                var data = dataset.data[index];
	                                //console.log(bar._model.x);
	                                if (data > 0) {
	                                	ctx.fillText(data, bar._model.base+(bar._model.x - bar._model.base)/2, bar._model.y-6);
	    								preset = bar._model.x;
	                                }   
	                            });
	                        });
	                    }
	                }
	            }
	        });

	        function handleClick(e) {
	        /**
	        var currentChart = myChart.getElementAtEvent(e)[0];
	        console.log(currentChart);
	        var currentTeamMember = currentChart._view.label;
	        console.log(currentTeamMember);
	        var currentDataset = currentChart._datasetIndex;
	        var currentData = currentChart._index;

	        //var dataset = myChart1.getElementAtEvent(e)[0]._datasetIndex;
	        swal({
	            html: "<h4>" + currentTeamMember + "</h4><br/>Pending: <strong>" + pending[currentData] +
	                "</strong><br/>Dismissed: <strong>" + dismissed[currentData] + "</strong><br/>Marked Complete: <strong>" +
	                completed[currentData] + "</strong><br/>Actioned: <strong>" + actioned[currentData] + "</strong>"
	        });**/


	            console.log(myChart.getElementAtEvent(e));
	            var chartData = myChart.getElementAtEvent(e)[0]._view;
	            console.log(chartData);
	        /**console.log(currentChart);
	        $(".search").find(".form-control").val(currentChart._view.label + '&' + currentChart._view.datasetLabel);
	        $(".search").find(".form-control").trigger("keyup");**/

	        	$('#response').append('<div> clicked createTeamChart:  chartData.label :' + JSON.stringify(chartData.label, null, "\t") + '</div>');
	        	$('#response').append('<div> clicked createTeamChart:  chartData.datasetLabel :' + JSON.stringify(chartData.datasetLabel, null, "\t") + '</div>');
	      		if (chartData.label == 'Marked Complete') {
	      			chartData.label = 'Marked as Complete';
	      		}
	      	//function buildTable(data, lastStatusUpdatedBy, statusFilter, typeFilter, products, drivers, selected_users);
	        	buildTable(appData.table_data, chartData.label, chartData.datasetLabel);

	            document.location.href = 'index.html#bootstrap-table';
	        }
	    }
	 
	 function createAverageChart(mydata) {
		    //console.log(mydata);
		    //suggestions average chart
		    var ctxAverage = document.getElementById("suggestions_average");
		    var myChartAverage = new Chart(ctxAverage, {
		        type: 'horizontalBar',
		        data: {
		            labels: ['Overall Team Average'],
		            datasets: [{
		                label: 'Pending',
		                data: [mydata.pending],
		                backgroundColor: pendingColor,
		                borderColor: pendingColor
		            }, {
		                label: 'Dismissed',
		                data: [mydata.dismissed],
		                backgroundColor: dismissedColor,
		                borderColor: dismissedColor
		            }, {
		                label: 'Actioned',
		                data: [mydata.actioned],
		                backgroundColor: actionedColor,
		                borderColor: actionedColor
		            }, {
		                label: 'Marked Complete',
		                data: [mydata.completed],
		                backgroundColor: completedColor,
		                borderColor: completedColor
		            }]
		        },
		        options: {
		            maintainAspectRatio: false,
		            responsive: true,
		            title: {
		                display: false
		            },
		            scales: {

		                yAxes: [{
		                    display: true,
		                    stacked: true,
		                    ticks: {
		                        fontStyle: 'bold'
		                    },
		                }],
		                xAxes: [{
		                    display: true,
		                    stacked: true,
		                }]
		            },
		            legend: {
		                display: false
		            },
		            tooltips: {
		                enabled: false
		            },
					animation: {
						onComplete: function() {
							var chartInstance = this.chart,
							    ctx = chartInstance.ctx,
								preset = 0;

							ctx.font = Chart.helpers.fontString(10, "bold", Chart.defaults.global.defaultFontFamily);
							ctx.textAlign = 'center';
							ctx.textBaseline = 'center';

							this.data.datasets.forEach(function(dataset, i) {
								var meta = chartInstance.controller.getDatasetMeta(i);
								meta.data.forEach(function(bar, index) {
									//var data = dataset.data[index];
									var data = Number(dataset.data[index]).toFixed(2);
									//console.log(bar._model.x);
									if (data > 0) {
										//ctx.fillText(data, bar._model.x, bar._model.base - (bar._model.base - bar._model.y)/2-5);								
										ctx.fillText(data, bar._model.base+(bar._model.x - bar._model.base)/2, bar._model.y+3);
										preset = bar._model.x;
									}   
								});
							});
						}
					}
		        }
		    });
		}
	 
	//0 = calls
	//1 = email
	//2 = insight
	//3 = call objective
	function createSuggestionsByTypeChart(type_data) {

	    $('#suggestions_by_type_container').empty();
	    $('#suggestions_by_type_container').append('<canvas id="suggestions_by_type"></canvas>');
	    if (myChart1) {
	        myChart1.destroy();
	    }

	    var labels = ["Call", "Email", "Insight", "Call Objective"];
	    var labels_to_display = [];
	    var data_to_display = [];

	    for (var i = 0; i < labels.length; i++) {
	        if (type_data[i] !== 0) {
	            labels_to_display.push(labels[i]);
	            data_to_display.push(type_data[i]);
	        }
	    }

	    if (data_to_display.length > 1) {//only render the chart if there are meaningful types to break down.
	        first_run = false;
	        var ctx1 = document.getElementById("suggestions_by_type");

	        var myChart1 = new Chart(ctx1, {
				type: 'horizontalBar',
				data: {
					labels: labels_to_display,
					datasets: [{
						label: 'Sugestions by Type',
						data: data_to_display,
						backgroundColor: [
							'rgba(93,165,218, 1)', 'rgba(93,165,218, 1)', 'rgba(93,165,218, 1)', 'rgba(93,165,218, 1)', 'rgba(93,165,218, 1)'
						],
						borderColor: [
							'rgba(93,165,218, 1)'
						]
					}]
				},
				options: {
					maintainAspectRatio: false,
					responsive: true,
					title: {
						display: false
					},
					scales: {
						yAxes: [{
							display: true,
							stacked: false,
							ticks: {
								beginAtZero: true
							},
						}],
						xAxes: [{
							display: true,
							stacked: false,
							barPercentage: 0.7,
							ticks: {
								beginAtZero: true
							}
						}]
					},
					legend: {
						display: false,
						labels: {
							display: true
						}
					},
					tooltips: {
						enabled: false
					},
					onClick: handleClick,
					animation: {
						onComplete: function() {
							var chartInstance = this.chart,
								ctx = chartInstance.ctx;

							ctx.font = Chart.helpers.fontString(10, "bold", Chart.defaults.global.defaultFontFamily);
							ctx.textAlign = 'center';
							ctx.textBaseline = 'center';

							this.data.datasets.forEach(function(dataset, i) {
								var meta = chartInstance.controller.getDatasetMeta(i);
								meta.data.forEach(function(bar, index) {
									var data = dataset.data[index];
									//console.log(bar._model.x);
									if (data > 0) {
										ctx.fillText(data, bar._model.base+(bar._model.x - bar._model.base)/2, bar._model.y);
									}   
								});
							});
						}
					}
	            }
	        });

	    } else if (first_run){
	        $("#suggestions_by_type_section").remove();
	        $("#team_continer").removeClass("col-md-6");
	        $("#team_continer").addClass("col-md-12");
	    }

	    

	    function handleClick(e) {
	        /**var currentChart = myChart1.getElementAtEvent(e)[0];
	        console.log(labels_to_display[currentChart._datasetIndex]);
	        console.log(data_to_display[currentChart._index]);
	        //var dataset = myChart1.getElementAtEvent(e)[0]._datasetIndex;
	        var myhtml = "";
	        for (var i = 0; i < labels_to_display.length; i++) {
	            myhtml += "<strong>" + labels_to_display[i] + ": </strong> " +
	                data_to_display + "<br/>";
	        }
	        swal({
	            html: myhtml
	        });
	        **/
	        //document.location.href = 'index.html#bootstrap-table';
	        //console.log(chart_config.data.datasets[activeElement[0]._datasetIndex].data[activeElement[0]._index]);


	        /**

	        switch (data.suggestions[i].RecordTypeId) {
	                case data.recordtype_map.Call_vod:
	                    row.type = 'Call';
	                    break;
	                case data.recordtype_map.Call_Objective_vod:
	                    row.type = 'Call Objective';
	                    break;
	                case data.recordtype_map.Email_vod:
	                    row.type = 'Email';
	                case data.recordtype_map.Insight_vod:
	                    row.type = 'Insight';
	            }

	        **/

	        var chartData = myChart1.getElementAtEvent(e)[0]._view;
	        console.log(chartData);
	        /**console.log(currentChart);
	        $(".search").find(".form-control").val(currentChart._view.label + '&' + currentChart._view.datasetLabel);
	        $(".search").find(".form-control").trigger("keyup");**/

	        //function buildTable(data, nameFilter, statusFilter, typeFilter)
	        $('#response').append('<div> clicked createSuggestionsByTypeChart:  chartData.label :' + JSON.stringify(chartData.label, null, "\t") + '</div>');
	        buildTable(appData.suggestions, null, null, chartData.label);
	        document.location.href = 'index.html#bootstrap-table';

	    }
	}
	
	function createTrendsChart(months, totals, completes) {

	    $('#trends_container').empty();
	    $('#trends_container').append('<canvas id="chart1"></canvas>');
	    if (myChart3) {
	        myChart3.destroy();
	    }

	    var ctx3 = document.getElementById("chart1");
	    var myChart3 = new Chart(ctx3, {
	        type: 'line',
	        data: {
	            labels: months,
	            datasets: [{
	                type: 'line',
	                label: 'Total',
	                data: totals,
	                backgroundColor: 'rgba(93,165,218, 0.5)',
	                borderColor: 'rgba(93,165,218, 1)',
	                borderWidth: 1
	            }, {
	                type: 'line',
	                label: 'Completed/Actioned',
	                data: completes,
	                backgroundColor: 'rgba(96,189,104, 0.9)',
	                borderColor: 'rgba(96,189,104,1)',
	                borderWidth: 1
	            }]
	        },
	        options: {
	            maintainAspectRatio: false,
	            responsive: true,
	            scales: {
	                yAxes: [{
	                    display: true,
	                    ticks: {
	                        beginAtZero: true,
	                        fontStyle: 'bold'
	                    }
	                }],
	                xAxes: [{
	                    display: true,
	                    scaleLabel: {
	                        display: false
	                    }
	                }],
	            },
	            legend: {
	                labels: {
	                    fontColor: '#777',
	                    fontFamily: 'Arial'
	                }
	            },
	            animation: {
					onComplete: function() {
						var chartInstance = this.chart,
							ctx = chartInstance.ctx;

						ctx.font = Chart.helpers.fontString(9, "bold", Chart.defaults.global.defaultFontFamily);
						ctx.textAlign = 'center';
						ctx.textBaseline = 'center';
						ctx.fillStyle = 'rgba(0, 0, 0,.7)';

						this.data.datasets.forEach(function(dataset, i) {
							var meta = chartInstance.controller.getDatasetMeta(i);
							meta.data.forEach(function(bar, index) {
								var data = dataset.data[index];
								//console.log(bar._model.x);
								if (data > 0) {
									ctx.fillText(data, bar._model.x, bar._model.y-15);
								}   
							});
						});
					}
				}
	        }
	    });
	}


$(document).ready(function() {

    //initialize the promise library
    $q = window.Q;
    //console.log("q.js initialized");

    function getUserId() {
        //console.log("getting userId");
    	$('#response').append('<pre>getUserId - Entering </pre>');
        var deferred = $q.defer();

        ds.getDataForCurrentObject('User', 'Id')
            .then(function(result) {
                //console.log(result);
                deferred.resolve(result.User.Id);
            })

        return deferred.promise;
    }

    function getCurrentUserTerritoryId(userId) {
        //console.log("getting UserTerr data based on userid = " + userId);
        //var inUserTerr = ds.getInStatement([userId]);
    	$('#response').append('<pre>getCurrentUserTerritoryId - Entering </pre>');
        var queryConfig = {
            userTerr: {
                object: 'UserTerritory',
                fields: ['TerritoryId'],
                where: "UserId = '" + userId + "'"
            }
        };

        var deferred = $q.defer();

        ds.runQuery(queryConfig.userTerr)
            .then(function(result) {
                //console.log(result)
                deferred.resolve(result.data); //we're assuming only 1 territory is assigned per user
            });

        return deferred.promise;
    }

    //accepts a single value territory SFDC Id
    function getChildTerritoryIds(terrId) {
        //console.log("getting more territories");
        //var inTerr = ds.getInStatement([terrId]);
        var queryConfig = {
            childTerr: {
                object: 'Territory',
                fields: ['Id'],
                where: 'ParentTerritoryId = \'' + terrId + '\''
            }
        };

        var deferred = $q.defer();

        ds.runQuery(queryConfig.childTerr)
            .then(function(result) {
                //console.log(result);
                deferred.resolve(result.data); //we're assuming only 1 level of child territories deep
            });

        return deferred.promise;

    }

    //accepts an array of territory SFDC Id's
    function getChildUserIds(terrIds) {
        //console.log("getting user id's of the manager's minions");
        var inTerr = ds.getInStatement(terrIds);

        var queryConfig = {
            childTerr: {
                object: 'UserTerritory',
                fields: ['UserId'],
                where: 'TerritoryId IN ' + inTerr
            }
        };

        var deferred = $q.defer();

        ds.runQuery(queryConfig.childTerr)
            .then(function(result) {
                //console.log(result);
                deferred.resolve(result.data);
            });

        return deferred.promise; //returning a list of User SFDC Ids
    }

    //accepts an array of User SFDC id's
    function getChildUsers(userIds) {
        //console.log("getting the usernames and id's together");
        var inTerr = ds.getInStatement(userIds);

        var queryConfig = {
            childTerr: {
                object: 'User',
                fields: ['Name', 'Id'],
                where: 'Id IN ' + inTerr
            }
        };

        var deferred = $q.defer();

        ds.runQuery(queryConfig.childTerr)
            .then(function(result) {
                deferred.resolve(result.data);
            });

        return deferred.promise; //returning a list of User Names for display
    }

    function getProducts() {
        //console.log("querying product catalog");
        var queryConfig = {
            all_products: {
                object: 'Product_vod__c',
                fields: ['Name', 'Id'],
                where: ''
            }
        };

        var deferred = $q.defer();

        ds.runQuery(queryConfig.all_products)
            .then(function(result) {
                //console.log(result);
                deferred.resolve(result.data);
            });

        return deferred.promise; //returning a list of products
    }

    function getRecordTypes() {
        //console.log('getting recordtypes');

        var inObject = ds.getInStatement(['Suggestion_vod__c', 'Suggestion_Tag_vod__c']);

        var queryConfig = {
            recordTypes: {
                object: 'RecordType',
                fields: ['Id', 'DeveloperName'],
                where: 'SobjectType IN ' + inObject
            }
        };

        var deferred = $q.defer();

        ds.runQuery(queryConfig.recordTypes)
            .then(function(result) {
                deferred.resolve(result.data);
            });

        return deferred.promise;
    }

    function getSuggestions() {
        //console.log("getting Suggestion header records");
  //      var inOwner = ds.getInStatement(userIds);
   //     $('#response').append('<div> Owner :' + JSON.stringify(inOwner, null, "\t") + '</div>');

       var queryConfig = {
            suggestions: {
                object: 'Suggestion_vod__c',
                fields: ['OwnerId', 'Account_Name_Stamp_AZ_US__c', 'Owner_District_AZ_US__c', 'Actioned_By_AZ_US__c', 'Completed_By_AZ_US__c', 'Dismissed_By_AZ_US__c', 'Account_vod__c','CreatedDate', 'RecordTypeId', 'Id', 'Marked_As_Complete_vod__c', 'Actioned_vod__c', 'Dismissed_vod__c', 'Title_vod__c', 'Reason_vod__c', 'Posted_Date_vod__c', 'Expiration_Date_vod__c']
            }
        };

        var deferred = $q.defer();

        ds.runQuery(queryConfig.suggestions)
            .then(function(result) {
                deferred.resolve(result.data);
            });

        return deferred.promise;
    }
	
    function getUserNames(ownerIds) {
        var inObject = ds.getInStatement(ownerIds);

        var queryConfig = {
            userNames: {
                object: 'User',
                fields: ['Id', 'Name'],
                where: 'Id IN ' + inObject
            }
        };
        
        var deferred = $q.defer();

        ds.runQuery(queryConfig.userNames)
            .then(function(result) {
                deferred.resolve(result.data);
            });

        return deferred.promise;
    }
    
	function getAccountNames(accountIds) {
        var accIds = ds.getInStatement(accountIds);
        var queryConfig = {
            accounts: {
                object: 'Account',
                fields: ['Name', 'Id'],
                where: 'Id IN ' + accIds
            }
        };

        var deferred = $q.defer();

        ds.runQuery(queryConfig.accounts)
            .then(function(result) {
                deferred.resolve(result.data);
            });

        return deferred.promise;
    }
	
    function getSuggestionTags(suggestions) {

        var suggestionIds = [];
        for (var i = 0; i < suggestions.length; i++) {
            suggestionIds.push(suggestions[i].Id);
        }
        //console.log("getting tags");
        var inSuggest = ds.getInStatement(suggestionIds);


        var queryConfig = {
            suggestionTags: {
                object: 'Suggestion_Tag_vod__c',
                fields: ['Product_Name__c', 'Suggestion_vod__c', 'Driver_vod__c'],
                where: 'Suggestion_vod__c IN ' + inSuggest
            }
        };

        var deferred = $q.defer();

        ds.runQuery(queryConfig.suggestionTags)
            .then(function(result) {
                //console.log(result);
                deferred.resolve(result.data);
            });

        return deferred.promise;
    }

    function disableProductFilter() {
        //console.log('sup');

        $('.product-filter').remove();
        $('#product_filter_label').remove();
        //$('.product-filter').children().css({color: "#9A9A9A"; border-color: "#9A9A9A"});
        //$('.product-filter').selectPicker('setStyle','btn-default','add');
        //$('.product-filter').prop('disabled', true);
        //$('.product-filter').selectpicker('refresh');
    }

    function disableDriverFilter() {
        $('.driver-filter').remove();
        $('#driver_filter_label').remove();
    }

    function getAllSuggestionFeedback() {
        //console.log("getting feedback");

        var queryConfig = {
            suggestionFeedback: {
                object: 'Suggestion_Feedback_vod__c',
                fields: ['Suggestion_vod__c'],
                where: ''
            }
        };

        var deferred = $q.defer();

        ds.runQuery(queryConfig.suggestionFeedback)
            .then(function(result) {
                //console.log(result);
                deferred.resolve(result.data);
            });

        return deferred.promise;
    }

    //returns true if a match is found
    function countAgainstTagFilters(applyProductFilter, applyDriverFilter, productFilter, driverFilter, suggestionTags) {
    	$('#response').append('<pre>countAgainstTagFilters - entering: productFilter ' + JSON.stringify(productFilter, null, "\t") +'</pre>');
    	$('#response').append('<pre>countAgainstTagFilters - entering: driverFilter ' + JSON.stringify(driverFilter, null, "\t") +'</pre>');
    	$('#response').append('<pre>countAgainstTagFilters - entering: suggestionTags ' + JSON.stringify(suggestionTags, null, "\t") +'</pre>');
        //console.log(suggestionTags);
        var product_match = false;
        var driver_match = false;

        if (applyProductFilter) {
            if (suggestionTags) {
                for (var i = 0; i < suggestionTags.length; i++) {
                    if (productFilter.has(suggestionTags[i].Product_Name__c)) {
                        product_match = true;
                    }
                }
            }
        }
        if (applyDriverFilter) {
            if (suggestionTags) {
                //console.log("checking driver filter");
                for (var i = 0; i < suggestionTags.length; i++) {
                    if (driverFilter.has(suggestionTags[i].Driver_vod__c)) {
                        driver_match = true;
                        //console.log("passed!");
                    }
                }
            }

        }
        return (product_match || driver_match);
    }


    function createTeamPicker(users) {
        var team_options = '';
        for (var i = 0; i < users.length; i++) {
            team_options += '<option value="' + users[i].Name + '">' + users[i].Name + '</option>';
        }

        $("#team_picker").append(team_options);
        $('#team_picker').selectpicker('refresh');
        $('#team_picker').selectpicker('render');

    }
    
    function filterSuggestionByProductsDrivers(productFilter, driverFilter, suggestion) {
    	var applyProductFilter = $.isEmptyObject(productFilter) ? false: true;
    		applyDriverFilter = $.isEmptyObject(driverFilter) ? false: true;
    		hasTags = false,
    		flag = true;
    	if(suggestion.tags != 'undefined') {
    		if($.isArray(suggestion.tags)) {
    			hasTags = suggestion.tags.lengh > 0 ? true : false;
    		} 
    	}
    	
    	if (applyProductFilter || applyDriverFilter) {
    		if(hasTags) {
    			for(var i=0; i<suggestion.tags.length; i++) {
    				if(!flag) {
    					return flag;
    				}
    				if (!productFilter.has(suggestion.tags[i].Product_Name__c) || !driverFilter.has(suggestion.tags[i].Driver_Name__c)) {
    					flag = false;
                    }
    			}
    		}
    	} 
    	return flag;
    }
    
	function filterSuggestions(productFilter, driverFilter, userFilter) {
		var filtered = {},
			tableData = [],
			thisSuggestion = {},
			averageData = {}, 
		    statusByUser = {},
			types = {
				calls: 0,
	        	email: 0,
	        	insight: 0,
	        	objective: 0
	        },
			count = {
	            total: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	            complete: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	        },
	        applyUserFilter = $.isEmptyObject(userFilter) ? false: true;
		
		//create filtered usersList array of object based on the selected users
		if (applyUserFilter) {
			var tempList = [];
            for (var i = 0; i < appData.usersList.length; i++) {
                if (userFilter.has(appData.usersList[i].Name)) {
                	tempList.push(appData.usersList[i]);
                }
            }
            appData.filtered.userObject.usersList = tempList;
        } else {
        	appData.filtered.userObject.usersList = appData.usersList;
        }
        
        for (var i = 0; i < appData.suggestions.length; i++) {
        	thisSuggestion = aggregateTableData(appData.suggestions[i]);
        	//apply user filter for suggestions
	    	if (applyUserFilter && !userFilter.has(thisSuggestion.lastStatusUpdatedBy)) {
                //console.log("filtering out a suggestion");
                continue;
            }
            //count by Type for Type Chart
            if (filterSuggestionByProductsDrivers(productFilter, driverFilter, thisSuggestion)) {
           		appData.filtered.userObject =  countUserStatus(thisSuggestion, appData.filtered.userObject);
           		appData.filtered.count = calculateMonthsCount(thisSuggestion, count);
           		appData.filtered.types = calculateSuggestionsType(thisSuggestion, types);
           	 	//appData.filtered.tableData.push(thisSuggestion);
           	 	appData.filtered.suggestions.push(thisSuggestion);
             }
        }
	}
	
	function aggregateTableData(suggestion) {
		var thisSuggestion = {
				title: suggestion.Title_vod__c,
	            reason: suggestion.Reason_vod__c,
	            type: suggestion.type,
				status: suggestion.Status,
				lastStatusUpdatedBy: suggestion.LastStatusUpdatedBy,
	            postedDate: moment(suggestion.Posted_Date_vod__c).format('LL'),
				expirationDate: moment(suggestion.Expiration_Date_vod__c).format('LL'),
				accountName: suggestion.AccountName,
				tags: suggestion.tags
            };
		
		return thisSuggestion;
	}
	
	function calculateSuggestionType(row, types) {
		if (row.type == callText) {
			types.calls++;
        } else if (row.type == emailText) {
        	types.email++;
        } else if (row.type == callObjectiveText) {
        	types.objective++;
        } else if (row.type == insightText) {
        	types.insight++;
        }
		return types;
	}
	
	//Count by User Status for Team Chart
	function countUserStatus(suggestion, userObject) {
		var averageData = {
				pendingSum: 0,
		        dismissedSum: 0,
		        completedSum: 0,
		        actionedSum: 0
			},
			usersList = userObject.usersList,
        	len = usersList.length;
		for (var i = 0; i < usersList.length; i++) {
			usersList[i]["pending"] = 0;
			usersList[i]["dismissed"] = 0;
			usersList[i]["actioned"] = 0;
			usersList[i]["completed"] = 0;
        }
        
		for (var i = 0; i < usersList.length; i++) {
            //console.log(row.lastStatusUpdatedBy);
			if (suggestion.lastStatusUpdatedBy == usersList[i].Name) {
			     //console.log("it's a match");
			 	if (suggestion.Status == actionedText) { 
			 		usersList[i].actioned++;
			 		averageData.actionedSum++
			 	} else if (suggestion.Status == completedText) {
			 		usersList[i].completed++;
			 		averageData.completedSum++
			 	} else if (suggestion.Status == dismissedText) {
			 		usersList[i].dismissed++;
			 		averageData.dismissedSum++
			 	} else if (suggestion.Status == pendingText) {
			 		usersList[i].pending++;
			 		averageData.pendingSum++
			     }
			}
		}
		averageData.pendingSum = (averageData.pendingSum / len);
		averageData.dismissedSum = (averageData.dismissedSum / len);
		averageData.completedSum = (averageData.completedSum / len);
		averageData.actionedSum = (averageData.actionedSum / len);
        
		userObject.usersList = usersList;
		userObject.averageData = averageData;
		
		return userObject;
	}
	
	//Count by created month for Trends chart
	function calculateMonthsCount(suggestion, count) {
		var month = new Date(suggestion.CreatedDate).getMonth();
        count.total[month]++;
        if (suggestion.status == completedText || suggestion.status == actionedText) {
            count.complete[month]++;
        }
		
        return count;
	}
	
    
    //buildTable
	
	
    function buildTable(suggestions, lastStatusUpdatedByFilter, statusFilter, typeFilter) {

        var $table = $('#bootstrap-table'),
        	rows = [],
        	row = {},
        	markup = '';
       
        for (var i = 0; i < suggestions.length; i++) {
        	row = suggestions[i];
        	if (lastStatusUpdatedByFilter || statusFilter) {
                if (lastStatusUpdatedByFilter === row.lastStatusUpdatedBy && statusFilter === row.status) {
                    rows.push(row);
                }
            } else if (typeFilter) {
                if (typeFilter === row.type) {
                    rows.push(row);
                }
            } else {
                rows.push(row);
            }

        }
        //$("#tablebody").append(markup);

        function operateFormatter(value, row, index) {
            return [
                '<div class="table-icons">',
                '<a rel="tooltip" title="View" class="btn btn-simple btn-info btn-icon table-action view" href="javascript:void(0)">',
                '<i class="ti-image"></i>',
                '</a>',
                '<a rel="tooltip" title="Edit" class="btn btn-simple btn-warning btn-icon table-action edit" href="javascript:void(0)">',
                '<i class="ti-pencil-alt"></i>',
                '</a>',
                '<a rel="tooltip" title="Remove" class="btn btn-simple btn-danger btn-icon table-action remove" href="javascript:void(0)">',
                '<i class="ti-close"></i>',
                '</a>',
                '</div>',
            ].join('');
        }
        $table.bootstrapTable({
            toolbar: ".toolbar",
            clickToSelect: true,
            showRefresh: false,
            search: true,
            showToggle: false,
            showColumns: false,
            pagination: true,
            searchAlign: 'left',
            pageSize: 5,
            clickToSelect: false,
            pageList: [5, 10, 15, 20],
            multipleSearch: true,
            delimeter: '&',
            showFilter: true,
            filterControl: true,


            formatShowingRows: function(pageFrom, pageTo, totalRows) {
                //do nothing here, we don't want to show the text "showing x of y from..."
            },
            formatRecordsPerPage: function(pageNumber) {
                return pageNumber + " rows visible";
            },
            icons: {
                refresh: 'fa fa-refresh',
                toggle: 'fa fa-th-list',
                columns: 'fa fa-columns',
                detailOpen: 'fa fa-plus-circle',
                detailClose: 'ti-close'
            }
        });

        $table.bootstrapTable('load', rows);

        //activate the tooltips after the data table is initialized
        $('[rel="tooltip"]').tooltip();

        $(window).resize(function() {
            $table.bootstrapTable('resetView');
        });

    }
   
   //refreshCharts(selected_users, selected_drivers, selected_products);     
    function refreshCharts(users, drivers, products) {
        
        var selected_drivers_set = null;
        if (drivers) {
            selected_drivers_set = new Set(selected_drivers);
        }
        var selected_products_set = null;
        if (products) {
            selected_products_set = new Set(selected_products);
        }
        var selected_users_set = null;
        if (users) {
            selected_users_set = new Set(selected_users);
        }
        
        filterSuggestions(selected_products_set, selected_drivers_set, selected_users_set).then(function() {
        
	        //make sure we're only displaying the YTD labels and values:
	        var this_month_remove = ((new Date().getMonth()) + 1);
	        appData.months_to_date = appData.months_to_date.slice(0, this_month_remove);
	        appData.filtered.count.total = appData.filtered.count.total.slice(0, this_month_remove);
	        appData.filtered.count.complete = appData.filtered.count.complete.slice(0, this_month_remove);
	        
	        //CREATE TYPE CHART
	        createSuggestionsByTypeChart(appData.filtered);
	        
	        //CREATE TRENDS CHART
	        createTrendsChart(appData.months_to_date, appData.filtered.count.total, appData.filtered.count.complete);
	        
	        //CREATE AVERAGE USERS CHART
	        createAverageChart(appData.filtered.averageData);
	        
	        //CREATE AVERAGE USERS CHART
	        createTeamChart(appData.filtered.userObject.usersList);
	      //  createTeamPicker(appData.usersList);
	        buildTable(appData.filtered.suggestions);
	    });
    }
    
    function parseSuggestions(suggestions) {
    	$('#response').append('<pre>inside: parseSuggestions : ' + JSON.stringify('', null, "\t") +'</pre>');
    	var accountIds = [];
        appData.ownerIdList = [];
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
				Status: ''
            };
        	appData.ownerIdList.push(suggestions[i].OwnerId.value);
        	
            appData.suggestionIds[i] = suggestions[i].Id.value;
            switch (suggestions[i].RecordTypeId.value) {
                case appData.recordtype_map.Call_vod:
                	this_suggestion.type = callText;
                    break;
                case appData.recordtype_map.Call_Objective_vod:
                	this_suggestion.type = callObjectiveText;
                    break;
                case appData.recordtype_map.Email_vod:
                	this_suggestion.type = emailText;
                    break;
                case appData.recordtype_map.Insight_vod:
                	this_suggestion.type = insightText;
                    break;
        	}
            this_suggestion.LastStatusUpdatedBy = this_suggestion.Actioned_By_AZ_US__c || this_suggestion.Completed_By_AZ_US__c || this_suggestion.Dismissed_By_AZ_US__c || '';
            this_suggestion.Status = this_suggestion.Actioned_vod__c ? 'Actioned' : this_suggestion.Marked_As_Complete_vod__c ? 'Marked as Complete' : this_suggestion.Dismissed_vod__c ? 'Dismissed' : 'Pending';
 //           accountIds[i] = suggestions[i].Account_vod__c.value;
            //console.log(this_suggestion);
            appData.suggestions[i] = this_suggestion;
        }
        appData.ownerIdList = appData.ownerIdList.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
    }
    
    function parseSuggestionTags(tags) {

        console.log(tags);
        if (tags.length > 0) {
            var product_tags_missing = true;
            var driver_tags_missing = true;
            //console.log(appData.suggestions);
            for (var i = 0; i < appData.suggestions.length; i++) {
                var tag_count = 0;
                for (var j = 0; j < tags.length; j++) {
                    //check if this tag parentid matches this suggestion id
                    if (tags[j].Suggestion_vod__c.value === appData.suggestions[i].Id) {
                        //console.log("it's a match!");
                        var newTag = {
                            Driver_vod__c: tags[j].Driver_vod__c.value,
                            Product_Name__c: tags[j].Product_Name__c.value
                        };
                        //console.log(newTag);
                        //console.log(appData.suggestions[i]);
                        if (tag_count === 0) {
                            appData.suggestions[i]["tags"] = [];
                        }
                        appData.suggestions[i].tags[tag_count] = newTag;
                        tag_count++;
                        //console.log(appData.suggestions[i].tags);
                        if (newTag.Driver_vod__c) {
                            drivers_master_set.add(newTag.Driver_vod__c);
                            driver_tags_missing = false;
                        }
                        if (newTag.Product_Name__c) {
                            products_master_set.add(newTag.Product_Name__c);
                            product_tags_missing = false;
                        }
                    }
                }
            }
            console.log("Driver tags missing? " + driver_tags_missing);
            console.log(drivers_master_set);
            console.log("Product tags missing? " + product_tags_missing);
            console.log(products_master_set);
            if (product_tags_missing) {
                disableProductFilter();
            } else { //now that all the tags are built out, time to compose the select pickers
                var product_options = '';
                for (let product of products_master_set) {
                    product_options += '<option value="' + product + '">' + product + '</option>';
                }
                $("#product_filter").append(product_options);
                $('.product-filter').selectpicker('refresh');

            }
            if (driver_tags_missing) {
                disableDriverFilter();
            } else { //now that all the tags are built out, time to compose the driver  pickers
                var driver_options = '';
                for (let driver of drivers_master_set) {
                    driver_options += '<option value="' + driver + '">' + driver + '</option>';
                }
                $("#driver_filter").append(driver_options);
                $('.driver-filter').selectpicker('refresh');
            }
        } else { //no tags!!
            //disable the filters that don't apply
            //console.log("There are zero Suggestion Tags")
            disableDriverFilter();
            disableProductFilter();
        }
    	
    }
    
    function parseUserNames(userNames) {
    	try {
        	var ownerIdLookup = {}, 
        	    tempSuggestions = [];
        	for (var i = 0;i < userNames.length; i++) {
        		childUserLookup[userNames[i].Id.value] = userNames[i].Name.value;
        	}
        	$.extend(appData.ownerIdLookup, ownerIdLookup);
        	for (var i = 0; i < appData.suggestions.length; i++) {
        		var temp = appData.ownerIdLookup[appData.suggestions[i].OwnerId] ? appData.ownerIdLookup[appData.suggestions[i].OwnerId] : '';
        	    appData.suggestions[i].LastStatusUpdatedBy = appData.suggestions[i].LastStatusUpdatedBy || temp ;
        	    if (appData.usersListSet.has(appData.suggestions[i].LastStatusUpdatedBy) && !moment().diff(suggestions[i].CreatedDate, 'years') > 0) {
        	    	tempSuggestions.push(appData.suggestions[i]);
        	    }
        	}
    	
        	appData.suggestions = tempSuggestions;
    		$('#response').append('<pre>After: LastStatusUpdatedBy of last suggestion : ' + appData.suggestions[appData.suggestions.length-1].LastStatusUpdatedBy +'</pre>');
    	} catch(e){
    		$('#response').append('<pre>ownerIdLookup for loop : ' + JSON.stringify(e, null, "\t") +'</pre>');
    	}
    }

    function mainController() {
    	$('#response').append('<div>mainController - entering </div>');
        getUserId().then(function(userId) {
        	$('#response').append('<pre>getUserId - '+ JSON.stringify(userId, null, "\t") +' </pre>');
        //	try {
        //		$('#response').append('<pre>appData - '+ JSON.stringify(appData, null, "\t") +' </pre>');
        		appData.currentUser.Id = userId;
                return getCurrentUserTerritoryId(appData.currentUser.Id);
       // 	} catch(e) {
        //		$('#response').append('<pre>error - '+ JSON.stringify(e, null, "\t") +' </pre>');
       // 	}
        }).then(function(terrId) {
        	$('#response').append('<pre>getCurrentUserTerritoryId - passed </pre>');
            $('#response').append('<pre>getCurrentUserTerritoryId - '+ JSON.stringify(terrId, null, "\t") +'  </pre>');
            appData.currentUser.territoryId = terrId[0].TerritoryId.value; //we assume the manager is only aligned to 1 territory
            //console.log(appData.currentUser.territoryId);
            return getChildTerritoryIds(appData.currentUser.territoryId);
        }).then(function(childTerrIds) {
        	 $('#response').append('<pre>getChildTerritoryIds - passed </pre>');
         //   $('#response').append('<pre>getChildTerritoryIds - '+ JSON.stringify(childTerrIds, null, "\t") +' </pre>');
            for (var i = 0; i < childTerrIds.length; i++) {
                appData.childTerrIds.push(childTerrIds[i].Id.value);
            }
            return getChildUserIds(appData.childTerrIds);
        }).then(function(users) {
            $('#response').append('<pre>getChildUserIds - passed </pre>');
            for (var i = 0; i < users.length; i++) {
                appData.subordinateUserIds[i] = users[i].UserId.value;
            }
            return getChildUsers(appData.subordinateUserIds);
        }).then(function(subUsers) {
            $('#response').append('<pre>getChildUsers - passed </pre>');
       //     $('#response').append('<pre>subUsers '+ JSON.stringify(subUsers, null, "\t") +' </pre>');
            var usersList = [];
            for (var i = 0; i < subUsers.length; i++) {
                var user_to_add = {
                    Name: subUsers[i].Name.value,
                    Id: subUsers[i].Id.value
                };
                appData.usersList.push(user_to_add);
                usersList.push(subUsers[i].Name.value);
            }
            appData.filtered.userObject.usersList = appData.usersList;
            appData.usersListSet = new Set(usersList);
            $('#response').append('<pre>usersListSet '+ JSON.stringify(appData.usersListSet, null, "\t") +' </pre>');
            return getRecordTypes();
        }).then(function(rt) {
            $('#response').append('<div>getRecordTypes - passed </div>');
            for (var i = 0; i < rt.length; i++) {
                $.extend(appData.recordtype_map, {
                    [rt[i].DeveloperName.value]: rt[i].Id.value
                });
            } //for the horrified: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#Computed_property_names
            $('#response').append('<pre>appData.recordtype_map '+ JSON.stringify(appData.recordtype_map, null, "\t") +' </pre>');
            console.log(appData.recordtype_map);
            return getSuggestions();
        }).then(function(suggestions) {
            $('#response').append('<div>getSuggestions - passed </div>');
        	return parseSuggestions(suggestions);
        }).then(function() {
        	$('#response').append('<div>parseSuggestions - passed </div>');
            return getSuggestionTags(appData.suggestions);
        }).then(function(tags) {
            $('#response').append('<div>getSuggestionTags - passed </div>');
        	return parseSuggestionTags(tags);
        }).then(function() {
        	$('#response').append('<pre>before: getUserNames</pre>');
           	return getUserNames(appData.ownerIdList);
        }).then(function(userNames) {
        	$('#response').append('<pre>After: getUserNames : ' + JSON.stringify(userNames, null, "\t") +'</pre>');
        	return parseUserNames(userNames);
        }).then(function() {
        	$('#response').append('<pre>before: filterSuggestions</pre>');
           	filterSuggestions(null, null, null);
            //make sure we're only displaying the YTD labels and values:
            var this_month_remove = ((new Date().getMonth()) + 1);
            appData.months_to_date = appData.months_to_date.slice(0, this_month_remove);
            appData.filtered.count.total = appData.filtered.count.total.slice(0, this_month_remove);
            appData.filtered.count.complete = appData.filtered.count.complete.slice(0, this_month_remove);

            
            //Create charts
            createSuggestionsByTypeChart(appData.filtered);
            createTrendsChart(appData.months_to_date, appData.filtered.count.total, appData.filtered.count.complete);
            createAverageChart(appData.filtered.averageData);
            createTeamChart(appData.filtered.userObject.usersList);
            createTeamPicker(appData.usersList);
            buildTable(appData.filtered.tableDatasuggestions);
            //event listener for team picker
            $("#team_picker").on("hidden.bs.select", function(e) {
                selected_users = $("#team_picker").val();
                refreshCharts(selected_users, selected_drivers, selected_products);
            });

            //event listener for driver filter
            $("#driver_filter").on("hidden.bs.select", function(e) {
                selected_drivers = $("#driver_filter").val();
                refreshCharts(selected_users, selected_drivers, selected_products);
            });

            //event listener for product filter
            $("#product_filter").on("hidden.bs.select", function(e) {
                selected_products = $("#product_filter").val();
                refreshCharts(selected_users, selected_drivers, selected_products);
            });

        });
    }
    

	$('#response').append('<pre>document-ready</pre>');
    mainController();
});