const superagent = require("superagent");
const npmApi = require("npm-api");
const npmStats = require("npm-stats-patched");

const REGISTRY_URL = "https://replicate.npmjs.com/";
const npm = new npmApi();

exports.index = function(req, res) {
  res.render("user", {
    title: `Stats for ${req.params.username}`,
    username: req.params.username,
    repository: ""
  });
};

exports.repository = (req, res) =>
  res.render("repository", {
    title: `Stats for ${req.params.repository}`,
    username: "",
    repository: req.params.repository
  });

exports.info = (req, res) => {
  const repoName = req.params.repository;
  if (!repoName)
    return res.json(500, { error: true, message: "not valid repository" });

  const registry = npmStats(REGISTRY_URL);

  registry.module(repoName).info((err, data) => {
    if (err)
      res.json(500, {
        error: true,
        message:
          err.reason === "missing" ? "The module is missing" : err.reason,
        details: err
      });
    else {
      const ctime =
        data.time && data.time.created
          ? data.time.created
          : data.ctime || "2009-01-01T00:00:00Z";
      const cdate = new Date(ctime).toISOString().split("T")[0];
      const nowDate = new Date().toISOString().split("T")[0];
      const url = `https://api.npmjs.org/downloads/range/${cdate}:${nowDate}/${repoName}`;

      superagent.get(url).end((err, response) => {
        if (err || response.body.error)
          return res.json({
            error: true,
            message: err || response.body.error
          });

        const downloads = response.body.downloads.map(el => [
          el.day,
          el.downloads
        ]);

        const maintainers = data.maintainers.map(el => el.name);

        res.json({ downloads, maintainers });
      });
    }
  });
};

exports.repositories = (req, res) => {
  const { username } = req.params;
  if (!username)
    return res.json(500, { error: true, message: "not valid username" });

  const maintainer = npm.maintainer(username);

  maintainer
    .repos()
    .then(r => res.json(r.sort()))
    .catch(details =>
      res.json(400, { error: true, message: "api error", details })
    );
};
