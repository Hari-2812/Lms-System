import Job from '../models/Job.js';

export const createJob = async (req, res) => {
  const { title, company, description, applyLink } = req.body;
  if (!title || !company || !applyLink) {
    return res.status(400).json({ message: 'title, company and applyLink are required' });
  }

  const job = await Job.create({ title, company, description, applyLink });
  res.status(201).json(job);
};

export const getJobs = async (req, res) => {
  const jobs = await Job.find().sort({ createdAt: -1 }).lean();
  res.json(jobs);
};
