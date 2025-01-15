let maxDate = parseDate(data[0][0]['date'])
let minDate = parseDate(data[0][data[0].length - 1]['date']);

for (let currentDate = new Date(minDate); currentDate <= maxDate; currentDate.setDate(currentDate.getDate() + 1)) {
    console.log(currentDate);
}
