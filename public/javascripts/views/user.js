var UserView = function(){

  var selectors = {
    loading: "#loading",
    repositories: "#repositories",
    userInfo: "#user-info",
    twitterShare: ".twitter-share",
    twitterShareLink: ".twitter-share a"
  };

  var userData = [];

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
            divId = username.replace(".","-") + "-" + data[i].replace(/\./g, "-");
            
        while ($("#" + divId).length) {
          divId += "-";
        }

        $(selectors.repositories).append(templates.repositoryDiv(divId, data[i]));

        (function(repository, endpoint, div){
          $.get(endpoint, function(info){

            $(selectors.loading).html("Loading downloads (" + fetched + "/" + data.length + ")...");
            userData.push({ repository: repository, div: div, downloads: info.downloads, maintainers: info.maintainers });

            fetched ++;
            if(fetched == data.length){ 
              userData = userData.sort(function(a, b){
                if(a.repository > b.repository)
                  return 1;
                else if(a.repository < b.repository)
                  return -1;

                return 0;
              });

              addDetails();
              var end = Math.min(data.length, maxPlotsPerPage);
              $(selectors.loading).html("Plotting the data...");
              plot(userData, 0, end, loadTwitterWidget);
              $(selectors.loading).html("");
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

      data.downloads = data.downloads || [];
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

      $("#" + div).html(templates.repositoryDetails(data.repository, data.maintainers, total, lastMonth, max));
    }
    $(selectors.userInfo).html(templates.userInfo(userData.length, userTotal, userLastMonth));

    $(selectors.twitterShare).html(templates.shareViaTwitter("Wow! " + userLastMonth + " downloads to my npm modules this month!", "http://www.npm-stats.com/" + username));
    $(selectors.twitterShare).removeClass("hide");
    $(selectors.twitterShareLink).addClass("twitter-hashtag-button").removeClass("twitter-hashtag-button-hide");

    loadTwitterWidget();    
  };

  var loadTwitterWidget = function(){
    if(!!window.twttr){
      twttr.ready(function(twttr) {       
        twttr.events.bind('tweet', function (event) {
          _gaq.push(['_trackEvent', "Engagement", "Share-Twitter", username]);
        });
        twttr.widgets.load();
      });
    }
  };
};