PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_populate-job` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`startAt` integer,
	`finishedAt` integer,
	`totalGames` integer NOT NULL,
	`failedGames` integer DEFAULT 0 NOT NULL,
	`progressStatusId` integer DEFAULT 1 NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	CONSTRAINT `fk_PopulateJob_progressStatusId_progress-status_id_fk` FOREIGN KEY (`progressStatusId`) REFERENCES `progress-status`(`id`)
);
--> statement-breakpoint
INSERT INTO `__new_populate-job`(`id`, `startAt`, `finishedAt`, `totalGames`, `failedGames`, `progressStatusId`, `createdAt`, `updatedAt`) SELECT `id`, `startAt`, `finishedAt`, `totalGames`, `failedGames`, `progressStatusId`, `createdAt`, `updatedAt` FROM `populate-job`;--> statement-breakpoint
DROP TABLE `populate-job`;--> statement-breakpoint
ALTER TABLE `__new_populate-job` RENAME TO `populate-job`;--> statement-breakpoint
PRAGMA foreign_keys=ON;