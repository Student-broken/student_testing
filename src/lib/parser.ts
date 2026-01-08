import type { Assignment, Subject, Competency } from './types';

export interface ParseResult {
    nom: string | null;
    etapeKey: string | null;
    etapeData: Subject[];
}

export function parsePortalData(text: string): ParseResult {
    const nameMatch = text.match(/Photo\s*\n(.+)/);
    const semesterMatch = text.match(/Classe\s*\n\s*(\d)/);
    const nom = nameMatch ? nameMatch[1].trim() : null;
    const etapeNumber = semesterMatch ? semesterMatch[1].trim() : null;

    if (!nom || !etapeNumber) return { nom: null, etapeKey: null, etapeData: [] };
    const etapeKey = `etape${etapeNumber}`;

    const POND_REGEX = /^\d{1,3}$/;
    const DATE_REGEX = /^\d{4}-\d{2}-\d{2}/;
    const RESULT_REGEX = /^(\d{1,3},\d\s\/\s\d{1,3}\s\(.+\)|[A-DF][+-]?)$/;
    const SUBJECT_REGEX = /([A-Z]{3}\d{3}[A-Z]?) - (.+)/g;

    const createNewAssignment = (): Partial<Assignment> & { textBuffer: string[] } => ({
        textBuffer: [],
        // initialize other fields empty or undefined, will be filled
        category: '',
        work: '',
        pond: '',
        assignedDate: '',
        dueDate: '',
        result: ''
    });

    const parseAssignments = (lines: string[]): Assignment[] => {
        let assignments: Assignment[] = [];
        if (lines.length === 0) return assignments;
        let currentAssignment = createNewAssignment();

        const finalizeAssignment = () => {
            // Check if valid assignment
            if (currentAssignment.textBuffer.length === 0 && !currentAssignment.pond) return;

            const buffer = currentAssignment.textBuffer;
            let category = currentAssignment.category || '';
            let work = currentAssignment.work || '';

            if (buffer.length === 1) {
                work = buffer[0];
            } else if (buffer.length > 1) {
                category = buffer[0];
                work = buffer.slice(1).join('<br>');
            }

            // Push complete assignment
            assignments.push({
                category,
                work,
                pond: currentAssignment.pond || '',
                assignedDate: currentAssignment.assignedDate || '',
                dueDate: currentAssignment.dueDate || '',
                result: currentAssignment.result || ''
            });
        };

        for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine || trimmedLine.includes('Catégorie\tTravail\tPond.')) continue;

            if (RESULT_REGEX.test(trimmedLine)) {
                currentAssignment.result = trimmedLine;
                finalizeAssignment();
                currentAssignment = createNewAssignment();
            } else if (POND_REGEX.test(trimmedLine)) {
                currentAssignment.pond = trimmedLine;
            } else if (DATE_REGEX.test(trimmedLine)) {
                if (!currentAssignment.assignedDate) {
                    currentAssignment.assignedDate = trimmedLine.split('à')[0].trim();
                }
                currentAssignment.dueDate = trimmedLine;
            } else {
                // If we hit text but already have pond/date, it's likely a NEW assignment's text start
                // (This logic mirrors the original JS logic)
                if (currentAssignment.pond || currentAssignment.assignedDate) {
                    finalizeAssignment();
                    currentAssignment = createNewAssignment();
                }
                currentAssignment.textBuffer.push(trimmedLine);
            }
        }
        finalizeAssignment();
        return assignments;
    };

    // Split subjects
    // Note: matchAll is cleaner but legacy used split + regex
    const parts = text.split(SUBJECT_REGEX);
    // text.split(regexWithCapturingGroups) returns [part, capture1, capture2, part, capture1, capture2...]
    // The first part is before the first match.
    const subjects: Subject[] = [];

    // parts[0] is pre-match garbage usually.
    // Then we have groups of 3 (code, name, content)
    const subjectsInfo = parts.slice(1);

    for (let i = 0; i < subjectsInfo.length; i += 3) {
        const code = subjectsInfo[i].trim();
        const name = subjectsInfo[i + 1].trim();
        const content = subjectsInfo[i + 2] || '';

        const competencies: Competency[] = [];
        const compBlocks = content.split('Compétence - ').slice(1);

        for (const block of compBlocks) {
            const blockLines = block.trim().split('\n');
            const compNameLine = blockLines.shift();
            const compName = `Compétence - ${compNameLine?.trim()}`;

            const assignments = parseAssignments(blockLines);
            if (assignments.length > 0) {
                competencies.push({ name: compName, assignments });
            }
        }

        if (competencies.length > 0) {
            subjects.push({ code, name, competencies });
        }
    }

    return { nom, etapeKey, etapeData: subjects };
}
