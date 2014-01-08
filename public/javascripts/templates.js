window.templates = {
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

    s += this.shareViaTwitter("Wow! " + total + " downloads for " + repository + "!", "http://www.npm-stats.com/~packages/" + repository);
    return s;
  },
  shareViaTwitter: function(msg, url){
    return "<a href=\"https://twitter.com/intent/tweet?button_hashtag=npmstats&text=" + msg.replace(/ /g, "%20") + "\" data-hashtags=\"npmstats, npm, nodejs\" data-url=\"" + url + "\" class=\"twitter-hashtag-button\">Tweet #npmstats</a>"
  }
};
