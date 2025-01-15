let timelineAxisElement = document.getElementById("timeline-axis");
let plottingAreaElement = document.getElementById("timeline-holder");

const root = document.documentElement;

let currentX = 0;

root.style.setProperty("--timeline-position", "0px");
root.style.setProperty("--timeline-zoom", "0");

function generateTickMark(position) {
    let tickMark = document.createElement("div");
    tickMark.classList.add("tickmark");
    tickMark.style.left = position + "px";
    let tooltip = document.createElement("div");
    tickMark.appendChild(tooltip);
    tooltip.classList.add("axistooltip");
    tooltip.classList.add("tooltip");
    tooltip.innerHTML = "Tickmark"
    timelineAxisElement.appendChild(tickMark);
}

function plotDeckOnScreen(positionX, positionY, deckName) {
    let plotCircle = document.createElement("div");
    plotCircle.classList.add("circle");
    plotCircle.classList.add("timeline-element");
    plotCircle.style.left = (positionX - 10) + "px";
    plotCircle.style.top = (positionY - 10) + "px";
    plotCircle.style.backgroundColor = colorMap(deckNameToIndexByMaxAppearances[deckName]);
    plotCircle.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + deckName;
    plottingAreaElement.appendChild(plotCircle);
}

function drawBarOnScreen(startX, endX, yPosition, deckName, thickness) {
    let line = document.createElement("div");
    line.classList.add("line");
    line.classList.add("timeline-element");
    line.style.left = (startX) + "px";
    line.style.top = (yPosition - 10 - thickness) + "px";
    line.style.width = endX - startX + "px"
    line.style.height = thickness + "px";
    line.innerHTML = deckName;
    line.style.backgroundColor = colorMap(deckNameToIndexByMaxAppearances[deckName]);
    plottingAreaElement.appendChild(line);
}

let maxDate = parseDate(data[0][0]['date'])
let minDate = parseDate(data[0][data[0].length - 1]['date']);

let minPosition = 100;
let maxPosition = plottingAreaElement.clientWidth - 100;

let minY = 10;
let maxY = plottingAreaElement.clientHeight - 10;

let dataSortedByDate = []

let dateToIndexMapping = {}

let deckNameToIndexByMaxAppearances = {}
let counts = {}
for (let i = 0; i < data[0].length; i++) {
    if (!Object.keys(counts).includes(data[0][i]['name'])) {
        counts[data[0][i]['name']] = 0;
    }
    counts[data[0][i]['name']] += 1;
}

let keysSorted = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a] })
for (let i = 0; i < keysSorted.length; i++) {
    deckNameToIndexByMaxAppearances[keysSorted[i]] = i;
}


for (let currentDate = new Date(minDate); currentDate <= maxDate; currentDate.setDate(currentDate.getDate() + 1)) {
    dateToIndexMapping[currentDate] = dataSortedByDate.length;
    dataSortedByDate.push({});
}


for (let i = 0; i < data[0].length; i++) {
    let dateIndex = dateToIndexMapping[parseDate(data[0][i]['date'])];
    if (!Object.keys(dataSortedByDate[dateIndex]).includes(data[0][i]['name'])) {
        dataSortedByDate[dateIndex][data[0][i]['name']] = 0
    }
    dataSortedByDate[dateIndex][data[0][i]['name']] += 1
}

let maxDailyValues = [];

for (let i = 0; i < dataSortedByDate.length; i++) {
    let decksOnDay = Object.values(dataSortedByDate[i]);
    maxDailyValues.push(Math.max(...decksOnDay))
}


// for (let i = 0; i < data[0].length; i++) {
//     plotDeckOnScreen(mapRange(parseDate(data[0][i]['date']), minDate, maxDate, minPosition, maxPosition), mapRange(Math.random(), 0, 1, minY, maxY), data[0][i]['name'])
// }

let previousPoint = [0, 0];


for (let currentDate = new Date(minDate); currentDate <= maxDate; currentDate.setDate(currentDate.getDate() + 1)) {
    let dateIndex = dateToIndexMapping[currentDate];
    let decksOnDay = Object.keys(dataSortedByDate[dateIndex]);
    // console.log(decksOnDay)
    for (let deckIndex = 0; deckIndex < decksOnDay.length; deckIndex++) {
        // if (decksOnDay[deckIndex] == "Dimir Aggro") {
        // plotDeckOnScreen(
        //     mapRange(currentDate, minDate, maxDate, minPosition, maxPosition),
        //     // mapRange(dataSortedByDate[dateIndex][decksOnDay[deckIndex]], 0, maxDailyValues[dateIndex], maxY - 100, minY + 100),
        //     dataSortedByDate[dateIndex][decksOnDay[deckIndex]] * -30 + 500,
        //     // dataSortedByDate[dateIndex][decksOnDay[deckIndex]],
        //     decksOnDay[deckIndex]
        // )
        // drawBarOnScreen(mapRange(currentDate, minDate, maxDate, minPosition, maxPosition), dataSortedByDate[dateIndex][decksOnDay[deckIndex]] * -30 + 500)
        // previousPoint[0] = mapRange(currentDate, minDate, maxDate, minPosition, maxPosition)
        // previousPoint[1] = dataSortedByDate[dateIndex][decksOnDay[deckIndex]] * -30 + 500;
        // }
    }
}

for (let currentDate = new Date(minDate); currentDate <= maxDate; currentDate.setDate(currentDate.getDate() + 1)) {
    generateTickMark(mapRange(currentDate, minDate, maxDate, minPosition, maxPosition));
}


// Set up color mapping for the deck names
function colorMap(index) {
    if (index < 10) {
        switch (index) {
            case 0:
                return "lightgreen"
            case 1:
                return "red"
            case 2:
                return "yellow"
            case 3:
                return "blue"
            case 4:
                return "orange"
            case 5:
                return "forestgreen"
            case 6:
                return "purple"
            case 7:
                return "pink"
            case 8:
                return "indigo"
            case 9:
                return "brown"
        }
    } else {
        return "black"
    }
}


// Use a threshold to determine when a group gets a bar or not.  
function arbitraryRule(deckDataArray) {
    // Takes an array of values for a particular deck for each day 
    let boolArr = [];
    for (let i = 0; i < deckDataArray.length; i++) {
        boolArr.push(deckDataArray[i] > 1);


        
    }

    // Returns an array with bools for whether or not it gets a bar
    return boolArr
}

let arrOfDecksByNameOrderingWithDatewiseData = [];
let barsArr = []
keysSorted.forEach(deckName => {
    let deckDataArr = []
    for (let dateIndex = 0; dateIndex < dataSortedByDate.length; dateIndex++) {
        if (Object.keys(dataSortedByDate[dateIndex]).includes(deckName)) {
            deckDataArr.push(dataSortedByDate[dateIndex][deckName]);
        } else {
            deckDataArr.push(0);
        }
    }
    barsArr.push(arbitraryRule(deckDataArr))
    arrOfDecksByNameOrderingWithDatewiseData.push(deckDataArr)
})

// For the top ten decks, draw their bar(s)
// for (let deckIndex = 0; deckIndex < 10; deckIndex++) {
//     let y = mapRange(deckIndex + 1, 0, 11, minY, maxY);
//     for (let i = 0; i < barsArr[deckIndex].length; i++) {
//         let startX = mapRange(i, 0, barsArr[deckIndex].length - 1, minPosition, maxPosition)
//         let endX = mapRange(i + 1, 0, barsArr[deckIndex].length - 1, minPosition, maxPosition)
//         if (barsArr[deckIndex][i]) {
//             drawBarOnScreen(startX, endX, y, keysSorted[deckIndex], 5 * arrOfDecksByNameOrderingWithDatewiseData[deckIndex][i]);
//         }
//     }
// }


// Redo but merge bars if they are neighboring

for (let deckIndex = 0; deckIndex < 10; deckIndex++) {
    let y = mapRange(deckIndex + 1, 0, 11, minY, maxY);
    let i = 0;
    let countsOverI = 0;
    let startX = mapRange(i, 0, barsArr[deckIndex].length - 1, minPosition, maxPosition)
    let endX = startX;
    while (i < barsArr[deckIndex].length) {
        if (barsArr[deckIndex][i]) {
            endX = mapRange(i + 1, 0, barsArr[deckIndex].length - 1, minPosition, maxPosition)
            countsOverI += arrOfDecksByNameOrderingWithDatewiseData[deckIndex][i]
        } else {
            if (startX != endX) {
                drawBarOnScreen(startX, endX, y, keysSorted[deckIndex], countsOverI);
            }
            startX = mapRange(i + 1, 0, barsArr[deckIndex].length - 1, minPosition, maxPosition)
            countsOverI = 0;
            endX = startX;
        }
        i++;
    }
    if (barsArr[deckIndex][i - 1]) {
        drawBarOnScreen(startX, endX, y, keysSorted[deckIndex], 10);
    }
}


















// Smooth out the curve by a 121/4 gaussian blue 
// let kernel = [1/4, 2/4, 1/4]


// let newSortedData = []



// newSortedData.push({'Dimir Aggro': (dataSortedByDate[0]['Dimir Aggro'] * 2 + dataSortedByDate[1]['Dimir Aggro'] * 1) / 3})
// for (let dateIndex = 1; dateIndex < dataSortedByDate.length - 1; dateIndex++) {
//     newSortedData.push({'Dimir Aggro': (dataSortedByDate[dateIndex - 1]['Dimir Aggro'] * 1 + dataSortedByDate[dateIndex]['Dimir Aggro'] * 2 + dataSortedByDate[dateIndex + 1]['Dimir Aggro'] * 1) / 4})
// }
// newSortedData.push({'Dimir Aggro': (dataSortedByDate[dataSortedByDate.length - 2]['Dimir Aggro'] * 2 + dataSortedByDate[dataSortedByDate.length - 1]['Dimir Aggro'] * 1) / 3})



// After smoothing


// for (let currentDate = new Date(minDate); currentDate <= maxDate; currentDate.setDate(currentDate.getDate() + 1)) {
//     let dateIndex = dateToIndexMapping[currentDate];
//     let decksOnDay = Object.keys(newSortedData[dateIndex]);
//     console.log(decksOnDay)
//     for (let deckIndex = 0; deckIndex < decksOnDay.length; deckIndex++) {
//         if (decksOnDay[deckIndex] == "Dimir Aggro") {
//             plotDeckOnScreen(
//                 mapRange(currentDate, minDate, maxDate, minPosition, maxPosition),
//                 // mapRange(dataSortedByDate[dateIndex][decksOnDay[deckIndex]], 0, maxDailyValues[dateIndex], maxY - 100, minY + 100),
//                 newSortedData[dateIndex][decksOnDay[deckIndex]] * -30 + 500,
//                 newSortedData[dateIndex][decksOnDay[deckIndex]],
//                 // decksOnDay[deckIndex]
//             )
//         }
//     }
// }














function parseDate(datestring) {
    let [day, month, year] = datestring.split("/").map(Number);
    year += 2000;
    month -= 1;
    return new Date(year, month, day);
}

function mapRange(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}


function setTimelineX(xVal) {
    root.style.setProperty("--timeline-position", xVal + "px");
}

function setTimelineZoom(zoomVal) {
    root.style.setProperty("--timeline-zoom", zoomVal);
}


const timeForOneDay = new Date(2024, 0, 2) - new Date(2024, 0, 1);
const xForOneDay = mapRange(timeForOneDay, 0, maxDate - minDate, minPosition, maxPosition) - 100;



function moveOneDayForward() {
    currentX += xForOneDay;
    setTimelineX(currentX);
}

function moveOneDayBackwards() {
    currentX -= xForOneDay;
    setTimelineX(currentX);
}



