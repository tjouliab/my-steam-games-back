ALTER TABLE `games` ADD `backgroundUrl` text;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_populate-job-item` (
	`jobId` integer NOT NULL,
	`gameId` integer NOT NULL,
	`progressStatusId` integer DEFAULT 1 NOT NULL,
	`attemps` integer DEFAULT 0 NOT NULL,
	CONSTRAINT `PopulateJobItem_pk` PRIMARY KEY(`jobId`, `gameId`),
	CONSTRAINT `fk_PopulateJobItem_jobId_PopulateJob_id_fk` FOREIGN KEY (`jobId`) REFERENCES `populate-job`(`id`),
	CONSTRAINT `fk_PopulateJobItem_progressStatusId_progress-status_id_fk` FOREIGN KEY (`progressStatusId`) REFERENCES `progress-status`(`id`)
);
--> statement-breakpoint
INSERT INTO `__new_populate-job-item`(`jobId`, `gameId`, `progressStatusId`, `attemps`) SELECT `jobId`, `gameId`, `progressStatusId`, `attemps` FROM `populate-job-item`;--> statement-breakpoint
DROP TABLE `populate-job-item`;--> statement-breakpoint
ALTER TABLE `__new_populate-job-item` RENAME TO `populate-job-item`;--> statement-breakpoint
PRAGMA foreign_keys=ON;