import React from 'react';
import BaseToolPage from './BaseToolPage';

const TranscriptGenerator: React.FC = () => (
  <BaseToolPage 
    slug="instagram-transcript-generator"
    toolType="transcript"
    inputLabel="Paste your video transcript or talking points"
    inputPlaceholder="Paste the raw text here to clean it up and summarize it..."
    buttonText="Clean & Summarize Transcript"
    resultKey="summary"
  />
);

export default TranscriptGenerator;
