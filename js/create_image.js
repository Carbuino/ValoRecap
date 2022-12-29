var agentsNames = [];
var riotIDs = [];
var ACSs = [];
var KDAs = [];
var imageURLs = [];
var matchDetails = {};
var goldName = '';
var wins = 0;
var loss = 0;
var gameResult;

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const victoryImage = new Image();
victoryImage.src = './bg/UI_MVP_VIctoryBG.png';

const defeatImage = new Image();
defeatImage.src = './bg/UI_MVP_DefeatBG.png';

const drawImage = new Image();
drawImage.src = './bg/UI_MVP_DrawBG.png';

const valRed = "#FF4655";
const valGreen = "#79D8BC";
const valGray = "#BCC6C3";
const valGold = "#F0CB74";
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

async function scrapeJSON(id, tag) {
    async function getJSON() {
        let response = await fetch('./comp_test.json');
        let data = await response.json();
        return data
    }
    resetVars();
    // get match data
    data = await getJSON();
    let matchData = data.data[0];
    let playerList = matchData.players.all_players;
    let statsList = [];
    let playerIndex = 0;
    let playerTopIndex = 0;

    // Create condencsed array of all players with their name, tag, agent, acs, kills, deaths and assists
    for (let i = 0; i < playerList.length; i++) {
        statsList.push([playerList[i].name, playerList[i].tag, playerList[i].character.toUpperCase(), playerList[i].stats.score, playerList[i].stats.kills, playerList[i].stats.deaths, playerList[i].stats.assists]);
        if (id == playerList[i].name && tag == playerList[i].tag) { playerIndex = i };
    };

    matchDetails.map = matchData.metadata.map
    matchDetails.mode = matchData.metadata.mode
    matchDetails.time = matchData.metadata.game_length

    if (matchData.metadata.mode == "Deathmatch") {
        // Sort list from worst to best performers, by most kills then highest ACS
        statsList.sort((a,b) => {
            if (a[4] !== b[4]) {
                return a[4] - b[4]
            } else {
                return b[3] < a[3]
            }
        })
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
    } else if (matchData.metadata.mode == "Custom") {
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
        // Sort list from worst to best performers, by most kills [4] then highest ACS [3]
        teamStats.sort((a,b) => {
            if (a[4] !== b[4]) {
                return a[4] - b[4]
            } else {
                return b[3] < a[3]
            }
        })
        // Rounds won and lost
        wins = matchData.teams[playerTeamColour].rounds_won;
        loss = matchData.teams[playerTeamColour].rounds_lost;
        gameResult = matchData.teams[playerTeamColour].has_won;
        // Add all the information required to draw the image
        teamStats.forEach(element => {
            riotIDs.push(element[0])
            agentsNames.push(element[2])
            ACSs.push(~~(element[3]/(wins + loss)))
            KDAs.push(`${element[4]} / ${element[5]} / ${element[6]}`)
        });
    };
    goldName = playerList[playerIndex].name
    generateImage()
};

async function retrieveText() {
	var textByOption = {};
    resetVars();
	for (var i = 0; i < localStorage.length; i++) {
		var key = localStorage.key(i);

		if (key.startsWith("option")) {
			var parts = key.split("-");
			var option = parts[0];
			var textNum = parts[1];
			var text = localStorage.getItem(key);

			// Initialize the text arrays for the option if they don't exist
			if (!textByOption[option]) {
				textByOption[option] = {
					text1: [],
					text2: [],
					text3: [],
					text4: []
				};
			}

			// Add the text to the appropriate array for the option
			if (textNum === "text1") {
				textByOption[option].text1.push(text.toUpperCase());
			} else if (textNum === "text2") {
				textByOption[option].text2.push(text);
			} else if (textNum === "text3") {
				textByOption[option].text3.push(text);
			} else if (textNum === "text4") {
				textByOption[option].text4.push(text);
			}
		}
	}

	// Get the keys for the textByOption object in alphabetical order
	var options = Object.keys(textByOption).sort();

	// Iterate over the options and retrieve the text for each option
	for (var i = 0; i < options.length; i++) {
		var option = options[i];
		agentsNames = agentsNames.concat(textByOption[option].text1);
		riotIDs = riotIDs.concat(textByOption[option].text2);
		ACSs = ACSs.concat(textByOption[option].text3);
		KDAs = KDAs.concat(textByOption[option].text4);
	}
	wins = document.getElementById("roundW").value;
	loss = document.getElementById("roundL").value;
    matchDetails.map = document.getElementById("matchMap").value;
	matchDetails.mode = document.getElementById("matchMode").value;
    matchDetails.time = document.getElementById("matchTime").value;
    generateImage()
};

function drawResult(context) {
    function matchInfo(context) {
        context.font = "20px din, sans-serif";
	    context.textAlign = "center";
        // https://stackoverflow.com/a/58531661
        let time;
        try {
            time = new Date(matchDetails.time).toISOString().slice(11,19)  
        } catch {
            time = matchDetails.time
        };
        
        context.fillText(`${matchDetails.map} ⬩ ${matchDetails.mode} ⬩ ${time}`, 960, 44);
    };
    function victory(context)  {
        context.fillStyle = valGreen;
        context.fillText("VICTORY", 960, 458);
        winX = 282;
        lossX = 1642;
        matchInfo(context)
    };
    function draw(context)  {
        context.fillStyle = valGray;
        context.fillText("DRAW", 960, 458);
        winX = 493
        lossX = 1436
        matchInfo(context)
    };
    function defeat(context)  {
        context.fillStyle = valRed;
        context.fillText("DEFEAT", 960, 458);
        winX = 417
        lossX = 1511
        matchInfo(context)
    };
    // init
	context.font = "550px tungsten, sans-serif";
	context.textAlign = "center";
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
	context.font = "128px tungsten, sans-serif";
	context.fillStyle = valGreen;
	context.textAlign = "right";
	context.fillText(wins, winX, 158);
	context.textAlign = "left";
	context.fillStyle = valRed;
	context.fillText(loss, lossX, 158);
};

function drawAgentGradient(context) {
	const gradHeight = 600;
	const image = new Image();
	image.src = "./bg/UI_MVP_floor.png";
	image.onload = function() {
		context.drawImage(image, 0, gradHeight, canvas.width, canvas.height - gradHeight);
	}
};

function drawStatBoxs(context, rectangleWidth, rectangleHeight) {
    function drawAgentStats(context, index, location) {
        // Calculate the x-coordinate of the first box
        const x = 30 + (310 * (location + 1))
    
        // Constant starting y value
        const y = 626
    
        // Agent Name
        context.font = "22px din-light, sans-serif";
        context.textAlign = "center";
        context.fillStyle = "white";
        context.fillText(agentsNames[index], x, y);
    
        // Riot ID
        context.font = "28px din-bold, sans-serif";
        if (riotIDs[index] == goldName) {
            context.fillStyle = valGold;
        }
        context.fillText(riotIDs[index], x, y + 40);
        context.fillStyle = "white";
    
        //AVG Score Txt
        context.font = "22px din-light, sans-serif";
        context.fillText('AVG COMBAT SCORE', x, y + 90);
    
        //AVG Score Value
        context.font = "36px din-medium, sans-serif";
        context.fillText(ACSs[index], x, y + 129);
    
        //KDA Txt
        context.font = "22px din-light, sans-serif";
        context.fillText('KDA', x, y + 163);
    
        //KDA Value
        context.font = "36px din-medium, sans-serif";
        context.fillText(KDAs[index], x, y + 202);
    };
	// Calculate the x-coordinate of the first rectangle
	const x = (canvas.width - rectangleWidth * 5 - 27 * 4) / 2;

	// Calculate the y-coordinate of the first rectangle
	const y = canvas.height - rectangleHeight - 230;

	// Loop through 5 rectangles and draw them on the canvas
	for (let i = 0; i < 5; i++) {
        let j = drawOrder[i]
		const image = new Image();
		if (j == 2) {
			image.src = './bg/mvp_box.png';
		} else {
			image.src = './bg/box.png';
		}

		image.onload = function() {
			context.drawImage(image, x + j * (rectangleWidth + 27), y, rectangleWidth, rectangleHeight);
			// Draw Stats
			drawAgentStats(context, i, j);
		}
	}

};

function drawAgents(context, imageWidth, imageHeight) {
    function draw(context, j, x, y, mw, mh) {
        const image = new Image();
        image.src = imageURLs[j];
        image.onload = function() {
            context.drawImage(image, x, y, mw, mh);
        };
    }
    
	// Calculate the x-coordinate of the first rectangle
	const startX = ((canvas.width - 300 * 5 - 11 * 4) - 550) / 2;

	// Loop through 5 rectangles and draw them on the canvas
	for (let i = 0; i < 5; i++) {
		let j = drawOrder[i];
        // First box
        if (j == 0) {
			let multW = imageWidth * 0.9
			let multH = imageHeight * 0.9
			let x = startX + 44
			let y = canvas.height - multH - 38;
            draw(context, i, x, y, multW, multH)
        // Second Box
		} else if (j == 1) {
			let x = startX + j * (300 + 12)
			let y = canvas.height - imageHeight - 38;
            draw(context, i, x, y, imageWidth, imageHeight)
        // Third Box
        } else if (j == 2) {
            let multW = imageWidth * 1.1
            let multH = imageHeight * 1.1
            let x = startX + j * (300) - 17
            let y = canvas.height - multH - 38;
            draw(context, i, x, y, multW, multH)
        // Forth Box
        } else if (j == 3) {
			let x = startX + j * (300 + 10.5)
			let y = canvas.height - imageHeight - 38;
            draw(context, i, x, y, imageWidth, imageHeight)
        // Fifth Box
		} else {
			let multW = imageWidth * 0.9
			let multH = imageHeight * 0.9
			let x = startX + j * (300 + 21)
			let y = canvas.height - multH - 38;
            draw(context, i, x, y, multW, multH)
		}
	};
};

function generateImage() {
    for (let i = 0; i < agentsNames.length; i++) {
        if (agentsNames[i] in agentPortraits) {
            imageURLs.push(agentPortraits[agentsNames[i]])
        } else {
            imageURLs.push('./bg/missing.png')
        }
    };
	if (wins < loss) {
		ctx.drawImage(defeatImage, 0, 0);
	} else if (wins == loss) {
		ctx.drawImage(drawImage, 0, 0);
	} else {
		ctx.drawImage(victoryImage, 0, 0);
	};
	// Draw the Result
	drawResult(ctx);
	// Draw the Images
	drawAgents(ctx, 850, 772);
	// Draw the Gradient
	drawAgentGradient(ctx);
	// Draw the Rectangles
	drawStatBoxs(ctx, 283, 310);
};