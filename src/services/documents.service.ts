import prisma from "../config/prisma";

export const saveDocuments = async (
  studentId: number,
  files: any
) => {

  const documentData: any = {};
  if (files.sslcMarkscard?.[0]) documentData.sslcMarkscard = files.sslcMarkscard[0].filename;
  if (files.pucMarkscard?.[0]) documentData.pucMarkscard = files.pucMarkscard[0].filename;
  if (files.casteCertificate?.[0]) documentData.casteCertificate = files.casteCertificate[0].filename;
  if (files.incomeCertificate?.[0]) documentData.incomeCertificate = files.incomeCertificate[0].filename;
  if (files.transferCertificate?.[0]) documentData.transferCertificate = files.transferCertificate[0].filename;
  if (files.migrationCertificate?.[0]) documentData.migrationCertificate = files.migrationCertificate[0].filename;
  if (files.studyCertificate?.[0]) documentData.studyCertificate = files.studyCertificate[0].filename;
  if (files.photo?.[0]) documentData.photo = files.photo[0].filename;
  if (files.signature?.[0]) documentData.signature = files.signature[0].filename;

  if (Object.keys(documentData).length === 0) {
    const existing = await prisma.studentdocuments.findUnique({
      where: { studentId }
    });
    return existing;
  }

  const documents = await prisma.studentdocuments.upsert({
    where: { studentId },
    update: documentData,
    create: {
      studentId,
      ...documentData
    }
  });

  return documents;
};