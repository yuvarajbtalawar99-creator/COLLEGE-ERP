import prisma from "../config/prisma";

export const saveAddressDetails = async (
  studentId: number,
  data: {
    Address: string;
    City: string;
    Taluk: string;
    DistrictId: number;
    Pincode: string;

    permanentAddress: string;
    permanentCity: string;
    permanentTaluk: string;
    permanentDistrictId: number;
    permanentPincode: string;
  }
) => {

  const address = await prisma.studentaddress.upsert({
    where: { studentId },
    update: {
      Address: data.Address || "",
      City: data.City || "",
      Taluk: data.Taluk || "",
      DistrictId: Number(data.DistrictId) || 0,
      Pincode: data.Pincode || "",
      permanentAddress: data.permanentAddress || "",
      permanentCity: data.permanentCity || "",
      permanentTaluk: data.permanentTaluk || "",
      permanentDistrictId: Number(data.permanentDistrictId) || 0,
      permanentPincode: data.permanentPincode || ""
    },
    create: {
      studentId,
      Address: data.Address || "",
      City: data.City || "",
      Taluk: data.Taluk || "",
      DistrictId: Number(data.DistrictId) || 0,
      Pincode: data.Pincode || "",
      permanentAddress: data.permanentAddress || "",
      permanentCity: data.permanentCity || "",
      permanentTaluk: data.permanentTaluk || "",
      permanentDistrictId: Number(data.permanentDistrictId) || 0,
      permanentPincode: data.permanentPincode || ""
    }
  });

  return address;
};