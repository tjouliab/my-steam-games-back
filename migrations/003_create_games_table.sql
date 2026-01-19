CREATE TABLE games (
  appId INTEGER NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  isVisible TINYINT NOT NULL DEFAULT 1,
  personnalNotation INTEGER NULL,
  metacriticNotation INTEGER NOT NULL,
  steamPositiveNotation INTEGER NOT NULL,
  steamNegativeNotation INTEGER NOT NULL,
  playtime INTEGER NOT NULL,
  statusId INTEGER NULL,
  releaseDate TEXT NOT NULL,
  lastTimePlayed INTEGER NOT NULL,
  initialPrice INTEGER NOT NULL,
  personnalNotes TEXT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (statusId) REFERENCES status(id)
);