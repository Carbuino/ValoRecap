const { createCanvas, registerFont, loadImage } = require('canvas')
registerFont('./js/create_image/fonts/Tungsten-Bold.ttf', {family: 'Tungsten'});
registerFont('./js/create_image/fonts/DINNextW1G-Light.ttf', {family: 'DIN Next W1G', weight: '300'});
registerFont('./js/create_image/fonts/DINNextW1G-Regular.ttf', {family: 'DIN Next W1G', weight: '400'});
registerFont('./js/create_image/fonts/DINNextW1G-Medium.ttf', {family: 'DIN Next W1G', weight: '500'});

var agentsNames = [];
var riotIDs = [];
var riotTags = [];
var ACSs = [];
var KDAs = [];
var imageURLs = [];
var matchDetails = {};
var goldName = '';
var wins = 0;
var loss = 0;
var gameResult;

const canvas = createCanvas(1920, 1080)
const ctx = canvas.getContext('2d');

const valRed = '#FF4655';
const valGreen = '#79D8BC';
const valGray = '#BCC6C3';
const valGold = '#F0CB74';
const drawOrder = [0, 4, 1, 3, 2];

var agentPortraits = {};
fetch('https://valorant-api.com/v1/agents?isPlayableCharacter=true')
    .then(response => response.json())
    .then(data => {
        data.data.forEach(element => {
            agentPortraits[element.displayName.toUpperCase()] = element.fullPortrait;
    })
});

function resetVars() {
    agentsNames = [];
    riotIDs = [];
    ACSs = [];
    KDAs = [];
    imageURLs = [];
    matchDetails = {};
    goldName = '';
    wins = 0;
    loss = 0;
    gameResult = undefined;
};

async function scrapeJSON(id, tag, region, lastMatchID, puuid) {
    resetVars();
    let response;
    gameRegion = region;
    // get match data
    if ( puuid === undefined) {
        response = await fetch(`https://api.henrikdev.xyz/valorant/v3/matches/${region}/${id}/${tag}?size=1`);
    } else {
        response = await fetch(`https://api.henrikdev.xyz/valorant/v3/by-puuid/matches/${region}/${puuid}?size=1`);
    };
    let data = await response.json();
    let matchData = data.data[0];
    let newMatchID = matchData.metadata.matchid;
    
    if ( lastMatchID === newMatchID ) {
        return { image: false, match: newMatchID };
    }

    let playerList = matchData.players.all_players;
    let statsList = [];
    let playerIndex = 0;
    let playerTopIndex = 0;

    // Create condencsed array of all players with their name, tag, agent, acs, kills, deaths and assists
    for (let i = 0; i < playerList.length; i++) {
        statsList.push([playerList[i].name, playerList[i].tag, playerList[i].character.toUpperCase(), playerList[i].stats.score, playerList[i].stats.kills, playerList[i].stats.deaths, playerList[i].stats.assists]);
        if (id == playerList[i].name && tag == playerList[i].tag) { playerIndex = i };
    };

    matchDetails.map = matchData.metadata.map;
    matchDetails.mode = matchData.metadata.mode;
    matchDetails.time = matchData.metadata.game_length;
    matchDetails.region = matchData.metadata.region;

    if (matchData.metadata.mode == 'Deathmatch') {
        // Sort list from worst to best performers, most kills [4], highest ACS [3], then least deaths [5]
        statsList.sort((a,b) => {
            if (a[4] !== b[4]) {
              return a[4] - b[4];
            }
            if (a[3] !== b[3]) {
              return a[3] - b[3];
            }
            return b[5] - b[5];
          });
        // Create list of only top 5 players in match
        let killsTop5 = statsList.slice(-5);
        let playerTop5 = false;
        // Is Player in top 5?
        for (let i = 0; i < 5; i++) {
            if (id == killsTop5[i][0] && tag == killsTop5[i][1]) { 
                playerTop5 = true 
                playerTopIndex = i
            };
        };
        // Player not in top 5, replace worst player in top 5 with them
        if (playerTop5 == false) {
            killsTop5[0] = [playerList[playerIndex].name, playerList[playerIndex].tag, playerList[playerIndex].character.toUpperCase(), playerList[playerIndex].stats.score, playerList[playerIndex].stats.kills, playerList[playerIndex].stats.deaths, playerList[playerIndex].stats.assists]
        };
        // Add all the information required to draw the image
        killsTop5.forEach(element => {
            riotIDs.push(element[0])
            agentsNames.push(element[2])
            ACSs.push(element[3])
            KDAs.push(`${element[4]} / ${element[5]} / ${element[6]}`)
        });
        // Winning numbers
        if (killsTop5[4][0] == id) {
            wins = killsTop5[4][4]
            loss = killsTop5[3][4]
        } else {
            wins = killsTop5[playerTopIndex][4]
            loss = killsTop5[4][4]
        }
    } else if (matchData.metadata.mode == 'Custom') {
        console.log('custom deez nutz')
    } else {
        // Any other gamemode
        let playerTeamColour = playerList[playerIndex]['team'].toLowerCase()
        let playerTeam = matchData.players[playerTeamColour]
        let teamStats = [];
        // Process stats for everyone on team
        for (var i = 0; i < playerTeam.length; i++) {
            teamStats.push([playerTeam[i].name, playerTeam[i].tag, playerTeam[i].character.toUpperCase(), playerTeam[i].stats.score, playerTeam[i].stats.kills, playerTeam[i].stats.deaths, playerTeam[i].stats.assists]);
        };
        // Sort list from worst to best performers, by highest ACS [3], most kills [4] then least deaths [5]
        teamStats.sort((a,b) => {
            if (a[3] !== b[3]) {
              return a[3] - b[3];
            }
            if (a[4] !== b[4]) {
              return a[4] - b[4];
            }
            return b[5] - b[5];
          });
        // Rounds won and lost
        wins = matchData.teams[playerTeamColour].rounds_won;
        loss = matchData.teams[playerTeamColour].rounds_lost;
        gameResult = matchData.teams[playerTeamColour].has_won;
        // Add all the information required to draw the image
        teamStats.forEach(element => {
            riotIDs.push(element[0]);
            riotTags.push(element[1]);
            agentsNames.push(element[2]);
            ACSs.push(~~(element[3]/(wins + loss)));
            KDAs.push(`${element[4]} / ${element[5]} / ${element[6]}`);
        });
    };
    goldName = playerList[playerIndex].name
    // Set BG image
    await drawBG(ctx);
    // Draw the Result
	await drawResult(ctx);
	// Draw the Images
	await drawAgents(ctx, 850, 772);
	// Draw the Gradient covering Agents lower half
	await loadImage('./js/create_image/bg/gradient.png').then((image) => {
        ctx.drawImage(image, 0, 600, canvas.width, canvas.height - 600);
    });
	// Draw the Stats and their containers
	await drawStatBoxs(ctx, 283, 310);
    return { image: canvas.toBuffer(), match: newMatchID };
};

function drawResult(context) {
    function matchInfo(context) {
        context.font = '20px "DIN Next W1G"';
	    context.textAlign = 'center';
        let time;
        try {
            // https://stackoverflow.com/a/58531661
            time = new Date(matchDetails.time).toISOString().slice(11,19)  
        } catch {
            time = matchDetails.time
        };
        
        context.fillText(`${matchDetails.map} - ${matchDetails.mode} - ${time}`, 960, 44);
    };
    function victory(context)  {
        context.fillStyle = valGreen;
        context.fillText('VICTORY', 960, 458);
        winX = 282;
        lossX = 1642;
        matchInfo(context)
    };
    function draw(context)  {
        context.fillStyle = valGray;
        context.fillText('DRAW', 960, 458);
        winX = 493
        lossX = 1436
        matchInfo(context)
    };
    function defeat(context)  {
        context.fillStyle = valRed;
        context.fillText('DEFEAT', 960, 458);
        winX = 417
        lossX = 1511
        matchInfo(context)
    };
    // init
	context.font = '550px "Tungsten"';
	context.textAlign = 'center';
	var winX;
	var lossX;
    if (typeof gameResult !== 'undefined' && wins !== loss) {
        if (gameResult == true) {
            victory(context)
        } else {
            defeat(context)
        };
    } else if (wins < loss) {
        defeat(context)
    } else if (wins == loss) {
        draw(context)
    } else {
        victory(context)
    };
    // Draw Rounds Won/Lost
	context.font = '128px "Tungsten"';
	context.fillStyle = valGreen;
	context.textAlign = 'right';
	context.fillText(wins, winX, 158);
	context.textAlign = 'left';
	context.fillStyle = valRed;
	context.fillText(loss, lossX, 158);
};

async function drawStatBoxs(context, rectangleWidth, rectangleHeight) {
    async function drawAgentStats(context, index, location) {
        // Calculate the x-coordinate of the first box
        const x = 30 + (310 * (location + 1))
    
        // Constant starting y value
        const y = 626
    
        // Agent Name
        context.font = '300 22px "DIN Next W1G"';
        context.textAlign = 'center';
        context.fillStyle = 'white';
        context.fillText(agentsNames[index], x, y);
    
        // Riot ID and Rank
        context.font = '500 28px "DIN Next W1G"';
        if (riotIDs[index] == goldName) {
            if (matchDetails.mode == 'Competitive') {
                try {
                    response = await fetch(`https://api.henrikdev.xyz/valorant/v1/mmr/${matchDetails.region}/${riotIDs[index]}/${riotTags[index]}`);
                    let data = await response.json();
                    let mmrData = data.data;
                    await loadImage(mmrData.images.large).then((image) => {
                        context.drawImage(image, x - 50, y + 260, 100, 100);
                    });
                    //Current MMR
                    context.font = '300 22px "DIN Next W1G"';
                    context.strokeStyle = 'black';
                    context.lineWidth = 3;
                    context.strokeText(mmrData.ranking_in_tier, x - 1, y + 317);
                    context.fillText(mmrData.ranking_in_tier, x - 1, y + 317);
                    if ( mmrData.mmr_change_to_last_game > 0 ) { mmrData.mmr_change_to_last_game = `+${mmrData.mmr_change_to_last_game}`};
                    //MMR Change
                    context.font = '300 22px "DIN Next W1G"';
                    context.strokeText(mmrData.mmr_change_to_last_game, x, y + 260);
                    context.fillText(mmrData.mmr_change_to_last_game, x, y + 260);
                } catch (error) {
                    console.log(error);
                };
            };
            context.fillStyle = valGold;
        };    
        context.fillText(riotIDs[index], x, y + 40);
        context.fillStyle = 'white';
    
        //AVG Score Txt
        context.font = '300 22px "DIN Next W1G"';
        context.fillText('AVG COMBAT SCORE', x, y + 90);
    
        //AVG Score Value
        context.font = '500 36px "DIN Next W1G"';
        context.fillText(ACSs[index], x, y + 129);
    
        //KDA Txt
        context.font = '300 22px "DIN Next W1G"';
        context.fillText('KDA', x, y + 163);
    
        //KDA Value
        context.font = '500 36px "DIN Next W1G"';
        context.fillText(KDAs[index], x, y + 202);
    };
	// Calculate the x-coordinate of the first rectangle
	const x = (canvas.width - rectangleWidth * 5 - 27 * 4) / 2;

	// Calculate the y-coordinate of the first rectangle
	const y = canvas.height - rectangleHeight - 230;

	// Loop through 5 rectangles and draw them on the canvas
	for (let i = 0; i < 5; i++) {
        let j = drawOrder[i]
		if (j == 2) {
			await loadImage('./js/create_image/bg/mvp_box.png').then((image) => {
                context.drawImage(image, x + j * (rectangleWidth + 27), y, rectangleWidth, rectangleHeight);
            });
		} else {
			await loadImage('./js/create_image/bg/box.png').then((image) => {
                context.drawImage(image, x + j * (rectangleWidth + 27), y, rectangleWidth, rectangleHeight);
            });
		}
		await drawAgentStats(context, i, j);
	}

};

async function drawAgents(context, imageWidth, imageHeight) {
    async function draw(context, i, x, y, mw, mh) {
        await loadImage(imageURLs[i]).then((image) => {
            context.drawImage(image, x, y, mw, mh);
        });  
    };

    for (let i = 0; i < agentsNames.length; i++) {
        if (agentsNames[i] in agentPortraits) {
            imageURLs.push(agentPortraits[agentsNames[i]])
        } else {
            imageURLs.push('./bg/missing.png')
        };    
    };
    
	// Calculate the x-coordinate of the first rectangle
	const startX = ((canvas.width - 300 * 5 - 11 * 4) - 550) / 2;

	// Loop through 5 rectangles and draw them on the canvas
	for (let i = 0; i < 5; i++) {
		let j = drawOrder[i];
        // First box
        if (j == 0) {
			let multW = imageWidth * 0.9;
			let multH = imageHeight * 0.9;
			let x = startX + 44;
			let y = canvas.height - multH - 38;
            await draw(context, i, x, y, multW, multH);
        // Second Box
		} else if (j == 1) {
			let x = startX + j * (300 + 12);
			let y = canvas.height - imageHeight - 38;
            await draw(context, i, x, y, imageWidth, imageHeight);
        // Third Box
        } else if (j == 2) {
            let multW = imageWidth * 1.1;
            let multH = imageHeight * 1.1;
            let x = startX + j * (300) - 17;
            let y = canvas.height - multH - 38;
            await draw(context, i, x, y, multW, multH);
        // Forth Box
        } else if (j == 3) {
			let x = startX + j * (300 + 10.5);
			let y = canvas.height - imageHeight - 38;
            await draw(context, i, x, y, imageWidth, imageHeight);
        // Fifth Box
		} else {
			let multW = imageWidth * 0.9;
			let multH = imageHeight * 0.9;
			let x = startX + j * (300 + 21);
			let y = canvas.height - multH - 38;
            await draw(context, i, x, y, multW, multH);
		}
	};
};

async function drawBG(context) {
    if (wins < loss) {
        await loadImage('./js/create_image/bg/defeat.png').then((image) => {
            context.drawImage(image, 0, 0);
        });
    } else if (wins == loss) {
        await loadImage('./js/create_image/bg/draw.png').then((image) => {
            context.drawImage(image, 0, 0);
        });
    } else {
        await loadImage('./js/create_image/bg/victory.png').then((image) => {
            context.drawImage(image, 0, 0);
        });
    };
};

module.exports.scrapeJSON = scrapeJSON;