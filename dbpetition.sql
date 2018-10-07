DROP TABLE IF EXISTS signatures;

CREATE TABLE signatures (
   id SERIAL primary key,
   first VARCHAR(255) NOT NULL,
   last VARCHAR(255) NOT NULL,
   signature TEXT NOT NULL
);


INSERT INTO signatures (first, last)
