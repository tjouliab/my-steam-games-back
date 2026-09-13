CREATE TABLE `genres` (
	`id` integer PRIMARY KEY,
	`description` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`description` text NOT NULL
);
