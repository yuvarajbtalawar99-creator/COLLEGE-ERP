/*
  Warnings:

  - You are about to alter the column `dateOfBirth` on the `studentpersonaldetails` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.

*/
-- AlterTable
ALTER TABLE `student` ADD COLUMN `approvedAt` DATETIME(3) NULL,
    ADD COLUMN `documentsVerifiedAt` DATETIME(3) NULL,
    ADD COLUMN `marksCardVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `photoVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `rejectedAt` DATETIME(3) NULL,
    ADD COLUMN `rejectionRemark` TEXT NULL,
    ADD COLUMN `reviewStartedAt` DATETIME(3) NULL,
    ADD COLUMN `signatureVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `submittedAt` DATETIME(3) NULL,
    MODIFY `status` ENUM('REGISTERED', 'SUBMITTED', 'UNDER_REVIEW', 'DOCUMENT_VERIFIED', 'CORRECTION_REQUIRED', 'REJECTED', 'ADMISSION_CONFIRMED', 'USN_ASSIGNED') NOT NULL DEFAULT 'REGISTERED';

-- AlterTable
ALTER TABLE `studentpersonaldetails` MODIFY `dateOfBirth` DATETIME(0) NOT NULL;
