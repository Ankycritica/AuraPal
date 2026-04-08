import React, { useState } from 'react';
import { AIGeneratorTool } from '../../components/AIGeneratorTool';

export function SideHustles() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Side Hustle Ideas</h1>
        <p className="text-gray-400 text-lg">Find the perfect profitable side project based on your specific skills and budget.</p>
      </div>
      <AIGeneratorTool
        title="Side Hustle Generator"
        description="Fill out the details below to get 3 highly actionable, monetization-ready ideas."
        endpoint="side-hustle"
        fields={[
          {
            name: 'interests',
            label: 'Your Interests',
            type: 'text',
            placeholder: 'e.g., fitness, coding, writing'
          },
          {
            name: 'skills',
            label: 'Your Skills',
            type: 'text',
            placeholder: 'e.g., JavaScript, SEO, graphic design'
          },
          {
            name: 'budget',
            label: 'Available Budget ($)',
            type: 'text',
            placeholder: 'e.g., 500'
          }
        ]}
      />
    </>
  );
}
