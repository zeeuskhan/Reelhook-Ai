import React from 'react';
import BaseToolPage from './BaseToolPage';

const MockupGenerator: React.FC = () => (
  <BaseToolPage 
    slug="instagram-mockup-generator"
    toolType="mockup"
    inputLabel="Describe your feed aesthetic or next post"
    inputPlaceholder="e.g. A warm, earthy-toned travel feed with minimalist typography..."
    buttonText="Get Mockup Strategy"
    resultKey="result"
  />
);

export default MockupGenerator;
