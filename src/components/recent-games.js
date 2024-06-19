const recentGame = (stats) => {
  const {
      gameName,
      gameLogo,
      gamePlayTime,
      animationDelay,
      translateY,
  } = stats;
  return `
    <g transform="translate(-10, ${translateY})">
        <g class="stagger" style="animation-delay: ${animationDelay}ms" transform="translate(25, 0)">
        <image x="0" y="0" height="30" width="30" href="${gameLogo}"></image>
        <text class="game-header bold" x="35" y="12">${gameName}</text>
        <text class="stat" x="35" y="27">${gamePlayTime}</text>
        </g>
    </g>
  `;
};

const convertGamePlayTime = (t) => {
  return (t === 0 ? 0 : (t / 60).toFixed(2)) + " hours";
};

export function renderRecentGames(recentGames) {
  let groupItems;
  let animationDelay = 450;
  let translateY = 0;
  recentGames
      .sort((a, b) => b.playTime - a.playTime)
      .slice(0, 5)
      .forEach((game) => {
          groupItems += recentGame({
              gameName: game.game.name,
              gameLogo: game.image,
              gamePlayTime: convertGamePlayTime(game.minutes),
              animationDelay: animationDelay,
              translateY: translateY,
          });
          animationDelay += 150;
          translateY += 35;
      });
  return groupItems;
}
