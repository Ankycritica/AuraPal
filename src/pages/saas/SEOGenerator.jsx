import React, { useState } from 'react';
import { AIGeneratorTool } from '../../components/AIGeneratorTool';

export function SEOGenerator() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold mb-2 tracking-tight">SEO Article Generator</h1>
        <p className="text-gray-400 text-lg">Generate fully-structured, highly engaging blog posts optimized to rank on Google.</p>
      </div>
      <AIGeneratorTool
        title="SEO Super Engine"
        description="Enter your target keyword, and we'll generate the H1s, H2s, FAQ Schema, and the article body."
        endpoint="seo-article"
        fields={[
          {
            name: 'keyword',
            label: 'Target Keyword',
            type: 'text',
            placeholder: 'e.g., best cold email templates'
          }
        ]}
      />
    </>
  );
}
