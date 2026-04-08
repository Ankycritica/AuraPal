import React, { useState } from 'react';
import { AIGeneratorTool } from '../../components/AIGeneratorTool';

export function BusinessPlan() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold mb-2 tracking-tight">1-Page Business Plan Generator</h1>
        <p className="text-gray-400 text-lg">Turn your startup idea into a structured Lean Canvas business plan in seconds.</p>
      </div>
      <AIGeneratorTool
        title="Business Plan AI"
        description="Describe your idea in a few sentences, and our VC-trained AI will construct a full business model."
        endpoint="business-plan"
        fields={[
          {
            name: 'idea',
            label: 'Startup Idea',
            type: 'textarea',
            placeholder: 'e.g., An AI SaaS that helps founders write better cold emails...'
          }
        ]}
      />
    </>
  );
}
