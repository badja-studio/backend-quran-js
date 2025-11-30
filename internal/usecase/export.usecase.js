const ExcelJS = require('exceljs');
const puppeteer = require('puppeteer');
const participantRepository = require('../repository/participant.repository');
const assessorRepository = require('../repository/assessor.repository');
const assessmentRepository = require('../repository/assessment.repository');

// Helper function for Puppeteer configuration
const getPuppeteerConfig = () => ({
    headless: true, // Use legacy headless mode
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser',
    timeout: 20000,
    args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--single-process',
        '--no-zygote',
        '--disable-web-security',
        '--memory-pressure-off'
    ]
});

// Helper function to safely create PDF with retry
const createPdfWithRetry = async (html, retries = 3) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        let browser = null;
        let page = null;
        
        try {
            console.log(`PDF generation attempt ${attempt}/${retries}`);
            
            browser = await puppeteer.launch(getPuppeteerConfig());
            page = await browser.newPage();
            
            await page.setContent(html);
            
            const pdf = await page.pdf({
                format: 'A4',
                landscape: true,
                margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
            });
            
            return pdf;
            
        } catch (error) {
            console.error(`PDF generation attempt ${attempt} failed:`, error.message);
            
            if (attempt === retries) {
                throw new Error(`Failed to generate PDF after ${retries} attempts: ${error.message}`);
            }
            
            // Wait longer before retry
            await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
            
        } finally {
            // Always cleanup
            try {
                if (page) await page.close();
                if (browser) await browser.close();
            } catch (cleanupError) {
                console.warn('Cleanup error:', cleanupError.message);
            }
        }
    }
};

class ExportUseCase {
    // Generate Excel for participants
    async generateParticipantsExcel(filters = {}) {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Data Peserta');

            // Set header
            const headers = [
                'No Akun', 'NIP', 'Nama', 'Jenis Kelamin', 'Tempat Lahir',
                'Jabatan', 'Jenjang', 'Level', 'Provinsi', 'Kab/Kota',
                'Sekolah', 'Pendidikan', 'Program Studi', 'Perguruan Tinggi',
                'Jenis PT', 'Tahun Lulus', 'Status', 'Usia', 'Pegawai'
            ];

            worksheet.addRow(headers);

            // Style header
            const headerRow = worksheet.getRow(1);
            headerRow.eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF4F81BD' }
                };
                cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });

            // Get data
            const participants = await participantRepository.findAll({
                limit: 999999, // Get all data
                ...filters
            });

            // Add data rows
            participants.data.forEach((participant, index) => {
                const row = [
                    participant.no_akun || '',
                    participant.nip || '',
                    participant.nama || '',
                    participant.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan',
                    participant.tempat_lahir || '',
                    participant.jabatan || '',
                    participant.jenjang || '',
                    participant.level || '',
                    participant.provinsi || '',
                    participant.kab_kota || '',
                    participant.sekolah || '',
                    participant.pendidikan || '',
                    participant.prodi || '',
                    participant.perguruan_tinggi || '',
                    participant.jenis_pt || '',
                    participant.tahun_lulus || '',
                    participant.status || '',
                    participant.usia || '',
                    participant.pegawai || ''
                ];
                worksheet.addRow(row);
            });

            // Auto-fit columns
            worksheet.columns.forEach(column => {
                column.width = 15;
            });

            return workbook;
        } catch (error) {
            throw new Error(`Failed to generate participants Excel: ${error.message}`);
        }
    }

    // Generate Excel for assessors
    async generateAssessorsExcel(filters = {}) {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Data Asesor');

            const headers = [
                'Nama', 'Username', 'No Telepon', 'Email', 'Link Grup WA',
                'Total Peserta Belum Asesmen', 'Total Peserta Selesai Asesmen'
            ];

            worksheet.addRow(headers);

            // Style header
            const headerRow = worksheet.getRow(1);
            headerRow.eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF4F81BD' }
                };
                cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });

            const assessors = await assessorRepository.findAll({
                limit: 999999,
                ...filters
            });

            assessors.data.forEach((assessor) => {
                const row = [
                    assessor.name || '',
                    assessor.username || '',
                    assessor.no_telepon || '',
                    assessor.email || '',
                    assessor.link_grup_wa || '',
                    assessor.total_peserta_belum_asesmen || 0,
                    assessor.total_peserta_selesai_asesmen || 0
                ];
                worksheet.addRow(row);
            });

            worksheet.columns.forEach(column => {
                column.width = 20;
            });

            return workbook;
        } catch (error) {
            throw new Error(`Failed to generate assessors Excel: ${error.message}`);
        }
    }

    // Generate Excel for assessments
    async generateAssessmentsExcel(filters = {}) {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Data Hasil Asesmen');

            const headers = [
                'Nama Peserta', 'NIP', 'Nama Asesor', 'Huruf', 'Nilai', 'Kategori', 'Tanggal Asesmen'
            ];

            worksheet.addRow(headers);

            // Style header
            const headerRow = worksheet.getRow(1);
            headerRow.eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF4F81BD' }
                };
                cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
            });

            const assessments = await assessmentRepository.findAll({
                limit: 999999,
                ...filters
            });

            assessments.data.forEach((assessment) => {
                const row = [
                    assessment.peserta?.nama || '',
                    assessment.peserta?.nip || '',
                    assessment.assessor?.name || '',
                    assessment.huruf || '',
                    assessment.nilai || '',
                    assessment.kategori || '',
                    assessment.createdAt ? new Date(assessment.createdAt).toLocaleDateString('id-ID') : ''
                ];
                worksheet.addRow(row);
            });

            worksheet.columns.forEach(column => {
                column.width = 15;
            });

            return workbook;
        } catch (error) {
            throw new Error(`Failed to generate assessments Excel: ${error.message}`);
        }
    }

    // Generate PDF for participants
    async generateParticipantsPDF(filters = {}) {
        try {
            const participants = await participantRepository.findAll({
                limit: 999999,
                ...filters
            });

            const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Data Peserta</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        h1 { text-align: center; color: #333; margin-bottom: 30px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 10px; }
                        th { background-color: #4F81BD; color: white; font-weight: bold; }
                        tr:nth-child(even) { background-color: #f2f2f2; }
                        .summary { margin-bottom: 20px; }
                        .summary span { font-weight: bold; color: #4F81BD; }
                    </style>
                </head>
                <body>
                    <h1>LAPORAN DATA PESERTA</h1>
                    <div class="summary">
                        <p>Total Peserta: <span>${participants.data.length}</span></p>
                        <p>Tanggal Generate: <span>${new Date().toLocaleDateString('id-ID')}</span></p>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>No Akun</th>
                                <th>NIP</th>
                                <th>Nama</th>
                                <th>Jenis Kelamin</th>
                                <th>Jabatan</th>
                                <th>Jenjang</th>
                                <th>Provinsi</th>
                                <th>Sekolah</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${participants.data.map((participant, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${participant.no_akun || '-'}</td>
                                    <td>${participant.nip || '-'}</td>
                                    <td>${participant.nama || '-'}</td>
                                    <td>${participant.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                                    <td>${participant.jabatan || '-'}</td>
                                    <td>${participant.jenjang || '-'}</td>
                                    <td>${participant.provinsi || '-'}</td>
                                    <td>${participant.sekolah || '-'}</td>
                                    <td>${participant.status || '-'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
                </html>
            `;

            return await createPdfWithRetry(html);
        } catch (error) {
            throw new Error(`Failed to generate participants PDF: ${error.message}`);
        }
    }

    // Generate PDF for assessors
    async generateAssessorsPDF(filters = {}) {
        try {
            const assessors = await assessorRepository.findAll({
                limit: 999999,
                ...filters
            });

            const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Data Asesor</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        h1 { text-align: center; color: #333; margin-bottom: 30px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 10px; }
                        th { background-color: #4F81BD; color: white; font-weight: bold; }
                        tr:nth-child(even) { background-color: #f2f2f2; }
                        .summary { margin-bottom: 20px; }
                        .summary span { font-weight: bold; color: #4F81BD; }
                    </style>
                </head>
                <body>
                    <h1>LAPORAN DATA ASESOR</h1>
                    <div class="summary">
                        <p>Total Asesor: <span>${assessors.data.length}</span></p>
                        <p>Tanggal Generate: <span>${new Date().toLocaleDateString('id-ID')}</span></p>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Nama</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>No Telepon</th>
                                <th>Belum Asesmen</th>
                                <th>Selesai Asesmen</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${assessors.data.map((assessor, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${assessor.name || '-'}</td>
                                    <td>${assessor.username || '-'}</td>
                                    <td>${assessor.email || '-'}</td>
                                    <td>${assessor.no_telepon || '-'}</td>
                                    <td>${assessor.total_peserta_belum_asesmen || 0}</td>
                                    <td>${assessor.total_peserta_selesai_asesmen || 0}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
                </html>
            `;

            return await createPdfWithRetry(html);
        } catch (error) {
            throw new Error(`Failed to generate assessors PDF: ${error.message}`);
        }
    }

    // Generate PDF for assessments
    async generateAssessmentsPDF(filters = {}) {
        try {
            const assessments = await assessmentRepository.findAll({
                limit: 999999,
                ...filters
            });

            const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Data Hasil Asesmen</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        h1 { text-align: center; color: #333; margin-bottom: 30px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 10px; }
                        th { background-color: #4F81BD; color: white; font-weight: bold; }
                        tr:nth-child(even) { background-color: #f2f2f2; }
                        .summary { margin-bottom: 20px; }
                        .summary span { font-weight: bold; color: #4F81BD; }
                    </style>
                </head>
                <body>
                    <h1>LAPORAN HASIL ASESMEN</h1>
                    <div class="summary">
                        <p>Total Asesmen: <span>${assessments.data.length}</span></p>
                        <p>Tanggal Generate: <span>${new Date().toLocaleDateString('id-ID')}</span></p>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Nama Peserta</th>
                                <th>NIP</th>
                                <th>Nama Asesor</th>
                                <th>Huruf</th>
                                <th>Nilai</th>
                                <th>Kategori</th>
                                <th>Tanggal</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${assessments.data.map((assessment, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${assessment.peserta?.nama || '-'}</td>
                                    <td>${assessment.peserta?.nip || '-'}</td>
                                    <td>${assessment.assessor?.name || '-'}</td>
                                    <td>${assessment.huruf || '-'}</td>
                                    <td>${assessment.nilai || '-'}</td>
                                    <td>${assessment.kategori || '-'}</td>
                                    <td>${assessment.createdAt ? new Date(assessment.createdAt).toLocaleDateString('id-ID') : '-'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
                </html>
            `;

            return await createPdfWithRetry(html);
        } catch (error) {
            throw new Error(`Failed to generate assessments PDF: ${error.message}`);
        }
    }

    // Generate PDF from Excel data using HTML conversion (more stable)
    async generateAssessmentsPDFFromExcel(filters = {}) {
        try {
            // Get assessments data - same as Excel generation
            const assessments = await assessmentRepository.findAll({
                limit: 999999,
                ...filters
            });

            // Create simple HTML table from the data
            const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Data Hasil Asesmen</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; font-weight: bold; }
                        tr:nth-child(even) { background-color: #f9f9f9; }
                        h1 { color: #333; text-align: center; }
                    </style>
                </head>
                <body>
                    <h1>Data Hasil Asesmen</h1>
                    <p>Total data: ${assessments.data.length} records</p>
                    <p>Generated on: ${new Date().toLocaleDateString('id-ID')}</p>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Nama Peserta</th>
                                <th>NIP Peserta</th>
                                <th>Nama Asesor</th>
                                <th>Email Asesor</th>
                                <th>Huruf</th>
                                <th>Nilai</th>
                                <th>Kategori</th>
                                <th>Tanggal</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${assessments.data.map((assessment, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${assessment.peserta?.nama || '-'}</td>
                                    <td>${assessment.peserta?.nip || '-'}</td>
                                    <td>${assessment.assessor?.name || '-'}</td>
                                    <td>${assessment.assessor?.email || '-'}</td>
                                    <td>${assessment.huruf || '-'}</td>
                                    <td>${assessment.nilai || '-'}</td>
                                    <td>${assessment.kategori || '-'}</td>
                                    <td>${assessment.createdAt ? new Date(assessment.createdAt).toLocaleDateString('id-ID') : '-'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
                </html>
            `;

            // Use PDFKit for stable PDF generation
            const PDFDocument = require('pdfkit');
            const chunks = [];
            const doc = new PDFDocument({ 
                layout: 'landscape',
                margin: 50
            });

            // Collect PDF data
            doc.on('data', chunk => chunks.push(chunk));
            
            return new Promise((resolve, reject) => {
                doc.on('end', () => {
                    resolve(Buffer.concat(chunks));
                });

                doc.on('error', reject);

                // Header with logo area and styling
                doc.fontSize(20)
                   .fillColor('#1a472a')
                   .font('Helvetica-Bold')
                   .text('LAPORAN DATA HASIL ASESMEN AL-QURAN', { align: 'center' });
                
                doc.fontSize(14)
                   .fillColor('#2d5a2d')
                   .font('Helvetica')
                   .text('Sistem Penilaian dan Evaluasi Kemampuan Baca Al-Quran', { align: 'center' });
                
                doc.moveDown(1);
                
                // Info section with border
                const infoY = doc.y;
                doc.rect(50, infoY, 720, 60)
                   .fillColor('#f8f9fa')
                   .fill()
                   .stroke('#dee2e6');
                
                doc.fontSize(11)
                   .fillColor('#495057')
                   .font('Helvetica')
                   .text(`Total Data: ${assessments.data.length} records`, 70, infoY + 15)
                   .text(`Tanggal Generate: ${new Date().toLocaleDateString('id-ID')}`, 70, infoY + 30)
                   .text(`Waktu Generate: ${new Date().toLocaleTimeString('id-ID')}`, 70, infoY + 45);
                
                doc.y = infoY + 80;
                
                // Table styling
                const tableTop = doc.y;
                const itemHeight = 30;
                const cols = [
                    { header: 'No', x: 50, width: 35 },
                    { header: 'Nama Peserta', x: 85, width: 110 },
                    { header: 'NIP', x: 195, width: 75 },
                    { header: 'Nama Asesor', x: 270, width: 95 },
                    { header: 'Email Asesor', x: 365, width: 110 },
                    { header: 'Huruf', x: 475, width: 45 },
                    { header: 'Nilai', x: 520, width: 45 },
                    { header: 'Kategori', x: 565, width: 75 },
                    { header: 'Tanggal', x: 640, width: 80 }
                ];
                
                // Draw header with gradient effect
                doc.rect(50, tableTop, 720, itemHeight)
                   .fillColor('#28a745')
                   .fill();
                
                // Header text
                doc.fillColor('white')
                   .fontSize(10)
                   .font('Helvetica-Bold');
                
                cols.forEach(col => {
                    doc.text(col.header, col.x + 3, tableTop + 10, {
                        width: col.width - 6,
                        align: 'center'
                    });
                });
                
                // Table rows with better styling
                let currentY = tableTop + itemHeight;
                
                assessments.data.forEach((assessment, index) => {
                    // Check for new page
                    if (currentY > 500) {
                        doc.addPage();
                        currentY = 50;
                        
                        // Redraw header on new page
                        doc.rect(50, currentY, 720, itemHeight)
                           .fillColor('#28a745')
                           .fill();
                        
                        doc.fillColor('white')
                           .fontSize(10)
                           .font('Helvetica-Bold');
                        
                        cols.forEach(col => {
                            doc.text(col.header, col.x + 3, currentY + 10, {
                                width: col.width - 6,
                                align: 'center'
                            });
                        });
                        
                        currentY += itemHeight;
                    }
                    
                    // Alternating row colors
                    const bgColor = index % 2 === 0 ? '#ffffff' : '#f8f9fa';
                    doc.rect(50, currentY, 720, itemHeight)
                       .fillColor(bgColor)
                       .fill()
                       .stroke('#e9ecef');
                    
                    // Row data with better formatting
                    doc.fillColor('#212529')
                       .fontSize(9)
                       .font('Helvetica');
                    
                    const rowData = [
                        (index + 1).toString(),
                        assessment.peserta?.nama || '-',
                        assessment.peserta?.nip || '-',
                        assessment.assessor?.name || '-',
                        assessment.assessor?.email || '-',
                        assessment.huruf || '-',
                        assessment.nilai?.toString() || '-',
                        assessment.kategori || '-',
                        assessment.createdAt ? new Date(assessment.createdAt).toLocaleDateString('id-ID') : '-'
                    ];
                    
                    cols.forEach((col, colIndex) => {
                        const text = rowData[colIndex];
                        const isNumber = colIndex === 0 || colIndex === 6; // No and Nilai columns
                        
                        doc.text(text, col.x + 3, currentY + 10, {
                            width: col.width - 6,
                            align: isNumber ? 'center' : 'left',
                            ellipsis: true
                        });
                    });
                    
                    currentY += itemHeight;
                });
                
                // Footer section
                const footerY = doc.page.height - 80;
                doc.rect(50, footerY, 720, 50)
                   .fillColor('#f8f9fa')
                   .fill()
                   .stroke('#dee2e6');
                
                doc.fontSize(9)
                   .fillColor('#6c757d')
                   .font('Helvetica')
                   .text('Generated by Sistem Penilaian Al-Quran', 70, footerY + 15)
                   .text(`© ${new Date().getFullYear()} - Laporan dibuat pada ${new Date().toLocaleString('id-ID')}`, 70, footerY + 30);

                doc.end();
            });

        } catch (error) {
            throw new Error(`Failed to generate assessments PDF from Excel data: ${error.message}`);
        }
    }

    // Generate participants PDF from Excel data
    async generateParticipantsPDFFromExcel(filters = {}) {
        try {
            const participantRepository = require('../repository/participant.repository');
            const participants = await participantRepository.findAll({
                ...filters,
                limit: 999999,
                page: 1
            });

            const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Data Peserta</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; font-size: 10px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
                        th { background-color: #f2f2f2; font-weight: bold; }
                        tr:nth-child(even) { background-color: #f9f9f9; }
                        h1 { color: #333; text-align: center; font-size: 18px; }
                    </style>
                </head>
                <body>
                    <h1>Data Peserta</h1>
                    <p>Total data: ${participants.count} records</p>
                    <p>Generated on: ${new Date().toLocaleDateString('id-ID')}</p>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>No Akun</th>
                                <th>NIP</th>
                                <th>Nama</th>
                                <th>Jenis Kelamin</th>
                                <th>Tempat Lahir</th>
                                <th>Jabatan</th>
                                <th>Jenjang</th>
                                <th>Level</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${participants.data.map((participant, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${participant.no_akun || '-'}</td>
                                    <td>${participant.nip || '-'}</td>
                                    <td>${participant.nama || '-'}</td>
                                    <td>${participant.jenis_kelamin || '-'}</td>
                                    <td>${participant.tempat_lahir || '-'}</td>
                                    <td>${participant.jabatan || '-'}</td>
                                    <td>${participant.jenjang || '-'}</td>
                                    <td>${participant.level || '-'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
                </html>
            `;

            // Use PDFKit for stable PDF generation
            const PDFDocument = require('pdfkit');
            const chunks = [];
            const doc = new PDFDocument({ 
                layout: 'landscape',
                margin: 50
            });

            // Collect PDF data
            doc.on('data', chunk => chunks.push(chunk));
            
            return new Promise((resolve, reject) => {
                doc.on('end', () => {
                    resolve(Buffer.concat(chunks));
                });

                doc.on('error', reject);

                // Header styling
                doc.fontSize(18)
                   .fillColor('#1a472a')
                   .font('Helvetica-Bold')
                   .text('LAPORAN DATA PESERTA', { align: 'center' });
                
                doc.moveDown(0.5);
                
                // Info section
                doc.fontSize(11)
                   .fillColor('#495057')
                   .font('Helvetica')
                   .text(`Total Data: ${participants.count} records`)
                   .text(`Generated on: ${new Date().toLocaleDateString('id-ID')}`);
                
                doc.moveDown(1);
                
                // Simple table for participants
                participants.data.forEach((participant, index) => {
                    if (doc.y > 500) doc.addPage();
                    
                    doc.fontSize(10)
                       .fillColor('#212529')
                       .font('Helvetica')
                       .text(`${index + 1}. ${participant.nama} (${participant.nip})`, { align: 'left' });
                    doc.moveDown(0.3);
                });

                doc.end();
            });

        } catch (error) {
            throw new Error(`Failed to generate participants PDF from Excel data: ${error.message}`);
        }
    }

    // Generate assessors PDF from Excel data  
    async generateAssessorsPDFFromExcel(filters = {}) {
        try {
            const assessorRepository = require('../repository/assessor.repository');
            const assessors = await assessorRepository.findAll({
                ...filters,
                limit: 999999,
                page: 1
            });

            const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Data Asesor</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; font-weight: bold; }
                        tr:nth-child(even) { background-color: #f9f9f9; }
                        h1 { color: #333; text-align: center; }
                    </style>
                </head>
                <body>
                    <h1>Data Asesor</h1>
                    <p>Total data: ${assessors.count} records</p>
                    <p>Generated on: ${new Date().toLocaleDateString('id-ID')}</p>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Nama</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Spesialisasi</th>
                                <th>Tanggal Daftar</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${assessors.data.map((assessor, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${assessor.name || '-'}</td>
                                    <td>${assessor.email || '-'}</td>
                                    <td>${assessor.phone || '-'}</td>
                                    <td>${assessor.specialization || '-'}</td>
                                    <td>${assessor.createdAt ? new Date(assessor.createdAt).toLocaleDateString('id-ID') : '-'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
                </html>
            `;

            // Use PDFKit for stable PDF generation
            const PDFDocument = require('pdfkit');
            const chunks = [];
            const doc = new PDFDocument({ 
                layout: 'portrait',
                margin: 50
            });

            // Collect PDF data
            doc.on('data', chunk => chunks.push(chunk));
            
            return new Promise((resolve, reject) => {
                doc.on('end', () => {
                    resolve(Buffer.concat(chunks));
                });

                doc.on('error', reject);

                // Header styling
                doc.fontSize(18)
                   .fillColor('#1a472a')
                   .font('Helvetica-Bold')
                   .text('LAPORAN DATA ASESOR', { align: 'center' });
                
                doc.moveDown(0.5);
                
                // Info section
                doc.fontSize(11)
                   .fillColor('#495057')
                   .font('Helvetica')
                   .text(`Total Data: ${assessors.count} records`)
                   .text(`Generated on: ${new Date().toLocaleDateString('id-ID')}`);
                
                doc.moveDown(1);
                
                // Simple list for assessors
                assessors.data.forEach((assessor, index) => {
                    if (doc.y > 700) doc.addPage();
                    
                    doc.fontSize(10)
                       .fillColor('#212529')
                       .font('Helvetica')
                       .text(`${index + 1}. ${assessor.name} - ${assessor.email}`, { align: 'left' });
                    doc.moveDown(0.3);
                });

                doc.end();
            });

        } catch (error) {
            throw new Error(`Failed to generate assessors PDF from Excel data: ${error.message}`);
        }
    }
}

module.exports = new ExportUseCase();
