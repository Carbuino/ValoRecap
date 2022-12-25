var text1 = [];
var text2 = [];
var text3 = [];
var text4 = [];
var wins;
var loss;

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const victoryImage = new Image();
victoryImage.src = './bg/UI_MVP_VIctoryBG.png';

const defeatImage = new Image();
defeatImage.src = './bg/UI_MVP_DefeatBG.png';

const valRed = "#FF4655";
const valGreen = "#79D8BC";

function drawResult(context) {
    context.font = "550px tungsten, sans-serif";
    context.textAlign = "center";
    if (wins < loss) {
        context.fillStyle = valRed;
        context.fillText("DEFEAT", 960, 458);
        context.font = "128px tungsten, sans-serif";
        context.textAlign = "right";
        context.fillText(loss, 417, 158);
        context.textAlign = "left";
        context.fillStyle = valGreen;
        context.fillText(wins, 1509, 158);
    } else {
        context.fillStyle = valGreen;
        context.fillText("VICTORY", 960, 458);
        context.font = "128px tungsten, sans-serif";
        context.textAlign = "right";
        context.fillText(wins, 286, 158);
        context.textAlign = "left";
        context.fillStyle = valRed;
        context.fillText(loss, 1640, 158);
    };
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
    // Calculate the x-coordinate of the first rectangle
    const x = (canvas.width - rectangleWidth * 5 - 27 * 4) / 2;
  
    // Calculate the y-coordinate of the first rectangle
    const y = canvas.height - rectangleHeight - 230;
  
    // Loop through 5 rectangles and draw them on the canvas
    for (let i = 0; i < 5; i++) {
        const image = new Image();
        if (i == 2) {
            image.src = './bg/mvp_box.png';
        } else {
            image.src = './bg/box.png';
        }
            
            image.onload = function() {  
                context.drawImage(image, x + i * (rectangleWidth + 27), y, rectangleWidth, rectangleHeight);
                // Draw Stats
                drawAgentStats(ctx, i);
            }
    }

};

function drawAgents(context, imageWidth, imageHeight) {
    // Define the URLs of the images to be used for the inner rectangles
    const imageURLs = [
        'https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/fullportrait.png', // img 1
        'https://media.valorant-api.com/agents/7f94d92c-4234-0a36-9646-3a87eb8b5c89/fullportrait.png', // img 2
        'https://media.valorant-api.com/agents/41fb69c1-4189-7b37-f117-bcaf1e96f1bf/fullportrait.png', // img 3
        'https://media.valorant-api.com/agents/f94c3b30-42be-e959-889c-5aa313dba261/fullportrait.png', // img 4
        'https://media.valorant-api.com/agents/22697a3d-45bf-8dd7-4fec-84a9e28c69d7/fullportrait.png' // img 5
    ];

    const drawOrder = [0,4,1,3,2];

    // Calculate the x-coordinate of the first rectangle
    //const x = (canvas.width - imageWidth * 5 - 11 * 4) / 2;
    const x = ((canvas.width - 300 * 5 - 11 * 4)- 550 ) / 2;

    // Loop through 5 rectangles and draw them on the canvas
    for (let i = 0; i < 5; i++) {
        let j = drawOrder[i];
        if (j == 1 || j == 3) {

            // Calculate the y-coordinate of the first rectangle
            const y = canvas.height - imageHeight - 38;

            // Load the image
            const image = new Image();
            image.src = imageURLs[j];
            image.onload = function() {  
                //context.drawImage(image, x + j * (imageWidth + 11), y, imageWidth, imageHeight);
                context.drawImage(image, x + j * (300 + 11), y, imageWidth, imageHeight);
            }
        } else if (j == 4) {
            const multW = imageWidth * 0.9
            const multH = imageHeight * 0.9
            // Calculate the y-coordinate of the first rectangle
            const y = canvas.height - multH - 50;
            // Load the image
            const image = new Image();
            image.src = imageURLs[j];
            image.onload = function() {  
                //context.drawImage(image, x + j * (imageWidth + 11), y, imageWidth, imageHeight);
                context.drawImage(image, x + j * (300 + 22), y, multW, multH);
            }
        } else if (j == 0) {
            const multW = imageWidth * 0.9
            const multH = imageHeight * 0.9

            // Calculate the y-coordinate of the first rectangle
            const y = canvas.height - multH - 50;

            // Load the image
            const image = new Image();
            image.src = imageURLs[j];
            image.onload = function() {  
                //context.drawImage(image, x + j * (imageWidth + 11), y, imageWidth, imageHeight);
                context.drawImage(image, x + 55, y, multW, multH);
            }
        } else {
            const multW = imageWidth * 1.1
            const multH = imageHeight * 1.1

            // Calculate the y-coordinate of the first rectangle
            const y = canvas.height - multH - 50;
            
            // Load the image
            const image = new Image();
            image.src = imageURLs[j];
            image.onload = function() {  
                //context.drawImage(image, x + j * (imageWidth + 11), y, imageWidth, imageHeight);
                context.drawImage(image, x + j * (300 + 11), y, multW, multH);
        }
    }
  };
};

function drawAgentStats(context, grid) {
    // Calculate the x-coordinate of the first rectangle
    const x = 30 + (310 * (grid+1))
  
    // Calculate the y-coordinate of the first rectangle
    const y = 626
  
    // Agent Name
    context.font = "22px din-light, sans-serif";
    context.textAlign = "center";
    context.fillStyle = "white";
    context.fillText(text1[grid], x, y);

    // Riot ID
    context.font = "28px din-bold, sans-serif";
    context.fillText(text2[grid], x, y+40);
    
    //AVG Score Txt
    context.font = "22px din-light, sans-serif";
    context.fillText('AVG COMBAT SCORE', x, y+90);

    //AVG Score Value
    context.font = "36px din-medium, sans-serif";
    context.fillText(text3[grid], x, y+129);

    //KDA Txt
    context.font = "22px din-light, sans-serif";
    context.fillText('KDA', x, y+163);

    //KDA Value
    context.font = "36px din-medium, sans-serif";
    context.fillText(text4[grid], x, y+202);
};

function retrieveText() {
    var textByOption = {};

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
                textByOption[option].text1.push(text);
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
        text1 = text1.concat(textByOption[option].text1);
        text2 = text2.concat(textByOption[option].text2);
        text3 = text3.concat(textByOption[option].text3);
        text4 = text4.concat(textByOption[option].text4);
    }
    wins = document.getElementById("rounW").value;
    loss = document.getElementById("rounL").value;
};

// Draw the background image before calling the drawRectangles function
// backgroundImage.onload = function() {
function generateImage() {
    retrieveText();
    if (wins < loss) {
        ctx.drawImage(defeatImage, 0, 0);
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