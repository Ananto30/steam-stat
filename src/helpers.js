import fetch from "node-fetch";

export async function imageToData(imageUrl) {
  const imageData = await fetch(imageUrl);
  const buff = await imageData.arrayBuffer();
  return `data:image/jpg;base64,${Buffer.from(buff).toString("base64")}`;
}

export function countRecentPlayHours(recentGames) {
  let recentMinutes = 0;
  recentGames.forEach((g) => (recentMinutes += parseInt(g.playTime2)));
  return (recentMinutes === 0 ? 0 : (recentMinutes / 60).toFixed(2)) + " hours";
}

export async function recentlyPlayedGames(recentGames) {
  return await Promise.all(
    recentGames.map(async (game) => {
      return {
        name: game.name,
        playTime2: game.playTime2,
        iconURL: await this.imageToData(game.iconURL),
      };
    })
  );
}

export function recentlyPlayedGamesName(recentGames) {
  return recentGames.map((game) => game.name).join(", ");
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

export async function downloadGamesImages(recentGames) {
  await Promise.all(
    recentGames.map(async (game) => {
      game.iconURL = await imageToData(game.iconURL);
      // game.logoURL = await imageToData(game.logoURL);
    })
  );
}

export function formatRecentlyPlayedGamesName(names) {
  return names.replace("&", "&amp;");
}
