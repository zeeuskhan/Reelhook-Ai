import React from 'react';
import BaseToolPage from './BaseToolPage';

const UsernameGenerator: React.FC = () => (
  <BaseToolPage 
    slug="instagram-username-generator"
    toolType="username"
    inputLabel="Enter your name or niche keywords"
    inputPlaceholder="e.g. Sana, Travel, Photography..."
    buttonText="Generate Unique Usernames"
    resultKey="usernames"
  />
);

export default UsernameGenerator;
