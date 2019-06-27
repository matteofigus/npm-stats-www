const npmStats = require("npm-stats-patched");
const _ = require("lodash");

const from = () => {
  const d = new Date();
  d.setHours(d.getHours() - 30);
  return d;
};

const to = () => {
  const d = new Date();
  d.setHours(d.getHours() - 24);
  return d;
};

const registry = npmStats("https://replicate.npmjs.com/");

const getUpdated = callback =>
  registry.listByDate({ since: from(), until: to() }, (err, r) => {
    if (err) return callback(err);

    const result = _(r)
      .chain()
      .map(item => item.name)
      .uniq()
      .value();

    callback(null, result);
  });

exports.index = (req, res) =>
  getUpdated((err, updatedModules) =>
    res.render("index", {
      title: "Npm-stats",
      username: "",
      repository: "",
      updatedModules: updatedModules || []
    })
  );
