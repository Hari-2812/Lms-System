import Task from '../models/Task.js';

export const createTask = async (req, res) => {
  const task = await Task.create(req.body);
  res.json(task);
};

export const submitTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  task.submissions.push({
    student: req.user._id,
    file: req.body.file
  });

  await task.save();
  res.json(task);
};

export const getTasks = async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
};