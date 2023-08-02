// searchRoutes.js
const express = require('express');
const router = express.Router();
const Project = require('../models/projectModel');

router.get('/', async (req, res) => {
  const searchTerm = req.query.query;

  try {
    const projects = await Project.find({ name: { $regex: searchTerm, $options: 'i' } });

    res.json(projects);
  } catch (error) {
    console.error('Error searching projects:', error);
    res.status(500).json({ error: 'Error searching projects' });
  }
});

module.exports = router;
