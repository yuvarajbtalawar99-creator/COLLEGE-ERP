/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Branch` will be added. If there are existing duplicate values, this will fail.
  - Made the column `code` on table `branch` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `branch` MODIFY `code` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Branch_code_key` ON `Branch`(`code`);
