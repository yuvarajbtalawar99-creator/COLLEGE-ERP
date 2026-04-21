import prisma from "../config/prisma";

export const saveParentDetails = async (
  studentId: number,
  data: {
    fatherName: string;
    motherName: string;
    parentMobile: string;
    parentEmail?: string;
    occupation?: string;
    annualIncome?: number;
  }
) => {

  const parent = await prisma.studentparentdetails.upsert({
    where: { studentId },
    update: {
      fatherName: data.fatherName || "",
      motherName: data.motherName || "",
      parentMobile: data.parentMobile || "",
      parentEmail: data.parentEmail || null,
      occupation: data.occupation || null,
      annualIncome: data.annualIncome ? Number(data.annualIncome) : null
    },
    create: {
      studentId,
      fatherName: data.fatherName || "",
      motherName: data.motherName || "",
      parentMobile: data.parentMobile || "",
      parentEmail: data.parentEmail || null,
      occupation: data.occupation || null,
      annualIncome: data.annualIncome ? Number(data.annualIncome) : null
    }
  });

  return parent;
};