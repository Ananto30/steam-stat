const SteamAPI = require("steamapi");
const { imageToData } = require("../src/helpers");
const { renderRecentStatCard } = require("../src/components/recent-stat");
const steam = new SteamAPI(process.env.STEAM_APP_ID);

countRecentPlayHours = (recentGames) => {
  let recentMinutes = 0;
  recentGames.forEach((g) => (recentMinutes += parseInt(g.playTime2)));
  return (recentMinutes === 0 ? 0 : (recentMinutes / 60).toFixed(2)) + " hours";
};

const personaMap = {
  0: "Offline",
  1: "Online",
  2: "Busy",
  3: "Away",
  4: "Snooze",
  5: "Looking to trade",
  6: "Looking to play",
};

convertPersonaState = (personaState) => {
  return personaMap[parseInt(personaState)];
};

downloadRecentGamesImages = async (recentGames) => {
  await Promise.all(recentGames.slice(0,2).map(async (game) => {
    game.iconURL = await imageToData(game.iconURL);
  }));
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

  let recentGames = await steam.getUserRecentGames(steamId);
  await downloadRecentGamesImages(recentGames);

  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", `public, max-age=18000`);
  return res.send(
    renderRecentStatCard(
      {
        nickname: summary.nickname,
        steamProfileUrl: summary.url,
        avatarMedium: await imageToData(summary.avatar.medium),
        recentPlayHours: countRecentPlayHours(recentGames),
        personaState: convertPersonaState(summary.personaState),
      },
      recentGames
    )
  );
};
