PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_games` (
	`id` integer PRIMARY KEY,
	`name` text NOT NULL,
	`imgIconUrl` text NOT NULL,
	`metacriticScore` integer,
	`positiveReviews` integer NOT NULL,
	`negativeReviews` integer NOT NULL,
	`playTime` integer NOT NULL,
	`lastTimePlayed` text,
	`releaseDate` text NOT NULL,
	`initialPrice` integer NOT NULL,
	`personnalScore` integer,
	`personnalNotes` text,
	`visibilityId` integer NOT NULL,
	`statusId` integer,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	CONSTRAINT `fk_games_visbilityId_visibility_id_fk` FOREIGN KEY (`visibilityId`) REFERENCES `visibility`(`id`),
	CONSTRAINT `fk_games_statusId_game-status_id_fk` FOREIGN KEY (`statusId`) REFERENCES `game-status`(`id`)
);
--> statement-breakpoint
INSERT INTO `__new_games`(`id`, `name`, `imgIconUrl`, `metacriticScore`, `positiveReviews`, `negativeReviews`, `playTime`, `lastTimePlayed`, `releaseDate`, `initialPrice`, `personnalScore`, `personnalNotes`, `visibilityId`, `statusId`, `createdAt`, `updatedAt`) SELECT `id`, `name`, `imgIconUrl`, `metacriticScore`, `positiveReviews`, `negativeReviews`, `playTime`, `lastTimePlayed`, `releaseDate`, `initialPrice`, `personnalScore`, `personnalNotes`, `visibilityId`, `statusId`, `createdAt`, `updatedAt` FROM `games`;--> statement-breakpoint
DROP TABLE `games`;--> statement-breakpoint
ALTER TABLE `__new_games` RENAME TO `games`;--> statement-breakpoint
PRAGMA foreign_keys=ON;