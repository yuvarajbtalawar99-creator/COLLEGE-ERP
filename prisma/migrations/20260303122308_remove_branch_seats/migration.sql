/*
  Warnings:

  - You are about to drop the column `availableSeats` on the `branch` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `branch` table. All the data in the column will be lost.
  - You are about to drop the column `totalSeats` on the `branch` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `branch` DROP COLUMN `availableSeats`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `totalSeats`;
