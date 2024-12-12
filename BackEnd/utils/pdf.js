const PDFDocument = require("pdfkit");
const innovateLogo =
  "https://res.cloudinary.com/dvhfgstud/image/upload/v1733239402/467198922_588876523648635_1569889043517254517_n_nnoyav.jpg";
const buksuLogo =
  "https://res.cloudinary.com/dvhfgstud/image/upload/v1733117339/buksu-logo-min-1024x1024_ye6b58.png";
class InspectionPDF {
  constructor() {
    this.doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });
  }

  footer(officerName) {
    let startx = 50;
    let startY = this.doc.page.height - 100;
    this.doc
      .font("Helvetica")
      .fontSize(12)
      .text("Marilou O. Espina", startx, startY - 15, {
        align: "center",
        width: 200,
      });
    this.doc
      .moveTo(startx, startY)
      .lineTo(startx + 200, startY)
      .stroke();
    this.doc
      .font("Helvetica")
      .fontSize(10)
      .text("Department Dean", startx, startY + 5, {
        align: "center",
        width: 200,
      });

    this.doc
      .font("Helvetica")
      .fontSize(10)
      .text("(Signature over Printed Name)", startx, startY + 20, {
        align: "center",
        width: 200,
      });

    startx = 350;
    startY = this.doc.page.height - 100;
    this.doc
      .font("Helvetica")
      .fontSize(12)
      .text(officerName, startx, startY - 15, {
        align: "center",
        width: 200,
      });
    this.doc
      .moveTo(startx, startY)
      .lineTo(startx + 200, startY)
      .stroke();
    this.doc
      .font("Helvetica")
      .fontSize(10)
      .text("Enrollment Officer", startx, startY + 5, {
        align: "center",
        width: 200,
      });

    this.doc
      .font("Helvetica")
      .fontSize(10)
      .text("(Signature over Printed Name)", startx, startY + 20, {
        align: "center",
        width: 200,
      });
  }

  async addHeader(
    date,
    currentSemester,
    totalStudents,
    totalComplete,
    totalIncomplete,
    totalRequirements,
    totalFirstYear,
    totalSecondYear,
    totalThirdYear,
    totalFourthYear,
    regularStudents,
    irregularStudents,
    LOA,
    totalBSITStudents,
    totalBSEMCStudents,
    totalArchiveStudents
  ) {
    this.doc
      .image("log buk.png", 50, 50, { width: 50 })
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("BUKIDNON STATE UNIVERSITY", 200, 50)
      .font("Helvetica")
      .fontSize(10)
      .text("Malaybalay City, Bukidnon 8700", 220, 65)
      .text("Tel (088) 813-5661 to 5663; Telefax (088) 813-2717, ", 130, 80)
      .fillColor("blue")
      .text("www.buksu.edu.ph", 360, 80, { link: "http://www.buksu.edu.ph" })

      .moveTo(50, 110)
      .lineTo(550, 110)
      .lineWidth(3)
      .stroke();
    this.doc.image("it Logo.png", 480, 45, { width: 60 });
    this.doc
      .font("Helvetica-Bold")
      .fillColor("black")
      .fontSize(17)
      .text("Student Information Report Summary", 50, 150)
      .font("Helvetica")
      .fontSize(10)
      .text(`School Year: ${currentSemester}`, 50, 125)
      .text(`Date: ${date}`, 350, 125)
      .fontSize(13)
      .text("Report Table: ", 50, 180);
    const tableData = [
      ["Title", "Total"],
      [`Students in ${currentSemester}`, totalStudents],
      ["Students with complete requirements", totalComplete],
      ["Students with incomplete requirements", totalIncomplete],
      ["Requirements submitted", totalRequirements],
      ["First year students ", totalFirstYear],
      ["Second year students", totalSecondYear],
      ["Third year students", totalThirdYear],
      ["Fourth year students", totalFourthYear],
      ["Regular students", regularStudents],
      ["Irregular students", irregularStudents],
      ["LOA students", LOA],
      ["BSEMC students", totalBSEMCStudents],
      ["BSIT students", totalBSITStudents],
      ["Archived students", totalArchiveStudents],
    ];

    const startX = 50;
    const startY = 200;
    const columnWidths = [396, 100];
    const rowHeight = 30;

    for (let i = 0; i < tableData.length; i++) {
      const rowY = startY + i * rowHeight;

      if (i === 0) {
        this.doc
          .rect(
            startX,
            rowY,
            columnWidths.reduce((a, b) => a + b),
            rowHeight
          )
          .fill("#cccccc");
        this.doc.fillColor("black");
      }

      for (let j = 0; j < tableData[i].length; j++) {
        const columnX =
          startX + columnWidths.slice(0, j).reduce((a, b) => a + b, 0);
        this.doc.lineWidth(0.5);
        this.doc
          .font("Helvetica")
          .fontSize(10)
          .text(tableData[i][j], columnX + 5, rowY + 10, {
            width: columnWidths[j] - 10,
            align: "left",
          });
      }

      this.doc
        .rect(
          startX,
          rowY,
          columnWidths.reduce((a, b) => a + b),
          rowHeight
        )
        .stroke();
    }

    let currentX = startX;
    columnWidths.forEach((width) => {
      this.doc
        .moveTo(currentX, startY)
        .lineTo(currentX, startY + tableData.length * rowHeight)
        .stroke();
      currentX += width;
    });

    return this;
  }
}
const Semester = require("../models/schoolYearModel");
const Requirements = require("../models/requirementsModel");
async function generatePostInspectionPdf(req, res) {
  const officerName = req.user.name;
  try {
    const date = new Date().toLocaleDateString();
    const semester = await Semester.find()
      .sort({ createdAt: -1 })
      .populate("students");
    console.log(semester);
    const currentSemester =
      "S.Y " +
      semester[0].schoolYear +
      " " +
      semester[0].semester +
      " Semester";
    const requirements = await Requirements.find();
    const students = semester[0].students;
    const totalStudents = students.length;
    const totalComplete = students.filter(
      (student) => student.isComplete === true
    ).length;
    const totalIncomplete = students.filter(
      (student) => student.isComplete === false
    ).length;
    const totalRequirements = requirements.length;
    const totalFirstYear = students.filter(
      (student) => student.year === "1st Year"
    ).length;
    const totalSecondYear = students.filter(
      (student) => student.year === "2nd Year"
    ).length;
    const totalThirdYear = students.filter(
      (student) => student.year === "3rd Year"
    ).length;
    const totalFourthYear = students.filter(
      (student) => student.year === "4th Year"
    ).length;
    const regularStudents = students.filter(
      (student) => student.status === "Regular"
    ).length;
    const irregularStudents = students.filter(
      (student) => student.status === "Irregular"
    ).length;
    const LOA = students.filter((student) => student.status === "LOA").length;
    const totalBSITStudents = students.filter(
      (student) => student.program === "BSIT"
    ).length;
    const totalBSEMCStudents = students.filter(
      (student) => student.program === "BSEMC"
    ).length;
    const totalArchiveStudents = students.filter(
      (student) => student.isArchived === true
    ).length;
    const pdf = new InspectionPDF();
    pdf.addHeader(
      date,
      currentSemester,
      totalStudents,
      totalComplete,
      totalIncomplete,
      totalRequirements,
      totalFirstYear,
      totalSecondYear,
      totalThirdYear,
      totalFourthYear,
      regularStudents,
      irregularStudents,
      LOA,
      totalBSITStudents,
      totalBSEMCStudents,
      totalArchiveStudents
    );
    pdf.footer(officerName);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=student_information_report_summary.pdf"
    );
    pdf.doc.pipe(res);
    pdf.doc.end();
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

module.exports = {
  generatePostInspectionPdf,
};
