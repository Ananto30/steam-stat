import {
    formatRecentlyPlayedGamesName
} from "../helpers.js";
import {
    renderRecentGames
} from "./recent-games.js";

export function renderRecentStatCard(profileStats, recentGames) {
    const {
        nickname,
        steamProfileUrl,
        avatarMedium,
        recentlyPlayedGamesName,
        personaState,
    } = profileStats;
    return `
    <svg width="360" height="255" viewBox="0 0 360 255" fill="none" xmlns="http://www.w3.org/2000/svg">
        <style>
            .header {
            font: 600 14px "Segoe UI", Ubuntu, Sans-Serif;
            fill: #ffffff;
            animation: fadeInAnimation 0.8s ease-in-out forwards;
            }

            .game-header {
            font: 600 12px "Motiva Sans", "Segoe UI", Ubuntu, Sans-Serif;
            fill: #bcbab8;
            }

            .stat {
            font: 400 12px "Motiva Sans", Ubuntu, "Helvetica Neue", Sans-Serif;
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
        <rect x="0.5" y="0.5" rx="4.5" height="99%" stroke="#E4E2E2" width="99%" fill="#171a21" stroke-opacity="1" />

        <g transform="translate(15, 30)">
            <g transform="translate(0, 0)">
              <image x="0" y="-15" href="${avatarMedium}" style="animation: fadeInAnimation 0.8s ease-in-out forwards;" width="45" height="45"/>
              <a href="${steamProfileUrl}">
                  <text x="53" y="-3" class="header" text-decoration="underline">${nickname}</text>
              </a>
              <text x="53" y="14" class="stat">
                  Recently played 
                  <tspan font-weight="bold">
                  ${formatRecentlyPlayedGamesName(recentlyPlayedGamesName)}
                  </tspan>
              </text>
              <text x="53" y="28" class="stat">Currently: ${personaState}</text> 
            </g>
        </g>
        
        <line x1="10" y1="67" x2="350" y2="67" style="stroke:#bcbab8;animation: fadeInAnimation 1s ease-in-out forwards;" />

        <g transform="translate(0, 75)">
            <svg x="0" y="0">
            ${renderRecentGames(recentGames)}
            </svg>
        </g>
    </svg>

  `;
}
