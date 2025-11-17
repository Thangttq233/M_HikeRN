
// src/db/init.js
import { exec } from './sqlite';

export async function initDb() {
  await exec(`
    CREATE TABLE IF NOT EXISTS hikes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      date TEXT NOT NULL,
      parking INTEGER NOT NULL,
      length REAL NOT NULL,
      difficulty TEXT NOT NULL,
      description TEXT,
      field1 TEXT,
      field2 TEXT,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_hikes_name ON hikes(name);
    CREATE INDEX IF NOT EXISTS idx_hikes_location ON hikes(location);
    CREATE INDEX IF NOT EXISTS idx_hikes_date ON hikes(date);

    CREATE TABLE IF NOT EXISTS observations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hikeId INTEGER NOT NULL,
      content TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      note TEXT,
      FOREIGN KEY (hikeId) REFERENCES hikes(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_obs_hike ON observations(hikeId);
    CREATE INDEX IF NOT EXISTS idx_obs_time ON observations(timestamp);
  `);
}
