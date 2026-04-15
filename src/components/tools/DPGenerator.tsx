import React from 'react';
import BaseToolPage from './BaseToolPage';

const DPGenerator: React.FC = () => (
  <BaseToolPage 
    slug="instagram-dp-generator"
    toolType="dp"
    inputLabel="Describe your brand or style"
    inputPlaceholder="e.g. Minimalist, Vibrant, Professional, Tech-focused..."
    buttonText="Get DP Ideas & Prompts"
    resultKey="ideas"
  />
);

export default DPGenerator;
