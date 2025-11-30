const ExcelJS = require('exceljs');
const puppeteer = require('puppeteer');
const participantRepository = require('../repository/participant.repository');
const assessorRepository = require('../repository/assessor.repository');
const assessmentRepository = require('../repository/assessment.repository');

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

            const browser = await puppeteer.launch({
                headless: 'new',
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();
            await page.setContent(html);
            
            const pdf = await page.pdf({
                format: 'A4',
                landscape: true,
                margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
            });
            
            await browser.close();
            return pdf;
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

            const browser = await puppeteer.launch({
                headless: 'new',
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();
            await page.setContent(html);
            
            const pdf = await page.pdf({
                format: 'A4',
                landscape: true,
                margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
            });
            
            await browser.close();
            return pdf;
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

            const browser = await puppeteer.launch({
                headless: 'new',
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();
            await page.setContent(html);
            
            const pdf = await page.pdf({
                format: 'A4',
                landscape: true,
                margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
            });
            
            await browser.close();
            return pdf;
        } catch (error) {
            throw new Error(`Failed to generate assessments PDF: ${error.message}`);
        }
    }
}

module.exports = new ExportUseCase();
