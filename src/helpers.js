import fetch from "node-fetch";

export async function imageToData(imageUrl) {
  const imageData = await fetch(imageUrl);
  const buff = await imageData.arrayBuffer();
  return `data:image/jpg;base64,${Buffer.from(buff).toString("base64")}`;
}

export function countRecentPlayHours(recentGames) {
  let recentMinutes = 0;
  recentGames.forEach((g) => (recentMinutes += parseInt(g.recentMinutes)));
  return (recentMinutes === 0 ? 0 : (recentMinutes / 60).toFixed(2)) + " hours";
}


export function recentlyPlayedGamesName(recentGames) {
  return recentGames.map((game) => game.game.name).join(", ");
}

const personaMap = {
  0: "Offline",
  1: "Online",
  2: "Busy",
  3: "Away",
  4: "Snooze",
  5: "Looking to trade",
  6: "Looking to play",
};

export function convertPersonaState(personaState) {
  return personaMap[parseInt(personaState)];
}

/**
 * Downloads images for the games in the provided list.
 *
 * @param {Array<{game: {id: number, name: string, icon: string, hasCommunityVisibleStats: boolean, hasLeaderboards: boolean, descriptorIDs: any}, minutes: number, recentMinutes: number, windowsMinutes: number, macMinutes: number, linuxMinutes: number, disconnectedMinutes: number, lastPlayedTimestamp: number}>} recentGames - The list of games to download images for.
 * @returns {Promise<void>}
 */
export async function downloadGamesImages(recentGames) {
  await Promise.all(
    recentGames.map(async (game) => {
      game.iconURL = imageUrl(game.game.id, game.game.icon);
      game.iconURL = await imageToData(game.iconURL);
      // game.logoURL = await imageToData(game.logoURL);
    })
  );
}

export function formatRecentlyPlayedGamesName(names) {
  return names.replace("&", "&amp;");
}

function imageUrl(gameId, iconId) {
  // return `https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/${gameId}/${iconId}.ico`;
  return `http://media.steampowered.com/steamcommunity/public/images/apps/${gameId}/${iconId}.jpg`;
}