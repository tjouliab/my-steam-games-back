CREATE TABLE gamesGenres (
  appId INTEGER NOT NULL,
  genreId INTEGER NOT NULL,
  PRIMARY KEY (appId, genreId),
  FOREIGN KEY (appId) REFERENCES games(appId),
  FOREIGN KEY (genreId) REFERENCES genres(id)
);