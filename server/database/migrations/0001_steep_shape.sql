DROP INDEX IF EXISTS `users_github_id_unique`;--> statement-breakpoint
DROP INDEX IF EXISTS `users_twitch_id_unique`;--> statement-breakpoint
ALTER TABLE `users` ADD `google_id` text;--> statement-breakpoint
ALTER TABLE `users` ADD `google_token` text;--> statement-breakpoint
CREATE UNIQUE INDEX `users_google_id_unique` ON `users` (`google_id`);--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `github_id`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `github_token`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `twitch_id`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `twitch_token`;