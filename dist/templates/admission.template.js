"use strict";
/**
 * Professional University Admission Acknowledgment Template
 * Uses a 2-column grid layout with boxed sections and high-quality branding.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdmissionTemplate = void 0;
const getAdmissionTemplate = (student) => {
    const photo = student.studentdocuments?.photo
        ? `http://localhost:5000/uploads/${student.studentdocuments.photo}`
        : 'https://via.placeholder.com/150?text=No+Photo';
    const date = new Date(student.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
    const personal = student.studentpersonaldetails || {};
    const parent = student.studentparentdetails || {};
    const address = student.studentaddress || {};
    const academic = student.studentacademicdetails || {};
    const docs = student.studentdocuments || {};
    const academicYear = "2024 - 2025";
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admission Acknowledgment - ${student.id}</title>
    <style>
        :root {
            --primary: #1e3a8a;
            --secondary: #64748b;
            --border: #e2e8f0;
            --bg-light: #f8fafc;
            --text-dark: #1e293b;
            --text-muted: #64748b;
        }
        
        * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact;
        }
        
        body {
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 40px;
            color: var(--text-dark);
            line-height: 1.5;
            background: #fff;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
            border-bottom: 3px solid var(--primary);
            padding-bottom: 20px;
        }

        .college-info {
            flex: 1;
        }

        .college-info h1 {
            margin: 0;
            color: var(--primary);
            font-size: 24px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .college-info p {
            margin: 5px 0 0 0;
            color: var(--secondary);
            font-size: 14px;
            font-weight: 500;
        }

        .document-title {
            margin-top: 15px;
            font-size: 18px;
            font-weight: 700;
            color: var(--text-dark);
        }

        .profile-photo {
            width: 120px;
            height: 140px;
            border: 2px solid var(--border);
            border-radius: 8px;
            overflow: hidden;
            background: var(--bg-light);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .profile-photo img {
            width: 100%;
            height: 100%;
            object-cover: cover;
        }

        .section {
            margin-bottom: 30px;
            break-inside: avoid;
        }

        .section-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 12px;
            border-bottom: 1px solid var(--border);
            padding-bottom: 5px;
        }

        .section-header h2 {
            margin: 0;
            font-size: 14px;
            text-transform: uppercase;
            color: var(--primary);
            letter-spacing: 1px;
        }

        .data-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px 30px;
            padding: 10px 0;
        }

        .data-item {
            display: flex;
            flex-direction: column;
        }

        .label {
            font-size: 10px;
            font-weight: 700;
            color: var(--text-muted);
            text-transform: uppercase;
            margin-bottom: 2px;
        }

        .value {
            font-size: 13px;
            font-weight: 600;
            color: var(--text-dark);
        }

        .full-width {
            grid-column: span 2;
        }

        .footer {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding-top: 40px;
        }

        .signature-box {
            text-align: center;
            width: 200px;
        }

        .signature-line {
            border-top: 1px solid var(--text-dark);
            margin-bottom: 8px;
        }

        .signature-text {
            font-size: 12px;
            font-weight: 700;
            color: var(--text-dark);
        }

        .system-info {
            text-align: center;
            font-size: 10px;
            color: var(--text-muted);
            margin-top: 40px;
            font-style: italic;
        }

        @media print {
            body { padding: 0; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="college-info">
            <h1>JAIN COLLEGE OF ENGINEERING AND RESEARCH</h1>
            <p>Admission & Examination Board</p>
            <div class="document-title">Admission Acknowledgment Request</div>
            <p>Academic Session: ${academicYear}</p>
            <p style="margin-top: 15px; font-weight: 700;">Application ID: #${student.id}</p>
        </div>
        <div class="profile-photo">
            <img src="${photo}" alt="Student Photo">
        </div>
    </div>

    <div class="section">
        <div class="section-header">
            <h2>Course & Admission Details</h2>
        </div>
        <div class="data-grid">
            <div class="data-item">
                <span class="label">Admission Type</span>
                <span class="value">${student.admissionType || 'N/A'}</span>
            </div>
            <div class="data-item">
                <span class="label">Course / Branch</span>
                <span class="value">${student.branch?.name || 'N/A'}</span>
            </div>
            <div class="data-item">
                <span class="label">Admission Status</span>
                <span class="value" style="color: green;">${student.status}</span>
            </div>
            <div class="data-item">
                <span class="label">Submission Date</span>
                <span class="value">${date}</span>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-header">
            <h2>Personal Information</h2>
        </div>
        <div class="data-grid">
            <div class="data-item">
                <span class="label">Full Name</span>
                <span class="value">${personal.fullName || 'N/A'}</span>
            </div>
            <div class="data-item">
                <span class="label">Date of Birth</span>
                <span class="value">${personal.dateOfBirth ? new Date(personal.dateOfBirth).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div class="data-item">
                <span class="label">Gender</span>
                <span class="value">${personal.gender || 'N/A'}</span>
            </div>
            <div class="data-item">
                <span class="label">Category / Caste</span>
                <span class="value">${personal.category || 'N/A'}</span>
            </div>
            <div class="data-item">
                <span class="label">Religion</span>
                <span class="value">${personal.religion || 'N/A'}</span>
            </div>
            <div class="data-item">
                <span class="label">Nationality</span>
                <span class="value">${personal.nationality || 'N/A'}</span>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-header">
            <h2>Parent / Guardian Details</h2>
        </div>
        <div class="data-grid">
            <div class="data-item">
                <span class="label">Father's Name</span>
                <span class="value">${parent.fatherName || 'N/A'}</span>
            </div>
            <div class="data-item">
                <span class="label">Mother's Name</span>
                <span class="value">${parent.motherName || 'N/A'}</span>
            </div>
            <div class="data-item">
                <span class="label">Primary Contact</span>
                <span class="value">${parent.parentMobile || 'N/A'}</span>
            </div>
            <div class="data-item">
                <span class="label">Annual Income</span>
                <span class="value">${parent.annualIncome ? '₹' + parent.annualIncome : 'N/A'}</span>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-header">
            <h2>Contact Address</h2>
        </div>
        <div class="data-grid">
            <div class="data-item full-width">
                <span class="label">Correspondence Address</span>
                <span class="value">${address.Address || 'N/A'}, ${address.City}, ${address.district_studentaddress_DistrictIdTodistrict?.name}, ${address.Pincode}</span>
            </div>
            <div class="data-item full-width">
                <span class="label">Permanent Address</span>
                <span class="value">${address.permanentAddress || 'N/A'}, ${address.permanentCity}, ${address.district_studentaddress_permanentDistrictIdTodistrict?.name}, ${address.permanentPincode}</span>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-header">
            <h2>Academic Qualification</h2>
        </div>
        <div class="data-grid">
            <div class="data-item">
                <span class="label">SSLC / Xth Board</span>
                <span class="value">${academic.sslcBoard || 'N/A'}</span>
            </div>
            <div class="data-item">
                <span class="label">SSLC / Xth Percentage</span>
                <span class="value">${academic.sslcPercentage ? academic.sslcPercentage + '%' : 'N/A'}</span>
            </div>
            <div class="data-item">
                <span class="label">PUC / XIIth Board</span>
                <span class="value">${academic.pucBoard || 'N/A'}</span>
            </div>
            <div class="data-item">
                <span class="label">PUC / XIIth Aggregate</span>
                <span class="value">${academic.pucAggregate || academic.pucPercentage ? (academic.pucAggregate || academic.pucPercentage) + '%' : 'N/A'}</span>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-header">
            <h2>Documents Checklist</h2>
        </div>
        <div class="data-grid" style="grid-template-columns: 1fr 1fr 1fr;">
            <div class="data-item">
                <span class="label">Personal Photo</span>
                <span class="value">${docs.photo ? '✓ Verified' : '✗ Pending'}</span>
            </div>
            <div class="data-item">
                <span class="label">Signature</span>
                <span class="value">${docs.signature ? '✓ Verified' : '✗ Pending'}</span>
            </div>
            <div class="data-item">
                <span class="label">Marks Cards</span>
                <span class="value">${docs.sslcMarkscard ? '✓ Verified' : '✗ Pending'}</span>
            </div>
        </div>
    </div>

    <div class="footer">
        <div class="signature-box">
            <div class="signature-line"></div>
            <span class="signature-text">Student Signature</span>
        </div>
        <div class="signature-box">
            <div class="signature-line"></div>
            <span class="signature-text">Authorized Signatory</span>
        </div>
    </div>

    <div class="system-info">
        This is a computer-generated admission acknowledgment. Printed on: ${new Date().toLocaleString('en-IN')}
    </div>
</body>
</html>
    `;
};
exports.getAdmissionTemplate = getAdmissionTemplate;
