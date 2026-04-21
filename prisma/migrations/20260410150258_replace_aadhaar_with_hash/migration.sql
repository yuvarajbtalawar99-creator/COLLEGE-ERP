/*
  Warnings:

  - You are about to drop the column `aadhaar` on the `student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[aadhaarHash]` on the table `student` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Student_aadhaar_key` ON `student`;

-- AlterTable
ALTER TABLE `student` DROP COLUMN `aadhaar`,
    ADD COLUMN `aadhaarHash` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Student_aadhaarHash_key` ON `student`(`aadhaarHash`);
