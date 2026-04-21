import { Request, Response } from "express";
import prisma from "../config/prisma";



/* ===============================
   DASHBOARD STATS
================================*/
export const getDashboardStats = async (req: Request, res: Response) => {
  try {

    const total = await prisma.student.count();

    const submitted = await prisma.student.count({
      where: { status: "SUBMITTED" }
    });

    const review = await prisma.student.count({
      where: { status: "UNDER_REVIEW" }
    });

    const documentVerified = await prisma.student.count({
      where: { status: "DOCUMENT_VERIFIED" }
    });

    const confirmed = await prisma.student.count({
      where: { status: "ADMISSION_CONFIRMED" }
    });

    const rejected = await prisma.student.count({
      where: { status: "REJECTED" }
    });

    const resubmitted = await prisma.student.count({
      where: { status: "RESUBMITTED" }
    });

    res.json({
      success: true,
      data: {
        total,
        submitted,
        resubmitted,
        review,
        documentVerified,
        confirmed,
        rejected
      }
    });

  } catch (error:any) {
    res.status(500).json({
      success:false,
      message:error.message
    });
  }
};



/* ===============================
   GET STUDENTS (FILTERABLE)
================================*/
export const getStudents = async (req: Request, res: Response) => {
  try {

    const { status, branchId, search, dateFrom, dateTo } = req.query;

    const where: any = {};

    if (status) {
      where.status = status as any;
    }

    if (branchId) {
      where.branchId = Number(branchId);
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom as string);
      if (dateTo) {
        const to = new Date(dateTo as string);
        to.setHours(23, 59, 59, 999);
        where.createdAt.lte = to;
      }
    }

    if (search) {
      const q = (search as string).trim();
      where.OR = [
        { user: { email: { contains: q } } },
        { user: { mobile: { contains: q } } },
        { studentpersonaldetails: { fullName: { contains: q } } },
        { tempCollegeId: { contains: q } },
      ];
    }

    const students = await prisma.student.findMany({
      where,
      include: {
        user:{
          select:{
            email:true,
            mobile:true
          }
        },
        branch:true,
        studentpersonaldetails: {
          select: {
            fullName: true
          }
        }
      },
      orderBy:{
        createdAt:"desc"
      }
    });

    res.json({
      success:true,
      data:students
    });

  } catch(error:any){
    res.status(500).json({
      success:false,
      message:error.message
    });
  }
};



/* ===============================
   FULL STUDENT PROFILE
================================*/
export const getStudentById = async (
  req: Request,
  res: Response
) => {

  try {

    const id = Number(req.params.id);

    const student = await prisma.student.findUnique({
      where:{ id },
      include:{
        user:true,
        branch:true,
        studentpersonaldetails:true,
        studentparentdetails:true,
        studentaddress:true,
        studentacademicdetails:true,
        studentdocuments:true
      }
    });

    if(!student){
      return res.status(404).json({
        success:false,
        message:"Student not found"
      });
    }

    res.json({
      success:true,
      data:student
    });

  } catch(error:any){
    res.status(500).json({
      success:false,
      message:error.message
    });
  }

};



/* ===============================
   UPDATE ADMISSION STATUS (GENERIC)
================================*/
export const updateStudentStatus = async (
  req: Request,
  res: Response
) => {

  try {

    const id = Number(req.params.id);
    const { status } = req.body;

    const student = await prisma.student.update({
      where:{ id },
      data:{ status }
    });

    res.json({
      success:true,
      message:"Status updated",
      data:student
    });

  } catch(error:any){
    res.status(500).json({
      success:false,
      message:error.message
    });
  }

};



/* ===============================
   START REVIEW
================================*/
export const startReview = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const student = await prisma.student.findUnique({ where: { id } });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    if (student.status !== "SUBMITTED" && student.status !== "RESUBMITTED") {
      return res.status(400).json({
        success: false,
        message: `Cannot start review. Current status: ${student.status}`
      });
    }

    const updated = await prisma.student.update({
      where: { id },
      data: {
        status: "UNDER_REVIEW",
        reviewStartedAt: new Date()
      }
    });

    res.json({
      success: true,
      message: "Review started",
      data: updated
    });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};



/* ===============================
   UPDATE DOCUMENT VERIFICATION CHECKS
================================*/
export const updateDocChecks = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const { photoVerified, signatureVerified, marksCardVerified } = req.body;

    const updated = await prisma.student.update({
      where: { id },
      data: {
        photoVerified: !!photoVerified,
        signatureVerified: !!signatureVerified,
        marksCardVerified: !!marksCardVerified
      }
    });

    res.json({
      success: true,
      message: "Verification checks updated",
      data: updated
    });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};



/* ===============================
   VERIFY DOCUMENTS (STATUS CHANGE)
================================*/
export const verifyDocuments = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const student = await prisma.student.findUnique({ where: { id } });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    if (student.status !== "UNDER_REVIEW") {
      return res.status(400).json({
        success: false,
        message: `Cannot verify documents. Current status: ${student.status}`
      });
    }

    if (!student.photoVerified || !student.signatureVerified || !student.marksCardVerified) {
      return res.status(400).json({
        success: false,
        message: "All document verification checks must be completed before marking as verified"
      });
    }

    const updated = await prisma.student.update({
      where: { id },
      data: {
        status: "DOCUMENT_VERIFIED",
        documentsVerifiedAt: new Date()
      }
    });

    res.json({
      success: true,
      message: "Documents verified successfully",
      data: updated
    });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};



/* ===============================
   APPROVE ADMISSION
================================*/
export const approveAdmission = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const student = await prisma.student.findUnique({
      where: { id },
      include: { branch: true }
    });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    if (student.status !== "DOCUMENT_VERIFIED") {
      return res.status(400).json({
        success: false,
        message: `Cannot approve. Current status: ${student.status}. Documents must be verified first.`
      });
    }

    // Generate temp college ID
    let tempCollegeId = student.tempCollegeId;
    if (!tempCollegeId) {
      const year = new Date().getFullYear().toString().slice(-2);
      const count = await prisma.student.count({
        where: { branchId: student.branchId }
      });
      const branchCode = student.branch?.code || "GEN";
      tempCollegeId = `CLG${year}${branchCode}${String(count + 1).padStart(3, "0")}`;
    }

    const updated = await prisma.student.update({
      where: { id },
      data: {
        status: "ADMISSION_CONFIRMED",
        tempCollegeId,
        approvedAt: new Date()
      }
    });

    res.json({
      success: true,
      message: "Admission approved and College ID generated",
      data: updated
    });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};



/* ===============================
   REJECT APPLICATION
================================*/
export const rejectApplication = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const { remark } = req.body;

    if (!remark || !remark.trim()) {
      return res.status(400).json({
        success: false,
        message: "Rejection remark is required"
      });
    }

    const student = await prisma.student.findUnique({ where: { id } });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    if (student.status === "ADMISSION_CONFIRMED" || student.status === "USN_ASSIGNED") {
      return res.status(400).json({
        success: false,
        message: "Cannot reject an already confirmed admission"
      });
    }

    const updated = await prisma.student.update({
      where: { id },
      data: {
        status: "REJECTED",
        rejectionRemark: remark.trim(),
        rejectedAt: new Date()
      }
    });

    res.json({
      success: true,
      message: "Application rejected",
      data: updated
    });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};



/* ===============================
   GENERATE TEMP COLLEGE ID
================================*/
export const generateTempCollegeId = async (
  req: Request,
  res: Response
) => {

  try{

    const id = Number(req.params.id);

    const student = await prisma.student.findUnique({
      where:{ id },
      include:{ branch:true }
    });

    if(!student){
      return res.status(404).json({
        success:false,
        message:"Student not found"
      });
    }

    if(student.tempCollegeId){
      return res.json({
        success:true,
        message:"Temp ID already generated",
        data:student
      });
    }

    const year = new Date().getFullYear().toString().slice(-2);

    const count = await prisma.student.count({
      where:{
        branchId:student.branchId
      }
    });

    const branchCode = student.branch?.code || "GEN";

    const tempId = `CLG${year}${branchCode}${String(count+1).padStart(3,"0")}`;

    const updated = await prisma.student.update({
      where:{ id },
      data:{
        tempCollegeId:tempId,
        status:"ADMISSION_CONFIRMED",
        approvedAt: new Date()
      }
    });

    res.json({
      success:true,
      message:"Temporary College ID generated",
      data:updated
    });

  }catch(error:any){
    res.status(500).json({
      success:false,
      message:error.message
    });
  }

};



/* ===============================
   ASSIGN VTU USN
================================*/
export const assignUSN = async (
  req: Request,
  res: Response
) => {

  try{

    const id = Number(req.params.id);
    const { usn } = req.body;

    const student = await prisma.student.update({
      where:{ id },
      data:{
        vtuUsn:usn,
        status:"USN_ASSIGNED",
        usnAssignedAt: new Date()
      }
    });

    res.json({
      success:true,
      message:"USN assigned",
      data:student
    });

  }catch(error:any){
    res.status(500).json({
      success:false,
      message:error.message
    });
  }

};