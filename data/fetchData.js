const fs = require("fs");
const fetch = require("node-fetch");

const apiEndpoint = "https://data.sfgov.org/api/views/u2ac-gv9v/rows.csv";
const filename = "./data/raw/parkingData.csv";

const parseRow = rawRow => {
  if (!rawRow) return;
  const parsedRow = [];
  let current = 0;
  let char = rawRow.charAt(current);
  let enclosure = false;
  let cell = "";
  while (char) {
    if (char === '"') {
      enclosure = !enclosure;
    }
    if (char === "," && !enclosure) {
      parsedRow.push(cell);
      cell = "";
    } else {
      cell += char;
    }
    char = rawRow.charAt(++current);
  }
  return parsedRow;
};

const processRow = rawRow => {
  const processedRow = [];
  // Parse string with latitude/longitude data for block
  const coordinates = rawRow[22]
    .substring(13, rawRow[22].length - 2)
    .split(", ")
    .map(pair => pair.split(" "))
    .map(pair => [parseFloat(pair[0]), parseFloat(pair[1])]);
  // Find leftmost/rightmost longitudes and topmost/bottom-most latitudes
  processedRow[0] = coordinates.reduce(
    (min, pair) => (pair[0] < min ? pair[0] : min),
    Number.POSITIVE_INFINITY
  );
  processedRow[1] = coordinates.reduce(
    (min, pair) => (pair[1] < min ? pair[1] : min),
    Number.POSITIVE_INFINITY
  );
  processedRow[2] = coordinates.reduce(
    (max, pair) => (pair[0] > max ? pair[0] : max),
    Number.NEGATIVE_INFINITY
  );
  processedRow[3] = coordinates.reduce(
    (max, pair) => (pair[1] > max ? pair[1] : max),
    Number.NEGATIVE_INFINITY
  );
  // Map remaining data fields to desired positions in row (see raw/SAMPLE_from_sfgov.csv for original fields)
  processedRow[4] = rawRow[20];
  processedRow[5] = rawRow[6];
  processedRow[6] = rawRow[14];
  processedRow[7] = rawRow[7];
  processedRow[8] = rawRow[15];
  processedRow[9] = rawRow[16];
  processedRow[10] = rawRow[17];
  processedRow[11] = rawRow[18];
  processedRow[12] = rawRow[19];
  processedRow[13] = rawRow[8];
  processedRow[14] = rawRow[9];
  processedRow[15] = rawRow[11];
  processedRow[16] = rawRow[12];
  processedRow[17] = rawRow[13];
  processedRow[18] = rawRow[21];
  processedRow[19] = '"' + JSON.stringify(coordinates) + '"';
  return processedRow.join(",");
};

const processData = data => {
  let rows = data.split("\n").slice(1);
  // Rows require parsing since some commas do not delineate separate fields
  // Filtering required to ensure no empty rows
  rows = rows.map(parseRow).filter(row => row);
  rows = rows.map(processRow);
  return rows.join("\n");
};

const fetchData = () => {
  fetch(apiEndpoint)
    .then(res => res.text())
    .then(data => {
      const result = processData(data);
      const dest = fs.createWriteStream(filename);
      dest.write(result, () => {
        console.log("Successfully fetched parking data from " + apiEndpoint);
      });
    })
    .catch(err => {
      console.error("Could not fetch parking data from " + apiEndpoint);
    });
};

fetchData();
