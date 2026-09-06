import {
  TeacherPhilosophyProfile,
  ClassroomProfile,
  LearnerProfile,
  MemoryItem,
  EducationalDesignOutput,
  PhilosophyDiscoveryQuestion,
  PostLessonReflection,
  ClassroomSection,
  ClassroomSyllabus,
  SyllabusUnit,
  SyllabusChapter,
  UploadedTextbookFile,
} from '../types';

export const initialTeacherPhilosophy: TeacherPhilosophyProfile = {
  teacherName: 'Abheesht',
  experienceYears: '3 years',
  roleOfTeacher: 'Epistemic Architect & Dialogic Coach: Setting up rigorous inquiry environments, moderating peer sense-making, and withholding premature answers.',
  viewOfMistakes: 'Essential Diagnostic Stepping Stones: Misconceptions reveal logic in progress. Errors must be made public, de-stigmatized, and probed collectively.',
  learnerAutonomy: 'Structured Agency: Students choose their pathways to express understanding and participate in self-assessment within clear conceptual bounds.',
  knowledgeConstruction: 'Dialogic Constructivism: Concrete phenomena first, peer talk second, shared synthesis third, formal terminology last.',
  assessmentStance: 'Diagnostic & Continuous Feedback: Low-stakes formative checks over punitive summative grading; student revision is mandatory for mastery.',
  coreValues: [
    'Every child can engage in high-order abstract reasoning when provided linguistic scaffolding.',
    'Classrooms must be emotionally safe sanctuaries where asking "I do not understand" is celebrated.',
    'Concepts must be anchored to students immediate lived experience and community reality.',
    'Teacher does not monopolize talk-time; student discourse is the engine of thought.',
  ],
  statedQuotes: [
    '"If I explain it first, I rob them of the joy and neurological wiring of figuring it out themselves."',
    '"Never grade a student on their first attempt at thinking."',
  ],
  lastUpdated: '2026-09-06',
};

export const initialClassroomProfile: ClassroomProfile = {
  schoolName: 'Govt. Model Senior Secondary School (Teach for India Partner)',
  gradeLevel: 'Grade 8',
  subject: 'Science & Environmental Thinking',
  classSize: 36,
  periodLengthMinutes: 45,
  roomLayout: '3 rows of double benches facing green chalkboard; narrow aisles with limited mobility; good natural window light.',
  techAccess: 'projector_only',
  techAccessDescription: 'Single classroom projector connected to teacher laptop; no student smartphones or tablets in class.',
  languageContext: 'Bilingual Hindi-English instruction; students speak Hindi/Hinglish at home; textbook is in English.',
  dailyScheduleContext: 'Science is Period 4 (right before lunch); students are hungry and fidgety if kept passive.',
};

export const initialLearnerProfile: LearnerProfile = {
  priorKnowledgeGaps: [
    'Graph reading (interpreting X/Y coordinates in science diagrams)',
    'Abstract unit conversions (e.g. grams to kilograms, millilitres)',
    'Confidence in scientific English vocabulary',
  ],
  readingAndLanguageDiversity: 'Wide spectrum: ~10 students read English fluently; ~18 comprehend with visual aids and sentence stems; ~8 require Hindi conceptual explanation before reading in English.',
  energyAndFocusDynamics: 'High vivacity, eager to talk and debate in small pairs. Easily agitated if asked to copy notes in silence for >10 minutes.',
  highInterestHooks: [
    'Local phenomena: cricket ball trajectories, street food frying physics, monsoon drain overflow, cycle repairs',
    'Tactile puzzles and physical cards',
    'Friendly peer challenges and chalkboard showdowns',
  ],
  specificAccommodations: [
    '4 students with visual acuity issues (need seating in front 2 rows and large chalkboard font)',
    '3 students with attention regulation challenges (benefit from having a tangible tactile object or pacing task like board cleaner/timer)',
  ],
  socioEmotionalClimate: 'Deep mutual warmth between teacher and class; occasional peer teasing when someone speaks broken English, which teacher actively interrupts with linguistic pride norms.',
};

// -------------------------------------------------------------
// Syllabi & Textbooks for Universal Grade & Subject Deployment
// -------------------------------------------------------------
export const sampleGrade8ScienceSyllabus: ClassroomSyllabus = {
  id: 'syl-g8-science',
  classroomId: 'class-8a',
  title: 'NCERT National Standard Science Curriculum — Class 8',
  subject: 'Science & Environmental Thinking',
  gradeLevel: 'Grade 8',
  curriculumBoard: 'NCERT / CBSE / State Composite',
  textbookTitle: 'NCERT Science: Class 8 (Universal Edition)',
  textbookPublisher: 'National Council of Educational Research & Training',
  academicYear: '2025-2026',
  uploadedFiles: [
    {
      id: 'file-ncert-8-book',
      fileName: 'NCERT_Class8_Science_FullTextbook_2025.pdf',
      fileType: 'application/pdf',
      fileSize: '14.2 MB',
      uploadedAt: '2026-08-10',
      parsedSummary: 'Full 13-chapter textbook containing units on chemical substances, biology of microorganisms, forces, friction, pressure, sound, and electrical effects.',
      detectedChaptersCount: 13,
      extractedTextExcerpt: 'Chapter 4: Materials — Metals and Non-Metals. Physical properties: malleability, ductility, sonorous nature. Chemical properties: reaction with oxygen, water, acids...',
    },
    {
      id: 'file-syllabus-scope',
      fileName: 'Curriculum_Scope_Sequence_G8_Science.docx',
      fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      fileSize: '180 KB',
      uploadedAt: '2026-08-12',
      parsedSummary: 'Official learning competencies matrix mapped to 45-minute period blocks and continuous formative checkpoints.',
      detectedChaptersCount: 13,
    },
  ],
  units: [
    {
      id: 'unit-8-1',
      unitNumber: 1,
      title: 'Food Production & The Microbial Universe',
      bigIdea: 'Living systems rely on interdependent cycles of nutrient transformation, energy harvest, and biological symbiosis.',
      essentialQuestion: 'How do microscopic organisms both sustain continental food supply and threaten human survival?',
      estimatedPeriods: 18,
      priorityFocus: 'Connect laboratory microscopy to community farming and kitchen fermentation phenomena; bridge bilingual terminology.',
      keyCompetencies: [
        'Understand agricultural practices and ecological impacts of crop rotation',
        'Distinguish beneficial vs pathogenic microorganisms through microscopic evidence',
        'Model nutrient and nitrogen cycling across biological trophic levels',
      ],
      unitValues: [
        'Scientific Humility toward Nature',
        'Environmental Stewardship',
        'Care for Community Health',
        'Evidentiary Skepticism',
      ],
      chapters: [
        {
          id: 'ch-8-1',
          chapterNumber: 1,
          title: 'Crop Production and Management',
          keyConcepts: ['Agricultural Practices', 'Sowing & Seed Selection', 'Manure & Fertilizers', 'Irrigation Systems'],
          learningOutcomes: [
            'Classify crops based on seasons (Kharif and Rabi)',
            'Evaluate traditional vs modern drip/sprinkler irrigation efficiency',
          ],
          textbookPages: 'Pages 1–16',
          suggestedInquiryHook: 'Why do farmers in arid regions choose drip over furrow flooding despite cost?',
          status: 'completed',
          linkedDesignCount: 2,
        },
        {
          id: 'ch-8-2',
          chapterNumber: 2,
          title: 'Microorganisms: Friend and Foe',
          keyConcepts: ['Bacterial Fermentation', 'Pasteurization', 'Nitrogen Cycle & Rhizobium', 'Antibiotics & Vaccines'],
          learningOutcomes: [
            'Explain how yeast enables dough fermentation in local cooking',
            'Diagram the atmospheric nitrogen fixation cycle through leguminous root nodules',
          ],
          textbookPages: 'Pages 17–33',
          suggestedInquiryHook: 'Why does milk spoil in 6 hours in summer but dough rises and stays safe when fermented?',
          status: 'completed',
          linkedDesignCount: 1,
        },
      ],
    },
    {
      id: 'unit-8-2',
      unitNumber: 2,
      title: 'Materials, Combustion & Chemical Transformations',
      bigIdea: 'Matter undergoes macroscopic transformations driven by microscopic molecular rearrangements and activation energy.',
      essentialQuestion: 'What invisible atomic exchanges dictate whether something protects us as a tool or consumes everything in fire?',
      estimatedPeriods: 22,
      priorityFocus: 'Hands-on safe tactile demonstrations; debunking the misconception that heat and temperature are identical.',
      keyCompetencies: [
        'Analyze physical and chemical properties of metallic vs non-metallic substances',
        'Model the chemistry of oxidation and ignition temperature in combustion',
        'Evaluate ecological trade-offs of fossil fuel extraction and alternative energies',
      ],
      unitValues: [
        'Curiosity & Wonder',
        'Safety & Responsibility with Materials',
        'Collaborative Problem-Solving',
        'Sustainable Resource Consciousness',
      ],
      chapters: [
        {
          id: 'ch-8-3',
          chapterNumber: 3,
          title: 'Coal and Petroleum: Exhaustible Natural Energy',
          keyConcepts: ['Fossil Fuels', 'Fractional Distillation', 'Carbonization', 'Sustainable Conservation'],
          learningOutcomes: [
            'Trace the geological formation of fossil fuels over millions of years',
            'Defend why fossil fuels are classified as exhaustible natural resources',
          ],
          textbookPages: 'Pages 55–63',
          suggestedInquiryHook: 'If petrol comes from ancient organisms, why can’t we synthesize it in a chemistry beaker overnight?',
          status: 'completed',
          linkedDesignCount: 1,
        },
        {
          id: 'ch-8-4',
          chapterNumber: 4,
          title: 'Combustion and Flame: The Heat of Reaction',
          keyConcepts: ['Ignition Temperature', 'Combustible vs Incombustible', 'Zones of Candle Flame', 'Fire Extinguishers'],
          learningOutcomes: [
            'Investigate factors required for combustion using the fire triangle',
            'Explain why a paper cup with water does not catch fire over a flame',
          ],
          textbookPages: 'Pages 64–78',
          suggestedInquiryHook: 'Can you boil water inside a paper tea cup without burning the paper?',
          status: 'in_progress',
          linkedDesignCount: 1,
        },
      ],
    },
    {
      id: 'unit-8-3',
      unitNumber: 3,
      title: 'Force, Pressure & Somatic Mechanics',
      bigIdea: 'Objects do not change their state of rest or motion spontaneously; interactions manifest through directional forces and distributed surface pressures.',
      essentialQuestion: 'How can small invisible forces alter colossal structures, and why does contact area change everything?',
      estimatedPeriods: 24,
      priorityFocus: 'Tactile bench-scale kinesthetic experiments with minimal classroom movement; explicit bilingual sentence framing for vector forces.',
      keyCompetencies: [
        'Quantify force as push or pull altering motion or shape',
        'Relate pressure to contact surface area and atmospheric fluid columns',
        'Distinguish static, sliding, and rolling friction through empirical trials',
        'Analyze wave transmission and acoustic medium dependencies',
      ],
      unitValues: [
        'Productive Struggle with Counter-Intuitive Ideas',
        'Scientific Rigor & Measurement Accuracy',
        'Peer Dialogue & Respectful Disagreement',
        'Everyday Observation & Inquiry',
      ],
      chapters: [
        {
          id: 'ch-8-5',
          chapterNumber: 5,
          title: 'Force and Pressure: Interacting Objects',
          keyConcepts: ['Contact vs Non-Contact Forces', 'Net Force & Vector Direction', 'Atmospheric Pressure', 'Liquid Depth Pressure'],
          learningOutcomes: [
            'Demonstrate how reducing surface area concentrates mechanical pressure (e.g. sharp vs dull nails)',
            'Calculate net force when two opposing forces act on a body',
          ],
          textbookPages: 'Pages 127–145',
          suggestedInquiryHook: 'Why can a heavy camel walk easily on desert sand while a bicycle sink instantly?',
          status: 'in_progress',
          linkedDesignCount: 2,
        },
        {
          id: 'ch-8-6',
          chapterNumber: 6,
          title: 'Friction: Essential Friction and Resisting Motion',
          keyConcepts: ['Static vs Sliding vs Rolling Friction', 'Interlocking of Irregularities', 'Friction as a Necessary Evil', 'Lubrication & Bearings'],
          learningOutcomes: [
            'Compare the magnitude of static friction, sliding friction, and rolling friction',
            'Identify real-life methods to increase or decrease friction safely',
          ],
          textbookPages: 'Pages 146–158',
          suggestedInquiryHook: 'If friction vanished for 10 seconds right now, what would happen in this classroom?',
          status: 'planning',
          linkedDesignCount: 0,
        },
        {
          id: 'ch-8-7',
          chapterNumber: 7,
          title: 'Sound & Acoustic Vibrations',
          keyConcepts: ['Vibrating Bodies', 'Human Larynx / Vocal Cords', 'Medium Requirement (No Vacuum Sound)', 'Frequency, Amplitude & Pitch'],
          learningOutcomes: [
            'Relate pitch to vibration frequency and loudness to wave amplitude',
            'Verify experimentally that sound requires a material medium to propagate',
          ],
          textbookPages: 'Pages 159–175',
          suggestedInquiryHook: 'If a giant drum is struck on the Moon, why would an astronaut standing 2 meters away hear absolute silence?',
          status: 'not_started',
          linkedDesignCount: 0,
        },
      ],
    },
    {
      id: 'unit-8-4',
      unitNumber: 4,
      title: 'Electromagnetism & Natural Phenomena',
      bigIdea: 'Invisible electrical fields and charge differentials govern both micro-chemical bonds and catastrophic macro atmospheric events.',
      essentialQuestion: 'How can electrical currents reshape atoms on a spoon, and what warns us when nature discharges its immense static reservoir?',
      estimatedPeriods: 20,
      priorityFocus: 'Low-cost DIY circuits with LED testers and salt solutions; safety-first mental models for lightning and seismic faults.',
      keyCompetencies: [
        'Investigate electrical conductivity in ionic liquid solutions',
        'Analyze electroplating mechanisms and static charge distribution',
        'Model ray reflection geometry and optical ray tracing',
      ],
      unitValues: [
        'Safety & Preparedness Mindset',
        'Inquisitive Testing over Guesswork',
        'Awe for Natural Powers',
        'Critical Sense of Scale',
      ],
      chapters: [
        {
          id: 'ch-8-8',
          chapterNumber: 8,
          title: 'Chemical Effects of Electric Current',
          keyConcepts: ['Electrolytes & Ion Dissociation', 'LED Testers', 'Electroplating', 'Corrosion Resistance'],
          learningOutcomes: [
            'Test liquids (lemon juice, tap water, distilled water) for electrical conductivity',
            'Explain copper electroplating onto iron spoons using cation transfer',
          ],
          textbookPages: 'Pages 176–187',
          suggestedInquiryHook: 'Why does pure distilled water not conduct electricity, but a single pinch of salt makes a bulb shine brightly?',
          status: 'not_started',
          linkedDesignCount: 0,
        },
        {
          id: 'ch-8-9',
          chapterNumber: 9,
          title: 'Some Natural Phenomena: Lightning & Earthquakes',
          keyConcepts: ['Static Electric Discharge', 'Lightning Conductors', 'Seismic Waves & Fault Zones', 'Earthquake Safety Protocols'],
          learningOutcomes: [
            'Describe how static friction charges clouds resulting in massive atmospheric discharge',
            'Formulate family and classroom emergency protocols during a Richter tremor',
          ],
          textbookPages: 'Pages 188–201',
          suggestedInquiryHook: 'Why is it safer inside a metal-roof car during a lightning thunderstorm than under a leafy tall tree?',
          status: 'not_started',
          linkedDesignCount: 0,
        },
        {
          id: 'ch-8-10',
          chapterNumber: 10,
          title: 'Light, Reflection & Human Vision',
          keyConcepts: ['Laws of Reflection', 'Regular vs Diffused Reflection', 'Multiple Reflections & Kaleidoscope', 'Structure of Human Eye'],
          learningOutcomes: [
            'Prove the angle of incidence equals the angle of reflection with ray pins',
            'Explain persistence of vision and how cinema frames produce fluid motion',
          ],
          textbookPages: 'Pages 202–221',
          suggestedInquiryHook: 'Why does a polished metal spoon reflect your face upside down on the front curve but right side up on the back curve?',
          status: 'not_started',
          linkedDesignCount: 0,
        },
      ],
    },
  ],
};

export const sampleGrade9PhysicsSyllabus: ClassroomSyllabus = {
  id: 'syl-g9-physics',
  classroomId: 'class-9-phys',
  title: 'Secondary Physics & Kinematics Curriculum — Class 9',
  subject: 'Physics',
  gradeLevel: 'Grade 9',
  curriculumBoard: 'CBSE / NCERT Secondary',
  textbookTitle: 'NCERT Science: Physics Modules (Grade 9)',
  textbookPublisher: 'NCERT',
  academicYear: '2025-2026',
  uploadedFiles: [
    {
      id: 'file-g9-phys-book',
      fileName: 'Grade9_Physics_Kinematics_Dynamics_Textbook.pdf',
      fileType: 'application/pdf',
      fileSize: '9.8 MB',
      uploadedAt: '2026-08-15',
      parsedSummary: 'Comprehensive secondary physics textbook chapters covering vectors, distance vs displacement, equations of motion, Newton’s laws, Universal Gravitation, and Work-Energy-Power.',
      detectedChaptersCount: 5,
    },
  ],
  units: [
    {
      id: 'unit-9-1',
      unitNumber: 1,
      title: 'Kinematics: Describing Motion in One Dimension',
      estimatedPeriods: 20,
      keyCompetencies: [
        'Distinguish scalar distance from vector displacement with graphical coordinates',
        'Derive and calculate kinematic variables using the 3 equations of motion',
      ],
      chapters: [
        {
          id: 'ch-9-1',
          chapterNumber: 8,
          title: 'Motion: Velocity, Acceleration & Graphs',
          keyConcepts: ['Reference Frame', 'Distance vs Displacement', 'Uniform vs Non-Uniform Acceleration', 'Velocity-Time Slope'],
          learningOutcomes: [
            'Interpret velocity-time graphs to compute acceleration and distance traveled (area under curve)',
            'Apply kinematic formulas to solve real-world vehicular deceleration',
          ],
          textbookPages: 'Pages 98–114',
          suggestedInquiryHook: 'Can an object have a constant speed but a constantly changing acceleration at every millisecond?',
          status: 'in_progress',
          linkedDesignCount: 1,
        },
      ],
    },
    {
      id: 'unit-9-2',
      unitNumber: 2,
      title: 'Dynamics: Force, Momentum & Newton’s Laws',
      estimatedPeriods: 22,
      keyCompetencies: [
        'Relate inertia to mass using Newton’s First Law',
        'Quantify momentum and impulse in collision dynamics using Newton’s Second and Third Laws',
      ],
      chapters: [
        {
          id: 'ch-9-2',
          chapterNumber: 9,
          title: 'Force and Laws of Motion',
          keyConcepts: ['Inertia of Rest & Motion', 'F = ma Derivation', 'Action-Reaction Pairs', 'Conservation of Linear Momentum'],
          learningOutcomes: [
            'Analyze cricket player hand-withdrawal while catching to understand time-extension and force minimization',
            'Calculate recoil velocity of firearms and rocket propulsion using momentum conservation',
          ],
          textbookPages: 'Pages 115–130',
          suggestedInquiryHook: 'Why does pulling your hands backwards when catching a hard leather cricket ball hurt 5 times less?',
          status: 'planning',
          linkedDesignCount: 0,
        },
        {
          id: 'ch-9-3',
          chapterNumber: 10,
          title: 'Gravitation & Fluid Flotation',
          keyConcepts: ['Universal Law of Gravitation (G)', 'Free Fall & Acceleration due to Gravity (g)', 'Mass vs Weight', 'Archimedes Principle'],
          learningOutcomes: [
            'Differentiate between universal constant G and local planetary acceleration g',
            'Explain why an iron ship weighing 10,000 tons floats on water while a tiny 2-gram iron needle sinks',
          ],
          textbookPages: 'Pages 131–145',
          suggestedInquiryHook: 'If the Earth pulls on the Moon with enormous gravitational force, why does the Moon not crash into us?',
          status: 'not_started',
          linkedDesignCount: 0,
        },
      ],
    },
  ],
};

export const sampleGrade7MathSyllabus: ClassroomSyllabus = {
  id: 'syl-g7-math',
  classroomId: 'class-7-math',
  title: 'Middle School Mathematical Foundations — Class 7',
  subject: 'Mathematics',
  gradeLevel: 'Grade 7',
  curriculumBoard: 'State Composite & NCERT',
  textbookTitle: 'NCERT Middle School Mathematics (Grade 7)',
  textbookPublisher: 'NCERT',
  academicYear: '2025-2026',
  uploadedFiles: [
    {
      id: 'file-g7-math-book',
      fileName: 'Grade7_Mathematics_NCERT_Full.pdf',
      fileType: 'application/pdf',
      fileSize: '8.4 MB',
      uploadedAt: '2026-08-20',
      parsedSummary: 'Core mathematics textbook covering integers on the number line, fractions & decimals, simple equations, lines & angles, and practical geometry.',
      detectedChaptersCount: 8,
    },
  ],
  units: [
    {
      id: 'unit-7-1',
      unitNumber: 1,
      title: 'Number Sense: Integers, Decimals & Fractions',
      estimatedPeriods: 25,
      keyCompetencies: [
        'Model negative numbers through real contexts of debt, elevation, and temperature',
        'Execute multi-step fraction operations with visual geometric tape models',
      ],
      chapters: [
        {
          id: 'ch-7-1',
          chapterNumber: 1,
          title: 'Integers: Signs and Operations',
          keyConcepts: ['Negative Numbers in Context', 'Addition/Subtraction on Number Line', 'Multiplication Rules (- × - = +)', 'Distributive Property'],
          learningOutcomes: [
            'Conceptualize why multiplying two negative quantities produces a positive direction',
            'Solve real temperature change and elevation word problems',
          ],
          textbookPages: 'Pages 1–28',
          suggestedInquiryHook: 'If you owe two people 5 rupees each, why does cancelling that debt mean you gained money?',
          status: 'completed',
          linkedDesignCount: 1,
        },
        {
          id: 'ch-7-2',
          chapterNumber: 4,
          title: 'Simple Linear Equations',
          keyConcepts: ['Variable Concept', 'Balancing Scales', 'Transposition Method', 'Word Problem Translation'],
          learningOutcomes: [
            'Formulate algebraic equations from everyday verbal riddles',
            'Solve one-variable linear equations by maintaining balance on both sides',
          ],
          textbookPages: 'Pages 77–92',
          suggestedInquiryHook: 'I thought of a mystery number, doubled it, added 7, and got 25. How can we uncover my number without guessing?',
          status: 'in_progress',
          linkedDesignCount: 0,
        },
      ],
    },
  ],
};

// -------------------------------------------------------------
// Multi-Classroom & Subject Sections
// -------------------------------------------------------------
export const initialClassrooms: ClassroomSection[] = [
  {
    id: 'class-8a',
    name: 'Grade 8 Science - Section A (Morning)',
    gradeLevel: 'Grade 8',
    sectionName: 'Section A',
    subject: 'Science & Environmental Thinking',
    academicYear: '2025-26',
    colorTheme: 'indigo',
    classroom: initialClassroomProfile,
    learners: initialLearnerProfile,
    syllabus: sampleGrade8ScienceSyllabus,
  },
  {
    id: 'class-8b',
    name: 'Grade 8 Science - Section B (Afternoon)',
    gradeLevel: 'Grade 8',
    sectionName: 'Section B',
    subject: 'Science & Environmental Thinking',
    academicYear: '2025-26',
    colorTheme: 'emerald',
    classroom: {
      ...initialClassroomProfile,
      dailyScheduleContext: 'Science is Period 6 (post-lunch drowsy slot). Needs high energy somatic activities.',
      classSize: 32,
      roomLayout: 'Clusters of 4 students per double table; easier for group work and peer dialogue.',
    },
    learners: {
      ...initialLearnerProfile,
      readingAndLanguageDiversity: 'Higher Hindi dominance: ~22 students require bilingual instruction; visual cards and dual-language terminology essential.',
      highInterestHooks: [
        'Cooking chemistry, street vendor food mechanics, local workshop tools, farming techniques',
        'Physical competitions, chalk drawings on benches',
      ],
    },
    syllabus: {
      ...sampleGrade8ScienceSyllabus,
      id: 'syl-g8-science-b',
      classroomId: 'class-8b',
    },
  },
  {
    id: 'class-9-phys',
    name: 'Grade 9 Physics & Scientific Reasoning',
    gradeLevel: 'Grade 9',
    sectionName: 'Section C',
    subject: 'Physics',
    academicYear: '2025-26',
    colorTheme: 'purple',
    classroom: {
      schoolName: 'Govt. Model Senior Secondary School',
      gradeLevel: 'Grade 9',
      subject: 'Physics',
      classSize: 40,
      periodLengthMinutes: 45,
      roomLayout: 'Traditional tiered lecture room with high benches and a raised teacher demonstration dais.',
      techAccess: 'none',
      techAccessDescription: 'Chalkboard only; no digital projector in this wing of the school.',
      languageContext: 'Mixed Hindi-English; students preparing for upcoming 10th board expectations.',
      dailyScheduleContext: 'Period 2 (morning peak mental clarity).',
    },
    learners: {
      priorKnowledgeGaps: [
        'Vector directionality (confusing speed and velocity)',
        'Algebraic rearrangement of formulas with fractions (e.g. v = u + at)',
      ],
      readingAndLanguageDiversity: 'Intermediate English comprehension; students can read textbooks independently if provided graphic organizers.',
      energyAndFocusDynamics: 'Serious and focused, but high anxiety regarding board exam memorization traps.',
      highInterestHooks: [
        'Sports motion: soccer knuckleball kicks, train stops, vehicle crashes, satellite orbits',
        'Solving counter-intuitive thought experiments',
      ],
      specificAccommodations: [
        '5 students with severe math anxiety (need step-by-step formula cards)',
      ],
      socioEmotionalClimate: 'Highly competitive peer dynamics; teacher actively builds collaborative problem solving.',
    },
    syllabus: sampleGrade9PhysicsSyllabus,
  },
  {
    id: 'class-7-math',
    name: 'Grade 7 Applied Mathematics',
    gradeLevel: 'Grade 7',
    sectionName: 'Section A',
    subject: 'Mathematics',
    academicYear: '2025-26',
    colorTheme: 'amber',
    classroom: {
      schoolName: 'Govt. Model Senior Secondary School',
      gradeLevel: 'Grade 7',
      subject: 'Mathematics',
      classSize: 34,
      periodLengthMinutes: 40,
      roomLayout: 'Standard 4-row desks with shared bench seating; chalkboards on two walls.',
      techAccess: 'none',
      techAccessDescription: 'Chalkboard only; math manipulative kits available in teacher cabinet.',
      languageContext: 'Bilingual Hindi/English; mathematical terms taught in dual language.',
      dailyScheduleContext: 'Period 1 (first hour of the morning).',
    },
    learners: {
      priorKnowledgeGaps: [
        'Multiplication tables beyond 12',
        'Conceptual intuition for negative numbers',
      ],
      readingAndLanguageDiversity: 'Strong oral comprehension; struggles with multi-sentence math word problems.',
      energyAndFocusDynamics: 'Playful, responsive to games, puzzles, and competitive board challenges.',
      highInterestHooks: [
        'Market shopping money transactions, cricket batting strike rates, card games',
      ],
      specificAccommodations: [
        '3 students benefit from physical counting beads and visual number line strips taped to desks.',
      ],
      socioEmotionalClimate: 'Warm and eager; students love being invited to write on the chalkboard.',
    },
    syllabus: sampleGrade7MathSyllabus,
  },
];

export const initialMemoryItems: MemoryItem[] = [
  // Tier 1: Teacher-Stated Beliefs
  {
    id: 'mem-1',
    tier: 'stated_belief',
    text: 'Students must grapple with a tangible problem or puzzle in pairs for at least 5 minutes before I introduce formal terminology or definitions.',
    category: 'philosophy',
    source: 'teacher_stated',
    dateAdded: '2026-08-15',
    status: 'active',
  },
  {
    id: 'mem-2',
    tier: 'stated_belief',
    text: 'No student should be penalized for using home language (Hindi) to articulate complex scientific reasoning.',
    category: 'pedagogy',
    source: 'teacher_stated',
    dateAdded: '2026-08-20',
    status: 'active',
  },
  {
    id: 'mem-3',
    tier: 'stated_belief',
    text: 'Homework must never require digital internet access or parental tutoring; it must be completely self-reliant or observational.',
    category: 'classroom_reality',
    source: 'teacher_stated',
    dateAdded: '2026-08-25',
    status: 'active',
  },

  // Tier 2: Teacher-Approved Inferences
  {
    id: 'mem-4',
    tier: 'approved_inference',
    text: 'When transition between group work and quiet synthesis exceeds 90 seconds, whole-class focus deteriorates. Clapped rhythm call-and-response works best.',
    category: 'classroom_reality',
    source: 'ai_inferred',
    dateAdded: '2026-08-28',
    status: 'active',
    notes: 'Teacher verified during debrief on Electricity Lab.',
  },
  {
    id: 'mem-5',
    tier: 'approved_inference',
    text: 'Exit tickets using dual format (1 written sentence + 1 sketch diagram) yield 40% higher participation than purely verbal questions.',
    category: 'pedagogy',
    source: 'ai_inferred',
    dateAdded: '2026-09-01',
    status: 'active',
  },

  // Tier 3: Srijan Inferences (Active Hypotheses awaiting review)
  {
    id: 'mem-6',
    tier: 'srijan_inference',
    text: 'Teacher tends to shorten Phase 4 (Diagnostic Assessment) to allow Phase 2 (Group Discourse) to run long when student engagement is high.',
    category: 'pedagogy',
    source: 'ai_inferred',
    dateAdded: '2026-09-04',
    status: 'pending_approval',
    notes: 'Observed across 3 recent co-designs. Awaiting teacher confirmation.',
  },
  {
    id: 'mem-7',
    tier: 'srijan_inference',
    text: 'Teacher prefers physical enactments (e.g. human particle chains) over textbook diagrams when introducing abstract microscopic mechanisms.',
    category: 'pedagogy',
    source: 'ai_inferred',
    dateAdded: '2026-09-05',
    status: 'pending_approval',
    notes: 'Inferred from Science Lab reflections.',
  },

  // Tier 4: Temporary Situational Context
  {
    id: 'mem-8',
    tier: 'temporary_context',
    text: 'Mid-term examinations start in 10 days. Class is feeling anxious and needs review scaffolds embedded into all new concept explorations.',
    category: 'situational',
    source: 'teacher_stated',
    dateAdded: '2026-09-05',
    status: 'active',
    expiresAt: '2026-09-15',
  },
];

export const sampleDesigns: EducationalDesignOutput[] = [
  {
    id: 'design-heat-transfer',
    title: 'Thermal Energy & Heat Transfer: Conduction in Daily Life',
    designType: 'lesson',
    topicPrompt: 'Design a 45-minute lesson on heat conduction for 36 Grade 8 students with zero individual student devices.',
    summary: 'A dialogic inquiry lesson using a physical butter demonstration and a whole-class human particle wave to make abstract molecular vibration intuitive before introducing definitions.',
    createdAt: '2026-09-04',
    classroomId: 'class-8a',
    chapterId: 'ch-8-4',
    content: {
      essentialQuestion: 'Why does a metal spoon burn your fingers in hot chai while a wooden stick remains cool to the touch?',
      bigIdeas: [
        'Heat is thermal kinetic energy moving from higher temperature to lower temperature particles.',
        'Conduction occurs through direct microscopic collisions between neighboring atoms without bulk matter movement.',
      ],
      objectives: [
        'Students will predict and observe heat transfer rates through steel, plastic, and wood.',
        'Students will enact the kinetic vibration model in pairs using somatic gesture.',
        'Students will explain in writing or diagram why cookware handles are insulated.',
      ],
      phases: [
        {
          phaseName: 'Phase 1: Concrete Phenomenon Hook',
          timeAllocationMinutes: 8,
          teacherAction: 'Place three identical spoons (steel, plastic, wood) in a bowl of near-boiling water. Stick a tiny pea onto the top handle of each spoon using cold butter. Ask students to silently predict which pea will drop first on their chalkboard slates.',
          studentAction: 'Observe the three spoons from their benches. Record their silent prediction and write ONE reason why.',
          scaffoldingAndMaterials: '1 bowl hot water, 3 spoons, 3 peas, butter, visual prediction stem on board.',
          pedagogicalRationale: 'Anchors learning in visual, suspenseful observation before any textbook jargon.',
        },
        {
          phaseName: 'Phase 2: Partner Grapple & Physical Enactment',
          timeAllocationMinutes: 14,
          teacherAction: 'Prompt students in bench pairs: "Why did the steel spoon drop its pea in 45 seconds while the wood pea is still frozen?" Circulate quietly with clipboard. Do NOT reveal the word "conduction".',
          studentAction: 'Turn to bench partner. Debate what happens inside the metal. Link elbows in pairs to simulate vibrating atoms bumping into each other.',
          scaffoldingAndMaterials: 'Bilingual Hindi/English sentence starter: "I think the heat moves because the atoms are... / मुझे लगता है गर्मी इसलिए आगे बढ़ती है क्योंकि..."',
          pedagogicalRationale: 'Honors teacher philosophy of dialogic peer grappling and bilingual safety.',
        },
        {
          phaseName: 'Phase 3: Shared Synthesis & Formalization',
          timeAllocationMinutes: 13,
          teacherAction: 'Invite two pairs (one who reasoned in Hindi, one in English) to demonstrate their elbow vibration to the room. Synthesize their insight into canonical terminology: Thermal Conduction & Conductors vs Insulators.',
          studentAction: 'Connect their peer demonstration to the teacher summary. Record the concept map in their science notebooks.',
          scaffoldingAndMaterials: 'Chalkboard dual-column diagram: Good Conductors vs Thermal Insulators.',
          pedagogicalRationale: 'Crowns student intuition with scientific nomenclature only after meaning is established.',
        },
        {
          phaseName: 'Phase 4: Low-Stakes Diagnostic Check',
          timeAllocationMinutes: 10,
          teacherAction: 'Display exit challenge on chalkboard: "Your uncle is designing a frying pan for street samosas. Which material should the pan body be, and which material should the handle be? Draw or write your reason."',
          studentAction: 'Complete the 3-minute exit slip on a quarter sheet of paper. Hand to teacher at the door.',
          scaffoldingAndMaterials: 'Choice of drawing diagram or writing 2 sentences.',
          pedagogicalRationale: 'Adheres to teacher assessment stance: low-stakes, formative, multiple modes of expression.',
        },
      ],
      differentiationTiers: [
        {
          tierName: 'Tier 1: Emerging Language Learners',
          studentReadiness: 'Understands concept through demonstration but hesitates in English writing.',
          taskPrompt: 'Draw the frying pan with arrows showing heat movement and label "Hot" / "Cool" in either English or Hindi.',
          support: 'Chalkboard icon reference and bilingual vocabulary bank.',
        },
        {
          tierName: 'Tier 2: Conceptual Extension',
          studentReadiness: 'Easily grasps conduction.',
          taskPrompt: 'Explain why birds fluff their feathers in winter in terms of trapped air and thermal conduction.',
          support: 'Open inquiry prompt.',
        },
      ],
      materialsNeeded: [
        '1 thermos of hot water',
        '3 spoons (Stainless steel, hard plastic, wooden ruler)',
        'Cold butter + 3 chickpeas or peas',
        'Chalk and student notebook quarter-slips',
      ],
      accommodations: [
        'Students with visual acuity seated in front row for clear view of spoon pea drops.',
        'High-energy students designated as pea timer recorders.',
      ],
    },
    reasoningMatrix: {
      recommendedApproach: 'Demonstration-Driven Physical Dialogic Model',
      pedagogicalRationale: 'Directly mirrors the teacher’s core belief in concrete phenomena before canonical nomenclature, while respecting the physical reality of a 36-student crowded room without student devices.',
      philosophyAlignment: [
        'Withholds premature definitions to cultivate student intellectual struggle.',
        'Allows full bilingual participation in partner discourse without penalization.',
        'Protects student agency by offering exit check choice between drawing and writing.',
      ],
      classroomContextFit: [
        'Requires zero student electronic devices.',
        'Eliminates crowded aisle congestion in 3-row bench arrangement.',
        'Fits cleanly within 45-minute period with 2 minutes buffer before pre-lunch bell.',
      ],
      alternativesConsidered: [
        {
          approach: '6 Small-Group Lab Stations with Hot Water',
          pros: 'Hands-on tactile agency for every single student.',
          cons: 'Severe burn risk in narrow rows, high chaos, takes 25 minutes just to distribute hot water.',
          whyDeprioritized: 'Logistical hazards would overwhelm cognitive learning goals.',
        },
        {
          approach: 'Slide Lecture with Textbook Chapter Reading',
          pros: 'Zero safety risk, 100% predictable time management.',
          cons: 'Completely passive; violates teacher core philosophy of epistemic struggle.',
          whyDeprioritized: 'Rob students of intellectual dignity and authentic curiosity.',
        },
      ],
      educationalTradeoffs: [
        {
          gain: 'High safety, zero equipment chaos, deep cognitive discourse for all 36 students.',
          costOrSacrifice: 'Students do not get to physically hold the hot apparatus themselves.',
          mitigationStrategy: 'Substituted with the seated physical elbow-vibration wave to retain somatic physical understanding of particle collisions.',
        },
      ],
    },
    isSavedToLibrary: true,
  },
];

export const sampleReflections: PostLessonReflection[] = [
  {
    id: 'ref-heat-lesson',
    designId: 'design-heat-transfer',
    lessonTitle: 'Thermal Energy & Heat Transfer: Conduction in Daily Life',
    date: '2026-09-04',
    whatActuallyHappened: 'The butter demonstration hooked the students immediately. Partner talk was vibrant, and almost all pairs engaged in the elbow wave. However, the classroom was very hot, and students got distracted by the smell of midday meal cooking outside during Phase 3.',
    studentEngagementScore: 4,
    timePacingOutcome: 'ran_out_of_time',
    unforeseenFrictions: 'Phase 3 whole-class discussion ran 5 minutes over because four students had competing arguments about whether air conducts heat. As a result, Phase 4 Exit Slip was rushed in 3 minutes.',
    celebrations: 'Rohan, who usually stays quiet due to English hesitation, stood up and explained the particle vibration in fluent Hindi with amazing clarity! The class applauded him.',
    intentionVsPracticeDissonance: {
      summary: 'Dissonance between Teacher Desire for Organic Discussion and the Rigid 45-Minute Period Boundary',
      alignments: [
        'Honored the non-negotiable principle: students grappled with the phenomenon before definitions.',
        'Linguistic freedom: allowing Rohan to explain in Hindi created deep peer understanding and psychological safety.',
      ],
      dissonances: [
        {
          intendedPrinciple: 'Conduct a thorough low-stakes diagnostic exit slip to assess every child before the bell.',
          actualClassroomReality: 'Exit slip was compressed to 3 minutes, meaning 8 students only scribbled incomplete fragments.',
          underlyingDriver: 'Teacher allowed the spontaneous air-conduction debate to continue because it felt like rich learning, without realizing the clock had run down.',
          remedyStrategy: 'Use a physical timer and establish a "Parking Lot on the Chalkboard" for fascinating rabbit-hole questions to preserve the diagnostic exit window.',
        },
      ],
      systemicInsights: 'The tension between rich dialogic rabbit-holes and diagnostic closure is a signature mark of thoughtful teachers. Structural guardrails (like a visual 5-min bell chime) help protect formative checks without shutting down curiosity.',
      suggestedMemoryRefinement: {
        tier: 'approved_inference',
        proposedText: 'When student curiosity opens an unplanned conceptual tangent, place it on the "Curiosity Board" rather than sacrificing the final diagnostic exit check.',
      },
      empoweringClosingNote: 'Rohan’s breakthrough in Hindi is the ultimate vindication of your philosophy. You created the safety he needed to shine.',
    },
  },
];

export const philosophyDiscoveryQuestions: PhilosophyDiscoveryQuestion[] = [
  {
    id: 'dilemma-1',
    dilemmaTitle: 'The Premature Definition Dilemma',
    prompt: 'You are introducing an abstract scientific concept (e.g. Electric Resistance or Density). A textbook definition exists on page 42. How do you begin?',
    options: [
      {
        label: 'Concept First, Nomenclature Later',
        stance: 'Students must play with a physical puzzle or observe a mystery phenomenon first. We name the scientific term only after they have experienced the mechanism.',
        underlyingPhilosophy: 'Dialogic Constructivism & Epistemic Grappling',
      },
      {
        label: 'Direct Instruction with Immediate Guided Practice',
        stance: 'Introduce the clear definition and formula first to prevent misconception drift, then scaffold students through rigorous practice problems.',
        underlyingPhilosophy: 'Explicit Instruction & Cognitive Load Optimization',
      },
      {
        label: 'Socratic Guided Questioning',
        stance: 'Ask open questions to elicit students prior intuitions, bridging their everyday analogies into the formal concept.',
        underlyingPhilosophy: 'Guided Inquiry & Relational Sense-Making',
      },
    ],
    openReflectionPrompt: 'In your own words: Why do you choose this path, and what do you believe happens in a student’s mind when a teacher explains too soon?',
  },
  {
    id: 'dilemma-2',
    dilemmaTitle: 'The Productive Struggle vs. Classroom Chaos Tension',
    prompt: 'When students work in pairs on a difficult task and 40% are visibly confused or struggling, what is your instinct?',
    options: [
      {
        label: 'Protect the Struggle',
        stance: 'Withhold answers. Give a thinking prompt or ask a peer pair to cross-pollinate ideas. Struggle is where neural connections form.',
        underlyingPhilosophy: 'High Intellectual Agency & Growth Mindset',
      },
      {
        label: 'Timely Scaffold Intervention',
        stance: 'Intervene with a tiered hint card or mini-demonstration so productive struggle does not metastasize into helplessness or behavioral disruption.',
        underlyingPhilosophy: 'Scaffolded Zone of Proximal Development',
      },
      {
        label: 'Whole-Class Diagnostic Pause',
        stance: 'Pause everyone immediately. Bring the spotlight to one student’s half-formed mistake and discuss it collectively as a puzzle.',
        underlyingPhilosophy: 'Normalizing Errors as Collaborative Diagnostic Tools',
      },
    ],
    openReflectionPrompt: 'How do you know the difference between "productive struggle" and "damaging frustration" in your specific room?',
  },
  {
    id: 'dilemma-3',
    dilemmaTitle: 'The Assessment & Error Stance',
    prompt: 'A student completes an exit ticket with an earnest but fundamentally flawed scientific misconception. How do you treat this artifact?',
    options: [
      {
        label: 'Diagnostic Window into Mental Models',
        stance: 'The error is brilliant data. It shows their current logic in progress. I will use it anonymously tomorrow as our warmup puzzle.',
        underlyingPhilosophy: 'Diagnostic & Non-Punitive Formative Assessment',
      },
      {
        label: 'Individual Written Feedback & Prompt for Revision',
        stance: 'Write a clarifying guiding question on their paper and require them to re-attempt the reasoning before earning mastery.',
        underlyingPhilosophy: 'Mastery-Oriented Feedback Loop',
      },
      {
        label: 'Calibrated Benchmark Tracking',
        stance: 'Record the standard deficit into progress metrics and group with similar students for targeted remedial intervention.',
        underlyingPhilosophy: 'Data-Driven Systematic Remediation',
      },
    ],
    openReflectionPrompt: 'What message do you hope your grading and feedback sends to a student who tries hard but fails the first time?',
  },
];

export const initialPhilosophy = initialTeacherPhilosophy;
export const initialClassroom = initialClassroomProfile;
export const initialLearners = initialLearnerProfile;
export const initialSavedDesigns = sampleDesigns;
export const initialReflections = sampleReflections;
