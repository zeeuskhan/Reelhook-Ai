import React from 'react';
import BaseToolPage from './BaseToolPage';

const CaptionGenerator: React.FC = () => (
  <BaseToolPage 
    slug="instagram-caption-generator"
    toolType="caption"
    inputLabel="What is your post about?"
    inputPlaceholder="e.g. A video of me hiking in the Himalayas during sunrise..."
    buttonText="Generate Viral Captions"
    resultKey="captions"
  />
);

export default CaptionGenerator;
