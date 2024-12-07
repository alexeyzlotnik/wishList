CREATE TABLE `wishlists` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  `user_id` INTEGER NOT NULL,
  `name` TEXT NOT NULL,
  `description` TEXT,
  `created_at` TEXT NOT NULL DEFAULT (current_timestamp),
  `updated_at` TEXT NOT NULL DEFAULT (current_timestamp)
);

-- Add a foreign key constraint if needed
-- ALTER TABLE `wishlists` ADD FOREIGN KEY (`user_id`) REFERENCES `users`(`id`);