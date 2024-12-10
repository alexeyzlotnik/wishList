ALTER TABLE `wishlists` ADD `uuid` text NOT NULL DEFAULT (lower(hex(randomblob(16))));
