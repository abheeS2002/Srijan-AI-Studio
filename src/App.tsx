import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { TeacherOnboardingModal } from './components/TeacherOnboardingModal';
import { OverviewCockpit } from './components/OverviewCockpit';
import { PhilosophyStudio } from './components/PhilosophyStudio';
import { ClassroomLearnerStudio } from './components/ClassroomLearnerStudio';
import { CoDesignWorkspace } from './components/CoDesignWorkspace';
import { MemoryManager } from './components/MemoryManager';
import { ReflectionStudio } from './components/ReflectionStudio';
import { LibraryStudio } from './components/LibraryStudio';
import { SyllabusStudio } from './components/SyllabusStudio';
import { ClassroomSwitcherModal } from './components/ClassroomSwitcherModal';

import {
  ActiveTab,
  TeacherPhilosophyProfile,
  ClassroomProfile,
  LearnerProfile,
  MemoryItem,
  EducationalDesignOutput,
  PostLessonReflection,
  ClassroomSection,
  ClassroomSyllabus,
  SyllabusChapter,
  SyllabusUnit,
} from './types';

import {
  initialPhilosophy,
  initialClassrooms,
  initialMemoryItems,
  initialSavedDesigns,
  initialReflections,
} from './data/initialData';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showClassroomSwitcher, setShowClassroomSwitcher] = useState(false);
  const [editingClassroomIdForModal, setEditingClassroomIdForModal] = useState<string | null>(null);

  // Multi-Classroom & Syllabus State
  const [classrooms, setClassrooms] = useState<ClassroomSection[]>(() => {
    try {
      const saved = localStorage.getItem('srijan_classrooms');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading srijan_classrooms from localStorage', e);
    }
    return initialClassrooms;
  });

  const [activeClassroomId, setActiveClassroomId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('srijan_active_classroom_id');
      if (saved && classrooms.some((c) => c.id === saved)) {
        return saved;
      }
    } catch (e) {}
    return classrooms[0]?.id || 'sec-7a-science';
  });

  const [selectedSyllabusChapterId, setSelectedSyllabusChapterId] = useState<string | null>(null);

  // Find active classroom
  const activeClassroom =
    classrooms.find((c) => c.id === activeClassroomId) || classrooms[0] || initialClassrooms[0];

  // Active classroom profile & learners profile synced with activeClassroom
  const [classroom, setClassroom] = useState<ClassroomProfile>(() => {
    return activeClassroom?.classroom || initialClassrooms[0].classroom;
  });
  const [learners, setLearners] = useState<LearnerProfile>(() => {
    return activeClassroom?.learners || initialClassrooms[0].learners;
  });

  // Philosophy State
  const [philosophy, setPhilosophy] = useState<TeacherPhilosophyProfile>(() => {
    try {
      const saved = localStorage.getItem('srijan_philosophy');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return { ...initialPhilosophy, ...parsed };
      }
    } catch (e) {}
    return initialPhilosophy;
  });

  const [memoryItems, setMemoryItems] = useState<MemoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('srijan_memory');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return initialMemoryItems;
  });

  const [savedDesigns, setSavedDesigns] = useState<EducationalDesignOutput[]>(() => {
    try {
      const saved = localStorage.getItem('srijan_designs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return initialSavedDesigns;
  });

  const [reflections, setReflections] = useState<PostLessonReflection[]>(() => {
    try {
      const saved = localStorage.getItem('srijan_reflections');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return initialReflections;
  });

  // When active classroom changes, sync classroom & learners state
  useEffect(() => {
    if (activeClassroom) {
      if (activeClassroom.classroom) setClassroom(activeClassroom.classroom);
      if (activeClassroom.learners) setLearners(activeClassroom.learners);
    }
  }, [activeClassroomId]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('srijan_classrooms', JSON.stringify(classrooms));
  }, [classrooms]);

  useEffect(() => {
    localStorage.setItem('srijan_active_classroom_id', activeClassroomId);
  }, [activeClassroomId]);

  useEffect(() => {
    localStorage.setItem('srijan_philosophy', JSON.stringify(philosophy));
  }, [philosophy]);

  useEffect(() => {
    localStorage.setItem('srijan_memory', JSON.stringify(memoryItems));
  }, [memoryItems]);

  useEffect(() => {
    localStorage.setItem('srijan_designs', JSON.stringify(savedDesigns));
  }, [savedDesigns]);

  useEffect(() => {
    localStorage.setItem('srijan_reflections', JSON.stringify(reflections));
  }, [reflections]);

  // Classroom Switching & Management Handlers
  const handleSelectClassroom = (id: string) => {
    setActiveClassroomId(id);
    setSelectedSyllabusChapterId(null);
  };

  const handleCreateClassroom = (newSection: ClassroomSection) => {
    setClassrooms((prev) => [...prev, newSection]);
    setActiveClassroomId(newSection.id);
    setSelectedSyllabusChapterId(null);
  };

  const handleUpdateClassroomSection = (updatedSection: ClassroomSection) => {
    setClassrooms((prev) =>
      prev.map((cls) => (cls.id === updatedSection.id ? updatedSection : cls))
    );
    if (updatedSection.id === activeClassroomId) {
      setClassroom(updatedSection.classroom);
      setLearners(updatedSection.learners);
    }
  };

  const handleDeleteClassroomSection = (idToDelete: string) => {
    if (classrooms.length <= 1) return;
    const remaining = classrooms.filter((cls) => cls.id !== idToDelete);
    setClassrooms(remaining);
    if (activeClassroomId === idToDelete && remaining.length > 0) {
      const nextActive = remaining[0];
      setActiveClassroomId(nextActive.id);
      setClassroom(nextActive.classroom);
      setLearners(nextActive.learners);
      setSelectedSyllabusChapterId(null);
    }
  };

  const handleOpenEditClassroom = (classroomId?: string) => {
    setEditingClassroomIdForModal(classroomId || activeClassroomId);
    setShowClassroomSwitcher(true);
  };

  const handleUpdateSyllabus = (updatedSyllabus: ClassroomSyllabus) => {
    setClassrooms((prev) =>
      prev.map((sec) =>
        sec.id === activeClassroomId ? { ...sec, syllabus: updatedSyllabus } : sec
      )
    );
  };

  const handleUpdateClassroomProfile = (updated: ClassroomProfile) => {
    setClassroom(updated);
    setClassrooms((prev) =>
      prev.map((sec) =>
        sec.id === activeClassroomId ? { ...sec, classroom: updated } : sec
      )
    );
  };

  const handleUpdateLearnersProfile = (updated: LearnerProfile) => {
    setLearners(updated);
    setClassrooms((prev) =>
      prev.map((sec) =>
        sec.id === activeClassroomId ? { ...sec, learners: updated } : sec
      )
    );
  };

  const handleLaunchCoDesignWithChapter = (chapter: SyllabusChapter, unit: SyllabusUnit) => {
    setSelectedSyllabusChapterId(chapter.id);
    setActiveTab('design');
  };

  // Memory Handlers
  const handleAddMemoryItem = (item: Omit<MemoryItem, 'id' | 'dateAdded'>) => {
    const newItem: MemoryItem = {
      ...item,
      id: `mem-${Date.now()}`,
      dateAdded: new Date().toISOString().split('T')[0],
    };
    setMemoryItems((prev) => [newItem, ...prev]);
  };

  const handleUpdateMemoryItem = (id: string, updates: Partial<MemoryItem>) => {
    setMemoryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleDeleteMemoryItem = (id: string) => {
    setMemoryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleApproveInference = (id: string) => {
    setMemoryItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              tier: 'approved_inference',
              status: 'active',
              notes: `${item.notes || ''} (Explicitly approved by teacher on ${new Date().toLocaleDateString()})`,
            }
          : item
      )
    );
  };

  // Design Handlers
  const handleSaveDesign = (design: EducationalDesignOutput) => {
    setSavedDesigns((prev) => {
      const exists = prev.find((d) => d.id === design.id);
      if (exists) {
        return prev.map((d) => (d.id === design.id ? design : d));
      }
      return [design, ...prev];
    });
  };

  const handleDeleteDesign = (id: string) => {
    setSavedDesigns((prev) => prev.filter((d) => d.id !== id));
  };

  // Reflection Handlers
  const handleAddReflection = (ref: PostLessonReflection) => {
    setReflections((prev) => [ref, ...prev]);
  };

  const pendingMemoryApprovalsCount = (memoryItems || []).filter(
    (m) => m.tier === 'srijan_inference' && m.status === 'pending_approval'
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navigation with Classroom Switcher */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        memoryItems={memoryItems || []}
        pendingApprovalsCount={pendingMemoryApprovalsCount}
        teacherName={philosophy?.teacherName || 'Teacher'}
        onOpenOnboarding={() => setShowOnboarding(true)}
        activeClassroom={activeClassroom}
        onOpenClassroomSwitcher={() => setShowClassroomSwitcher(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <OverviewCockpit
            philosophy={philosophy}
            classroom={classroom}
            learners={learners}
            memoryItems={memoryItems}
            savedDesigns={savedDesigns}
            reflections={reflections}
            setActiveTab={setActiveTab}
            onOpenOnboarding={() => setShowOnboarding(true)}
            activeClassroom={activeClassroom}
            onOpenClassroomSwitcher={() => setShowClassroomSwitcher(true)}
            onLaunchCoDesignWithChapter={handleLaunchCoDesignWithChapter}
          />
        )}

        {activeTab === 'philosophy' && (
          <PhilosophyStudio
            philosophy={philosophy}
            onUpdatePhilosophy={setPhilosophy}
            onAddMemoryItem={handleAddMemoryItem}
          />
        )}

        {activeTab === 'classroom' && (
          <ClassroomLearnerStudio
            classroom={classroom}
            learners={learners}
            onUpdateClassroom={handleUpdateClassroomProfile}
            onUpdateLearners={handleUpdateLearnersProfile}
            activeClassroom={activeClassroom}
            onOpenClassroomSwitcher={() => setShowClassroomSwitcher(true)}
            onEditClassroomSection={handleOpenEditClassroom}
            onDeleteClassroomSection={handleDeleteClassroomSection}
            canDeleteClassroom={classrooms.length > 1}
          />
        )}

        {activeTab === 'syllabus' && (
          <SyllabusStudio
            activeClassroom={activeClassroom}
            onUpdateSyllabus={handleUpdateSyllabus}
            onLaunchDesignForChapter={handleLaunchCoDesignWithChapter}
            onOpenClassroomSwitcher={() => setShowClassroomSwitcher(true)}
          />
        )}

        {activeTab === 'design' && (
          <CoDesignWorkspace
            philosophy={philosophy}
            classroom={classroom}
            learners={learners}
            memoryItems={memoryItems}
            savedDesigns={savedDesigns}
            onSaveDesign={handleSaveDesign}
            onAddMemoryItem={handleAddMemoryItem}
            activeClassroom={activeClassroom}
            selectedSyllabusChapterId={selectedSyllabusChapterId}
            onSelectSyllabusChapter={setSelectedSyllabusChapterId}
            onSwitchToSyllabus={() => setActiveTab('syllabus')}
          />
        )}

        {activeTab === 'memory' && (
          <MemoryManager
            memoryItems={memoryItems}
            onAddMemoryItem={handleAddMemoryItem}
            onUpdateMemoryItem={handleUpdateMemoryItem}
            onDeleteMemoryItem={handleDeleteMemoryItem}
            onApproveInference={handleApproveInference}
          />
        )}

        {activeTab === 'reflection' && (
          <ReflectionStudio
            reflections={reflections}
            savedDesigns={savedDesigns}
            philosophy={philosophy}
            memoryItems={memoryItems}
            onAddReflection={handleAddReflection}
            onAddMemoryItem={handleAddMemoryItem}
          />
        )}

        {activeTab === 'library' && (
          <LibraryStudio
            savedDesigns={savedDesigns}
            onDeleteDesign={handleDeleteDesign}
            onSelectDesignForWorkspace={(design) => {
              setActiveTab('design');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500 font-sans mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-bold text-slate-800">Srijan</span> — Teacher-First AI Educational Design Companion
          </div>
          <div className="text-slate-400 font-mono text-[11px]">
            Universal Multi-Grade & Classroom Architecture • Grounded in Textbooks & Syllabi • Bento Grid
          </div>
        </div>
      </footer>

      {/* Philosophy Manifesto & Onboarding Modal */}
      <TeacherOnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onStartDiscovery={() => {
          setShowOnboarding(false);
          setActiveTab('philosophy');
        }}
      />

      {/* Multi-Classroom Switcher & Creator Modal */}
      <ClassroomSwitcherModal
        isOpen={showClassroomSwitcher}
        classrooms={classrooms}
        activeClassroomId={activeClassroomId}
        onSelectClassroom={handleSelectClassroom}
        onCreateClassroom={handleCreateClassroom}
        onUpdateClassroom={handleUpdateClassroomSection}
        onDeleteClassroom={handleDeleteClassroomSection}
        initialEditingClassroomId={editingClassroomIdForModal}
        onClose={() => {
          setShowClassroomSwitcher(false);
          setEditingClassroomIdForModal(null);
        }}
      />
    </div>
  );
}
