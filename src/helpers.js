const fetch = require("node-fetch");

exports.imageToData = async (imageUrl) => {
  const buff = await (await fetch(imageUrl)).arrayBuffer();
  return `data:image/jpeg;base64,${Buffer.from(buff).toString("base64")}`;
};

exports.countRecentPlayHours = (recentGames) => {
  let recentMinutes = 0;
  recentGames.forEach((g) => (recentMinutes += parseInt(g.playTime2)));
  return (recentMinutes === 0 ? 0 : (recentMinutes / 60).toFixed(2)) + " hours";
};

exports.recentlyPlayedGames = async (recentGames) => {
  return await Promise.all(
    recentGames.map(async (game) => {
      return {
        name: game.name,
        playTime2: game.playTime2,
        iconURL: await this.imageToData(game.iconURL),
      };
    })
  );
};

exports.recentlyPlayedGamesName = (recentGames) => {
  return recentGames.map((game) => game.name).join(", ");
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

exports.convertPersonaState = (personaState) => {
  return personaMap[parseInt(personaState)];
};

exports.downloadGamesImages = async (recentGames) => {
  await Promise.all(
    recentGames.map(async (game) => {
      game.iconURL = await this.imageToData(game.iconURL);
      game.logoURL = await this.imageToData(game.logoURL);
    })
  );
};

exports.formatRecentlyPlayedGamesName = (names) => {
  return names.replace("&", "&amp;");
};
