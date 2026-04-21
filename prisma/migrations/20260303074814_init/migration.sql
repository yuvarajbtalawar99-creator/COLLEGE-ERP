-- CreateTable
CREATE TABLE `Branch` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `totalSeats` INTEGER NOT NULL,
    `availableSeats` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Branch_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `District` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `District_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `mobile` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('STUDENT', 'ADMISSION_OFFICER', 'SUPER_ADMIN') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_mobile_key`(`mobile`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Student` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `admissionType` ENUM('KCET', 'DCET', 'MANAGEMENT') NOT NULL,
    `cetNumber` VARCHAR(191) NULL,
    `dcetNumber` VARCHAR(191) NULL,
    `aadhaar` VARCHAR(191) NULL,
    `branchId` INTEGER NULL,
    `tempCollegeId` VARCHAR(191) NULL,
    `vtuUsn` VARCHAR(191) NULL,
    `status` ENUM('REGISTERED', 'SUBMITTED', 'UNDER_REVIEW', 'CORRECTION_REQUIRED', 'REJECTED', 'ADMISSION_CONFIRMED', 'USN_ASSIGNED') NOT NULL DEFAULT 'REGISTERED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Student_userId_key`(`userId`),
    UNIQUE INDEX `Student_cetNumber_key`(`cetNumber`),
    UNIQUE INDEX `Student_dcetNumber_key`(`dcetNumber`),
    UNIQUE INDEX `Student_aadhaar_key`(`aadhaar`),
    UNIQUE INDEX `Student_tempCollegeId_key`(`tempCollegeId`),
    UNIQUE INDEX `Student_vtuUsn_key`(`vtuUsn`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentPersonalDetails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `gender` ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,
    `dateOfBirth` DATETIME(3) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `religion` ENUM('HINDU', 'MUSLIM', 'CHRISTIAN', 'JAIN', 'SIKH', 'BUDDHIST', 'OTHER') NOT NULL,
    `nationality` ENUM('INDIAN', 'NRI', 'FOREIGN') NOT NULL,
    `studiedInKarnataka` BOOLEAN NOT NULL,

    UNIQUE INDEX `StudentPersonalDetails_studentId_key`(`studentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentParentDetails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `fatherName` VARCHAR(191) NOT NULL,
    `motherName` VARCHAR(191) NOT NULL,
    `parentMobile` VARCHAR(191) NOT NULL,
    `parentEmail` VARCHAR(191) NULL,
    `occupation` VARCHAR(191) NULL,
    `annualIncome` DOUBLE NULL,

    UNIQUE INDEX `StudentParentDetails_studentId_key`(`studentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentAddress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `Address` VARCHAR(191) NOT NULL,
    `City` VARCHAR(191) NOT NULL,
    `Taluk` VARCHAR(191) NOT NULL,
    `DistrictId` INTEGER NOT NULL,
    `Pincode` VARCHAR(191) NOT NULL,
    `permanentAddress` VARCHAR(191) NOT NULL,
    `permanentCity` VARCHAR(191) NOT NULL,
    `permanentTaluk` VARCHAR(191) NOT NULL,
    `permanentDistrictId` INTEGER NOT NULL,
    `permanentPincode` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `StudentAddress_studentId_key`(`studentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentAcademicDetails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `sslcBoard` VARCHAR(191) NOT NULL,
    `sslcYear` INTEGER NOT NULL,
    `sslcRegisterNumber` VARCHAR(191) NOT NULL,
    `sslcAttempts` INTEGER NULL,
    `sslcMarksObtained` DOUBLE NOT NULL,
    `sslcMaxMarks` DOUBLE NOT NULL,
    `pucBoard` VARCHAR(191) NULL,
    `pucYear` INTEGER NULL,
    `pucRegisterNumber` VARCHAR(191) NULL,
    `pucAttempts` INTEGER NULL,
    `physicsMarks` DOUBLE NULL,
    `mathsMarks` DOUBLE NULL,
    `optionalSubject` VARCHAR(191) NULL,
    `optionalMarks` DOUBLE NULL,
    `pucTotalMarks` DOUBLE NULL,
    `pucPercentage` DOUBLE NULL,
    `diplomaUniversity` VARCHAR(191) NULL,
    `diplomaYearOfPassing` INTEGER NULL,
    `diplomaRegisterNumber` VARCHAR(191) NULL,
    `diplomaAttempts` INTEGER NULL,
    `diplomaFinalYearMarks` DOUBLE NULL,
    `diplomaFinalYearMaxMarks` DOUBLE NULL,
    `diplomaFinalYearPercentage` DOUBLE NULL,

    UNIQUE INDEX `StudentAcademicDetails_studentId_key`(`studentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentDocuments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `sslcMarkscard` VARCHAR(191) NULL,
    `pucMarkscard` VARCHAR(191) NULL,
    `casteCertificate` VARCHAR(191) NULL,
    `incomeCertificate` VARCHAR(191) NULL,
    `transferCertificate` VARCHAR(191) NULL,
    `migrationCertificate` VARCHAR(191) NULL,
    `photo` VARCHAR(191) NULL,
    `signature` VARCHAR(191) NULL,

    UNIQUE INDEX `StudentDocuments_studentId_key`(`studentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentPersonalDetails` ADD CONSTRAINT `StudentPersonalDetails_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentParentDetails` ADD CONSTRAINT `StudentParentDetails_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentAddress` ADD CONSTRAINT `StudentAddress_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentAddress` ADD CONSTRAINT `StudentAddress_DistrictId_fkey` FOREIGN KEY (`DistrictId`) REFERENCES `District`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentAddress` ADD CONSTRAINT `StudentAddress_permanentDistrictId_fkey` FOREIGN KEY (`permanentDistrictId`) REFERENCES `District`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentAcademicDetails` ADD CONSTRAINT `StudentAcademicDetails_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentDocuments` ADD CONSTRAINT `StudentDocuments_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
