import prisma from "../config/prisma";

export const savePersonalDetails = async (
  studentId: number,
  data: {
    fullName: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    dateOfBirth: string;
    category: string;
    religion: string;
    nationality: string;
    areaType: "RURAL" | "URBAN";
    studiedInKarnataka: boolean;
  }
) => {


  const student = await prisma.student.findUnique({
    where: { id: studentId }
  });

  if (!student) {
    throw new Error("Admission not found");
  }

  if (
    student.status !== "REGISTERED" &&
    student.status !== "CORRECTION_REQUIRED"
  ) {
    throw new Error("Editing not allowed after submission");
  }

  const parsedDob = data.dateOfBirth ? new Date(data.dateOfBirth) : new Date();
  if (isNaN(parsedDob.getTime())) {
    throw new Error("Invalid value for Date of Birth. Expected a valid date.");
  }


  const personal = await prisma.studentpersonaldetails.upsert({
    where: { studentId },
    update: {
      fullName: data.fullName || "",
      gender: data.gender,
      dateOfBirth: parsedDob,
      category: data.category || "",
      religion: (data.religion as any) || "",
      nationality: (data.nationality as any) || "Indian",
      areaType: data.areaType || "URBAN",
      studiedInKarnataka: !!data.studiedInKarnataka
    },
    create: {
      studentId,
      fullName: data.fullName || "",
      gender: data.gender,
      dateOfBirth: parsedDob,
      category: data.category || "",
      religion: (data.religion as any) || "",
      nationality: (data.nationality as any) || "Indian",
      areaType: data.areaType || "URBAN",
      studiedInKarnataka: !!data.studiedInKarnataka
    }
  });

  return personal;
};