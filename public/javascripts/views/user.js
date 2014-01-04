var selectors = {
  loading: "#loading",
  repositories: "#repositories"
};

var endpoints = {
  repositoriesByUser: function(username){
    return '/~repositories/' + username;
  },
  downloadsByRepository: function(repository){
    return '/~downloads/' + repository;
  }
};

var templates = {
  repositoryDiv: function(divId, repository){
    return "<div class=\"repository\"><div class=\"chart\" id=\"" + divId + "\"></div><div class=\"repository-details\" id=\"" + divId + "-details\"></div></div>";
  },
  repositoryDetails: function(repository, total, max){
    var s = "<h2>" + repository + "</h2><br />Total downloads: " + total + "<br />";
    
    if(max)
      s += "Last peak: " + max[0] + "(" + max[1] + ")";

    return s;
  }
}

$(function(){
  $(selectors.loading).html("Loading stats for " + username + "...");
  $.get(endpoints.repositoriesByUser(username), function(data){    
    if(data && data.error)
      return $(selectors.loading).html("An error occurred: " + data.message);

    if(data && data.length == 0)
      return $(selectors.loading).html("No repositories found on npm for user " + username);

    $(selectors.loading).html("Loading downloads (0/" + data.length + ")...");
    for(var i = 0; i < data.length; i++){
      var fetched = 0,
          divId = "repository-" + username + "-" + data[i],
          dataToPlot = [];

      $(selectors.repositories).append(templates.repositoryDiv(divId, data[i]));

      (function(repository, endpoint, div){
        $.get(endpoint, function(downloads){

          $(selectors.loading).html("Loading downloads (" + fetched + "/" + data.length + ")...");
          dataToPlot.push({ repository: repository, div: div, downloads: downloads});

          fetched ++;
          if(fetched == data.length){
            addDetails(dataToPlot);
            plot(dataToPlot);
          }

        }).fail(function(){
          $("#" + div).html("An error occurred while trying to retrieve the downloads for the " + repository + " repository");
        });
      })(data[i], endpoints.downloadsByRepository(data[i]), divId);

    }
  }).fail(function(){
    return $(selectors.loading).html("An error occurred while trying to retrieve the results");
  });

  var addDetails = function(details){
    $(selectors.loading).html("Rendering the details...");
    for(var i = 0; i < details.length; i++){
      var data = details[i],
          div = data.div + "-details",
          total = 0,
          max = null;

      for(var j = 0; j < data.downloads.length; j++){
        total += data.downloads[j][1];
        if(!max)
          max = data.downloads[j];
        else if(data.downloads[j][1] >= max[1])
          max = data.downloads[j];
      }

      $("#" + div).html(templates.repositoryDetails(data.repository, total, max));
    }
  };

  var plot = function(dataToPlot){
    $(selectors.loading).html("Plotting the data...");
    for(var i = 0; i < dataToPlot.length; i++){
    
      var data = dataToPlot[i];

      var options = {
        title: {
          text: data.repository,
          color: '#F1F1F1'
        },
        animate: true,
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

      if(data.downloads.length == 0)
        $("#" + data.div).html("No data to plot");
      else
        var plot = $.jqplot(data.div, [data.downloads], options);
    }
    $(selectors.loading).html("");
  };
});