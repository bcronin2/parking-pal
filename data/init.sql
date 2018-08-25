DROP DATABASE IF EXISTS parking_pal_db;
CREATE DATABASE parking_pal_db;

\c parking_pal_db;

CREATE TABLE parking_info (
  blockside VARCHAR(20),
  blocksweep INT,
  cnn INT,
  cnnrightle VARCHAR(1),
  corridor VARCHAR(20),
  district VARCHAR(20),
  fromhour TIME,
  holidays VARCHAR(1),
  lf_fadd INT NOT NULL,
  lf_toadd INT NOT NULL,
  nhood VARCHAR(20),
  rt_fadd INT NOT NULL,
  rt_toadd INT NOT NULL,
  streetname VARCHAR(20) NOT NULL,
  tohour TIME,
  week1ofmon VARCHAR(1),
  week2ofmon VARCHAR(1),
  week3ofmon VARCHAR(1),
  week4ofmon VARCHAR(1),
  week5ofmon VARCHAR(1),
  week_day VARCHAR(10),
  zip_code INT,
  geo TEXT,
  multigeo BOOLEAN
);

CREATE TABLE user_info (
  id SERIAL NOT NULL,
  username VARCHAR(20) NOT NULL,
  pass VARCHAR(50) NOT NULL,
  is_parked BOOLEAN NOT NULL DEFAULT false,
  latitude FLOAT,
  longitude FLOAT,
  expiration TIME,
  PRIMARY KEY (id)
);

COPY parking_info FROM '/Users/benc/Desktop/MVP/data/raw/parkingData.csv' WITH CSV HEADER DELIMITER AS ',';