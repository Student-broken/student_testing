export interface Assignment {
    category: string;
    work: string;
    pond: string; // Keep as string to match legacy input, parse on usage
    assignedDate: string;
    dueDate: string;
    result: string;
}

export interface Competency {
    name: string;
    assignments: Assignment[];
}

export interface Subject {
    code: string;
    name: string;
    competencies: Competency[];
}

export interface Settings {
    niveau?: string;
    unitesMode?: 'defaut' | 'sans' | 'perso';
    customUnites?: Record<string, number>;
}

export interface TermData {
    timestamps: number[];
    moyennes: number[];
}

export interface MBSData {
    user_random?: string;
    valid?: boolean;
    nom?: string;
    settings?: Settings;
    etape1?: Subject[];
    etape2?: Subject[];
    etape3?: Subject[];
    historique?: Record<string, TermData>;
    [key: string]: any; // fallback for loose parsing
}
