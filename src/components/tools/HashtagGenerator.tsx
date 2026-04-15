import React from 'react';
import BaseToolPage from './BaseToolPage';

const HashtagGenerator: React.FC = () => (
  <BaseToolPage 
    slug="instagram-hashtag-generator"
    toolType="hashtags"
    inputLabel="Enter your niche or post topic"
    inputPlaceholder="e.g. Vegan recipes, Travel vlogger, Fitness coach..."
    buttonText="Find Trending Hashtags"
    resultKey="hashtags"
  />
);

export default HashtagGenerator;
