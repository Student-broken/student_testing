import type { MBSData, Subject } from './types';

const GRADE_MAP: Record<string, number> = {
    'A+': 100, 'A': 95, 'A-': 90,
    'B+': 85, 'B': 80, 'B-': 75,
    'C+': 70, 'C': 65, 'C-': 60,
    'D+': 55, 'D': 50, 'E': 45
};

export const DEFAULT_UNITS: Record<string, Record<string, number>> = {
    sec4: { 'ART': 2, 'MUS': 2, 'DRM': 2, 'FRA': 6, 'ELA': 4, 'EESL': 6, 'ESL': 4, 'MAT': 6, 'CST': 6, 'ST': 4, 'STE': 4, 'HQC': 4, 'CCQ': 2, 'EPS': 2, 'ENT': 2, 'INF': 2, 'PSY': 2 },
    sec5: { 'ART': 2, 'MUS': 2, 'DRM': 2, 'CAT': 4, 'FRA': 6, 'ELA': 6, 'EESL': 6, 'ESL': 4, 'MAT': 6, 'CST': 4, 'MED': 4, 'PSY': 4, 'ENT': 4, 'FIN': 2, 'CHI': 4, 'PHY': 4, 'MON': 2, 'HQC': 4, 'CCQ': 2, 'EPS': 2 }
};

export const SUBJECT_NAMES: Record<string, string> = {
    'ART': "Arts Plastiques", 'MUS': "Musique", 'DRM': "Art Dramatique", 'CAT': "Conception et Application Technologique",
    'FRA': "Français", 'ELA': "English Language Arts", 'EESL': "Enriched English",
    'ESL': "English Second Language", 'SN': "Math SN", 'CST': "Math CST",
    'ST': "Science et Technologie", 'STE': "Science et Tech. Env.",
    'HQC': "Histoire", 'CCQ': "Culture et Citoyenneté", 'EPS': "Éducation Physique",
    'CHI': "Chimie", 'PHY': "Physique", 'MON': "Monde Contemporain",
    'MED': "Média", 'ENT': "Entrepreneuriat", 'INF': "Informatique",
    'PSY': "Psychologie", 'FIN': "Éducation Financière"
};

export function getNumericGrade(result: string | undefined): number | null {
    if (!result) return null;
    const trimmed = result.trim();
    if (GRADE_MAP[trimmed]) return GRADE_MAP[trimmed];

    const percentageMatch = trimmed.match(/(\d+[,.]?\d*)\s*%/);
    if (percentageMatch) return parseFloat(percentageMatch[1].replace(',', '.'));

    const scoreMatch = trimmed.match(/(\d+[,.]?\d*)\s*\/\s*(\d+[,.]?\d*)/);
    if (scoreMatch) {
        const score = parseFloat(scoreMatch[1].replace(',', '.'));
        const max = parseFloat(scoreMatch[2].replace(',', '.'));
        return (max > 0) ? (score / max) * 100 : null;
    }
    return null;
}

export function calculateSubjectAverage(subject: Subject): number | null {
    let totalWeightedGrade = 0;
    let totalCompetencyWeight = 0;

    subject.competencies.forEach((comp) => {
        const compWeightMatch = comp.name.match(/\((\d+)%\)/);
        if (!compWeightMatch) return;
        const compWeight = parseFloat(compWeightMatch[1]);

        let totalAssignmentGrade = 0;
        let totalAssignmentWeight = 0;

        comp.assignments.forEach((assign) => {
            // Note: We use assign.pond as the source of truth for weight.
            // If the user modified it, it should be updated in the data before calling this.
            // But here we might read raw strings.
            const grade = getNumericGrade(assign.result);
            const weight = parseFloat(assign.pond);

            if (grade !== null && !isNaN(grade) && !isNaN(weight) && weight > 0) {
                totalAssignmentGrade += grade * weight;
                totalAssignmentWeight += weight;
            }
        });

        if (totalAssignmentWeight > 0) {
            const competencyAverage = totalAssignmentGrade / totalAssignmentWeight;
            totalWeightedGrade += competencyAverage * compWeight;
            totalCompetencyWeight += compWeight;
        }
    });

    return totalCompetencyWeight > 0 ? totalWeightedGrade / totalCompetencyWeight : null;
}

export interface AveragesResult {
    subjectAverages: Record<string, Record<string, { name: string, average: number | null }>>;
    termAverages: Record<string, number | null>;
    globalAverage: number | null;
}

export function calculateAllAverages(data: MBSData): AveragesResult {
    const niveau = data.settings?.niveau;
    const unitesMode = data.settings?.unitesMode;
    const customUnites = data.settings?.customUnites;

    // Units resolution logic
    const getUnits = () => {
        if (unitesMode === 'sans') return new Proxy({}, { get: () => 1 });
        if (unitesMode === 'perso') return customUnites || {};
        return (niveau && DEFAULT_UNITS[niveau]) ? DEFAULT_UNITS[niveau] : {};
    };
    const units = getUnits();

    let allTermAverages: Record<string, number | null> = { etape1: null, etape2: null, etape3: null };
    let allSubjectAverages: Record<string, any> = {};

    ['etape1', 'etape2', 'etape3'].forEach(etape => {
        const termData = data[etape] as Subject[];
        if (!termData) return;

        let termWeightedSum = 0;
        let termUnitSum = 0;
        allSubjectAverages[etape] = {};

        termData.forEach((subject) => {
            const average = calculateSubjectAverage(subject);
            const codePrefix = subject.code.substring(0, 3);
            const subjectName = SUBJECT_NAMES[codePrefix] || subject.name;

            allSubjectAverages[etape][codePrefix] = { name: subjectName, average };

            if (average !== null && niveau) {
                const unit = (units as any)[codePrefix] || 2;
                termWeightedSum += average * unit;
                termUnitSum += unit;
            }
        });
        allTermAverages[etape] = termUnitSum > 0 ? termWeightedSum / termUnitSum : null;
    });

    let globalWeightedSum = 0;
    let totalWeight = 0;
    const termWeights: Record<string, number> = { etape1: 0.20, etape2: 0.20, etape3: 0.60 };

    Object.entries(allTermAverages).forEach(([etape, avg]) => {
        if (avg !== null) {
            globalWeightedSum += avg * termWeights[etape];
            totalWeight += termWeights[etape];
        }
    });

    const globalAverage = totalWeight > 0 ? globalWeightedSum / totalWeight : null;
    return { subjectAverages: allSubjectAverages, termAverages: allTermAverages, globalAverage };
}
