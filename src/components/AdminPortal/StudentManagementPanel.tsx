import React from 'react';
import { StudentForm } from './StudentForm';
import { AttendanceLogEditor } from './AttendanceLogEditor';
import { CodexPointsEditor } from './CodexPointsEditor';

export const StudentManagementPanel: React.FC = () => {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-[#F5F5F7]">Student Management</h2>
        <p className="text-xs text-[#8E8E93] mt-0.5">
          Assign existing tokens first, then generate more after 100 students. Attendance starts from today.
        </p>
      </div>
      <StudentForm />
      <AttendanceLogEditor />
      <CodexPointsEditor />
    </div>
  );
};
