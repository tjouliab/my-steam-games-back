CREATE TABLE `PopulateJobItem` (
	`jobId` integer,
	`gameId` integer NOT NULL,
	`progressStatusId` integer DEFAULT 1 NOT NULL,
	`attemps` integer DEFAULT 0 NOT NULL,
	CONSTRAINT `PopulateJobItem_pk` PRIMARY KEY(`jobId`, `gameId`),
	CONSTRAINT `fk_PopulateJobItem_jobId_PopulateJob_id_fk` FOREIGN KEY (`jobId`) REFERENCES `PopulateJob`(`id`),
	CONSTRAINT `fk_PopulateJobItem_progressStatusId_progress-status_id_fk` FOREIGN KEY (`progressStatusId`) REFERENCES `progress-status`(`id`)
);
--> statement-breakpoint
CREATE TABLE `PopulateJob` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`startAt` integer NOT NULL,
	`finishedAt` integer,
	`totalGames` integer NOT NULL,
	`failedGames` integer DEFAULT 0 NOT NULL,
	`progressStatusId` integer DEFAULT 1 NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	CONSTRAINT `fk_PopulateJob_progressStatusId_progress-status_id_fk` FOREIGN KEY (`progressStatusId`) REFERENCES `progress-status`(`id`)
);
