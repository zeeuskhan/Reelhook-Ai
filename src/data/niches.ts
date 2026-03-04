export interface Niche {
  id: string;
  name: string;
  subcategories: string[];
}

export const NICHES: Niche[] = [
  {
    id: "fitness",
    name: "Fitness",
    subcategories: ["Weight Loss", "Gym Motivation", "Diet Tips", "Home Workout", "Yoga & Mindfulness", "CrossFit", "Bodybuilding", "Pilates", "HIIT", "Running", "Swimming", "Calisthenics", "Mobility & Stretching", "Post-Workout Recovery", "Sports Nutrition", "Kettlebell Training", "Powerlifting", "Functional Training", "Outdoor Fitness", "Senior Fitness"]
  },
  {
    id: "finance",
    name: "Finance",
    subcategories: ["Stock Market", "Crypto", "Saving Tips", "Side Hustle", "Real Estate", "Personal Finance", "Investing for Beginners", "Passive Income", "Tax Planning", "Budgeting", "Credit Card Hacks", "Retirement Planning", "Financial Independence (FIRE)", "Dividend Investing", "Forex Trading", "NFTs & Web3", "Banking Tips", "Insurance Advice", "Debt Management", "Gold Investing"]
  },
  {
    id: "business",
    name: "Business",
    subcategories: ["Startup Advice", "Sales Tips", "Personal Branding", "Marketing Strategy", "E-commerce", "SaaS Growth", "Networking", "Leadership Skills", "Project Management", "Business Automation", "Freelancing Tips", "Customer Service", "Negotiation Tactics", "Public Speaking", "Time Management", "Remote Work", "Digital Marketing", "SEO Strategy", "Social Media Marketing", "Content Strategy"]
  },
  {
    id: "lifestyle",
    name: "Lifestyle",
    subcategories: ["Travel", "Food & Cooking", "Productivity", "Self Care", "Home Decor", "Minimalism", "Digital Nomad", "Gardening", "Sustainable Living", "Pet Care", "Parenting Tips", "Relationships", "Fashion & Style", "Photography", "Interior Design", "DIY Crafts", "Van Life", "Coffee Culture", "Wine Tasting", "Meditation"]
  },
  {
    id: "tech",
    name: "Tech",
    subcategories: ["Gadgets", "Software Reviews", "AI & Future", "Coding", "Cybersecurity", "Web Development", "Mobile Apps", "Blockchain", "Cloud Computing", "Data Science", "Machine Learning", "Gaming Hardware", "Smart Home", "Tech News", "Apple Ecosystem", "Android Tips", "Linux", "DevOps", "UX/UI Design", "VR/AR"]
  },
  {
    id: "education",
    name: "Education",
    subcategories: ["Study Tips", "Language Learning", "Online Courses", "Career Advice", "Skill Building", "Exam Preparation", "Student Productivity", "College Life", "Scholarships", "Scientific Facts", "History Lessons", "Philosophy", "Psychology", "Mathematics", "Writing Skills", "Speed Reading", "Memory Techniques", "Critical Thinking", "Academic Research", "Teaching Tips"]
  },
  {
    id: "entertainment",
    name: "Entertainment",
    subcategories: ["Movie Reviews", "Gaming", "Music", "Comedy", "Pop Culture", "Celebrity News", "Anime & Manga", "Board Games", "Magic Tricks", "Dance", "Theatre", "Art & Illustration", "Book Recommendations", "Podcasts", "Concerts", "Fan Theories", "Cosplay", "E-sports", "Streaming Tips", "TV Shows"]
  },
  {
    id: "beauty",
    name: "Beauty & Skincare",
    subcategories: ["Skincare Routine", "Makeup Tutorials", "Hair Care", "Nail Art", "Fragrance", "Natural Beauty", "Anti-Aging", "Men's Grooming", "K-Beauty", "Sun Protection", "Acne Solutions", "Beauty Product Reviews", "Spa at Home", "Wedding Makeup", "Sustainable Beauty"]
  },
  {
    id: "motivation",
    name: "Motivation",
    subcategories: ["Self Discipline", "Personal Growth", "Success Mindset", "Daily Affirmations", "Overcoming Procrastination", "Goal Setting", "Morning Routines", "Mental Toughness", "Inspirational Quotes", "Confidence Building", "Habit Tracking", "Resilience", "Stoicism", "Focus Techniques", "Vision Boards"]
  },
  {
    id: "social-media",
    name: "Social Media",
    subcategories: ["Instagram Growth", "Reels Growth", "Content Creation", "TikTok Trends", "YouTube Strategy", "LinkedIn Networking", "Twitter/X Tips", "Community Building", "Influencer Marketing", "Video Editing", "Thumbnail Design", "Algorithm Secrets", "Engagement Hacks", "Brand Partnerships", "Live Streaming"]
  },
  {
    id: "health",
    name: "Health & Wellness",
    subcategories: ["Mental Health", "Sleep Optimization", "Gut Health", "Biohacking", "Stress Management", "Healthy Recipes", "Intermittent Fasting", "Vitamins & Supplements", "Holistic Healing", "Women's Health", "Men's Health", "Posture Correction", "Vision Health", "Dental Care", "Immune Support"]
  },
  {
    id: "real-estate",
    name: "Real Estate",
    subcategories: ["House Flipping", "Rental Properties", "Airbnb Hosting", "Commercial Real Estate", "Mortgage Tips", "First-Time Homebuyer", "Property Management", "Interior Staging", "Real Estate Investing", "Tiny Houses", "Smart Home Tech", "Sustainable Building", "Luxury Real Estate", "Land Investing", "Wholesaling"]
  },
  {
    id: "parenting",
    name: "Parenting",
    subcategories: ["Newborn Care", "Toddler Activities", "Homeschooling", "Positive Discipline", "Teen Challenges", "Family Travel", "Budget Parenting", "Single Parenting", "Gentle Parenting", "Kids Nutrition", "Sleep Training", "Parental Self-Care", "Educational Toys", "Family Traditions", "Co-Parenting"]
  },
  {
    id: "pets",
    name: "Pets",
    subcategories: ["Dog Training", "Cat Care", "Aquarium Setup", "Exotic Pets", "Pet Nutrition", "Rescue Stories", "Pet Grooming", "Bird Watching", "Reptile Care", "Pet Photography", "Service Animals", "Pet-Friendly Travel", "Veterinary Tips", "Homemade Pet Treats", "Small Mammals"]
  },
  {
    id: "hobbies",
    name: "Hobbies",
    subcategories: ["Woodworking", "Knitting & Crochet", "Gardening", "Fishing", "Hiking", "Camping", "Astronomy", "Chess", "Model Building", "Pottery", "Painting", "Calligraphy", "Leatherworking", "Baking", "Urban Exploration"]
  },
  {
    id: "career",
    name: "Career",
    subcategories: ["Resume Writing", "Interview Tips", "Salary Negotiation", "Career Pivot", "Networking", "Work-Life Balance", "Corporate Culture", "Remote Work Tips", "Soft Skills", "Executive Coaching", "Job Search Strategy", "LinkedIn Optimization", "Workplace Productivity", "Mentorship", "Industry Trends"]
  }
];

// Total niches + subcategories count is well over 200 now.
