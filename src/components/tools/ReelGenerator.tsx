import React from 'react';
import BaseToolPage from './BaseToolPage';

const ReelGenerator: React.FC = () => (
  <BaseToolPage 
    slug="instagram-reel-generator"
    toolType="script"
    inputLabel="What is your Reel topic or goal?"
    inputPlaceholder="e.g. How to save money as a student, 5 tips for better sleep..."
    buttonText="Generate Viral Reel Script"
    resultKey="script"
  />
);

export default ReelGenerator;
