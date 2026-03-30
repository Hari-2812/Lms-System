import User from '../models/User.js';
import Course from '../models/Course.js';
import Task from '../models/Task.js';
import Job from '../models/Job.js';

const defaultMentors = [
  { name: 'Ava Mentor', email: 'ava.mentor@learnhub.dev', password: 'mentor123', role: 'mentor' },
  { name: 'Liam Mentor', email: 'liam.mentor@learnhub.dev', password: 'mentor123', role: 'mentor' },
  { name: 'Noah Mentor', email: 'noah.mentor@learnhub.dev', password: 'mentor123', role: 'mentor' },
];

const defaultCourses = [
  {
    title: 'MERN Stack Foundations',
    description: 'Build full-stack applications with MongoDB, Express, React, and Node.js.',
    videoUrl: 'https://www.youtube.com/watch?v=7CqJlxBYj-M',
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200',
    modules: [{ title: 'Project setup', duration: '20m' }, { title: 'Authentication flow', duration: '35m' }],
  },
  {
    title: 'React for LMS Dashboards',
    description: 'Create production-grade dashboards with React hooks and component architecture.',
    videoUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200',
    modules: [{ title: 'State management', duration: '25m' }, { title: 'API integration', duration: '30m' }],
  },
  {
    title: 'Node.js API Security',
    description: 'Secure your APIs with JWT, middleware, and role-based access control.',
    videoUrl: 'https://www.youtube.com/watch?v=f2EqECiTBL8',
    coverImage: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1200',
    modules: [{ title: 'JWT implementation', duration: '28m' }, { title: 'Auth middleware', duration: '24m' }],
  },
  {
    title: 'MongoDB Data Modeling',
    description: 'Design reliable document schemas and optimize LMS data relationships.',
    videoUrl: 'https://www.youtube.com/watch?v=ofme2o29ngU',
    coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=1200',
    modules: [{ title: 'Schema design', duration: '22m' }, { title: 'Indexes & queries', duration: '27m' }],
  },
  {
    title: 'System Design for LMS',
    description: 'Learn scalable architecture patterns for educational platforms.',
    videoUrl: 'https://www.youtube.com/watch?v=UzLMhqg3_Wc',
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1200',
    modules: [{ title: 'Service boundaries', duration: '18m' }, { title: 'Scaling strategy', duration: '33m' }],
  },
  {
    title: 'Frontend Performance Tuning',
    description: 'Improve rendering speed, loading states, and UX quality in React apps.',
    videoUrl: 'https://www.youtube.com/watch?v=cuHDQhDhvPE',
    coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1200',
    modules: [{ title: 'Code splitting', duration: '21m' }, { title: 'Memoization patterns', duration: '26m' }],
  },
];

const defaultJobs = [
  {
    title: 'Frontend Developer Intern',
    company: 'LearnHub Labs',
    description: 'Work on React UI, accessibility, and performance improvements for LMS products.',
    applyLink: 'https://example.com/jobs/frontend-intern',
  },
  {
    title: 'Backend Developer Intern',
    company: 'SkillForge Tech',
    description: 'Build and maintain Node/Express APIs, authentication, and database integrations.',
    applyLink: 'https://example.com/jobs/backend-intern',
  },
  {
    title: 'Full Stack Developer',
    company: 'EdScale Systems',
    description: 'Own end-to-end features across MERN stack modules for learning platforms.',
    applyLink: 'https://example.com/jobs/fullstack-developer',
  },
  {
    title: 'MERN Trainee Engineer',
    company: 'CodeBridge Academy',
    description: 'Hands-on role focused on API integration, bug fixing, and feature delivery.',
    applyLink: 'https://example.com/jobs/mern-trainee',
  },
];

export const ensureSeedData = async () => {
  const mentorCount = await User.countDocuments({ role: 'mentor' });
  if (mentorCount === 0) {
    await User.insertMany(defaultMentors);
    console.log('Seeded mentors');
  }

  const courseCount = await Course.countDocuments();
  if (courseCount === 0) {
    const defaultInstructor =
      (await User.findOne({ role: 'mentor' })) || (await User.findOne({ role: 'admin' }));

    const payload = defaultCourses.map((course) => ({
      ...course,
      instructor: defaultInstructor?._id,
    }));

    await Course.insertMany(payload);
    console.log('Seeded courses');
  }

  const taskCount = await Task.countDocuments();
  if (taskCount === 0) {
    const mentor = await User.findOne({ role: 'mentor' });
    const students = await User.find({ role: 'student' }).limit(20).select('_id');

    if (mentor && students.length > 0) {
      await Task.insertMany([
        {
          title: 'Build your learner profile page',
          description: 'Create a responsive learner profile page with progress widgets.',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          createdBy: mentor._id,
          assignedTo: students.map((item) => item._id),
        },
        {
          title: 'Submit LMS API Postman collection',
          description: 'Document auth, course, task, and appointment APIs using Postman.',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          createdBy: mentor._id,
          assignedTo: students.map((item) => item._id),
        },
      ]);
      console.log('Seeded tasks');
    }
  }

  const jobCount = await Job.countDocuments();
  if (jobCount === 0) {
    await Job.insertMany(defaultJobs);
    console.log('Seeded jobs');
  }
};
