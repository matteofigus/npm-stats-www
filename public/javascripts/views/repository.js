var RepositoryView = function(){

  var selectors = {
    loading: "#loading",
    repositories: "#repositories",
    twitterShare: ".twitter-share"
  };

  var repositoryData = [];

  this.init = function(){

    var div = "user-" + repository.replace(/\./g, "-");
    $(selectors.loading).html("Loading downloads for " + repository + "...");
    $(selectors.repositories).append(templates.repositoryDiv(div, repository));

    $.get(endpoints.downloadsByRepository(repository, true), function(response){
      if(response.error)
        return $(selectors.loading).html(response.message);

      repositoryData.push({ repository: repository, div: div, downloads: response.downloads, maintainers: response.maintainers });
      addDetails();
      $(selectors.loading).html("Plotting the data...");
      plot(repositoryData, 0, 1, loadTwitterWidget);
      $(selectors.loading).html("");

    }).fail(function(){
      $("#" + div).html("An error occurred while trying to retrieve the downloads for the " + repository + " repository");
    });
  };

  var addDetails = function(){
    $(selectors.loading).html("Rendering the details...");
    for(var i = 0; i < repositoryData.length; i++){
      var data = repositoryData[i],
          div = data.div + "-details",
          total = 0,
          lastMonth = 0,
          max = null,
          now = new Date();

          now.setMonth(now.getMonth() - 1);

          var todayOneMonthAgo = now.toJSON().substr(0, 10);

      for(var j = 0; j < data.downloads.length; j++){
        total += data.downloads[j][1];

        if(data.downloads[j][0] >= todayOneMonthAgo)
          lastMonth += data.downloads[j][1];

        if(!max)
          max = data.downloads[j];
        else if(data.downloads[j][1] >= max[1])
          max = data.downloads[j];
      }

      $("#" + div).html(templates.repositoryDetails(data.repository, data.maintainers, total, lastMonth, max));
      loadTwitterWidget();
    }   
  };

  var loadTwitterWidget = function(){
    if(!!window.twttr){
      twttr.ready(function(twttr) {       
        twttr.events.bind('tweet', function (event) {
          _gaq.push(['_trackEvent', "Engagement", "Share-Twitter-Module", repository]);
        });
        twttr.widgets.load();
      });
    }
  };
};