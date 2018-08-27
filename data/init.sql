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
  coordinates JSON
);

CREATE TABLE user_info (
  id SERIAL NOT NULL,
  username VARCHAR(20) UNIQUE NOT NULL,
  password VARCHAR(50) NOT NULL,
  is_parked BOOLEAN NOT NULL DEFAULT false,
  latitude DOUBLE PRECISION DEFAULT NULL,
  longitude DOUBLE PRECISION DEFAULT NULL,
  expiration TIME DEFAULT NULL,
  PRIMARY KEY (id)
  );

COPY parking_info FROM '/Users/benc/Desktop/MVP/data/raw/streetCleaningData.csv' WITH DELIMITER E'|';

CREATE INDEX on parking_info (ll_lon);
CREATE INDEX on parking_info (ll_lat);
CREATE INDEX on parking_info (ur_lon);
CREATE INDEX on parking_info (ur_lat);
