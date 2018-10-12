DROP TABLE IF EXISTS signatures;

CREATE TABLE signatures (
   id SERIAL primary key,
   signature TEXT NOT NULL,
   user_id INT NOT NULL UNIQUE REFERENCES users(id)
);






DROP TABLE IF EXISTS users;

CREATE TABLE users (
   id SERIAL primary key,
   first VARCHAR(255),
   last VARCHAR(255) NOT NULL,
   email VARCHAR(255) UNIQUE NOT NULL,
   hashed_pw VARCHAR(255) NOT NULL
);








DROP TABLE IF EXISTS user_profiles; 

CREATE TABLE user_profiles (
   id SERIAL primary key,
   age INT,
   city VARCHAR(100),
   url VARCHAR(300),
   user_id INT NOT NULL UNIQUE REFERENCES users(id)
);
