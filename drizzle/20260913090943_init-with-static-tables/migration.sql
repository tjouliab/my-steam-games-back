CREATE TABLE `game-status` (
	`id` integer PRIMARY KEY,
	`label` text NOT NULL UNIQUE
);

--> statement-breakpoint
INSERT INTO `game-status` (`id`, `label`) VALUES
  (1, '100%'),
  (2, 'Finished'),
  (3, 'Unfinished'),
  (4, 'Abandoned');

--> statement-breakpoint
CREATE TABLE `progress-status` (
	`id` integer PRIMARY KEY,
	`label` text NOT NULL UNIQUE
);

--> statement-breakpoint
INSERT INTO `progress-status` (`id`, `label`) VALUES
  (1, 'Pending'),
  (2, 'Running'),
  (3, 'Completed'),
  (4, 'Failed'),
  (5, 'Canceled');

--> statement-breakpoint
CREATE TABLE `visibility` (
	`id` integer PRIMARY KEY,
	`label` text NOT NULL UNIQUE
);

--> statement-breakpoint
INSERT INTO `visibility` (`id`, `label`) VALUES
  (1, 'Visible'),
  (2, 'Hidden Manually'),
  (3, 'Hidden Default');
