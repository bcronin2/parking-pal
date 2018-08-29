DROP DATABASE IF EXISTS parking_pal_db;
CREATE DATABASE parking_pal_db;

\c parking_pal_db;

CREATE TABLE parking_info (
  id SERIAL NOT NULL,
  ll_lat DOUBLE PRECISION,
  ll_lon DOUBLE PRECISION,
  ur_lat DOUBLE PRECISION,
  ur_lon DOUBLE PRECISION,
  direction VARCHAR(3),
  days JSON,
  weeks JSON,
  start_hour INT,
  end_hour INT,
  holidays VARCHAR(1),
  fadd INT NOT NULL,
  toadd INT NOT NULL,
  street_name VARCHAR(20) NOT NULL,
  zip_code INT,
  neighborhood VARCHAR(50),
  coordinates JSON
);

CREATE TABLE user_info (
  id SERIAL NOT NULL,
  username VARCHAR(20) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  latitude DOUBLE PRECISION DEFAULT NULL,
  longitude DOUBLE PRECISION DEFAULT NULL,
  expiration BIGINT DEFAULT NULL,
  neighborhood VARCHAR(50) DEFAULT NULL,
  PRIMARY KEY (id)
);

COPY parking_info FROM '/Users/benc/Dropbox/Hack Reactor/MVP/data/raw/streetCleaningData.csv' WITH DELIMITER E'|';

CREATE INDEX on parking_info (ll_lon);
CREATE INDEX on parking_info (ll_lat);
CREATE INDEX on parking_info (ur_lon);
CREATE INDEX on parking_info (ur_lat);
