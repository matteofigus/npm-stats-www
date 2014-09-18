var maxPlotsPerPage = 10;

var showMoreButton = function(start, data, callback){
  var selectors = {
    loading: "#loading",
    showMore: "#show-more"
  };

  $(selectors.showMore).unbind('click').click(function(){
    _gaq.push(['_trackPageview', '/' + username + '/' + parseInt(1 + (start/maxPlotsPerPage), 10)]);
    $(selectors.showMore).addClass("hide");
    var end = Math.min(data.length, start + maxPlotsPerPage);
    $(selectors.loading).html("Plotting the data...");
    plot(data, start, end, callback);
    $(selectors.loading).html("");

    return false;
  });

  if(!!callback && typeof(callback) === 'function')
    callback();

  $(selectors.showMore).removeClass("hide");
};

window.plot = function(plotData, start, end, callback){
  for(var i = start; i < end; i++){
  
    var data = plotData[i];

    var options = {
      title: {
        text: data.repository,
        color: '#F1F1F1'
      },
      animate: false,
      grid: {
        background: '#000000', textColor: '#F1F1F1'
      },
      seriesDefaults:{
        rendererOptions: {
          showDataLabels: true
        }
      },
      highlighter: {
        show: true,
        sizeAdjust: 7.5
      },
      axesDefaults: {
        labelRenderer: $.jqplot.CanvasAxisLabelRenderer
      },
      axes: {
        xaxis: { 
          label: "Date", 
          renderer: $.jqplot.DateAxisRenderer,
          pad: 0
        },
        yaxis: { 
          label: "Downloads", 
        }
      },
      series: [{
        showMarker: false, 
        pointLabels: { show: true },
        label: 'Downloads', 
        color: '#CC3D33'
      }]
    };
    $(".twitter-hashtag-button-hide", "#" + data.div + "-repository").addClass("twitter-hashtag-button").removeClass("twitter-hashtag-button-hide");

    $("#" + data.div + "-repository").removeClass("hide");

    if(data.downloads.length == 0)
      $("#" + data.div + "-chart").html("No data to plot");
    else
      var plot = $.jqplot(data.div + "-chart", [data.downloads], options);

  }

  if(end < plotData.length)
    showMoreButton(end, plotData, callback);
  else if(!!callback && typeof(callback) === 'function')
    callback();

};