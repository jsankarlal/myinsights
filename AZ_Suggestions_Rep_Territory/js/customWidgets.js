//jscs:disable
function createTeamChart(myData, chartContainer, messages) {
    console.log('inside chart')

    $('#team_chart_container').empty();
    $('#team_chart_container').append('<canvas id="suggestions"></canvas>');
    if (myChart) {
        myChart.destroy();
    }

    //suggestions chart
    var ctx = document.getElementById("suggestions");
    var myChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: [''],
            datasets: [{
                label: messages.pendingText,
                data: [myData.pending],
                backgroundColor: pendingColorDisplay,
                borderColor: pendingColorDisplay
            }, {
                label: messages.dismissedText,
                data: [myData.dismissed],
                backgroundColor: dismissedColorDisplay,
                borderColor: dismissedColorDisplay
            }, {
                label: messages.completedText,
                data: [myData.completed],
                backgroundColor: completedColorDisplay,
                borderColor: completedColorDisplay
            }, {
                label: messages.actionedText,
                data: [myData.actioned],
                backgroundColor: actionedColorDisplay,
                borderColor: actionedColorDisplay
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
                    }
                }],
                xAxes: [{
                    display: true,
                    stacked: true,
                    stepSize: 1,    
                    scaleLabel: {
                        display: true,
                        labelString: messages.totalSuggestionsLabel
                    }
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
                            preset = 0,
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
        console.log(myChart.getElementAtEvent(e));
        var chartData = myChart.getElementAtEvent(e)[0]._view;
        console.log(chartData);
        buildTable(appData.table_data,chartData.datasetLabel,null);
        document.location.href = 'index.html#bootstrap-table';
    }
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
                      beginAtZero: true,
                  },
              }],
              xAxes: [{
                  display: true,
                  stacked: false,
                  barPercentage: 0.7,
                  ticks: {
                      beginAtZero: true
//                      stepSize: 1
                  },
					scaleLabel: {
                      display: true,
                      labelString: 'Total Number of Suggestions'
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

  function handleClick(e) {
      var chartData = myChart1.getElementAtEvent(e)[0]._view;
      console.log(chartData);
      buildTable(appData.table_data, null, chartData.label);
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
                        display: false,
                        stepSize: 1
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


function buildTable(data, statusFilter, typeFilter, $table) {

    var $table = $('#bootstrap-table');
    var rows = [];

    var markup = '';
    for (var i = 0; i < data.length; i++) {

        var row = {
            name: data[i].name,
    //        title: data[i].title,
            accountName: data[i].accountName,
            reason: data[i].reason,
            type: data[i].type,
            status: data[i].status,
            postedDate: data[i].postedDate,
			expirationDate: data[i].expirationDate,
			statusAzUs: data[i].statusAzUs,
			lastStatusUpdatedBy: data[i].lastStatusUpdatedBy
        }
        //console.log(row.status);

        if (statusFilter) {
            if (statusFilter === row.status) {
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