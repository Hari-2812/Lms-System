import asyncHandler from 'express-async-handler';
import Task from '../models/Task.js';

export const createTask = asyncHandler(async (req, res) => {
  const { title, description, dueDate, assignedTo = [] } = req.body;

  if (!title || !description || !dueDate) {
    res.status(400);
    throw new Error('title, description and dueDate are required');
  }

  const task = await Task.create({
    title,
    description,
    dueDate,
    assignedTo,
    createdBy: req.user._id,
  });

  res.status(201).json(task);
});

export const getMyTasks = asyncHandler(async (req, res) => {
  const query = req.user.role === 'student' ? { assignedTo: req.user._id } : { createdBy: req.user._id };

  const tasks = await Task.find(query)
    .populate('assignedTo', 'name email')
    .populate('submissions.student', 'name email')
    .sort({ createdAt: -1 });

  if (req.user.role === 'student') {
    const payload = tasks.map((task) => {
      const mySubmission = task.submissions.find((sub) => sub.student._id.toString() === req.user._id.toString());
      return {
        ...task.toObject(),
        mySubmission: mySubmission || null,
      };
    });

    res.json(payload);
    return;
  }

  res.json(tasks);
});

export const submitTaskSolution = asyncHandler(async (req, res) => {
  const { fileUrl, submissionText } = req.body;
  if (!fileUrl && !submissionText) {
    res.status(400);
    throw new Error('Either fileUrl or submissionText is required');
  }

  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const existing = task.submissions.find((sub) => sub.student.toString() === req.user._id.toString());

  if (existing) {
    existing.fileUrl = fileUrl || undefined;
    existing.submissionText = submissionText || undefined;
    existing.status = 'pending';
    existing.feedback = undefined;
    existing.score = undefined;
  } else {
    task.submissions.push({
      student: req.user._id,
      fileUrl,
      submissionText,
    });
  }

  await task.save();
  res.json({ message: 'Submission saved successfully' });
});

export const evaluateSubmission = asyncHandler(async (req, res) => {
  const { score, feedback } = req.body;

  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const submission = task.submissions.id(req.params.submissionId);
  if (!submission) {
    res.status(404);
    throw new Error('Submission not found');
  }

  submission.score = score;
  submission.feedback = feedback;
  submission.status = 'evaluated';

  await task.save();

  res.json({ message: 'Submission evaluated', submission });
});
