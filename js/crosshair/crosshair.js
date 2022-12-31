var crosshairCode = 0;

function chance(pcnt) {
    return Math.random() < ( pcnt / 100 )
};

function getRandomNumber(min, max, precision = 0) {
    min = Math.ceil(min);
    max = Math.floor(max);
    let randomNumber = Math.random() * (max - min) + min;
    return Number(randomNumber.toFixed(precision));
};

function crosshairSettings() {
    let color = getRandomNumber(0, 8);
    let showCenterDot = chance(50);
    let showOutlines = chance(50);
    let firingErrorOverride = chance(50);

    let showInnerLines = chance(50);
    let innerLineLengthLinked = chance(50);
    let innerMovementError = chance(50);
    let innerFiringError = chance(50);

    let showOuterLines = chance(50);
    let outerLineLengthLinked = chance(50);
    let outerMovementError = chance(50);
    let outerFiringError = chance(50);

    crosshairCode += `;c;${color}`
    if ( color ===  8 ) {
        let hexCode = Math.floor(Math.random()*16777215).toString(16); // https://css-tricks.com/snippets/javascript/random-hex-color/
        crosshairCode += `;u;${hexCode}FF;b;1`
    };
    // Outlines
    if ( showOutlines ) {
        crosshairCode += `;o;${getRandomNumber(0, 1, 3)}`; // Opacity
        crosshairCode += `;t;${getRandomNumber(1, 6)}`; // Thickness
    } else { 
        crosshairCode += ';h;0' // No Outline
    };
    // Center Dot
    if ( showCenterDot ) {
        crosshairCode += ';d;1'; // Center Dot Enable
        crosshairCode += `;a;${getRandomNumber(0, 1, 3)}`; // Opacity
        crosshairCode += `;z;${getRandomNumber(1, 6)}`; // Thickness
    };
    if ( firingErrorOverride ) { crosshairCode += ';m;1'};
    // Inner Lines
    if ( showInnerLines ) {
        crosshairCode += `;0a;${getRandomNumber(0, 1, 3)}`; // Opacity
        crosshairCode += `;0l;${getRandomNumber(0, 20)}`; // Horizontal Length
        crosshairCode += `;0v;${getRandomNumber(0, 20)}`; // Vertical Length
        if (! innerLineLengthLinked ) { crosshairCode += ';0g;1' }; // Lengths Linked
        crosshairCode += `;0t;${getRandomNumber(0, 10)}`; // Thickness
        crosshairCode += `;0o;${getRandomNumber(0, 20)}`; // Offset
        if ( innerMovementError ) {
            crosshairCode += ';0m;1'; // Enable
            crosshairCode += `;0s;${getRandomNumber(0, 3, 3)}`; // Multipler
        };
        if ( innerFiringError ) {
            crosshairCode += `;0e;${getRandomNumber(0, 3, 3)}`; // Multipler
        } else {
            crosshairCode += ';0f;0' // Disable
        };
    } else {
        crosshairCode += ';0b;0'; // Disable 
    };
    // Outer Lines
    if ( showOuterLines ) {
        crosshairCode += `;1a;${getRandomNumber(0, 1, 3)}`; // Opacity
        crosshairCode += `;1l;${getRandomNumber(0, 10)}`; // Horizontal Length
        crosshairCode += `;1v;${getRandomNumber(0, 10)}`; // Vertical Length
        if (! outerLineLengthLinked ) { crosshairCode += ';1g;1' }; // Lengths Linked
        crosshairCode += `;1t;${getRandomNumber(0, 10)}`; // Thickness
        crosshairCode += `;1o;${getRandomNumber(0, 40)}`; // Offset
        if ( outerMovementError ) {
            crosshairCode += `;1s;${getRandomNumber(0, 3, 3)}`; // Multipler
        } else {
            crosshairCode += ';1m;0'; // Disable
        }
        if ( outerFiringError ) {
            crosshairCode += `;1e;${getRandomNumber(0, 3, 3)}`; // Multipler
        } else {
            crosshairCode += ';1f;0' // Disable
        };
    } else {
        crosshairCode += ';1b;0'; // Disable 
    };
};

function sniperSettings() {
    let color = getRandomNumber(0, 8);
    let showCenterDot = chance(50);

    crosshairCode += ';S';
    crosshairCode += `;c;${color}`
    if ( color ===  8 ) {
        let hexCode = Math.floor(Math.random()*16777215).toString(16); // https://css-tricks.com/snippets/javascript/random-hex-color/
        crosshairCode += `;u;${hexCode}FF;b;1`
    };
    // Center Dot
    if ( showCenterDot ) {
        crosshairCode += `;o;${getRandomNumber(0, 1, 3)}`; // Opacity
        crosshairCode += `;s;${getRandomNumber(1, 6)}`; // Thickness
    } else {
        crosshairCode += ';d;0'
    };
};

function genCode() {
    let advancedSettings = chance(50);
    let overrideAllCrosshairs = chance(50);
    let noSpecCrosshair = chance(5);
    let fadeOnFire = chance(50);

    // Basic Blank Code
    crosshairCode = 0;
    if ( advancedSettings ) { 
        crosshairCode += ';p;0;s;1'
    };
    if ( overrideAllCrosshairs ) { crosshairCode += ';c;1'};
    // Setup Primary
    crosshairCode += ';P';
    if ( noSpecCrosshair ) { crosshairCode += ';s;0' };
    if ( fadeOnFire ) { crosshairCode += ';f;0' };
    crosshairSettings();
    if ( advancedSettings ) {
        crosshairCode += ';A';
        crosshairSettings();
        sniperSettings();
    };
    return crosshairCode;
};

module.exports.genCode = genCode;