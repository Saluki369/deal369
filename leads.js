const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// Get all leads
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find()
      .populate('affiliate', 'name company')
      .sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get leads by affiliate
router.get('/affiliate/:affiliateId', async (req, res) => {
  try {
    const leads = await Lead.find({ affiliate: req.params.affiliateId })
      .populate('affiliate', 'name company')
      .sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get single lead
router.get('/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('affiliate', 'name company');
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.json(lead);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create new lead
router.post('/', async (req, res) => {
  try {
    const newLead = new Lead(req.body);
    const lead = await newLead.save();
    
    // Update landing page statistics if landingPage is provided
    if (req.body.landingPage) {
      const LandingPage = require('../models/LandingPage');
      await LandingPage.findOneAndUpdate(
        { slug: req.body.landingPage },
        { $inc: { 'statistics.leads': 1 } }
      );
    }
    
    res.status(201).json(lead);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update lead
router.put('/:id', async (req, res) => {
  try {
    // Check if status is being updated to 'converted'
    const currentLead = await Lead.findById(req.params.id);
    const isConversionUpdate = 
      currentLead && 
      currentLead.status !== 'converted' && 
      req.body.status === 'converted';
    
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    // If lead was converted, update landing page statistics
    if (isConversionUpdate && lead.landingPage) {
      const LandingPage = require('../models/LandingPage');
      await LandingPage.findOneAndUpdate(
        { slug: lead.landingPage },
        { $inc: { 'statistics.conversions': 1 } }
      );
    }
    
    res.json(lead);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete lead
router.delete('/:id', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.json({ message: 'Lead removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
