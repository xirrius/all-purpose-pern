CREATE DATABASE pern_db;

CREATE TABLE users(
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,            
    title VARCHAR(255) NOT NULL,     
    body TEXT NOT NULL,               
    category VARCHAR(100),           
    created_at TIMESTAMP DEFAULT NOW(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE
);

INSERT INTO users (user_name, user_email, user_password) VALUES ('henry', 'test@gmail.com', '123456');