import React, { useState } from 'react';
import { AIGeneratorTool } from '../../components/AIGeneratorTool';

export function LinkedInRoast() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold mb-2 tracking-tight">LinkedIn Profile Roast</h1>
        <p className="text-gray-400 text-lg">Get brutal, actionable feedback on your LinkedIn summary and experience to attract more leads.</p>
      </div>
      <AIGeneratorTool
        title="LinkedIn Roast & Optimizer"
        description="Paste your LinkedIn About section or Headline."
        endpoint="linkedin-roast"
        fields={[
          {
            name: 'profileProfile',
            label: 'LinkedIn Content',
            type: 'textarea',
            placeholder: 'e.g., Software Engineer passionate about changing the world...'
          }
        ]}
      />
    </>
  );
}
