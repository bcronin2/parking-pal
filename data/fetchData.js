const fs = require("fs");
const fetch = require("node-fetch");

const apiEndpoint = "https://data.sfgov.org/api/views/u2ac-gv9v/rows.csv";
const filename = "./data/raw/parkingData.csv";

const fetchData = () => {
  fetch(apiEndpoint)
    .then(res => res.text())
    .then(text => {
      const dest = fs.createWriteStream(filename);
      dest.write(text, () => {
        console.log("Successfully fetched parking data from " + apiEndpoint);
      });
    })
    .catch(err => {
      console.error("Could not fetch parking data from " + apiEndpoint);
    });
};

fetchData();
