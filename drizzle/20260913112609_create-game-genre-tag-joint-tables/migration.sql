CREATE TABLE `game-to-genre` (
	`gameId` integer NOT NULL,
	`genreId` integer NOT NULL,
	CONSTRAINT `game-to-genre_pk` PRIMARY KEY(`gameId`, `genreId`),
	CONSTRAINT `fk_game-to-genre_gameId_games_id_fk` FOREIGN KEY (`gameId`) REFERENCES `games`(`id`),
	CONSTRAINT `fk_game-to-genre_genreId_genres_id_fk` FOREIGN KEY (`genreId`) REFERENCES `genres`(`id`)
);
--> statement-breakpoint
CREATE TABLE `game-to-tag` (
	`gameId` integer NOT NULL,
	`tagId` integer NOT NULL,
	CONSTRAINT `game-to-tag_pk` PRIMARY KEY(`gameId`, `tagId`),
	CONSTRAINT `fk_game-to-tag_gameId_games_id_fk` FOREIGN KEY (`gameId`) REFERENCES `games`(`id`),
	CONSTRAINT `fk_game-to-tag_tagId_tags_id_fk` FOREIGN KEY (`tagId`) REFERENCES `tags`(`id`)
);
