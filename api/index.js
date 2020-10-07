const SteamAPI = require("steamapi");
const { renderRecentStatCard } = require("../src/svg-card/recent-stat");
const steam = new SteamAPI(process.env.STEAM_APP_ID);

countRecentPlayHours = (recentGames) => {
  let recentMinutes = 0;
  for (let g in recentGames) {
    recentMinutes += g.playTime2;
  }
  return (recentMinutes === 0 ? 0 : recentMinutes / 60) + " hours";
};

module.exports = async (req, res) => {
  const { profileName, profileUrl } = req.query;

  let steamId;
  if (profileName) {
    steamId = await steam.resolve(
      "https://steamcommunity.com/id/" + profileName
    );
  } else if (profileUrl) {
    steamId = await steam.resolve(profileUrl);
  } else {
    return res.status(500).send("Put url or profileName");
  }

  const summary = await steam.getUserSummary(steamId);

  const recentGames = await steam.getUserRecentGames(steamId);

  return res.send(
    renderRecentStatCard({
      summary: summary.nickname,
      steamProfileUrl: summary.url,
      avatarMedium: summary.avatar.medium,
      recentPlayHours: countRecentPlayHours(recentGames),
      personaState: summary.personaState,
    })
  );
};
