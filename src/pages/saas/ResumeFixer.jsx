import React, { useState } from 'react';
import { AIGeneratorTool } from '../../components/AIGeneratorTool';

export function ResumeFixer() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Resume Fixer</h1>
        <p className="text-gray-400 text-lg">Paste your current resume and let our AI rewrite it for maximum impact and recruiter appeal.</p>
      </div>
      <AIGeneratorTool
        title="Resume Fixer AI"
        description="Enter your raw resume text or your latest job responsibilities below."
        endpoint="resume-fixer"
        fields={[
          {
            name: 'resumeText',
            label: 'Resume Content',
            type: 'textarea',
            placeholder: 'e.g., I worked at XYZ corp and did software engineering using React and Node...'
          }
        ]}
      />
    </>
  );
}
