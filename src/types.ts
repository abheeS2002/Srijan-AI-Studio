export type ActiveTab =
  | 'overview'
  | 'philosophy'
  | 'syllabus'
  | 'units'
  | 'classroom'
  | 'memory'
  | 'design'
  | 'reflection'
  | 'library';

export type DesignType = 'unit' | 'lesson' | 'activity' | 'assessment';

export type MemoryTier =
  | 'stated_belief'
  | 'approved_inference'
  | 'srijan_inference'
  | 'temporary_context';

export interface MemoryItem {
  id: string;
  tier: MemoryTier;
  text: string;
  category: 'philosophy' | 'pedagogy' | 'classroom_reality' | 'learner_dynamic' | 'situational';
  source: 'teacher_stated' | 'ai_inferred' | 'reflection_insight';
  dateAdded: string;
  status: 'active' | 'pending_approval' | 'archived';
  notes?: string;
  expiresAt?: string; // For temporary context
}

export interface TeacherPhilosophyProfile {
  teacherName: string;
  experienceYears: string;
  roleOfTeacher: string;
  viewOfMistakes: string;
  learnerAutonomy: string;
  knowledgeConstruction: string;
  assessmentStance: string;
  coreValues: string[];
  statedQuotes: string[];
  lastUpdated: string;
}

export interface ClassroomProfile {
  schoolName: string;
  gradeLevel: string;
  subject: string;
  classSize: number;
  periodLengthMinutes: number;
  roomLayout: string;
  techAccess: 'none' | 'projector_only' | 'shared_tablets' | 'one_to_one';
  techAccessDescription: string;
  languageContext: string;
  dailyScheduleContext: string;
}

export interface LearnerProfile {
  priorKnowledgeGaps: string[];
  readingAndLanguageDiversity: string;
  energyAndFocusDynamics: string;
  highInterestHooks: string[];
  specificAccommodations: string[];
  socioEmotionalClimate: string;
}

// ------------------------------
// Syllabus & Textbook Types
// ------------------------------
export interface UploadedTextbookFile {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  uploadedAt: string;
  parsedSummary: string;
  detectedChaptersCount: number;
  extractedTextExcerpt?: string;
}

export interface SyllabusChapter {
  id: string;
  chapterNumber: number | string;
  title: string;
  keyConcepts: string[];
  learningOutcomes: string[];
  textbookPages?: string;
  suggestedInquiryHook?: string;
  status: 'not_started' | 'planning' | 'in_progress' | 'completed';
  linkedDesignCount?: number;
}

export interface SyllabusUnit {
  id: string;
  unitNumber: number;
  title: string;
  bigIdea?: string;
  essentialQuestion?: string;
  estimatedPeriods?: number;
  priorityFocus?: string;
  keyCompetencies: string[];
  unitValues?: string[];
  chapters: SyllabusChapter[];
  notes?: string;
}

export interface ClassroomSyllabus {
  id: string;
  classroomId: string;
  title: string;
  subject: string;
  gradeLevel: string;
  curriculumBoard?: string;
  textbookTitle?: string;
  textbookPublisher?: string;
  academicYear?: string;
  uploadedFiles: UploadedTextbookFile[];
  units: SyllabusUnit[];
  lastUpdated?: string;
}

// ------------------------------
// Multi-Classroom & Subject Section
// ------------------------------
export interface ClassroomSection {
  id: string;
  name: string; // e.g. "Grade 8 Science - Section A"
  gradeLevel: string;
  sectionName: string;
  subject: string;
  academicYear: string;
  colorTheme?: string;
  classroom: ClassroomProfile;
  learners: LearnerProfile;
  syllabus: ClassroomSyllabus;
}

export interface AlternativeApproach {
  approach: string;
  pros: string;
  cons: string;
  whyDeprioritized: string;
}

export interface EducationalTradeoff {
  gain: string;
  costOrSacrifice: string;
  mitigationStrategy: string;
}

export interface ReasoningMatrix {
  recommendedApproach: string;
  pedagogicalRationale: string;
  philosophyAlignment: string[];
  classroomContextFit: string[];
  alternativesConsidered: AlternativeApproach[];
  educationalTradeoffs: EducationalTradeoff[];
}

export interface LessonPhase {
  phaseName: string;
  timeAllocationMinutes: number;
  teacherAction: string;
  studentAction: string;
  scaffoldingAndMaterials: string;
  pedagogicalRationale: string;
}

export interface EducationalDesignOutput {
  id: string;
  title: string;
  designType: DesignType;
  topicPrompt: string;
  summary: string;
  createdAt: string;
  classroomId?: string;
  unitId?: string;
  unitTitle?: string;
  unitNumber?: number;
  chapterId?: string;
  chapterTitle?: string;
  unitAlignment?: {
    unitTitle: string;
    priorityApplied: string;
    competenciesAddressed: string[];
    valuesCultivated: string[];
  };
  content: {
    essentialQuestion?: string;
    bigIdeas?: string[];
    objectives?: string[];
    phases?: LessonPhase[];
    differentiationTiers?: {
      tierName: string;
      studentReadiness: string;
      taskPrompt: string;
      support: string;
    }[];
    assessmentRubric?: {
      criterion: string;
      emerging: string;
      proficient: string;
      advanced: string;
      philosophicalNote: string;
    }[];
    unitSequence?: {
      dayOrLesson: string;
      focus: string;
      inquiryHook: string;
      rationale: string;
    }[];
    accommodations?: string[];
    materialsNeeded?: string[];
    homeworkOrExtension?: string;
  };
  reasoningMatrix: ReasoningMatrix;
  teacherCritiquesAndOverrides?: {
    date: string;
    critique: string;
    resultSummary: string;
  }[];
  isSavedToLibrary?: boolean;
}

export interface PostLessonReflection {
  id: string;
  designId?: string;
  lessonTitle: string;
  date: string;
  whatActuallyHappened: string;
  studentEngagementScore: number; // 1 to 5
  timePacingOutcome: 'too_fast' | 'on_track' | 'ran_out_of_time' | 'dragged';
  unforeseenFrictions: string;
  celebrations: string;
  intentionVsPracticeDissonance?: {
    summary: string;
    alignments: string[];
    dissonances: {
      intendedPrinciple: string;
      actualClassroomReality: string;
      underlyingDriver: string;
      remedyStrategy: string;
    }[];
    systemicInsights: string;
    suggestedMemoryRefinement?: {
      tier: MemoryTier;
      proposedText: string;
    };
    empoweringClosingNote: string;
  };
}

export interface PhilosophyDiscoveryQuestion {
  id: string;
  dilemmaTitle: string;
  prompt: string;
  options: {
    label: string;
    stance: string;
    underlyingPhilosophy: string;
  }[];
  openReflectionPrompt: string;
}
