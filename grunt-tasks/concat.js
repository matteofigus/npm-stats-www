var jsInput = 'public/javascripts/',
    cssInput = 'public/stylesheets/';

var task = {
  js: {
    src: [
      // Libraries
      jsInput + "vendor/ga.js",
      jsInput + "vendor/jquery.2.0.0.js",
      jsInput + "vendor/jquery.jqplot.min.js",
      jsInput + "vendor/jqplot.canvasAxisLabelRenderer.min.js",
      jsInput + "vendor/jqplot.canvasTextRenderer.min.js",
      jsInput + "vendor/jqplot.dateAxisRenderer.min.js",
      jsInput + "vendor/jqplot.highlighter.min.js",
      jsInput + "vendor/twttr.js",

      // Scripts
      jsInput + "templates.js",
      jsInput + "endpoints.js",
      jsInput + "search.js",
      jsInput + "plot.js",

      //Views
      jsInput + "views/repository.js",
      jsInput + "views/user.js"

    ],
    dest: 'public/bundle.js'
  },
  css: {
    src: [
      cssInput + 'style.css',
      cssInput + 'jquery.jqplot.min.css',
      cssInput + 'jqplot.custom.css'
    ],
    dest: 'public/bundle.css'
  }
};

module.exports = task;