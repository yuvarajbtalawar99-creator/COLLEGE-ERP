/*
  Warnings:

  - You are about to drop the column `diplomaFinalYearMarks` on the `studentacademicdetails` table. All the data in the column will be lost.
  - You are about to drop the column `diplomaFinalYearPercentage` on the `studentacademicdetails` table. All the data in the column will be lost.
  - You are about to drop the column `diplomaYearOfPassing` on the `studentacademicdetails` table. All the data in the column will be lost.
  - You are about to drop the column `pucTotalMarks` on the `studentacademicdetails` table. All the data in the column will be lost.
  - Added the required column `sslcPercentage` to the `StudentAcademicDetails` table without a default value. This is not possible if the table is not empty.
  - Made the column `sslcAttempts` on table `studentacademicdetails` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `studentacademicdetails` DROP COLUMN `diplomaFinalYearMarks`,
    DROP COLUMN `diplomaFinalYearPercentage`,
    DROP COLUMN `diplomaYearOfPassing`,
    DROP COLUMN `pucTotalMarks`,
    ADD COLUMN `diplomaFinalYearObtained` DOUBLE NULL,
    ADD COLUMN `diplomaPercentage` DOUBLE NULL,
    ADD COLUMN `diplomaYear` INTEGER NULL,
    ADD COLUMN `pucAggregate` DOUBLE NULL,
    ADD COLUMN `pucMaxMarks` DOUBLE NULL,
    ADD COLUMN `sslcPercentage` DOUBLE NOT NULL,
    MODIFY `sslcAttempts` INTEGER NOT NULL;
