-- schema.sql

-- Make sure schema exists
CREATE DATABASE IF NOT EXISTS event_store;

-- Switch to schema
USE event_store;

-- Example table
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    start datetime DEFAULT CURRENT_TIMESTAMP,
    end datetime DEFAULT CURRENT_TIMESTAMP,
    creationId INT NOT NULL DEFAULT 0,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    available BOOLEAN DEFAULT FALSE,
    payload JSON
);

-- Insert a sample event
INSERT INTO events (title, start, end, created_at, description, available, payload)
VALUES ('sample', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'test', TRUE, JSON_OBJECT('username', 'alice', 'email', 'alice@example.com'));
