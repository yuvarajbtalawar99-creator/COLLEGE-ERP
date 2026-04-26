-- CreateEnum
CREATE TYPE "student_admissionType" AS ENUM ('KCET', 'DCET', 'MANAGEMENT');

-- CreateEnum
CREATE TYPE "studentpersonaldetails_gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('STUDENT', 'ADMISSION_OFFICER', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "studentpersonaldetails_religion" AS ENUM ('HINDU', 'MUSLIM', 'CHRISTIAN', 'JAIN', 'SIKH', 'BUDDHIST', 'OTHER');

-- CreateEnum
CREATE TYPE "studentpersonaldetails_nationality" AS ENUM ('INDIAN', 'NRI', 'FOREIGN');

-- CreateEnum
CREATE TYPE "student_status" AS ENUM ('REGISTERED', 'SUBMITTED', 'RESUBMITTED', 'UNDER_REVIEW', 'DOCUMENT_VERIFIED', 'CORRECTION_REQUIRED', 'REJECTED', 'ADMISSION_CONFIRMED', 'USN_ASSIGNED');

-- CreateEnum
CREATE TYPE "studentpersonaldetails_areaType" AS ENUM ('RURAL', 'URBAN');

-- CreateTable
CREATE TABLE "branch" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "district" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "stateId" INTEGER NOT NULL,

    CONSTRAINT "district_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "state" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "state_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "admissionType" "student_admissionType" NOT NULL,
    "cetNumber" TEXT,
    "dcetNumber" TEXT,
    "aadhaarHash" TEXT,
    "branchId" INTEGER,
    "tempCollegeId" TEXT,
    "vtuUsn" TEXT,
    "status" "student_status" NOT NULL DEFAULT 'REGISTERED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rejectionRemark" TEXT,
    "photoVerified" BOOLEAN NOT NULL DEFAULT false,
    "signatureVerified" BOOLEAN NOT NULL DEFAULT false,
    "marksCardVerified" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" TIMESTAMP(3),
    "resubmittedAt" TIMESTAMP(3),
    "reviewStartedAt" TIMESTAMP(3),
    "documentsVerifiedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "usnAssignedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),

    CONSTRAINT "student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studentacademicdetails" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "sslcBoard" TEXT NOT NULL,
    "sslcYear" INTEGER NOT NULL,
    "sslcRegisterNumber" TEXT NOT NULL,
    "sslcAttempts" INTEGER NOT NULL,
    "sslcMarksObtained" DOUBLE PRECISION NOT NULL,
    "sslcMaxMarks" DOUBLE PRECISION NOT NULL,
    "pucBoard" TEXT,
    "pucYear" INTEGER,
    "pucRegisterNumber" TEXT,
    "pucAttempts" INTEGER,
    "physicsMarks" DOUBLE PRECISION,
    "mathsMarks" DOUBLE PRECISION,
    "optionalSubject" TEXT,
    "optionalMarks" DOUBLE PRECISION,
    "pucPercentage" DOUBLE PRECISION,
    "diplomaUniversity" TEXT,
    "diplomaRegisterNumber" TEXT,
    "diplomaAttempts" INTEGER,
    "diplomaFinalYearMaxMarks" DOUBLE PRECISION,
    "diplomaFinalYearObtained" DOUBLE PRECISION,
    "diplomaPercentage" DOUBLE PRECISION,
    "diplomaYear" INTEGER,
    "pucAggregate" DOUBLE PRECISION,
    "pucMaxMarks" DOUBLE PRECISION,
    "sslcPercentage" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "studentacademicdetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studentaddress" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "Address" TEXT NOT NULL,
    "City" TEXT NOT NULL,
    "Taluk" TEXT NOT NULL,
    "DistrictId" INTEGER NOT NULL,
    "Pincode" TEXT NOT NULL,
    "permanentAddress" TEXT NOT NULL,
    "permanentCity" TEXT NOT NULL,
    "permanentTaluk" TEXT NOT NULL,
    "permanentDistrictId" INTEGER NOT NULL,
    "permanentPincode" TEXT NOT NULL,

    CONSTRAINT "studentaddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studentdocuments" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "sslcMarkscard" TEXT,
    "pucMarkscard" TEXT,
    "casteCertificate" TEXT,
    "incomeCertificate" TEXT,
    "transferCertificate" TEXT,
    "migrationCertificate" TEXT,
    "photo" TEXT,
    "signature" TEXT,
    "studyCertificate" TEXT,

    CONSTRAINT "studentdocuments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studentparentdetails" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "fatherName" TEXT NOT NULL,
    "motherName" TEXT NOT NULL,
    "parentMobile" TEXT NOT NULL,
    "parentEmail" TEXT,
    "occupation" TEXT,
    "annualIncome" DOUBLE PRECISION,

    CONSTRAINT "studentparentdetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studentpersonaldetails" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "fullName" TEXT NOT NULL,
    "gender" "studentpersonaldetails_gender" NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,
    "religion" "studentpersonaldetails_religion" NOT NULL,
    "nationality" "studentpersonaldetails_nationality" NOT NULL,
    "studiedInKarnataka" BOOLEAN NOT NULL,
    "areaType" "studentpersonaldetails_areaType" NOT NULL,

    CONSTRAINT "studentpersonaldetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "supabaseUserId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile" TEXT,
    "password" TEXT,
    "role" "user_role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Branch_code_key" ON "branch"("code");

-- CreateIndex
CREATE UNIQUE INDEX "District_name_key" ON "district"("name");

-- CreateIndex
CREATE INDEX "District_stateId_fkey" ON "district"("stateId");

-- CreateIndex
CREATE UNIQUE INDEX "State_name_key" ON "state"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Student_userId_key" ON "student"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_cetNumber_key" ON "student"("cetNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Student_dcetNumber_key" ON "student"("dcetNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Student_aadhaarHash_key" ON "student"("aadhaarHash");

-- CreateIndex
CREATE UNIQUE INDEX "Student_tempCollegeId_key" ON "student"("tempCollegeId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_vtuUsn_key" ON "student"("vtuUsn");

-- CreateIndex
CREATE INDEX "Student_branchId_fkey" ON "student"("branchId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentAcademicDetails_studentId_key" ON "studentacademicdetails"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentAddress_studentId_key" ON "studentaddress"("studentId");

-- CreateIndex
CREATE INDEX "StudentAddress_DistrictId_fkey" ON "studentaddress"("DistrictId");

-- CreateIndex
CREATE INDEX "StudentAddress_permanentDistrictId_fkey" ON "studentaddress"("permanentDistrictId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentDocuments_studentId_key" ON "studentdocuments"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentParentDetails_studentId_key" ON "studentparentdetails"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentPersonalDetails_studentId_key" ON "studentpersonaldetails"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "user_supabaseUserId_key" ON "user"("supabaseUserId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_mobile_key" ON "user"("mobile");

-- AddForeignKey
ALTER TABLE "district" ADD CONSTRAINT "District_stateId_fkey_rel" FOREIGN KEY ("stateId") REFERENCES "state"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "Student_branchId_fkey_rel" FOREIGN KEY ("branchId") REFERENCES "branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentacademicdetails" ADD CONSTRAINT "StudentAcademicDetails_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentaddress" ADD CONSTRAINT "StudentAddress_DistrictId_fkey_rel" FOREIGN KEY ("DistrictId") REFERENCES "district"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentaddress" ADD CONSTRAINT "StudentAddress_permanentDistrictId_fkey_rel" FOREIGN KEY ("permanentDistrictId") REFERENCES "district"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentaddress" ADD CONSTRAINT "StudentAddress_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentdocuments" ADD CONSTRAINT "StudentDocuments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentparentdetails" ADD CONSTRAINT "StudentParentDetails_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentpersonaldetails" ADD CONSTRAINT "StudentPersonalDetails_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
