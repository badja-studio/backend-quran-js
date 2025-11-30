const exportUseCase = require('../usecase/export.usecase');

class ExportController {
    // Export participants to Excel
    async exportParticipantsExcel(req, res) {
        try {
            const filters = req.query;
            const workbook = await exportUseCase.generateParticipantsExcel(filters);

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=data-peserta-${new Date().toISOString().split('T')[0]}.xlsx`);

            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            console.error('Error in exportParticipantsExcel:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to export participants to Excel'
            });
        }
    }

    // Export participants to PDF (Excel data rendered as PDF)
    async exportParticipantsPDF(req, res) {
        try {
            const filters = req.query;
            
            // Generate PDF from Excel data using HTML conversion
            const pdfBuffer = await exportUseCase.generateParticipantsPDFFromExcel(filters);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=data-peserta-${new Date().toISOString().split('T')[0]}.pdf`);

            res.send(pdfBuffer);
        } catch (error) {
            console.error('Error in exportParticipantsPDF:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to export participants to PDF'
            });
        }
    }

    // Export assessors to Excel
    async exportAssessorsExcel(req, res) {
        try {
            const filters = req.query;
            const workbook = await exportUseCase.generateAssessorsExcel(filters);

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=data-asesor-${new Date().toISOString().split('T')[0]}.xlsx`);

            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            console.error('Error in exportAssessorsExcel:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to export assessors to Excel'
            });
        }
    }

    // Export assessors to PDF (Excel data rendered as PDF)
    async exportAssessorsPDF(req, res) {
        try {
            const filters = req.query;
            
            // Generate PDF from Excel data using HTML conversion
            const pdfBuffer = await exportUseCase.generateAssessorsPDFFromExcel(filters);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=data-asesor-${new Date().toISOString().split('T')[0]}.pdf`);

            res.send(pdfBuffer);
        } catch (error) {
            console.error('Error in exportAssessorsPDF:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to export assessors to PDF'
            });
        }
    }

    // Export assessments to Excel
    async exportAssessmentsExcel(req, res) {
        try {
            const filters = req.query;
            const workbook = await exportUseCase.generateAssessmentsExcel(filters);

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=data-hasil-asesmen-${new Date().toISOString().split('T')[0]}.xlsx`);

            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            console.error('Error in exportAssessmentsExcel:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to export assessments to Excel'
            });
        }
    }

    // Export assessments to PDF (Excel data rendered as PDF)
    async exportAssessmentsPDF(req, res) {
        try {
            const filters = req.query;
            
            // Generate PDF from Excel data using HTML conversion
            const pdfBuffer = await exportUseCase.generateAssessmentsPDFFromExcel(filters);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=data-hasil-asesmen-${new Date().toISOString().split('T')[0]}.pdf`);

            res.send(pdfBuffer);
        } catch (error) {
            console.error('Error in exportAssessmentsPDF:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to export assessments to PDF'
            });
        }
    }

    // Export participants by status (not assessed)
    async exportParticipantsNotAssessedExcel(req, res) {
        try {
            const filters = { 
                ...req.query,
                status: 'BELUM'
            };
            const workbook = await exportUseCase.generateParticipantsExcel(filters);

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=data-peserta-belum-asesmen-${new Date().toISOString().split('T')[0]}.xlsx`);

            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            console.error('Error in exportParticipantsNotAssessedExcel:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to export not assessed participants to Excel'
            });
        }
    }

    async exportParticipantsNotAssessedPDF(req, res) {
        try {
            const filters = { 
                ...req.query,
                status: 'BELUM'
            };
            const pdfBuffer = await exportUseCase.generateParticipantsPDFFromExcel(filters);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=data-peserta-belum-asesmen-${new Date().toISOString().split('T')[0]}.pdf`);

            res.send(pdfBuffer);
        } catch (error) {
            console.error('Error in exportParticipantsNotAssessedPDF:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to export not assessed participants to PDF'
            });
        }
    }

    // Export participants ready to assess
    async exportParticipantsReadyToAssessExcel(req, res) {
        try {
            const filters = { 
                ...req.query,
                status: 'BELUM',
                hasAssessor: true // participants with assigned assessor
            };
            const workbook = await exportUseCase.generateParticipantsExcel(filters);

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=data-peserta-siap-asesmen-${new Date().toISOString().split('T')[0]}.xlsx`);

            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            console.error('Error in exportParticipantsReadyToAssessExcel:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to export ready to assess participants to Excel'
            });
        }
    }

    async exportParticipantsReadyToAssessPDF(req, res) {
        try {
            const filters = { 
                ...req.query,
                status: 'BELUM',
                hasAssessor: true
            };
            const pdfBuffer = await exportUseCase.generateParticipantsPDFFromExcel(filters);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=data-peserta-siap-asesmen-${new Date().toISOString().split('T')[0]}.pdf`);

            res.send(pdfBuffer);
        } catch (error) {
            console.error('Error in exportParticipantsReadyToAssessPDF:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to export ready to assess participants to PDF'
            });
        }
    }
}

module.exports = new ExportController();
