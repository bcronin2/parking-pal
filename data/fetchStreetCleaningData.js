const fs = require("fs");
const fetch = require("node-fetch");

const streetCleaningEndpoint =
  "https://data.sfgov.org/api/views/u2ac-gv9v/rows.csv";
const streetCleaningFilename = "./data/raw/streetCleaningData.csv";

// TODO: Shorten functions in this file!

let id = 1;
const blocks = {};

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

const extractCoordinates = rawRow => {
  const offset = rawRow[3] === "R" ? 0.00005 : -0.00005;
  return rawRow[22]
    .substring(13, rawRow[22].length - 2)
    .split(", ")
    .map(pair => pair.split(" "))
    .map(pair => ({
      longitude: parseFloat(pair[0]) - offset,
      latitude: parseFloat(pair[1]) + offset
    }));
};

const extractBoundaries = (coordinates, processedRow) => {
  processedRow[1] = coordinates.reduce(
    (min, coordinate) =>
      coordinate.latitude < min ? coordinate.latitude : min,
    Number.POSITIVE_INFINITY
  );
  processedRow[2] = coordinates.reduce(
    (min, coordinate) =>
      coordinate.longitude < min ? coordinate.longitude : min,
    Number.POSITIVE_INFINITY
  );
  processedRow[3] = coordinates.reduce(
    (max, coordinate) =>
      coordinate.latitude > max ? coordinate.latitude : max,
    Number.NEGATIVE_INFINITY
  );
  processedRow[4] = coordinates.reduce(
    (max, coordinate) =>
      coordinate.longitude > max ? coordinate.longitude : max,
    Number.NEGATIVE_INFINITY
  );
};

const createRow = rawRow => {
  const processedRow = [id++];
  const coordinates = extractCoordinates(rawRow);
  // Find leftmost/rightmost longitudes and topmost/bottom-most latitudes
  extractBoundaries(coordinates, processedRow);
  // Map remaining data fields to desired positions in row (see raw/SAMPLE_from_sfgov.csv for original fields)
  // direction
  processedRow[5] = rawRow[3];
  // days of week
  processedRow[6] = [rawRow[20]];
  // weeks of month
  processedRow[7] = JSON.stringify([
    rawRow[15],
    rawRow[16],
    rawRow[17],
    rawRow[18],
    rawRow[19]
  ]);
  // from/to hours
  processedRow[8] = parseInt(rawRow[6]);
  processedRow[9] = parseInt(rawRow[14]);
  //holidays
  processedRow[10] = rawRow[7];
  // from/to addresses
  processedRow[11] = rawRow[3] === "R" ? rawRow[11] : rawRow[8];
  processedRow[12] = rawRow[3] === "R" ? rawRow[12] : rawRow[9];
  // street, zip
  processedRow[13] = rawRow[13];
  processedRow[14] = rawRow[21];
  // coords/block side
  processedRow[15] = JSON.stringify(coordinates);
  // store block data in blocks object
  blocks[rawRow[22] + rawRow[3]] = processedRow;
};

const processRow = rawRow => {
  const blockId = rawRow && rawRow[22] + rawRow[3];
  if (blocks[blockId]) {
    blocks[blockId][6].push(rawRow[20]);
  } else if (rawRow) {
    createRow(rawRow);
  }
};

const processData = data => {
  let rows = data.split("\n").slice(1);
  // Rows require parsing since some commas do not delineate separate fields
  rows = rows.map(parseRow);
  rows.forEach(processRow);
  let processedBlocks = Object.values(blocks);
  processedBlocks.forEach(block => (block[6] = JSON.stringify(block[6])));
  processedBlocks = processedBlocks.map(block => block.join("|"));
  return processedBlocks.join("\n");
};

const fetchData = () => {
  fetch(streetCleaningEndpoint)
    .then(res => res.text())
    .then(data => {
      const result = processData(data);
      const dest = fs.createWriteStream(streetCleaningFilename);
      dest.write(result, () => {
        console.log(
          "Successfully fetched parking data from " + streetCleaningEndpoint
        );
      });
    });
  // .catch(err => {
  //   console.error(
  //     "Could not fetch parking data from " + streetCleaningEndpoint
  //   );
  // });
};

fetchData();
