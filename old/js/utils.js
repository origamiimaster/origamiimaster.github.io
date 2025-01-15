function parseDate(datestring) {
    let [day, month, year] = datestring.split("/").map(Number);
    year += 2000;
    month -= 1;
    return new Date(year, month, day);
}

function mapRange(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

