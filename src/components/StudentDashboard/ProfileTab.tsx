import React, { useState } from 'react';
import { useCamp } from '../../context/CampContext';
import { ShieldCheck, Award, Edit3, Check, X } from 'lucide-react';
import { CodexBadgeIcon } from '../CodexBadgeIcon';

export const ProfileTab: React.FC = () => {
  const { currentStudent, updateStudentProfile } = useCamp();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(currentStudent?.fullName || '');
  const [grade, setGrade] = useState(currentStudent?.grade || 'Grade 10');
  const [section, setSection] = useState(currentStudent?.section || 'Section A');
  const [schoolName, setSchoolName] = useState(currentStudent?.schoolName || 'Oxford Secondary School');
  const [parentPhone, setParentPhone] = useState(currentStudent?.parentPhone || '');
  const [track, setTrack] = useState(currentStudent?.track || 'Full-Stack Web Development');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!currentStudent) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentProfile(currentStudent.id, {
      fullName,
      grade,
      section,
      schoolName,
      parentPhone,
      track
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div id="student-profile-tab" className="space-y-6 animate-in fade-in duration-150">
      
      {/* Top Banner Card */}
      <div className="p-6 rounded-lg bg-[#1E1E1E] border border-[#3A3A3C] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full bg-[#3A3A3C] flex items-center justify-center text-lg font-bold font-mono text-[#F5F5F7]">
            {currentStudent.fullName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h2 className="text-xl font-bold text-[#F5F5F7]">
                {currentStudent.fullName}
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#30D158]/10 text-[#30D158] border border-[#30D158]/30">
                ACTIVE STUDENT
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-[#8E8E93]">
              <span className="font-mono">{currentStudent.grade} • {currentStudent.section}</span>
              <span>•</span>
              <span>{currentStudent.schoolName}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-4 py-2 rounded-md bg-[#121212] border border-[#3A3A3C] flex items-center space-x-3">
            <CodexBadgeIcon size={18} glow />
            <div>
              <div className="text-[10px] uppercase font-mono text-[#8E8E93]">CODEX Balance</div>
              <div className="text-sm font-mono font-bold text-[#F5F5F7]">{currentStudent.codexBalance} <span className="text-[10px] text-[#0A84FF]">CODEX</span></div>
            </div>
          </div>

          {!isEditing && (
            <button
              id="btn-edit-profile"
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-md bg-[#2C2C2E] hover:bg-[#3A3A3C] text-xs font-semibold text-[#F5F5F7] border border-[#3A3A3C] transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          )}
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-md bg-[#30D158]/15 border border-[#30D158]/30 text-xs text-[#30D158] flex items-center space-x-2">
          <Check className="w-4 h-4" />
          <span>Student profile information updated successfully.</span>
        </div>
      )}

      {/* Details or Edit Form */}
      {isEditing ? (
        <div className="p-6 rounded-lg bg-[#1E1E1E] border border-[#3A3A3C] shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#3A3A3C]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F5F7]">Edit Profile Details</h3>
            <button
              onClick={() => setIsEditing(false)}
              className="text-[#8E8E93] hover:text-[#F5F5F7] p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-[#8E8E93] uppercase tracking-widest mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#121212] border border-[#3A3A3C] rounded-md text-xs text-[#F5F5F7] focus:outline-none focus:border-[#0A84FF]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#8E8E93] uppercase tracking-widest mb-1.5">
                  School Name
                </label>
                <input
                  type="text"
                  required
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#121212] border border-[#3A3A3C] rounded-md text-xs text-[#F5F5F7] focus:outline-none focus:border-[#0A84FF]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#8E8E93] uppercase tracking-widest mb-1.5">
                  Class / Grade
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#121212] border border-[#3A3A3C] rounded-md text-xs text-[#F5F5F7] focus:outline-none focus:border-[#0A84FF]"
                >
                  <option value="Grade 8">Grade 8</option>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 12">Grade 12</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#8E8E93] uppercase tracking-widest mb-1.5">
                  Section
                </label>
                <input
                  type="text"
                  required
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#121212] border border-[#3A3A3C] rounded-md text-xs text-[#F5F5F7] focus:outline-none focus:border-[#0A84FF]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#8E8E93] uppercase tracking-widest mb-1.5">
                  Parent Phone Contact
                </label>
                <input
                  type="tel"
                  required
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#121212] border border-[#3A3A3C] rounded-md text-xs text-[#F5F5F7] font-mono focus:outline-none focus:border-[#0A84FF]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#8E8E93] uppercase tracking-widest mb-1.5">
                  Assigned Track
                </label>
                <select
                  value={track}
                  onChange={(e) => setTrack(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#121212] border border-[#3A3A3C] rounded-md text-xs text-[#F5F5F7] focus:outline-none focus:border-[#0A84FF]"
                >
                  <option value="Full-Stack Web Development">Full-Stack Web Development</option>
                  <option value="Algorithms & Data Structures">Algorithms & Data Structures</option>
                  <option value="Python & Game Dev">Python & Game Dev</option>
                  <option value="Systems & Web Security">Systems & Web Security</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#3A3A3C]">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-xs font-medium text-[#8E8E93] hover:text-[#F5F5F7]"
              >
                Cancel
              </button>
              <button
                id="btn-save-profile"
                type="submit"
                className="px-4 py-2 rounded bg-[#0A84FF] hover:bg-[#0071E3] text-white text-xs font-semibold transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Official Registration Details */}
          <div className="p-6 rounded-lg bg-[#1E1E1E] border border-[#3A3A3C] shadow-sm space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0A84FF] flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Enrollment &amp; Identity</span>
            </h3>

            <div className="divide-y divide-[#3A3A3C]/60 text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#8E8E93]">Access Token Code</span>
                <span className="font-mono font-bold text-[#F5F5F7] bg-[#121212] px-2 py-0.5 rounded border border-[#3A3A3C]">
                  {currentStudent.tokenId}
                </span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#8E8E93]">Enrollment Date</span>
                <span className="font-mono text-[#F5F5F7]">{currentStudent.registeredAt}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#8E8E93]">School</span>
                <span className="text-[#F5F5F7] font-medium">{currentStudent.schoolName}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#8E8E93]">Class / Section</span>
                <span className="font-mono text-[#F5F5F7]">{currentStudent.grade} — {currentStudent.section}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#8E8E93]">Emergency Contact</span>
                <span className="font-mono text-[#F5F5F7]">{currentStudent.parentPhone}</span>
              </div>
            </div>
          </div>

          {/* Academic Track & Bootcamp Roadmap */}
          <div className="p-6 rounded-lg bg-[#1E1E1E] border border-[#3A3A3C] shadow-sm space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0A84FF] flex items-center space-x-1.5">
              <Award className="w-4 h-4" />
              <span>Curriculum &amp; Track</span>
            </h3>

            <div className="p-3.5 rounded bg-[#121212] border border-[#3A3A3C]">
              <div className="text-xs font-semibold text-[#F5F5F7]">
                {currentStudent.track || 'Full-Stack Web Development'}
              </div>
              <div className="text-[11px] text-[#8E8E93] mt-1">
                4-week core track covering TypeScript, React, Cloud architectures, and collaborative Git workflow.
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8E8E93]">Curriculum Progress</span>
                <span className="font-mono text-[#0A84FF] font-semibold">65% Completed</span>
              </div>
              <div className="w-full h-1.5 bg-[#121212] rounded-full overflow-hidden border border-[#3A3A3C]">
                <div className="h-full bg-[#0A84FF] rounded-full" style={{ width: '65%' }} />
              </div>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] text-[#8E8E93]">
              <div className="p-2 rounded bg-[#121212] border border-[#3A3A3C]/60">
                <span className="text-[#F5F5F7] font-medium block">Week 1–2</span>
                Web Engine &amp; UI
              </div>
              <div className="p-2 rounded bg-[#121212] border border-[#3A3A3C]/60">
                <span className="text-[#0A84FF] font-medium block">Week 3–4 (Current)</span>
                APIs &amp; Capstone
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
