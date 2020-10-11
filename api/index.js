const SteamAPI = require("steamapi");
const {
  imageToData,
  downloadRecentGamesImages,
  convertPersonaState,
  countRecentPlayHours,
} = require("../src/helpers");
const { renderRecentStatCard } = require("../src/components/recent-stat");
const steam = new SteamAPI(process.env.STEAM_APP_ID);

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
  res.setHeader("Cache-Control", `public, max-age=10800`);
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
