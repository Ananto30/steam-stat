const SteamAPI = require("steamapi");
const {
  imageToData,
  downloadGamesImages,
  convertPersonaState,
  countRecentPlayHours,
  recentlyPlayedGamesName,
} = require("../src/helpers");
const { renderRecentStatCard } = require("../src/components/recent-stat");
const Game = require("steamapi/src/structures/Game");
const steam = new SteamAPI(process.env.STEAM_APP_ID);

module.exports = async (req, res) => {
  const { profileName, profileUrl } = req.query;

  try {
    let steamId;
    if (profileName) {
      steamId = await steam.resolve(
        "https://steamcommunity.com/id/" + profileName
      );
    } else if (profileUrl) {
      steamId = await steam.resolve(profileUrl);
    } else {
      return res.status(400).send("Put url or profileName");
    }

    const summary = await steam.getUserSummary(steamId);

    let recentGames = await steam.getUserRecentGames(steamId);
    let ownedGames = await steam
      .get(
        `/IPlayerService/GetOwnedGames/v1?steamid=${steamId}&include_appinfo=1&include_played_free_games=1`
      )
      .then((json) => json.response.games.map((game) => new Game(game)));

    await downloadGamesImages(ownedGames);

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", `public, max-age=10800`);
    return res.send(
      renderRecentStatCard(
        {
          nickname: summary.nickname,
          steamProfileUrl: summary.url,
          avatarMedium: await imageToData(summary.avatar.medium),
          recentPlayHours: countRecentPlayHours(recentGames),
          recentlyPlayedGamesName: recentlyPlayedGamesName(
            recentGames.slice(0, 2)
          ).slice(0, 30),
          personaState: convertPersonaState(summary.personaState),
        },
        ownedGames
      )
    );
  } catch (e) {
    if (e instanceof TypeError) {
      return res.status(404).send("Profile not found");
    }
    console.trace(e);
    return res.status(500).send("Something is wrong!");
  }
};
