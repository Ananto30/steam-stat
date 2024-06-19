let recentGame = (stats) => {
    const {
        gameLogo,
        animationDelay,
        translateY,
        translateX,
    } = stats;
    return `
      <g transform="translate(${translateX}, ${translateY})">
          <g class="stagger" stroke="#E4E2E2" style="animation-delay: ${animationDelay}ms" transform="translate(15, -15)">
          <image x="0" y="0" height="70" width="100" href="${gameLogo}"></image>
          </g>
      </g>
    `;
};

export function renderRecentGamesImages(recentGames) {
    let groupItems;
    let animationDelay = 450;
    let translateY = 0;
    let translateX = 0;
    recentGames
        .sort((a, b) => b.playTime - a.playTime)
        .slice(0, 9)
        .forEach((game, i) => {
            if (i == 3 || i == 6) {
                translateX += 115;
                translateY = 0;
            }
            groupItems += recentGame({
                gameLogo: game.logoURL,
                animationDelay: animationDelay,
                translateY: translateY,
                translateX: translateX,
            });
            animationDelay += 150;
            translateY += 45;
        });
    return groupItems;
}
