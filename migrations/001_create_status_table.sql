CREATE TABLE status (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  label TEXT NOT NULL
);

INSERT INTO status (label) VALUES ("100%");
INSERT INTO status (label) VALUES ("Finished");
INSERT INTO status (label) VALUES ("Unfinished");
INSERT INTO status (label) VALUES ("Abandonned");