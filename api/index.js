import SteamAPI from "steamapi";
import { imageToData, downloadGamesImages, convertPersonaState, countRecentPlayHours, recentlyPlayedGamesName } from "../src/helpers.js";
import { renderRecentStatCard } from "../src/components/recent-stat.js";
import Game from "../node_modules/steamapi/src/structures/Game.js";
const steam = new SteamAPI(process.env.STEAM_APP_ID);

export default async (req, res) => {
  const { profileName, profileUrl } = req.query;

  try {
    if (profileName == undefined && profileUrl == undefined) {
      return res.status(400).send("Missing profileName or profileUrl");
    }
    const steamId = await getSteamId();

    const summary = await steam.getUserSummary(steamId);

    let recentGames = await steam.getUserRecentGames(steamId);
    let ownedGames = await steam
      .get(
        `/IPlayerService/GetOwnedGames/v1?steamid=${steamId}&include_appinfo=1&include_played_free_games=1`
      )
      .then((json) => json.response.games.map((game) => new Game(game)));
    
    console.table(ownedGames)

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
    console.trace(e);
    if (e instanceof TypeError) {
      return res.status(404).send("Profile not found");
    }
    return res.status(500).send("Something is wrong!");
  }

  async function getSteamId() {
    if (profileName) {
      return await steam.resolve(
        "https://steamcommunity.com/id/" + profileName
      );
    }
    if (profileUrl) {
      return await steam.resolve(profileUrl);
    }
  }
};
