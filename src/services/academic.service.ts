import prisma from "../config/prisma";

export const saveAcademicDetails = async (
  studentId: number,
  data: any
) => {

  // 1️⃣ Validate SSLC required fields
  if (!data.sslcMarksObtained || !data.sslcMaxMarks) {
    throw new Error("SSLC marks and max marks are required");
  }

  // 🔥 2️⃣ SSLC Percentage Calculation
  const sslcPercentage =
    (data.sslcMarksObtained / data.sslcMaxMarks) * 100;

  // 🔥 3️⃣ PUC Calculation (Optional)
  let pucAggregate: number | null = null;
  let pucPercentage: number | null = null;

  if (
    data.physicsMarks !== undefined &&
    data.mathsMarks !== undefined &&
    data.optionalMarks !== undefined &&
    data.pucMaxMarks !== undefined &&
    data.pucMaxMarks > 0
  ) {
    pucAggregate =
      (Number(data.physicsMarks) || 0) +
      (Number(data.mathsMarks) || 0) +
      (Number(data.optionalMarks) || 0);

    pucPercentage =
      (pucAggregate / data.pucMaxMarks) * 100;
  }

  // 🔥 4️⃣ Diploma Calculation (Optional)
  let diplomaPercentage: number | null = null;

  if (
    data.diplomaFinalYearObtained !== undefined &&
    data.diplomaFinalYearMaxMarks !== undefined &&
    data.diplomaFinalYearMaxMarks > 0
  ) {
    diplomaPercentage =
      (data.diplomaFinalYearObtained /
        data.diplomaFinalYearMaxMarks) * 100;
  }

  // 5️⃣ Save to Database (Upsert)
  const academicData = {
    // SSLC
    sslcBoard: data.sslcBoard || "",
    sslcYear: Number(data.sslcYear) || 0,
    sslcRegisterNumber: data.sslcRegisterNumber || "",
    sslcMarksObtained: Number(data.sslcMarksObtained) || 0,
    sslcMaxMarks: Number(data.sslcMaxMarks) || 0,
    sslcAttempts: Number(data.sslcAttempts) || 1,
    sslcPercentage: parseFloat(sslcPercentage.toFixed(2)) || 0,

    // PUC
    pucBoard: data.pucBoard || null,
    pucYear: data.pucYear ? Number(data.pucYear) : null,
    pucRegisterNumber: data.pucRegisterNumber || null,
    physicsMarks: data.physicsMarks !== undefined ? Number(data.physicsMarks) : null,
    mathsMarks: data.mathsMarks !== undefined ? Number(data.mathsMarks) : null,
    optionalSubject: data.optionalSubject || null,
    optionalMarks: data.optionalMarks !== undefined ? Number(data.optionalMarks) : null,
    pucMaxMarks: data.pucMaxMarks !== undefined ? Number(data.pucMaxMarks) : null,
    pucAggregate: pucAggregate !== null ? Number(pucAggregate) : null,
    pucPercentage:
      pucPercentage !== null
        ? parseFloat(pucPercentage.toFixed(2))
        : null,
    pucAttempts: data.pucAttempts ? Number(data.pucAttempts) : null,

    // Diploma
    diplomaUniversity: (data.university || data.diplomaUniversity) || null,
    diplomaYear: data.diplomaYear ? Number(data.diplomaYear) : null,
    diplomaRegisterNumber: data.diplomaRegisterNumber || null,
    diplomaFinalYearMaxMarks: data.diplomaFinalYearMaxMarks !== undefined ? Number(data.diplomaFinalYearMaxMarks) : null,
    diplomaFinalYearObtained: data.diplomaFinalYearObtained !== undefined ? Number(data.diplomaFinalYearObtained) : null,
    diplomaPercentage:
      diplomaPercentage !== null
        ? parseFloat(diplomaPercentage.toFixed(2))
        : null,
    diplomaAttempts: data.diplomaAttempts ? Number(data.diplomaAttempts) : null
  };

  const academic = await prisma.studentacademicdetails.upsert({
    where: { studentId },
    update: academicData,
    create: {
      studentId,
      ...academicData
    }
  });

  return academic;
};