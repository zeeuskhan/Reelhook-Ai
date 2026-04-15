import React from 'react';
import BaseToolPage from './BaseToolPage';

const BioGenerator: React.FC = () => (
  <BaseToolPage 
    slug="instagram-bio-generator"
    toolType="bio"
    inputLabel="Your Niche or Brand Description"
    inputPlaceholder="e.g. Minimalist graphic designer for eco-friendly brands..."
    buttonText="Generate Viral Bios"
    resultKey="bios"
  />
);

export default BioGenerator;
