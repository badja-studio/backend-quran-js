/**
 * Comprehensive tests for scoring utility functions
 */

const {
    SCORING_RULES,
    normalizeCategoryName,
    calculateParticipantScores,
    formatScoresForAPI
} = require('../utils/scoring.utils');

describe('Scoring Utils', () => {
    describe('normalizeCategoryName', () => {
        test('should normalize makhraj categories', () => {
            expect(normalizeCategoryName('makhraj')).toBe('MAKHRAJ');
            expect(normalizeCategoryName('MAKHRAJ')).toBe('MAKHRAJ');
            expect(normalizeCategoryName('Makharijul Huruf')).toBe('MAKHRAJ');
        });

        test('should normalize ahkam categories', () => {
            expect(normalizeCategoryName('ahkam')).toBe('AHKAM');
            expect(normalizeCategoryName('tanaffus')).toBe('AHKAM');
            expect(normalizeCategoryName('izhhar')).toBe('AHKAM');
            expect(normalizeCategoryName("Ikhfa'")).toBe('AHKAM');
        });

        test('should normalize mad categories', () => {
            expect(normalizeCategoryName('mad')).toBe('MAD');
            expect(normalizeCategoryName('qashr')).toBe('MAD');
        });

        test('should normalize kelancaran categories', () => {
            expect(normalizeCategoryName('kelancaran')).toBe('KELANCARAN');
            expect(normalizeCategoryName('Tidak Lancar')).toBe('KELANCARAN');
            expect(normalizeCategoryName('Kurang Lancar')).toBe('KELANCARAN');
        });

        test('should normalize pengurangan categories', () => {
            expect(normalizeCategoryName('pengurangan')).toBe('PENGURANGAN');
            expect(normalizeCategoryName('Tidak Bisa Membaca')).toBe('PENGURANGAN');
        });
    });

    describe('calculateParticipantScores - Zero Errors', () => {
        test('should give full score (100) when all nilai = 0', () => {
            const assessments = [
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "د", kategori: "makhraj", nilai: 0 },
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "خ", kategori: "makhraj", nilai: 0 },
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "ح", kategori: "makhraj", nilai: 0 },
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Tanaffus", kategori: "ahkam", nilai: 0 },
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Izhhar", kategori: "ahkam", nilai: 0 },
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Qashr", kategori: "mad", nilai: 0 },
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Iysmam", kategori: "gharib", nilai: 0 },
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Tidak Lancar", kategori: "kelancaran", nilai: 0 },
            ];

            const result = calculateParticipantScores(assessments);
            
            expect(result.overallScore).toBe(100);
            expect(result.categoryScores.MAKHRAJ.finalScore).toBe(55.5);
            expect(result.categoryScores.AHKAM.finalScore).toBe(8);
            expect(result.categoryScores.MAD.finalScore).toBe(13.5);
            expect(result.categoryScores.GHARIB.finalScore).toBe(6);
            expect(result.categoryScores.KELANCARAN.finalScore).toBe(2.5);
        });

        test('should give 100 score for the provided user example with all nilai = 0', () => {
            const assessments = [
                {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"د","kategori":"makhraj","nilai":0},
                {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"خ","kategori":"makhraj","nilai":0},
                {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ح","kategori":"makhraj","nilai":0},
                {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ج","kategori":"makhraj","nilai":0},
                {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ث","kategori":"makhraj","nilai":0},
                {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ت","kategori":"makhraj","nilai":0},
                {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ب","kategori":"makhraj","nilai":0},
                {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ا","kategori":"makhraj","nilai":0},
                {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ط","kategori":"makhraj","nilai":0},
                {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ض","kategori":"makhraj","nilai":0},
                {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ص","kategori":"makhraj","nilai":0},
                {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ش","kategori":"makhraj","nilai":0},
                {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"س","kategori":"makhraj","nilai":0},
                {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ز","kategori":"makhraj","nilai":0},
                {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ر","kategori":"makhraj","nilai":0},
                {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ذ","kategori":"makhraj","nilai":0},
                {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"م","kategori":"makhraj","nilai":0},
                {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ل","kategori":"makhraj","nilai":0},
                {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ك","kategori":"makhraj","nilai":0},
                {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ق","kategori":"makhraj","nilai":0},
                {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ف","kategori":"makhraj","nilai":0},
                {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"غ","kategori":"makhraj","nilai":0},
                {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ع","kategori":"makhraj","nilai":0},
                {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ظ","kategori":"makhraj","nilai":0},
                {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ي","kategori":"makhraj","nilai":0},
                {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ء","kategori":"makhraj","nilai":0},
                {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"هـ","kategori":"makhraj","nilai":0},
                {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"و","kategori":"makhraj","nilai":0},
                {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ن","kategori":"makhraj","nilai":0},
                {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"Tanaffus","kategori":"ahkam","nilai":0},
                {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"Izhhar","kategori":"ahkam","nilai":0},
                {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"Ikhfa'","kategori":"ahkam","nilai":0},
                {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"Qashr","kategori":"mad","nilai":0},
                {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"Iysmam","kategori":"gharib","nilai":0},
                {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"Badal","kategori":"gharib","nilai":0},
                {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"Tidak Lancar","kategori":"kelancaran","nilai":0},
                {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"Kurang Lancar","kategori":"kelancaran","nilai":0},
                {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"Tidak Bisa Membaca","kategori":"pengurangan","nilai":0}
            ];

            const result = calculateParticipantScores(assessments);
            
            console.log('Full Result:', JSON.stringify(result, null, 2));
            
            expect(result.overallScore).toBe(100);
            expect(result.categoryScores.MAKHRAJ.finalScore).toBe(55.5);
            expect(result.categoryScores.MAKHRAJ.itemCount).toBe(29);
            expect(result.categoryScores.MAKHRAJ.totalErrors).toBe(0);
            expect(result.penaltyDeduction).toBe(0);
        });
    });

    describe('calculateParticipantScores - Fair Distribution', () => {
        test('should limit deduction per category based on item count', () => {
            // Example: 30 items in makhraj, max score 55.5
            // Max deduction per item = 55.5 / 30 = 1.85
            // If all items have nilai = 100, raw deduction = 30 * 1.5 = 45
            // But should be capped at 55.5
            const assessments = [];
            for (let i = 0; i < 30; i++) {
                assessments.push({
                    peserta_id: "test-1",
                    asesor_id: "asesor-1",
                    huruf: `huruf-${i}`,
                    kategori: "makhraj",
                    nilai: 100 // extreme error value
                });
            }

            const result = calculateParticipantScores(assessments);
            
            // Should cap at category maximum
            expect(result.categoryScores.MAKHRAJ.totalDeduction).toBeLessThanOrEqual(55.5);
            expect(result.categoryScores.MAKHRAJ.finalScore).toBeGreaterThanOrEqual(0);
        });

        test('should cap deduction per item when nilai is very large', () => {
            // Test specific case: 1 item with nilai = 100
            // MAKHRAJ: max 55.5, if 10 items, max per item = 5.55
            // nilai = 100, standard deduction = 100 * 1.5 = 150
            // But should be capped at 5.55 per item
            const assessments = [
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "د", kategori: "makhraj", nilai: 100 },
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "خ", kategori: "makhraj", nilai: 0 },
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "ح", kategori: "makhraj", nilai: 0 },
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "ج", kategori: "makhraj", nilai: 0 },
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "ث", kategori: "makhraj", nilai: 0 },
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "ت", kategori: "makhraj", nilai: 0 },
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "ب", kategori: "makhraj", nilai: 0 },
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "ا", kategori: "makhraj", nilai: 0 },
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "ط", kategori: "makhraj", nilai: 0 },
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "ض", kategori: "makhraj", nilai: 0 },
            ];

            const result = calculateParticipantScores(assessments);
            
            // Max deduction per item = 55.5 / 10 = 5.55
            // So even with nilai=100, deduction should be max 5.55
            expect(result.categoryScores.MAKHRAJ.itemCount).toBe(10);
            expect(result.categoryScores.MAKHRAJ.totalErrors).toBe(100);
            expect(result.categoryScores.MAKHRAJ.totalDeduction).toBeCloseTo(5.55, 1);
            expect(result.categoryScores.MAKHRAJ.finalScore).toBeCloseTo(49.95, 1);
        });

        test('should fairly distribute deduction when items have different error values', () => {
            const assessments = [
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "د", kategori: "makhraj", nilai: 1 },
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "خ", kategori: "makhraj", nilai: 2 },
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "ح", kategori: "makhraj", nilai: 0 },
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "ج", kategori: "makhraj", nilai: 3 },
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "ث", kategori: "makhraj", nilai: 0 },
            ];

            const result = calculateParticipantScores(assessments);
            
            // Total errors = 1 + 2 + 0 + 3 + 0 = 6
            // Standard deduction = 6 * 1.5 = 9
            // Max allowed per item = 55.5 / 5 = 11.1
            // Item deductions: 1*1.5=1.5, 2*1.5=3, 0, 3*1.5=4.5, 0
            // All within max per item (11.1), so total = 9
            expect(result.categoryScores.MAKHRAJ.totalErrors).toBe(6);
            expect(result.categoryScores.MAKHRAJ.totalDeduction).toBe(9);
            expect(result.categoryScores.MAKHRAJ.finalScore).toBe(46.5);
        });
    });

    describe('calculateParticipantScores - Granular Pengurangan Rules', () => {
        describe('100 Deduction - Complete Failure (Score = 0)', () => {
            test('should set score to 0 for "Suara Tidak Ada"', () => {
                const assessments = [
                    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "د", kategori: "makhraj", nilai: 0 },
                    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Suara Tidak Ada", kategori: "pengurangan", nilai: 1 },
                ];

                const result = calculateParticipantScores(assessments);
                expect(result.overallScore).toBe(0);
                expect(result.penaltyDeduction).toBe(100);
                expect(result.categoryScores.PENGURANGAN.totalDeduction).toBe(100);
            });

            test('should set score to 0 for "Video Rusak"', () => {
                const assessments = [
                    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Video Rusak", kategori: "pengurangan", nilai: 2 },
                ];

                const result = calculateParticipantScores(assessments);
                expect(result.overallScore).toBe(0);
                expect(result.penaltyDeduction).toBe(100);
            });

            test('should set score to 0 for "Terindikasi Dubbing"', () => {
                const assessments = [
                    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Terindikasi Dubbing", kategori: "pengurangan", nilai: 1 },
                ];

                const result = calculateParticipantScores(assessments);
                expect(result.overallScore).toBe(0);
                expect(result.penaltyDeduction).toBe(100);
            });

            test('should set score to 0 for "Maqro yang dibaca tidak sesuai"', () => {
                const assessments = [
                    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Maqro yang dibaca tidak sesuai", kategori: "pengurangan", nilai: 1 },
                ];

                const result = calculateParticipantScores(assessments);
                expect(result.overallScore).toBe(0);
                expect(result.penaltyDeduction).toBe(100);
            });
        });

        describe('90 Deduction - Severe Failure (Score = 10)', () => {
            test('should set score to 10 for "Tidak Bisa Membaca"', () => {
                const assessments = [
                    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "د", kategori: "makhraj", nilai: 0 },
                    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Tidak Bisa Membaca", kategori: "pengurangan", nilai: 1 },
                ];

                const result = calculateParticipantScores(assessments);
                expect(result.overallScore).toBe(10);
                expect(result.penaltyDeduction).toBe(90);
                expect(result.categoryScores.MAKHRAJ.finalScore).toBeCloseTo(5.55, 1);
            });
        });

        describe('50 Deduction - Partial Penalty', () => {
            test('should subtract 50 from normal score for "Maqro yg dibaca cuma sebagian"', () => {
                const assessments = [
                    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "د", kategori: "makhraj", nilai: 0 },
                    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "خ", kategori: "makhraj", nilai: 0 },
                    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Maqro yg dibaca cuma sebagian", kategori: "pengurangan", nilai: 1 },
                ];

                const result = calculateParticipantScores(assessments);
                // Normal score would be 100, minus 50 = 50
                expect(result.overallScore).toBe(50);
                expect(result.penaltyDeduction).toBe(50);
            });

            test('should not go below 0 when 50 deduction applied', () => {
                const assessments = [
                    // Heavy errors that would result in score < 50
                    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "د", kategori: "makhraj", nilai: 10 },
                    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "خ", kategori: "makhraj", nilai: 10 },
                    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Maqro yg dibaca cuma sebagian", kategori: "pengurangan", nilai: 1 },
                ];

                const result = calculateParticipantScores(assessments);
                expect(result.overallScore).toBeGreaterThanOrEqual(0);
                expect(result.penaltyDeduction).toBe(50);
            });

            test('should preserve other category scores with 50 deduction', () => {
                const assessments = [
                    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "د", kategori: "makhraj", nilai: 1 }, // -1.5
                    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Tanaffus", kategori: "ahkam", nilai: 1 }, // -2
                    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Maqro yg dibaca cuma sebagian", kategori: "pengurangan", nilai: 1 },
                ];

                const result = calculateParticipantScores(assessments);
                // Base score: 100 - 1.5 - 2 = 96.5
                // After 50 deduction: 96.5 - 50 = 46.5
                expect(result.overallScore).toBe(46.5);
                expect(result.categoryScores.MAKHRAJ.totalDeduction).toBe(1.5);
                expect(result.categoryScores.AHKAM.totalDeduction).toBe(2);
            });
        });

        describe('0 Deduction - No Effect (Informational)', () => {
            test('should have no effect for "Video Tidak Ada Gambar"', () => {
                const assessments = [
                    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "د", kategori: "makhraj", nilai: 0 },
                    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Video Tidak Ada Gambar", kategori: "pengurangan", nilai: 1 },
                ];

                const result = calculateParticipantScores(assessments);
                expect(result.overallScore).toBe(100); // No effect
                expect(result.penaltyDeduction).toBe(0);
            });

            test('should have no effect for "Ayat yg Dibaca Tidak Sesuai"', () => {
                const assessments = [
                    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "د", kategori: "makhraj", nilai: 1 }, // 1.5 deduction
                    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Ayat yg Dibaca Tidak Sesuai", kategori: "pengurangan", nilai: 1 },
                ];

                const result = calculateParticipantScores(assessments);
                expect(result.overallScore).toBe(98.5); // Only makhraj deduction applies
                expect(result.penaltyDeduction).toBe(0);
            });
        });

        describe('Multiple Pengurangan - Highest Deduction Wins', () => {
            test('should use highest deduction when multiple pengurangan types present (100 wins)', () => {
                const assessments = [
                    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Maqro yg dibaca cuma sebagian", kategori: "pengurangan", nilai: 1 }, // 50
                    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Video Rusak", kategori: "pengurangan", nilai: 1 }, // 100
                ];

                const result = calculateParticipantScores(assessments);
                expect(result.overallScore).toBe(0); // 100 deduction wins
                expect(result.penaltyDeduction).toBe(100);
            });

            test('should use 90 when both 90 and 50 present', () => {
                const assessments = [
                    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Tidak Bisa Membaca", kategori: "pengurangan", nilai: 1 }, // 90
                    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Maqro yg dibaca cuma sebagian", kategori: "pengurangan", nilai: 1 }, // 50
                ];

                const result = calculateParticipantScores(assessments);
                expect(result.overallScore).toBe(10); // 90 deduction wins
                expect(result.penaltyDeduction).toBe(90);
            });

            test('should use 50 when both 50 and 0 present', () => {
                const assessments = [
                    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Maqro yg dibaca cuma sebagian", kategori: "pengurangan", nilai: 1 }, // 50
                    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Video Tidak Ada Gambar", kategori: "pengurangan", nilai: 1 }, // 0
                ];

                const result = calculateParticipantScores(assessments);
                expect(result.overallScore).toBe(50); // 50 deduction wins
                expect(result.penaltyDeduction).toBe(50);
            });
        });

        describe('Case Insensitivity and Edge Cases', () => {
            test('should handle different casing', () => {
                const assessments = [
                    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "TIDAK BISA MEMBACA", kategori: "pengurangan", nilai: 1 },
                ];

                const result = calculateParticipantScores(assessments);
                expect(result.overallScore).toBe(10);
                expect(result.penaltyDeduction).toBe(90);
            });

            test('should handle pengurangan with nilai = 0 (no error)', () => {
                const assessments = [
                    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Video Rusak", kategori: "pengurangan", nilai: 0 },
                ];

                const result = calculateParticipantScores(assessments);
                expect(result.overallScore).toBe(100); // No penalty since nilai = 0
                expect(result.penaltyDeduction).toBe(0);
            });

            test('should handle unknown pengurangan type (fallback to 90)', () => {
                const assessments = [
                    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Unknown Type", kategori: "pengurangan", nilai: 1 },
                ];

                const result = calculateParticipantScores(assessments);
                expect(result.overallScore).toBe(10); // Falls back to 90 deduction
                expect(result.penaltyDeduction).toBe(90);
            });
        });
    });

    describe('calculateParticipantScores - Mad and Ahkam Sub-types', () => {
        test('should handle different Mad sub-types correctly', () => {
            const assessments = [
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Mad Thabii", kategori: "mad", nilai: 1 },
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Qashr", kategori: "mad", nilai: 1 },
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Mad Wajib", kategori: "mad", nilai: 1 },
            ];

            const result = calculateParticipantScores(assessments);
            
            // Thabii: 1 error * 2 = 2
            // Qashr: 1 error * 2 = 2
            // Wajib: 1 error * 1 = 1
            // Total = 5, max per item = 13.5 / 3 = 4.5
            // Since 2 + 2 + 1 = 5 is within limit
            expect(result.categoryScores.MAD.totalDeduction).toBe(5);
            expect(result.categoryScores.MAD.finalScore).toBe(8.5);
        });

        test('should handle different Ahkam sub-types correctly', () => {
            const assessments = [
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Tanaffus", kategori: "ahkam", nilai: 1 },
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Izhhar", kategori: "ahkam", nilai: 1 },
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Gunna", kategori: "ahkam", nilai: 1 },
            ];

            const result = calculateParticipantScores(assessments);
            
            // Tanaffus: 1 error * 2 = 2
            // Izhhar: 1 error * 1 = 1
            // Gunna: 1 error * 0.5 = 0.5
            // Total = 3.5
            expect(result.categoryScores.AHKAM.totalDeduction).toBe(3.5);
            expect(result.categoryScores.AHKAM.finalScore).toBe(4.5);
        });
    });

    describe('formatScoresForAPI', () => {
        test('should format scores correctly for API response', () => {
            const assessments = [
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "د", kategori: "makhraj", nilai: 1 },
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Tanaffus", kategori: "ahkam", nilai: 1 },
            ];

            const scoreData = calculateParticipantScores(assessments);
            const formatted = formatScoresForAPI(scoreData);

            expect(formatted).toHaveProperty('scores');
            expect(formatted).toHaveProperty('details');
            expect(formatted.scores).toHaveProperty('makhraj');
            expect(formatted.scores).toHaveProperty('sifat');
            expect(formatted.scores).toHaveProperty('ahkam');
            expect(formatted.scores).toHaveProperty('mad');
            expect(formatted.scores).toHaveProperty('gharib');
            expect(formatted.scores).toHaveProperty('kelancaran');
            expect(formatted.scores).toHaveProperty('overall');
        });
    });

    describe('Edge Cases', () => {
        test('should handle empty assessment array', () => {
            const result = calculateParticipantScores([]);
            
            expect(result.overallScore).toBe(100);
            expect(result.assessmentCount).toBe(0);
        });

        test('should handle missing SIFAT category gracefully', () => {
            const assessments = [
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "د", kategori: "makhraj", nilai: 0 },
            ];

            const result = calculateParticipantScores(assessments);
            
            // SIFAT should have default full score
            expect(result.categoryScores.SIFAT.finalScore).toBe(14.5);
        });

        test('should handle unknown categories', () => {
            const assessments = [
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Unknown", kategori: "unknown_category", nilai: 10 },
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "د", kategori: "makhraj", nilai: 0 },
            ];

            const result = calculateParticipantScores(assessments);
            
            // Should not crash and should process known categories
            expect(result).toBeDefined();
            expect(result.categoryScores.MAKHRAJ).toBeDefined();
        });
    });

    describe('Real-world Scenarios', () => {
        test('should handle typical assessment with mixed errors', () => {
            const assessments = [
                // Makhraj: 5 items, 2 with errors
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "د", kategori: "makhraj", nilai: 0 },
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "خ", kategori: "makhraj", nilai: 1 },
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "ح", kategori: "makhraj", nilai: 0 },
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "ج", kategori: "makhraj", nilai: 2 },
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "ث", kategori: "makhraj", nilai: 0 },
                
                // Ahkam: 3 items, 1 with error
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Tanaffus", kategori: "ahkam", nilai: 0 },
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Izhhar", kategori: "ahkam", nilai: 1 },
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Ikhfa'", kategori: "ahkam", nilai: 0 },
                
                // Mad: 2 items, 1 with error
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Qashr", kategori: "mad", nilai: 1 },
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Mad Wajib", kategori: "mad", nilai: 0 },
                
                // Gharib: perfect
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Iysmam", kategori: "gharib", nilai: 0 },
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Badal", kategori: "gharib", nilai: 0 },
                
                // Kelancaran: perfect
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Tidak Lancar", kategori: "kelancaran", nilai: 0 },
                { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Kurang Lancar", kategori: "kelancaran", nilai: 0 },
            ];

            const result = calculateParticipantScores(assessments);
            
            // Makhraj: errors = 1 + 2 = 3, deduction = 3 * 1.5 = 4.5
            expect(result.categoryScores.MAKHRAJ.totalErrors).toBe(3);
            expect(result.categoryScores.MAKHRAJ.totalDeduction).toBe(4.5);
            expect(result.categoryScores.MAKHRAJ.finalScore).toBe(51);
            
            // Ahkam: errors = 1 (Izhhar), deduction = 1 * 1 = 1
            expect(result.categoryScores.AHKAM.totalErrors).toBe(1);
            expect(result.categoryScores.AHKAM.totalDeduction).toBe(1);
            expect(result.categoryScores.AHKAM.finalScore).toBe(7);
            
            // Mad: errors = 1 (Qashr), deduction = 1 * 2 = 2
            expect(result.categoryScores.MAD.totalErrors).toBe(1);
            expect(result.categoryScores.MAD.totalDeduction).toBe(2);
            expect(result.categoryScores.MAD.finalScore).toBe(11.5);
            
            // Gharib: perfect
            expect(result.categoryScores.GHARIB.finalScore).toBe(6);
            
            // Kelancaran: perfect
            expect(result.categoryScores.KELANCARAN.finalScore).toBe(2.5);
            
            // Overall: 51 + 7 + 11.5 + 6 + 2.5 + 14.5 (sifat default) = 92.5
            expect(result.overallScore).toBe(92.5);
        });
    });
});
