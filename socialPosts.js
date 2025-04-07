const express = require('express');
const router = express.Router();
const SocialPost = require('../models/SocialPost');

// Get all social posts
router.get('/', async (req, res) => {
  try {
    const posts = await SocialPost.find()
      .populate('affiliate', 'name company')
      .sort({ scheduledDate: 1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get social posts by affiliate
router.get('/affiliate/:affiliateId', async (req, res) => {
  try {
    const posts = await SocialPost.find({ affiliate: req.params.affiliateId })
      .populate('affiliate', 'name company')
      .sort({ scheduledDate: 1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get single social post
router.get('/:id', async (req, res) => {
  try {
    const post = await SocialPost.findById(req.params.id)
      .populate('affiliate', 'name company');
    if (!post) {
      return res.status(404).json({ message: 'Social post not found' });
    }
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create new social post
router.post('/', async (req, res) => {
  try {
    const newPost = new SocialPost(req.body);
    const post = await newPost.save();
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update social post
router.put('/:id', async (req, res) => {
  try {
    const post = await SocialPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!post) {
      return res.status(404).json({ message: 'Social post not found' });
    }
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete social post
router.delete('/:id', async (req, res) => {
  try {
    const post = await SocialPost.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Social post not found' });
    }
    res.json({ message: 'Social post removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
