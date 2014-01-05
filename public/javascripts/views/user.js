var UserView = function(){

  var selectors = {
    loading: "#loading",
    repositories: "#repositories",
    userInfo: "#user-info",
    showMore: "#show-more"
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
    userInfo: function(repositoryCount, total, lastMonth){
      return "Modules: " + repositoryCount + "<br />Total downloads: " + total + "<br />Downloads last month: " + lastMonth;
    },
    repositoryDiv: function(divId, repository){
      return "<div id=\"" + divId + "-repository\"class=\"repository hide\"><div class=\"chart\" id=\"" + divId + "-chart\"></div><div class=\"repository-details\" id=\"" + divId + "-details\"></div></div>";
    },
    repositoryDetails: function(repository, total, lastMonth, max){
      var s = "<h2>" + repository + "</h2><a href=\"https://www.npmjs.org/package/" + repository + 
              "\" target=\"blank\">open on npm</a><br /><br />Total downloads: " + total + "<br />";
      
      if(lastMonth >= 0)
        s += "Last month: " + lastMonth + "<br />";

      if(max)
        s += "Last peak: " + max[0] + " (" + max[1] + ")";

      return s;
    }
  };

  var maxPlotsPerPage = 10;
  var userData = [];

  var showMoreButton = function(start){
    $(selectors.showMore).unbind('click').click(function(){
      _gaq.push(['_trackPageview', '/' + username + '/' + parseInt(1 + (start/maxPlotsPerPage), 10)]);
      $(selectors.showMore).addClass("hide");
      var end = Math.min(userData.length, start + maxPlotsPerPage);
      plot(start, end);
      return false;
    });

    $(selectors.showMore).removeClass("hide");
  };

  this.init = function(){
    $(selectors.loading).html("Loading stats for " + username + "...");
    $.get(endpoints.repositoriesByUser(username), function(data){    
      if(data && data.error)
        return $(selectors.loading).html("An error occurred: " + data.message);

      if(data && data.length == 0)
        return $(selectors.loading).html("No repositories found on npm for user " + username);

      $(selectors.loading).html("Loading downloads (0/" + data.length + ")...");
      for(var i = 0; i < data.length; i++){
        var fetched = 0,
            divId = username + "-" + data[i];

        $(selectors.repositories).append(templates.repositoryDiv(divId, data[i]));

        (function(repository, endpoint, div){
          $.get(endpoint, function(downloads){

            $(selectors.loading).html("Loading downloads (" + fetched + "/" + data.length + ")...");
            userData.push({ repository: repository, div: div, downloads: downloads});

            fetched ++;
            if(fetched == data.length){
              addDetails();

              var end = Math.min(data.length, maxPlotsPerPage);
              plot(0, end);
            }

          }).fail(function(){
            $("#" + div).html("An error occurred while trying to retrieve the downloads for the " + repository + " repository");
          });
        })(data[i], endpoints.downloadsByRepository(data[i]), divId);

      }
    }).fail(function(){
      return $(selectors.loading).html("An error occurred while trying to retrieve the results");
    });
  };

  var addDetails = function(){
    $(selectors.loading).html("Rendering the details...");
    var userTotal = 0,
        userLastMonth = 0;

    for(var i = 0; i < userData.length; i++){
      var data = userData[i],
          div = data.div + "-details",
          total = 0,
          lastMonth = 0,
          max = null,
          now = new Date();

          now.setMonth(now.getMonth() - 1);

          var todayOneMonthAgo = now.toJSON().substr(0, 10);

      for(var j = 0; j < data.downloads.length; j++){
        total += data.downloads[j][1];
        userTotal += data.downloads[j][1];

        if(data.downloads[j][0] >= todayOneMonthAgo){
          lastMonth += data.downloads[j][1];
          userLastMonth += data.downloads[j][1];
        }

        if(!max)
          max = data.downloads[j];
        else if(data.downloads[j][1] >= max[1])
          max = data.downloads[j];
      }

      $("#" + div).html(templates.repositoryDetails(data.repository, total, lastMonth, max));
    }
    $(selectors.userInfo).html(templates.userInfo(userData.length, userTotal, userLastMonth));
  };

  var plot = function(start, end){
    $(selectors.loading).html("Plotting the data...");
    for(var i = start; i < end; i++){
    
      var data = userData[i];

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

      $("#" + data.div + "-repository").removeClass("hide");

      if(data.downloads.length == 0)
        $("#" + data.div + "-chart").html("No data to plot");
      else
        var plot = $.jqplot(data.div + "-chart", [data.downloads], options);

    }

    if(end < userData.length)
      showMoreButton(end);

    $(selectors.loading).html("");
  };
};

var view = new UserView();

$(function(){
  view.init();
});

