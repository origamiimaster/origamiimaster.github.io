// Break if not enough unicode characters...
if (cardIndex.length >= 65535) {
    throw new Error("Not enough unicode");
}

function deckToUnicodeString(deck) {
    // Ignore sideboard for now...
    let returnString = "";
    deck[0].forEach(card => {
        let cardName = card[1];
        let cardCount = card[0];
        let index = cardIndex.indexOf(cardName)
        let character = String.fromCharCode(index);
        for (let i = 0; i < cardCount; i++) {
            returnString += character;
        }
    })
    return returnString;
}

function bagOfWordsDistance(str1, str2) {
    // Written by ChatGPT.

    // Helper function to count character frequencies
    function getCharFrequencies(str) {
        const freq = {};
        for (const char of str) {
            freq[char] = (freq[char] || 0) + 1;
        }
        return freq;
    }

    // Get character frequencies for both strings
    const freq1 = getCharFrequencies(str1);
    const freq2 = getCharFrequencies(str2);

    // Collect all unique characters from both strings
    const uniqueChars = new Set([...Object.keys(freq1), ...Object.keys(freq2)]);

    // Compute the sum of absolute differences in frequencies
    let distance = 0;
    for (const char of uniqueChars) {
        const count1 = freq1[char] || 0;
        const count2 = freq2[char] || 0;
        distance += Math.abs(count1 - count2);
    }

    return distance;
}

