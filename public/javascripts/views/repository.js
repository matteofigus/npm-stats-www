var RepositoryView = function(){

  var selectors = {
    loading: "#loading",
    repositories: "#repositories",
    userInfo: "#user-info",
    showMore: "#show-more",
    twitterShare: ".twitter-share"
  };

  var endpoints = {
    downloadsByRepository: function(repository){
      return '/~downloads/' + repository;
    }
  };

  var templates = {
    userInfo: function(repositoryCount, total, lastMonth){
      var s = "Modules: " + repositoryCount + "<br />Total downloads: " + total + "<br />Downloads last month: " + lastMonth;

      return s;
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
        s += "Last peak: " + max[0] + " (" + max[1] + ")<br /><br />";

      s += templates.shareViaTwitter("Wow! " + total + " downloads for " + repository + "!");
      return s;
    },
    shareViaTwitter: function(msg){
      return "<a href=\"https://twitter.com/intent/tweet?button_hashtag=npmstats&text=" + msg.replace(/ /g, "%20") + "\" data-hashtags=\"npmstats, npm, nodejs\" data-url=\"http://www.npm-stats.com/~package/" + repository + "\" class=\"twitter-hashtag-button\">Tweet #npmstats</a>"
    }
  };

  var maxPlotsPerPage = 10;
  var userData = [];

  this.init = function(){

    var div = "user-" + repository.replace(/\./g, "-");
    $(selectors.loading).html("Loading downloads for " + repository + "...");
    $(selectors.repositories).append(templates.repositoryDiv(div, repository));

    $.get(endpoints.downloadsByRepository(repository), function(downloads){

      userData.push({ repository: repository, div: div, downloads: downloads});
      addDetails();
      plot(0, 1);

    }).fail(function(){
      $("#" + div).html("An error occurred while trying to retrieve the downloads for the " + repository + " repository");
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

    loadTwitterWidget(userLastMonth);    
  };

  var loadTwitterWidget = function(lastMonth){

    twttr.ready(function(twttr) {       
      twttr.events.bind('tweet', function (event) {
        _gaq.push(['_trackEvent', "Engagement", "Share-Twitter-Module", repository]);
      });
      twttr.widgets.load();
    });
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

    $(selectors.loading).html("");
  };
};

var view = new RepositoryView();

$(function(){
  view.init();
});

