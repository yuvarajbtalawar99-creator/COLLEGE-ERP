-- DropIndex
DROP INDEX `Branch_name_key` ON `branch`;

-- AlterTable
ALTER TABLE `branch` ADD COLUMN `code` VARCHAR(191) NULL;
