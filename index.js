const axios = require("axios").default
const cheerio = require("cheerio").default;
const fs = require("fs");


let fileString = "";


const url = "https://en.wikipedia.org/wiki/Road_safety_in_Europe#:~:text=In%20the%20year%202000%20over,road%20collisions%20was%20135%2C000%20people."

axios(url).then((response) => {
    const data = response.data;
    let result = []
    const $ = cheerio.load(data);
    $('table.wikitable.sortable>tbody>tr').slice(1, -1).toArray().forEach((e, i) => {
        const elementArray = $(e).find('td, td>br')
        let row = {
            country: elementArray.eq(0).text().slice(0, -1),
            year: 2018,
            area: parseFloat(elementArray.eq(1).text().slice(0, -1).replace(/,/g, '')),
            poplation: parseFloat(elementArray.eq(2).text().slice(0, -1).replace(/,/g, '')),
            gdp: parseFloat(elementArray.eq(3).text().slice(0, -1).replace(/,/g, '')),
            populationDensity: parseFloat(elementArray.eq(4).text().slice(0, -1).replace(/,/g, '')),
            vehicleOwnership: parseFloat(elementArray.eq(5).text().slice(0, -1).replace(/,/g, '')),
            totalRoadDeath: parseFloat(elementArray.eq(7).text().slice(0, -1).replace(/,/g, '')),
            roadDeathPerMillIhabitants: parseFloat(elementArray.eq(8).text().slice(0, -1).replace(/,/g, '')),
        }

        result.push(row)

    })
    result.sort((a, b) => a.roadDeathPerMillIhabitants <= b.roadDeathPerMillIhabitants ? 1 : -1)

    result.forEach((record) => {
        if (!fileString) {
            fileString += "Country, Year, Area, Population, GDP_per_capita, Population_Density, Vehicle_Ownership, Total_Road_Deaths, Road_Deaths_Per_Million_Inhabitant \n"
        }
        fileString += `${record.country}, ${record.year}, ${record.area}, ${record.poplation}, ${record.gdp}, ${record.populationDensity}, ${record.vehicleOwnership}, ${record.totalRoadDeath}, ${record.roadDeathPerMillIhabitants} \n`
    })

    fs.writeFileSync("RoadSafety.csv", fileString, "utf8")
})



