const express = require('express');
const router = express.Router();
const LandingPage = require('../models/LandingPage');
const Affiliate = require('../models/Affiliate');

// Get all landing pages
router.get('/', async (req, res) => {
  try {
    const landingPages = await LandingPage.find()
      .populate('affiliate', 'name company')
      .sort({ createdAt: -1 });
    res.json(landingPages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get landing pages by affiliate
router.get('/affiliate/:affiliateId', async (req, res) => {
  try {
    const landingPages = await LandingPage.find({ affiliate: req.params.affiliateId })
      .populate('affiliate', 'name company')
      .sort({ createdAt: -1 });
    res.json(landingPages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get single landing page by ID
router.get('/id/:id', async (req, res) => {
  try {
    const landingPage = await LandingPage.findById(req.params.id)
      .populate('affiliate', 'name company');
    if (!landingPage) {
      return res.status(404).json({ message: 'Landing page not found' });
    }
    res.json(landingPage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get single landing page by slug
router.get('/:slug', async (req, res) => {
  try {
    const landingPage = await LandingPage.findOne({ slug: req.params.slug })
      .populate('affiliate', 'name company');
    if (!landingPage) {
      return res.status(404).json({ message: 'Landing page not found' });
    }
    
    // Increment view count
    landingPage.statistics.views += 1;
    await landingPage.save();
    
    res.json(landingPage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create new landing page
router.post('/', async (req, res) => {
  try {
    // Check if affiliate exists
    const affiliate = await Affiliate.findById(req.body.affiliate);
    if (!affiliate) {
      return res.status(404).json({ message: 'Affiliate not found' });
    }
    
    // Check if slug is unique
    const existingPage = await LandingPage.findOne({ slug: req.body.slug });
    if (existingPage) {
      return res.status(400).json({ message: 'Slug already in use' });
    }
    
    const newLandingPage = new LandingPage(req.body);
    const landingPage = await newLandingPage.save();
    res.status(201).json(landingPage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update landing page
router.put('/:id', async (req, res) => {
  try {
    // If slug is being updated, check if it's unique
    if (req.body.slug) {
      const existingPage = await LandingPage.findOne({ 
        slug: req.body.slug,
        _id: { $ne: req.params.id }
      });
      if (existingPage) {
        return res.status(400).json({ message: 'Slug already in use' });
      }
    }
    
    const landingPage = await LandingPage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!landingPage) {
      return res.status(404).json({ message: 'Landing page not found' });
    }
    res.json(landingPage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete landing page
router.delete('/:id', async (req, res) => {
  try {
    const landingPage = await LandingPage.findByIdAndDelete(req.params.id);
    if (!landingPage) {
      return res.status(404).json({ message: 'Landing page not found' });
    }
    res.json({ message: 'Landing page removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
