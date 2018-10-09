DROP TABLE IF EXISTS users;

CREATE TABLE users (
   id SERIAL primary key,
   first VARCHAR(255) NOT NULL,
   last VARCHAR(255) NOT NULL,
   email VARCHAR(255) UNIQUE NOT NULL,
   hashed_pw VARCHAR(255) NOT NULL
);







DROP TABLE IF EXISTS signatures;

CREATE TABLE signatures (
   id SERIAL primary key,
   signature TEXT NOT NULL,
   user_id SERIAL primary key
);
