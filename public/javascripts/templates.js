window.templates = {
  userInfo: function(repositoryCount, total, lastMonth){
    var addSpaces = function(n){
      var nStr = n+'',
          remainder = nStr.length % 3;

      return (nStr.substr(0, remainder) + nStr.substr(remainder).replace(/(\d{3})/g, ' $1')).trim();
    };

    var s = "<div class=\"col m-20\"><div class=\"n\">" + addSpaces(repositoryCount) + "</div><div class=\"t\">modules</div></div>";
    s += "<div class=\"col m-20\"><div class=\"n\">" + addSpaces(total) + "</div><div class=\"t\">total downloads</div></div>";
    s += "<div class=\"col m-20\"><div class=\"n\">" + addSpaces(lastMonth) + "</div><div class=\"t\">downloads last month</div></div>";

    return s;
  },
  repositoryDiv: function(divId, repository){
    return "<div id=\"" + divId + "-repository\"class=\"repository hide\"><div class=\"chart\" id=\"" + divId + "-chart\"></div><div class=\"repository-details\" id=\"" + divId + "-details\"></div></div>";
  },
  repositoryDetails: function(repository, maintainers, total, lastMonth, max){
    var s = "<h2>" + repository + "</h2><a href=\"https://www.npmjs.org/package/" + repository + 
            "\" target=\"blank\">open on npm</a><br /><br />Total downloads: " + total + "<br />";
    
    if(lastMonth >= 0)
      s += "Last month: " + lastMonth + "<br />";

    if(max)
      s += "Last peak: " + max[0] + " (" + max[1] + ")<br /><br />";

    if(!!maintainers && maintainers.length > 0){
      s += "Maintainers: ";
      for(var i = 0; i < maintainers.length; i++)
        s += "<a href=\"/" + maintainers[i] + "\">" + maintainers[i] + "</a> - ";

      s = s.substr(0, s.length - 2) + "<br /><br />"; 
    }

    s += this.shareViaTwitter("Wow! " + total + " downloads for " + repository + "!", "http://www.npm-stats.com/~packages/" + repository);
    return s;
  },
  shareViaTwitter: function(msg, url){
    return "<a href=\"https://twitter.com/intent/tweet?button_hashtag=npmstats&text=" + msg.replace(/ /g, "%20") + "\" data-hashtags=\"npmstats, npm, nodejs\" data-url=\"" + url + "\" class=\"twitter-hashtag-button-hide\">Tweet #npmstats</a>"
  }
};
