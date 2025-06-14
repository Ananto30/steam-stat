import SteamAPI from "steamapi";
import {
    imageToData,
    downloadGamesImages,
    convertPersonaState,
    recentlyPlayedGamesName
} from "../src/helpers.js";
import {
    renderRecentStatCard
} from "../src/components/recent-stat.js";
const steam = new SteamAPI(process.env.STEAM_APP_ID);

export default async (req, res) => {
    const {
        profileName,
        profileUrl
    } = req.query;

    try {
        if (profileName == undefined && profileUrl == undefined) {
            return res.status(400).send("Missing profileName or profileUrl");
        }

        const steamId = await getSteamId();
        console.log("Steam ID: ", steamId);
        
        // wait for a random time between 1 to 3 seconds to avoid rate limiting
        const delay = Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000;
        await new Promise(resolve => setTimeout(resolve, delay));

        const summary = await steam.getUserSummary(steamId);
        console.log("User summary: ", summary);

        await new Promise(resolve => setTimeout(resolve, delay));

        let recentGames = await steam.getUserRecentGames(steamId);
        let ownedGames = await steam.getUserOwnedGames(steamId, {
            includeAppInfo: true,
            includeFreeGames: true
        });

        // sort games by minutes
        recentGames = recentGames
            .sort((a, b) => b.minutes - a.minutes)
            .slice(0, 2);
        ownedGames = ownedGames
            .sort((a, b) => b.minutes - a.minutes)
            .slice(0, 5);

        console.log("Recent games: ");
        console.table(recentGames);
        console.log("Owned games: ");
        console.table(ownedGames);

        await downloadGamesImages(ownedGames);

        res.setHeader("Content-Type", "image/svg+xml");
        res.setHeader("Cache-Control", `public, max-age=10800`);
        return res.send(
            renderRecentStatCard({
                    nickname: summary.nickname,
                    steamProfileUrl: summary.url,
                    avatarMedium: await imageToData(summary.avatar.medium),
                    recentlyPlayedGamesName: recentlyPlayedGamesName(recentGames)
                        .slice(0, 30),
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
        if (e.message.includes("No match")) {
            return res.status(404).send("Profile not found");
        }
        return res.status(500).send("Something is wrong!");
    }

        async function getSteamId() {
            if (profileName) {
                // Check if profileName is all digits (SteamID64)
                if (/^\d+$/.test(profileName)) {
                    return await steam.resolve(
                        "https://steamcommunity.com/profiles/" + profileName
                    );
                }
                return await steam.resolve(
                    "https://steamcommunity.com/id/" + profileName
                );
            }
            if (profileUrl) {
                return await steam.resolve(profileUrl);
            }
        }
};
