CREATE TABLE `wishlist_items` (
  `id` integer PRIMARY KEY AUTOINCREMENT,
  `wishlist_id` integer NOT NULL,
  `name` text NOT NULL,
  `description` text,
  `url` text,
  `image` text,
  `price` text,
  `created_at` text NOT NULL DEFAULT (current_timestamp),
  `updated_at` text NOT NULL DEFAULT (current_timestamp),
  FOREIGN KEY (`wishlist_id`) REFERENCES `wishlists` (`id`) ON DELETE CASCADE
);