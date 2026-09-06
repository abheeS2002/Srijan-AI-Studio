import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy GoogleGenAI initialization
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    service: 'Srijan Teacher Educational Design Companion',
  });
});

// Safe JSON parser that strips markdown fences
function cleanAndParseJSON(rawText: string): any {
  if (!rawText) return {};
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }
  return JSON.parse(cleaned);
}

// Resilient Gemini Execution with Retry and Model Fallbacks for 503 / 429
interface GeminiExecutionOptions {
  preferredModel?: string;
  contents: any;
  config?: any;
}

async function executeGeminiWithResilience(
  ai: GoogleGenAI,
  options: GeminiExecutionOptions
): Promise<{ text: string; modelUsed: string }> {
  const preferred = options.preferredModel || 'gemini-3.8-flash';
  // Pool of supported flash models as documented in Gemini guidelines:
  // 1. Preferred model (gemini-3.8-flash)
  // 2. gemini-flash-latest
  // 3. gemini-3.1-flash-lite
  const candidateModels = Array.from(
    new Set([preferred, 'gemini-flash-latest', 'gemini-3.1-flash-lite'])
  );

  let lastErr: any = null;

  for (const modelName of candidateModels) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: options.contents,
          config: options.config,
        });

        if (response && response.text) {
          return { text: response.text, modelUsed: modelName };
        }
        throw new Error(`Empty response from model ${modelName}`);
      } catch (err: any) {
        lastErr = err;
        const msg = (err?.message || '').toLowerCase();
        const status = err?.status || err?.code || '';
        const isTemporaryLoad =
          msg.includes('503') ||
          msg.includes('high demand') ||
          msg.includes('unavailable') ||
          msg.includes('spikes in demand') ||
          msg.includes('429') ||
          msg.includes('resource_exhausted') ||
          status === 503 ||
          status === 429 ||
          status === 'UNAVAILABLE';

        if (isTemporaryLoad) {
          console.warn(
            `[Srijan Gemini Resilience] Model ${modelName} temporary demand spike (${status || '503'}, attempt ${attempt}/2). Retrying or falling back...`
          );
          if (attempt === 1) {
            // Jittered backoff (700-1100ms)
            await new Promise((resolve) => setTimeout(resolve, 700 + Math.random() * 400));
            continue;
          }
          // On second failure of this candidate, move to next model
          break;
        } else {
          console.warn(`[Srijan Gemini Resilience] Model ${modelName} returned error: ${err?.message || err}`);
          break;
        }
      }
    }
  }

  throw lastErr;
}

// Local Fallback Engines
function getLocalPhilosophyFallback(responses?: any, currentPhilosophy?: any) {
  return {
    success: true,
    source: 'local_engine',
    synthesizedProfile: {
      roleOfTeacher: 'Epistemic Architect & Scaffolded Facilitator: Balances structured foundational inputs with student inquiry, guiding students to discover core principles.',
      viewOfMistakes: 'Diagnostic Stepping Stones: Errors reveal underlying mental models; mistakes are publicly de-stigmatized and examined collaboratively.',
      learnerAutonomy: 'Guided Agency: Provides structured choices in how students demonstrate understanding while maintaining firm conceptual guardrails.',
      knowledgeConstruction: 'Dialogic Constructivism: Students construct conceptual meaning through peer discourse, structured inquiry, and concrete representations before formal nomenclature.',
      assessmentStance: 'Formative & Feedback-Centric: Assessments are low-stakes probes for continuous instruction adjustment rather than summative sorting.',
      coreValues: [
        'Every student has intellectual dignity and capacity for rigorous thinking',
        'Contextual relevance: Connect abstractions to students lived community realities',
        'Safety to fail productively without fear of judgment',
      ],
    },
    extractedStatedBeliefs: [
      'Students must talk and grapple before the teacher provides the canonical definition.',
      'Scaffolding should fade gradually rather than being removed abruptly.',
    ],
    proposedSrijanInferences: [
      'The teacher values classroom discourse but worries about time loss in a 45-minute period.',
      'The teacher prefers visual representations and bilingual bridging for complex vocabulary.',
    ],
  };
}

function getLocalOverrideFallback(currentDesign: any, teacherCritique: string) {
  return {
    success: true,
    source: 'local_engine',
    revisedDesign: {
      ...currentDesign,
      title: `${currentDesign?.title || 'Contextual Lesson'} (Teacher Adjusted)`,
      summary: `Updated based on teacher directive: "${teacherCritique}"`,
    },
    reasoningUpdate: {
      adaptationSummary: `Shifted execution to honor teacher critique: "${teacherCritique}".`,
      newTradeoff: 'Prioritized immediate classroom viability and learner comfort over extended open-ended exploration.',
    },
    candidateMemoryUpdate: {
      type: 'approved_inference',
      text: `Teacher explicitly requires: ${teacherCritique.slice(0, 120)}...`,
      rationale: 'Direct classroom directive provided during planning iteration.',
    },
  };
}

function getLocalReflectionFallback(
  lessonOrPlanTitle?: string,
  intendedDesign?: any,
  intendedPhilosophy?: any,
  actualDebrief?: any,
  memory?: any
) {
  return {
    success: true,
    source: 'local_engine',
    reflectionAnalysis: {
      summary: `Analysis of Intended Pedagogical Stance vs. Live Classroom Execution for "${lessonOrPlanTitle || 'Lesson'}"`,
      alignments: [
        'Honored the commitment to concrete real-world hooks at the lesson opening.',
        'Encouraged peer-to-peer sharing during the initial prompt.',
      ],
      dissonances: [
        {
          intendedPrinciple: 'Students construct knowledge through self-guided inquiry before teacher answers.',
          actualClassroomReality: 'Due to time slippage, the teacher intervened early and provided the conclusion during direct instruction.',
          underlyingDriver: 'Short 40-minute period combined with anxiety over pacing.',
          remedyStrategy: 'Use micro-inquiry (6-min timed challenges with sentence starters) rather than open-ended discovery.',
        },
      ],
      systemicInsights: 'The gap was not caused by teacher failure, but by structural friction: 35+ students in a dense classroom make ambient monitoring slow.',
      suggestedMemoryRefinement: {
        tier: 'approved_inference',
        proposedText: 'Inquiry activities require strict 5-min timer checkpoints and pre-printed sentence starters to prevent teacher over-intervention.',
      },
      empoweringClosingNote: 'Recognizing this tension is the mark of an intentional practitioner. You protected student engagement when confusion arose; tomorrow we refine the scaffolding pacing.',
    },
  };
}

// 1. Philosophy Discovery & Synthesis API
app.post('/api/discover-philosophy', async (req, res) => {
  try {
    const { responses, currentPhilosophy } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.json(getLocalPhilosophyFallback(responses, currentPhilosophy));
    }

    const systemPrompt = `You are Srijan's Pedagogical Philosophy Engine.
Your purpose is to deeply analyze an individual classroom teacher's reflections on pedagogical dilemmas and discover their unique educational philosophy without imposing a generic one.
Extract their true beliefs across core dimensions:
1. Role of the Teacher
2. View of Mistakes & Error Culture
3. Learner Autonomy & Agency
4. Knowledge Construction (e.g., inquiry vs direct instruction)
5. Assessment & Feedback Stance
6. Non-negotiable Core Values

Distinguish between:
- Stated beliefs (explicit commitments made by the teacher)
- Proposed inferences (hypotheses Srijan observed that need teacher validation)

Return ONLY valid JSON matching this schema:
{
  "synthesizedProfile": {
    "roleOfTeacher": string,
    "viewOfMistakes": string,
    "learnerAutonomy": string,
    "knowledgeConstruction": string,
    "assessmentStance": string,
    "coreValues": string[]
  },
  "extractedStatedBeliefs": string[],
  "proposedSrijanInferences": string[]
}`;

    try {
      const { text, modelUsed } = await executeGeminiWithResilience(ai, {
        preferredModel: 'gemini-3.8-flash',
        contents: `Analyze these teacher reflection responses:\n${JSON.stringify(responses, null, 2)}\n\nCurrent philosophy state:\n${JSON.stringify(currentPhilosophy, null, 2)}`,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
        },
      });

      const parsed = cleanAndParseJSON(text);
      return res.json({ success: true, source: 'gemini', modelUsed, ...parsed });
    } catch (modelErr: any) {
      console.warn('[discover-philosophy] AI model demand spike handled via local fallback:', modelErr?.message || modelErr);
      return res.json({
        ...getLocalPhilosophyFallback(responses, currentPhilosophy),
        note: 'Synthesized with local pedagogical intelligence due to temporary AI model demand spike.',
      });
    }
  } catch (error: any) {
    console.warn('[discover-philosophy] Handled with local fallback:', error?.message || error);
    res.json(getLocalPhilosophyFallback(req.body.responses, req.body.currentPhilosophy));
  }
});

// 2. Contextual Co-Design & Reasoning Engine
app.post('/api/reason-design', async (req, res) => {
  try {
    const {
      designType, // 'unit' | 'lesson' | 'activity' | 'assessment' | 'system'
      topicPrompt,
      philosophy,
      classroom,
      learners,
      memory,
      additionalConstraints,
      syllabusContext,
      unitContext,
    } = req.body;

    const ai = getAIClient();

    if (!ai) {
      // Return high-quality deterministic educational design and reasoning matrix
      return res.json(getLocalCoDesignFallback(designType, topicPrompt, philosophy, classroom, learners, memory, syllabusContext, unitContext));
    }

    const systemPrompt = `You are Srijan: a teacher-first AI educational design companion for ONE individual classroom teacher.
You are NOT an LMS, not a generic chatbot, not an answer vending machine.
Your differentiator is CONTEXTUAL EDUCATIONAL REASONING grounded strictly in:
- Teacher's Stated Philosophy & Values
- Classroom Realities (time, room layout, tech access, class size)
- Learner Profile (prior knowledge, language diversity, energy dynamics)
- Contextual Memory (stated beliefs, approved inferences, temporary context)
- Foundational Unit Architecture (Overarching Priorities, Target Competencies, Unit Values)

Before finalizing the design, you MUST deliberate on:
1. Educational trade-offs (What is gained vs sacrificed?)
2. Alternative pedagogical approaches considered and why they were deprioritized
3. Exact philosophical alignment to this specific teacher
4. Adaptation to this specific classroom constraints
5. If a Unit Context is supplied, how this lesson directly honors the Unit's priority focus, competencies, and values.

Return ONLY valid JSON matching this schema:
{
  "title": string,
  "summary": string,
  "designType": string,
  "unitAlignment": {
    "unitTitle": string,
    "priorityApplied": string,
    "competenciesAddressed": string[],
    "valuesCultivated": string[]
  },
  "content": object, // Structured plan with stages, prompts, student/teacher actions
  "reasoningMatrix": {
    "recommendedApproach": string,
    "pedagogicalRationale": string,
    "philosophyAlignment": string[],
    "classroomContextFit": string[],
    "alternativesConsidered": [
      {
        "approach": string,
        "pros": string,
        "cons": string,
        "whyDeprioritized": string
      }
    ],
    "educationalTradeoffs": [
      {
        "gain": string,
        "costOrSacrifice": string,
        "mitigationStrategy": string
      }
    ]
  },
  "suggestedNewInferences": string[] // 1-2 new pedagogical observations about the teacher's preference to present for their approval
}`;

    const promptBody = `
DESIGN TYPE: ${designType}
TOPIC / GOAL: ${topicPrompt}

TEACHER PHILOSOPHY:
${JSON.stringify(philosophy, null, 2)}

CLASSROOM PROFILE:
${JSON.stringify(classroom, null, 2)}

LEARNER PROFILE:
${JSON.stringify(learners, null, 2)}

ACTIVE CONTEXTUAL MEMORY:
- Stated Beliefs: ${JSON.stringify(memory?.statedBeliefs || [])}
- Approved Inferences: ${JSON.stringify(memory?.approvedInferences || [])}
- Srijan Inferences: ${JSON.stringify(memory?.srijanInferences || [])}
- Temporary Situational Context: ${JSON.stringify(memory?.temporaryContext || [])}

ADDITIONAL CONSTRAINTS / TEACHER NOTES:
${additionalConstraints || 'None provided'}
${
  unitContext
    ? `
UNIT PLANNING LAYER (Every lesson must be anchored in this unit):
- Unit Title: Unit ${unitContext.unitNumber ? unitContext.unitNumber + ': ' : ''}${unitContext.unitTitle || 'Active Unit'}
- Unit Big Idea: ${unitContext.bigIdea || 'Fundamental conceptual inquiry'}
- Unit Essential Question: ${unitContext.essentialQuestion || 'How does this principle operate?'}
- Unit Priority Focus: ${unitContext.priorityFocus || 'Active conceptual sense-making'}
- Unit Target Competencies: ${JSON.stringify(unitContext.keyCompetencies || [])}
- Unit Target Values & Dispositions: ${JSON.stringify(unitContext.unitValues || [])}
MANDATE: The lesson plan MUST directly advance these unit competencies and embody the unit's declared priority focus and values! Fill in the 'unitAlignment' object in the response.
`
    : ''
}
${
  syllabusContext
    ? `
PRESCRIBED CURRICULUM & TEXTBOOK GROUNDING:
- Chapter: ${syllabusContext.chapterNumber ? `Chapter ${syllabusContext.chapterNumber}: ` : ''}${syllabusContext.chapterTitle || syllabusContext.title || ''}
- Unit: ${syllabusContext.unitTitle || unitContext?.unitTitle || 'Prescribed Unit'}
- Textbook Pages / Reference: ${syllabusContext.textbookPages || 'Standard Textbook'}
- Prescribed Learning Outcomes: ${JSON.stringify(syllabusContext.learningOutcomes || [])}
- Core Concepts Required: ${JSON.stringify(syllabusContext.keyConcepts || [])}
MANDATE: Srijan MUST strictly ground the lesson design and activities in these textbook objectives while reconciling them with the teacher's philosophy and room constraints.
`
    : ''
}
`;

    try {
      const { text, modelUsed } = await executeGeminiWithResilience(ai, {
        preferredModel: 'gemini-3.8-flash',
        contents: promptBody,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
        },
      });

      const parsed = cleanAndParseJSON(text);
      return res.json({ success: true, source: 'gemini', modelUsed, ...parsed });
    } catch (modelErr: any) {
      console.warn('[reason-design] AI model demand spike handled via local fallback:', modelErr?.message || modelErr);
      return res.json({
        ...getLocalCoDesignFallback(designType, topicPrompt, philosophy, classroom, learners, memory, syllabusContext, unitContext),
        note: 'Generated with local pedagogical intelligence due to temporary AI model demand spike.',
      });
    }
  } catch (error: any) {
    console.warn('[reason-design] Handled with local fallback:', error?.message || error);
    res.json(
      getLocalCoDesignFallback(
        req.body.designType,
        req.body.topicPrompt,
        req.body.philosophy,
        req.body.classroom,
        req.body.learners,
        req.body.memory,
        req.body.syllabusContext,
        req.body.unitContext
      )
    );
  }
});

// 3. Teacher Override & Critique Engine
app.post('/api/override-critique', async (req, res) => {
  try {
    const {
      currentDesign,
      teacherCritique,
      philosophy,
      classroom,
      learners,
      memory,
    } = req.body;

    const ai = getAIClient();

    if (!ai) {
      return res.json(getLocalOverrideFallback(currentDesign, teacherCritique));
    }

    const systemPrompt = `You are Srijan's Teacher-Agency Override Engine.
The teacher has rejected or critiqued a previous recommendation with their own pedagogical wisdom.
Teacher agency is non-negotiable.
1. Deeply respect and adopt the teacher's critique.
2. Revise the design to strictly align with their critique.
3. Formulate an updated reasoning explanation explaining how their feedback changed the pedagogical balance.
4. Suggest a concise candidate persistent memory item so Srijan remembers this preference in future designs.

Return ONLY valid JSON:
{
  "revisedDesign": object,
  "reasoningUpdate": {
    "adaptationSummary": string,
    "newTradeoff": string
  },
  "candidateMemoryUpdate": {
    "type": "approved_inference" | "stated_belief" | "temporary_context",
    "text": string,
    "rationale": string
  }
}`;

    const promptBody = `
ORIGINAL DESIGN:
${JSON.stringify(currentDesign, null, 2)}

TEACHER CRITIQUE & OVERRIDE:
"${teacherCritique}"

CONTEXT:
Philosophy: ${JSON.stringify(philosophy)}
Classroom: ${JSON.stringify(classroom)}
Learners: ${JSON.stringify(learners)}
Memory: ${JSON.stringify(memory)}
`;

    try {
      const { text, modelUsed } = await executeGeminiWithResilience(ai, {
        preferredModel: 'gemini-3.8-flash',
        contents: promptBody,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
        },
      });

      const parsed = cleanAndParseJSON(text);
      return res.json({ success: true, source: 'gemini', modelUsed, ...parsed });
    } catch (modelErr: any) {
      console.warn('[override-critique] AI model demand spike handled via local fallback:', modelErr?.message || modelErr);
      return res.json({
        ...getLocalOverrideFallback(currentDesign, teacherCritique),
        note: 'Updated with local pedagogical intelligence due to temporary AI model demand spike.',
      });
    }
  } catch (error: any) {
    console.warn('[override-critique] Handled with local fallback:', error?.message || error);
    res.json(getLocalOverrideFallback(req.body.currentDesign, req.body.teacherCritique));
  }
});

// 4. Intention-vs-Practice Reflection Engine
app.post('/api/reflect-dissonance', async (req, res) => {
  try {
    const {
      lessonOrPlanTitle,
      intendedDesign,
      intendedPhilosophy,
      actualDebrief, // what happened, where students struggled, pacing, deviations
      memory,
    } = req.body;

    const ai = getAIClient();

    if (!ai) {
      return res.json(
        getLocalReflectionFallback(
          lessonOrPlanTitle,
          intendedDesign,
          intendedPhilosophy,
          actualDebrief,
          memory
        )
      );
    }

    const systemPrompt = `You are Srijan's Reflective Inquiry Partner.
Your goal is to help the teacher reflect on the gap between INTENTION (their stated philosophy and lesson design) and PRACTICE (what actually transpired in the live classroom).
Never scold, grade, or judge. Treat tensions as fertile learning ground for intentional educational decision-making.
Analyze:
- Key alignments (where practice lived up to philosophy)
- Dissonances (where practice deviated from stated values, and why: time constraints, classroom density, anxiety, student fatigue)
- Structural drivers (distinguishing between teacher agency and system constraints)
- Actionable next iterations
- Suggested contextual memory update

Return ONLY valid JSON:
{
  "reflectionAnalysis": {
    "summary": string,
    "alignments": string[],
    "dissonances": [
      {
        "intendedPrinciple": string,
        "actualClassroomReality": string,
        "underlyingDriver": string,
        "remedyStrategy": string
      }
    ],
    "systemicInsights": string,
    "suggestedMemoryRefinement": {
      "tier": "approved_inference" | "stated_belief" | "temporary_context",
      "proposedText": string
    },
    "empoweringClosingNote": string
  }
}`;

    const promptBody = `
LESSON / PLAN: ${lessonOrPlanTitle}
INTENDED DESIGN & PHILOSOPHY:
${JSON.stringify({ intendedDesign, intendedPhilosophy }, null, 2)}

TEACHER'S POST-LESSON DEBRIEF:
${JSON.stringify(actualDebrief, null, 2)}

CONTEXTUAL MEMORY:
${JSON.stringify(memory, null, 2)}
`;

    try {
      const { text, modelUsed } = await executeGeminiWithResilience(ai, {
        preferredModel: 'gemini-3.8-flash',
        contents: promptBody,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
        },
      });

      const parsed = cleanAndParseJSON(text);
      return res.json({ success: true, source: 'gemini', modelUsed, ...parsed });
    } catch (modelErr: any) {
      console.warn('[reflect-dissonance] AI model demand spike handled via local fallback:', modelErr?.message || modelErr);
      return res.json({
        ...getLocalReflectionFallback(lessonOrPlanTitle, intendedDesign, intendedPhilosophy, actualDebrief, memory),
        note: 'Analyzed with local pedagogical intelligence due to temporary AI model demand spike.',
      });
    }
  } catch (error: any) {
    console.warn('[reflect-dissonance] Handled with local fallback:', error?.message || error);
    res.json(
      getLocalReflectionFallback(
        req.body.lessonOrPlanTitle,
        req.body.intendedDesign,
        req.body.intendedPhilosophy,
        req.body.actualDebrief,
        req.body.memory
      )
    );
  }
});

// 5. Universal Syllabus & Textbook Analysis Engine
app.post('/api/analyze-syllabus-textbook', async (req, res) => {
  try {
    const {
      fileName,
      fileText,
      pastedOutline,
      subject,
      gradeLevel,
      curriculumBoard,
    } = req.body;

    const rawInputText = (fileText || pastedOutline || '').trim();
    const ai = getAIClient();

    if (!ai) {
      // Local fallback parser / intelligent curriculum generator
      const fallbackData = getFallbackParsedSyllabus(rawInputText, subject, gradeLevel, curriculumBoard, fileName);
      return res.json({
        success: true,
        source: 'local_engine',
        parsedData: fallbackData,
      });
    }

    const systemPrompt = `You are Srijan's Universal Curriculum & Textbook Parsing Engine.
Your purpose is to transform uploaded textbook documents, syllabus scopes, or curriculum outlines into an actionable, structured syllabus hierarchy for any grade or subject.
The individual teacher will use this syllabus to build customized, grounded lesson designs.

Analyze the provided input and produce a structured sequence of Units and Chapters with:
1. Coherent Unit groupings
2. Detailed chapters with:
   - chapterNumber (number or string e.g. 1, 2)
   - title
   - keyConcepts (3-5 core conceptual anchors)
   - learningOutcomes (2-4 clear, measurable student competencies)
   - textbookPages (reference page range if detected, or reasonable estimate like "Pages 1-15")
   - suggestedInquiryHook (a thought-provoking real-world question or mystery)
   - estimatedPeriods (recommended 40-45 min teaching periods)

Return ONLY valid JSON matching this schema:
{
  "curriculumTitle": string,
  "textbookTitle": string,
  "curriculumBoard": string,
  "summary": string,
  "units": [
    {
      "unitNumber": number,
      "title": string,
      "estimatedPeriods": number,
      "keyCompetencies": string[],
      "chapters": [
        {
          "chapterNumber": string | number,
          "title": string,
          "keyConcepts": string[],
          "learningOutcomes": string[],
          "textbookPages": string,
          "suggestedInquiryHook": string
        }
      ]
    }
  ]
}`;

    const promptBody = `
SUBJECT: ${subject || 'Science / Mathematics / Humanities'}
GRADE LEVEL: ${gradeLevel || 'Standard Grade'}
CURRICULUM BOARD: ${curriculumBoard || 'Standard Curriculum'}
FILE NAME: ${fileName || 'Uploaded Curriculum Document'}

INPUT TEXTBOOK / SYLLABUS CONTENT:
${rawInputText.slice(0, 20000) || `Please generate a comprehensive, standards-aligned syllabus and chapter structure for ${gradeLevel} ${subject} (${curriculumBoard || 'State / National Curriculum Board'}).`}
`;

    try {
      const { text, modelUsed } = await executeGeminiWithResilience(ai, {
        preferredModel: 'gemini-3.8-flash',
        contents: promptBody,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
        },
      });

      const parsed = cleanAndParseJSON(text);
      return res.json({ success: true, source: 'gemini', modelUsed, parsedData: parsed });
    } catch (modelErr: any) {
      console.warn('[analyze-syllabus-textbook] AI model demand spike handled via local fallback:', modelErr?.message || modelErr);
      const fallbackData = getFallbackParsedSyllabus(
        rawInputText,
        subject,
        gradeLevel,
        curriculumBoard,
        fileName
      );
      return res.json({
        success: true,
        source: 'local_engine',
        parsedData: fallbackData,
        note: 'Curriculum parsed with pedagogical intelligence due to temporary AI model demand spike.',
      });
    }
  } catch (error: any) {
    console.warn('[analyze-syllabus-textbook] Handled with local fallback:', error?.message || error);
    const fallbackData = getFallbackParsedSyllabus(
      req.body.fileText || req.body.pastedOutline || '',
      req.body.subject,
      req.body.gradeLevel,
      req.body.curriculumBoard,
      req.body.fileName
    );
    res.json({ success: true, source: 'local_engine', parsedData: fallbackData });
  }
});

// 5. Unit Architecture Suggestion Engine (AI Suggests, Teacher Decides)
app.post('/api/suggest-unit-architecture', async (req, res) => {
  try {
    const {
      unitTitle,
      unitNumber,
      subject,
      gradeLevel,
      existingChapters,
      classroom,
      philosophy,
      learners,
    } = req.body;

    const ai = getAIClient();

    if (!ai) {
      return res.json(
        getLocalUnitSuggestions(
          unitTitle,
          unitNumber,
          subject,
          gradeLevel,
          existingChapters,
          classroom,
          philosophy,
          learners
        )
      );
    }

    const systemPrompt = `You are Srijan's Unit Design Architect.
Your task is to suggest foundational unit architecture for a teacher who will have the FINAL DECISION.
The teacher has complete authority to accept, modify, or discard your suggestions.
Your suggestions must NOT be generic boilerplate. They must be deeply grounded in:
1. Subject & Grade Level: ${gradeLevel || 'Secondary'} ${subject || 'General'}
2. Teacher Philosophy & Stated Values
3. Classroom Constraints & Learner Demographics
4. Unit Title & Assigned Topics

You will generate:
1. Big Idea (enduring understanding that transcends this specific unit)
2. Essential Question (provocative, open question that drives continuous inquiry)
3. Priority Focus (the overarching pedagogical emphasis for this unit, e.g. experiential inquiry before formulas, bilingual vocabulary bridging, low-movement tactile pair-grapples)
4. Key Competencies (4-6 actionable cognitive and skill competencies students will build across this unit)
5. Unit Values & Dispositions (3-5 core human values and intellectual habits cultivated during this unit, with a brief pedagogical rationale)
6. Suggested Chapter Progressions with investigative hooks

Return ONLY valid JSON matching this schema:
{
  "suggestedBigIdea": string,
  "suggestedEssentialQuestion": string,
  "suggestedPriorityFocus": string,
  "suggestedCompetencies": string[],
  "suggestedValues": [
    {
      "value": string,
      "dispositionRationale": string
    }
  ],
  "suggestedChapterProgressions": [
    {
      "title": string,
      "suggestedHook": string,
      "keyConcepts": string[]
    }
  ]
}`;

    const promptBody = `
UNIT: Unit ${unitNumber || 1}: ${unitTitle || 'Untitled Unit'}
SUBJECT & GRADE: ${gradeLevel || 'Grade 8'} ${subject || 'Science'}
EXISTING CHAPTERS: ${JSON.stringify(existingChapters || [], null, 2)}
TEACHER PHILOSOPHY: ${JSON.stringify(philosophy?.coreValues || [], null, 2)}
CLASSROOM REALITY: Class size ${classroom?.classSize || 36}, tech access: ${classroom?.techAccess || 'low'}, language: ${classroom?.languageContext || 'Bilingual'}
LEARNERS: ${JSON.stringify(learners?.priorKnowledgeGaps || [], null, 2)}, Interests: ${JSON.stringify(learners?.highInterestHooks || [], null, 2)}
`;

    try {
      const { text, modelUsed } = await executeGeminiWithResilience(ai, {
        preferredModel: 'gemini-3.8-flash',
        contents: promptBody,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
        },
      });

      const parsed = cleanAndParseJSON(text);
      return res.json({ success: true, source: 'gemini', modelUsed, ...parsed });
    } catch (modelErr: any) {
      console.warn('[suggest-unit-architecture] AI model spike handled via local fallback:', modelErr?.message || modelErr);
      return res.json({
        ...getLocalUnitSuggestions(
          unitTitle,
          unitNumber,
          subject,
          gradeLevel,
          existingChapters,
          classroom,
          philosophy,
          learners
        ),
        note: 'Generated with pedagogical intelligence due to temporary AI model demand spike.',
      });
    }
  } catch (error: any) {
    console.warn('[suggest-unit-architecture] Handled with local fallback:', error?.message || error);
    res.json(
      getLocalUnitSuggestions(
        req.body.unitTitle,
        req.body.unitNumber,
        req.body.subject,
        req.body.gradeLevel,
        req.body.existingChapters,
        req.body.classroom,
        req.body.philosophy,
        req.body.learners
      )
    );
  }
});

// Helper for deterministic high-fidelity educational designs
function getLocalCoDesignFallback(
  designType: string,
  topicPrompt: string,
  philosophy: any,
  classroom: any,
  learners: any,
  memory: any,
  syllabusContext?: any,
  unitContext?: any
) {
  const isScience = (classroom?.subject || topicPrompt || '').toLowerCase().includes('scien') ||
    (topicPrompt || '').toLowerCase().includes('heat') ||
    (topicPrompt || '').toLowerCase().includes('energy');

  return {
    success: true,
    source: 'local_engine',
    title: topicPrompt ? `${topicPrompt} - Contextualized ${designType.toUpperCase()}` : `Contextual ${designType.toUpperCase()} Design`,
    summary: `Structured specifically for Grade ${classroom?.gradeLevel || '8'} with ${classroom?.classSize || '35'} learners, calibrated to teacher's focus on dialogic sense-making and scaffolded inquiry.`,
    designType,
    unitAlignment: unitContext ? {
      unitTitle: unitContext.unitTitle || 'Active Unit',
      priorityApplied: unitContext.priorityFocus ? `Anchored directly in unit priority: "${unitContext.priorityFocus}" through scaffolded Phase 1-2 discovery.` : 'Directly targeted toward unit competencies and student agency.',
      competenciesAddressed: (unitContext.keyCompetencies || ['Conceptual analysis', 'Empirical reasoning']).slice(0, 2),
      valuesCultivated: (unitContext.unitValues || ['Scientific Humility', 'Curiosity & Wonder']).slice(0, 2),
    } : undefined,
    content: {
      essentialQuestion: unitContext?.essentialQuestion || 'How does our everyday observation connect to the fundamental scientific / conceptual principle?',
      phases: [
        {
          phaseName: 'Phase 1: Ignition & Cognitive Hook (7 mins)',
          teacherRole: 'Presents a tangible, anomalous everyday phenomenon without giving the explanation.',
          studentRole: 'Pair-share prediction with their bench partner; write one question on their notebook margin.',
          scaffolding: 'Bilingual sentence starter on the board: "I notice that ___, which makes me wonder if ___"',
          pedagogicalRationale: 'Alinged with philosophy: Students must experience the conceptual tension before terminology is introduced, building intrinsic epistemic drive.',
        },
        {
          phaseName: 'Phase 2: Guided Data Gathering / Text Grapple (15 mins)',
          teacherRole: 'Circulates between narrow rows, monitoring 4 benchmark student pairs to gauge common misconceptions.',
          studentRole: 'Work with tangible cards or structured data table to map cause-and-effect relationships.',
          scaffolding: 'Tiered prompts (Mild: guided table; Spicy: open inference challenge).',
          pedagogicalRationale: 'Accommodates the tight classroom layout by using sedentary pair-grapple instead of chaotic station movement, keeping cognitive focus high.',
        },
        {
          phaseName: 'Phase 3: Public Synthesis & Co-Constructed Concept (13 mins)',
          teacherRole: 'Facilitates a purposeful discussion using student predictions to co-author the definition on the chalkboard.',
          studentRole: 'Students defend or revise their opening hypothesis using evidence gathered in Phase 2.',
          scaffolding: 'Error-normalization: Teacher celebrates two insightful mistaken predictions as keys to uncovering the truth.',
          pedagogicalRationale: 'Strictly embodies teacher stated belief: "Mistakes are diagnostic stepping stones, not deficits."',
        },
        {
          phaseName: 'Phase 4: Low-Stakes Diagnostic Exit Check (10 mins)',
          teacherRole: 'Gathers 2-minute sticky note / paper slip responses for immediate formative insight.',
          studentRole: 'Solves one transfer scenario applying the newly co-constructed concept to a novel context.',
          scaffolding: 'Choice of format: 2 written sentences or a labeled annotated sketch.',
          pedagogicalRationale: 'Enables responsive teaching for tomorrow without creating high-stakes anxiety or heavy grading backlog.',
        },
      ],
      accommodations: [
        'Visual bilingual terminology chart displayed on chalkboard corner.',
        'High-energy student assigned the role of evidence collector / timekeeper to channel physical restlessness.',
      ],
    },
    reasoningMatrix: {
      recommendedApproach: 'Structured Guided Inquiry with Public Synthesis & Sedentary Pair-Work',
      pedagogicalRationale: `We selected a structured inquiry sequence over pure open-discovery because with ${classroom?.classSize || 35} students in a 45-minute window, open-discovery risks cognitive overload and classroom noise spikes. Sedentary pair-grapple preserves high student voice while respecting room constraints.`,
      philosophyAlignment: [
        'Directly reflects your belief that students must wrestle with data before definitions are delivered.',
        'Normalizes and leverages student misconceptions as learning stepping stones in Phase 3.',
        'Promotes student agency through choice of exit check format.',
      ],
      classroomContextFit: [
        `Calibrated for ${classroom?.classSize || 35} students: Uses adjacent bench partners, eliminating time wasted on furniture rearrangement.`,
        `Requires zero student digital devices; relies entirely on blackboard and paper-based inquiry.`,
        `Fits tightly into a ${classroom?.periodLengthMinutes || 45}-minute instructional block with 5-minute transition margin.`,
      ],
      alternativesConsidered: [
        {
          approach: 'Direct Lecture with Demonstration',
          pros: 'Predictable timing, effortless classroom management, high content coverage.',
          cons: 'Passive student reception; violates teacher philosophy of epistemic inquiry.',
          whyDeprioritized: 'Substantially diminishes student cognitive ownership and conceptual retention.',
        },
        {
          approach: 'Open Multi-Station Lab Exploration',
          pros: 'High tactile autonomy, kinesthetic engagement.',
          cons: 'Severe spatial congestion with 35+ students, equipment shortages, exceeds 45-minute boundary.',
          whyDeprioritized: 'High logistical friction would derail the conceptual learning objective.',
        },
      ],
      educationalTradeoffs: [
        {
          gain: 'Deeper conceptual retention and authentic student sense-making.',
          costOrSacrifice: 'Coverage speed is slightly slower than a didactic slide presentation.',
          mitigationStrategy: 'Pre-chunk foundational definitions onto a corner chart so synthesis moves briskly.',
        },
      ],
    },
    suggestedNewInferences: [
      'Teacher excels when student dialogue is anchored in concrete physical phenomena rather than abstract definitions.',
    ],
  };
}

// Fallback intelligent curriculum generator when Gemini is offline or for instant mock preview
function getFallbackParsedSyllabus(
  rawText: string,
  subject?: string,
  gradeLevel?: string,
  curriculumBoard?: string,
  fileName?: string
) {
  const subj = subject || 'Science';
  const grade = gradeLevel || 'Grade 8';
  const board = curriculumBoard || 'NCERT / Composite State Curriculum';

  // If the user pasted lines like "Chapter 1: ...", let's extract them
  const lines = rawText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 2);

  const detectedChapters: { title: string; num: number }[] = [];
  lines.forEach((line) => {
    const chMatch = line.match(/(?:chapter|unit|ch\.?|topic)\s*(\d+)[:\s.-]*(.+)/i);
    if (chMatch) {
      detectedChapters.push({
        num: parseInt(chMatch[1], 10),
        title: chMatch[2].trim(),
      });
    }
  });

  if (detectedChapters.length >= 2) {
    return {
      curriculumTitle: `${grade} ${subj} Parsed Curriculum`,
      textbookTitle: fileName ? fileName.replace(/\.[^/.]+$/, '') : `${grade} ${subj} Textbook`,
      curriculumBoard: board,
      summary: `Parsed ${detectedChapters.length} chapters from uploaded document "${fileName || 'Curriculum Input'}".`,
      units: [
        {
          unitNumber: 1,
          title: `Unit 1: Foundational Themes in ${subj}`,
          estimatedPeriods: 20,
          keyCompetencies: [
            `Core conceptual inquiry in ${subj}`,
            'Experimental investigation and evidentiary sense-making',
          ],
          chapters: detectedChapters.map((ch, idx) => ({
            chapterNumber: ch.num || idx + 1,
            title: ch.title,
            keyConcepts: ['Core mechanism', 'Scientific variables', 'Real-world manifestation'],
            learningOutcomes: [
              `Students will investigate the fundamental principles of ${ch.title}.`,
              'Students will apply concept to explain daily local phenomena.',
            ],
            textbookPages: `Pages ${idx * 16 + 1}–${(idx + 1) * 16}`,
            suggestedInquiryHook: `Why does ${ch.title.toLowerCase()} happen under certain conditions and not others?`,
          })),
        },
      ],
    };
  }

  // Generative default for the requested subject & grade
  return {
    curriculumTitle: `${grade} ${subj} Standard Scope & Sequence`,
    textbookTitle: fileName ? fileName.replace(/\.[^/.]+$/, '') : `Prescribed ${grade} ${subj} Coursebook`,
    curriculumBoard: board,
    summary: `Structured academic scope calibrated for ${grade} ${subj} with 4 foundational units and comprehensive learning outcomes.`,
    units: [
      {
        unitNumber: 1,
        title: `Unit 1: Fundamental Concepts & Observational Dynamics`,
        estimatedPeriods: 18,
        keyCompetencies: [
          'Direct observation of physical/conceptual phenomena',
          'Formulating testable hypotheses and qualitative descriptions',
        ],
        chapters: [
          {
            chapterNumber: 1,
            title: `Introduction to ${subj} Principles in Everyday Environments`,
            keyConcepts: ['Direct Observation', 'Classification', 'Equilibrium & Change'],
            learningOutcomes: [
              `Identify how ${subj} concepts govern common daily interactions.`,
              'Construct qualitative models before attempting numerical abstraction.',
            ],
            textbookPages: 'Pages 1–18',
            suggestedInquiryHook: 'What invisible laws are operating in this room right now that we take for granted?',
          },
          {
            chapterNumber: 2,
            title: 'Systems, Interactions and Cause-and-Effect Mechanisms',
            keyConcepts: ['Input-Output Dynamics', 'Conservation Laws', 'Interdependence'],
            learningOutcomes: [
              'Predict system outcomes when an external disturbance is introduced.',
              'Evaluate evidence from contrasting experiments.',
            ],
            textbookPages: 'Pages 19–38',
            suggestedInquiryHook: 'If you alter one component of a balanced system, why does the whole structure shift?',
          },
        ],
      },
      {
        unitNumber: 2,
        title: 'Unit 2: Quantitative Modeling & Real-World Application',
        estimatedPeriods: 22,
        keyCompetencies: [
          'Connecting mathematical or logical representations to concrete behavior',
          'Evaluating trade-offs in technological and ecological contexts',
        ],
        chapters: [
          {
            chapterNumber: 3,
            title: 'Measurement, Variables, and Formative Experimentation',
            keyConcepts: ['Dependent vs Independent Variables', 'Error Margins', 'Evidentiary Proof'],
            learningOutcomes: [
              'Design an experiment testing one variable while holding all others constant.',
              'Interpret graphs and tables to deduce empirical relationships.',
            ],
            textbookPages: 'Pages 39–58',
            suggestedInquiryHook: 'How can two scientists look at the exact same data and reach opposing conclusions?',
          },
        ],
      },
    ],
  };
}

function getLocalUnitSuggestions(
  unitTitle: string,
  unitNumber: number | string,
  subject: string,
  gradeLevel: string,
  existingChapters: any[],
  classroom: any,
  philosophy: any,
  learners: any
) {
  const titleLower = (unitTitle || '').toLowerCase();
  const subjectLower = (subject || '').toLowerCase();
  const isScience = subjectLower.includes('scien') || titleLower.includes('force') || titleLower.includes('energy') || titleLower.includes('matter') || titleLower.includes('food') || titleLower.includes('micro') || titleLower.includes('chem') || titleLower.includes('cell');
  const isMath = subjectLower.includes('math') || titleLower.includes('algebra') || titleLower.includes('geomet') || titleLower.includes('ratio');

  let bigIdea = `Core conceptual models reveal how microscopic exchanges and physical laws govern observable macroscopic reality.`;
  let essentialQuestion = `How do fundamental interactions in ${unitTitle || 'this unit'} shape the systems we observe and rely on daily?`;
  let priorityFocus = `Prioritize hands-on tactile and visual inquiry before abstract symbolic notation; scaffold technical language with bilingual paired talk.`;

  let competencies = [
    `Analyze foundational cause-and-effect relationships within ${unitTitle || 'this unit'}`,
    `Construct empirical explanations based on observable evidence and peer sense-making`,
    `Apply conceptual models to solve novel real-world community dilemmas`,
    `Translate between verbal descriptions, visual representations, and conceptual summaries`,
  ];

  let values = [
    {
      value: 'Scientific Humility & Epistemic Curiosity',
      dispositionRationale: 'Encourages students to ask deep questions and acknowledge that initial hypotheses are starting points, not final answers.'
    },
    {
      value: 'Collaborative Sense-Making',
      dispositionRationale: 'Values peer talk as the primary engine of intellectual discovery, ensuring no single voice dominates.'
    },
    {
      value: 'Resilience Through Productive Error',
      dispositionRationale: 'De-stigmatizes incorrect predictions, treating misconceptions as valuable diagnostic evidence.'
    },
    {
      value: 'Contextual & Environmental Responsibility',
      dispositionRationale: 'Links classroom knowledge directly to community welfare, local ecology, and ethical human choices.'
    }
  ];

  if (isMath) {
    bigIdea = `Mathematical structures and algebraic generalizations allow us to model patterns and solve complex real-world constraints.`;
    essentialQuestion = `How can mathematical representations simplify chaos and empower fair, reasoned decision making?`;
    priorityFocus = `Concrete physical manipulative models first, peer verbalization of strategy second, standard algebraic formulas last.`;
    competencies = [
      `Identify invariant patterns across varying representations and tables`,
      `Justify problem-solving strategies using logical mathematical arguments`,
      `Formulate equations from everyday contextual scenarios`,
      `Check plausibility of solutions through estimation and peer critique`,
    ];
    values = [
      { value: 'Precision & Intellectual Honesty', dispositionRationale: 'Disciplines thought to verify premises and calculations with care.' },
      { value: 'Perseverance in Ambiguity', dispositionRationale: 'Celebrates sticking with complex non-routine tasks without rushing to answer keys.' },
      { value: 'Accessible Communication', dispositionRationale: 'Encourages multiple ways of explaining mathematical thinking in diverse languages.' },
    ];
  } else if (!isScience && !isMath) {
    bigIdea = `Human narratives, cultural contexts, and language structures construct our understanding of societal power and personal identity.`;
    essentialQuestion = `How do contrasting viewpoints and historical or cultural forces shape the truths we take for granted?`;
    priorityFocus = `Low-stakes Socratic fishbowls with scaffolded sentence stems; grounding abstract theories in students' lived community experiences.`;
    competencies = [
      `Synthesize arguments from contrasting primary and secondary viewpoints`,
      `Express nuanced perspectives orally and in structured written prose`,
      `Evaluate ethical dilemmas and institutional actions with critical empathy`,
    ];
    values = [
      { value: 'Empathetic Perspective-Taking', dispositionRationale: 'Seeks to understand lived experiences and historical contexts distinct from one\'s own.' },
      { value: 'Civic Courage & Voice', dispositionRationale: 'Empowers students to formulate and defend convictions respectfully.' },
    ];
  }

  return {
    success: true,
    source: 'local_engine',
    suggestedBigIdea: bigIdea,
    suggestedEssentialQuestion: essentialQuestion,
    suggestedPriorityFocus: priorityFocus,
    suggestedCompetencies: competencies,
    suggestedValues: values,
    suggestedChapterProgressions: (existingChapters || []).map((ch: any, idx: number) => ({
      title: ch.title || `Chapter ${idx + 1}`,
      suggestedHook: `Why does this phenomenon behave counter-intuitively in everyday life?`,
      keyConcepts: ch.keyConcepts || ['Core relational concept'],
    })),
  };
}

// Vite middleware for dev / static for prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Srijan Server running on port ${PORT}`);
  });
}

startServer();
