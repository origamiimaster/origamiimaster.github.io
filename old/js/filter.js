/** 
 * Run a filtering algorithm where we discard any decks 
 * that are singleton up to a inclusion threshold edit 
 * distance.
 * 
 * Currently allows four swaps while still being same deck (loose criteria)
 */
const singletonInclusionCriteriaThreshold = 4;

console.log(`Initial number of decks: ${data[1].length}`);

console.log(`Filtering out rogue decks with distance > ${singletonInclusionCriteriaThreshold} distance.`)

let filteredInIndices = [];

for (let deckIndex = 0; deckIndex < data[1].length; deckIndex++) {
    let deckAsString = deckToUnicodeString(data[1][deckIndex]);
    for (let otherIndex = 0; otherIndex < data[1].length; otherIndex++) {
        if (otherIndex == deckIndex) {
            // Same deck, don't count. 
        } else {
            if (bagOfWordsDistance(deckAsString, deckToUnicodeString(data[1][otherIndex])) < singletonInclusionCriteriaThreshold) {
                filteredInIndices.push(deckIndex);
                break;
            }
        }
    }
}

console.log(`Final number of decks: ${filteredInIndices.length}`)

// // Give the "names" of the decks that were filtered out, to look for any problems with this: 
// for (let i = 0; i < data[0].length; i++) {
//     if (filteredInIndices.includes(i)) {
//     } else {
//         console.log(data[0][i]);
//     }
// }


let oldData = data;
data = [[], []];
for (let i = 0; i < filteredInIndices.length; i++) {
    data[0].push(oldData[0][filteredInIndices[i]]);
    data[1].push(oldData[1][filteredInIndices[i]]);
}