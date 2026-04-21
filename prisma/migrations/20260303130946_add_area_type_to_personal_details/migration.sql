/*
  Warnings:

  - Added the required column `stateId` to the `District` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `district` ADD COLUMN `stateId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `State` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `State_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `District` ADD CONSTRAINT `District_stateId_fkey` FOREIGN KEY (`stateId`) REFERENCES `State`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
