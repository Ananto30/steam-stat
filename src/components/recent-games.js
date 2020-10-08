recentGame = (stats) => {
  const {
    gameName,
    gameLogo,
    gamePlayTime,
    animationDelay,
    translateY,
  } = stats;
  return `
          <g transform="translate(0, ${translateY})">
              <g class="stagger" style="animation-delay: ${animationDelay}ms" transform="translate(25, 0)">
              <image x="0" y="0" height="40" width="40" href="${gameLogo}"></image>
              <text class="game-header bold" x="45" y="15">${gameName}</text>
              <text class="stat" x="45" y="33">${gamePlayTime} played in last 2 weeks</text>
              </g>
          </g>
      `;
};

convertGamePlayTime = (playTime2) => {
  return (playTime2 === 0 ? 0 : (playTime2 / 60).toFixed(2)) + " hours";
};

exports.renderRecentGames = (recentGames) => {
  let groupItems;
  let animationDelay = 450;
  let translateY = 0;
  recentGames.slice(0, 2).forEach((game) => {
    groupItems += recentGame({
      gameName: game.name,
      gameLogo: game.iconURL,
      gamePlayTime: convertGamePlayTime(game.playTime2),
      animationDelay: animationDelay,
      translateY: translateY,
    });
    animationDelay += 150;
    translateY += 45;
  });
  return groupItems;
};
