exports.renderRecentStatCard = (profileStats, gameStats) => {
  const {
    nickName,
    streamProfileUrl,
    avatarMedium,
    recentPlayHours,
    personaState,
  } = profileStats;

  return `
    <svg width="320" height="200" viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <style>
            .header {
            font: 600 16px "Segoe UI", Ubuntu, Sans-Serif;
            fill: #ffffff;
            animation: fadeInAnimation 0.8s ease-in-out forwards;
            }

            .game-header {
            font: 600 14px "Segoe UI", Ubuntu, Sans-Serif;
            fill: #bcbab8;
            }

            .stat {
            font: 400 14px "Motiva Sans", Ubuntu, "Helvetica Neue", Sans-Serif;
            fill: #bcbab8;
            animation: fadeInAnimation 0.8s ease-in-out forwards;
            }
            
            .stagger {
            opacity: 0;
            animation: fadeInAnimation 0.3s ease-in-out forwards;
            }

            .bold {
            font-weight: 700;
            }
            
            @keyframes fadeInAnimation {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
            }
        </style>
        undefined
        <rect x="0.5" y="0.5" rx="4.5" height="99%" stroke="#E4E2E2" width="320" fill="#171a21" stroke-opacity="1" />

        <g transform="translate(25, 35)">
            <g transform="translate(0, 0)">
            <image x="0" y="-15" class="header" href="${avatarMedium}" height="55" />
            <a href="${streamProfileUrl}">
                <text x="65" y="0" class="header" text-decoration="underline">${nickName}</text>
            </a>
            
            <text x="65" y="40" class="stat">${personaState}</text>
            <text x="65" y="22" class="stat">
                <tspan font-weight="bold">
                ${recentPlayHours}
                </tspan> played in last 2 weeks
            </text>
            </g>
        </g>
        
        <line x1="10" y1="85" x2="310" y2="85" style="stroke:#bcbab8;animation: fadeInAnimation 1s ease-in-out forwards;" />

        // <g transform="translate(0, 95)">
        //     <svg x="0" y="0">
        //     <g transform="translate(0, 0)">
        //         <g class="stagger" style="animation-delay: 450ms" transform="translate(25, 0)">
        //         <image height="40" href="${gameLogo}" />
        //         <text class="game-header bold" x="45" y="15">${gameName}</text>
        //         <text class="stat" x="45" y="33">${gamePlayTime2} played in last 2 weeks</text>
        //         </g>
        //     </g>
        //
        //     <g transform="translate(0, 45)">
        //         <g class="stagger" style="animation-delay: 450ms" transform="translate(25, 0)">
        //         <image height="40" href="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/570/0bbb630d63262dd66d2fdd0f7d37e8661a410075.jpg" />
        //         <text class="game-header bold" x="45" y="15">Dota</text>
        //         <text class="stat" x="45" y="33">13 hours played in last 2 weeks</text>
        //         </g>
        //     </g>
        //     </svg>
        // </g>
    </svg>

  `;
};
