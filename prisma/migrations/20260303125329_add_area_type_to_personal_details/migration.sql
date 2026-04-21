/*
  Warnings:

  - Added the required column `areaType` to the `StudentPersonalDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `studentpersonaldetails` ADD COLUMN `areaType` ENUM('RURAL', 'URBAN') NOT NULL;
