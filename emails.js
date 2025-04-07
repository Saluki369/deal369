const express = require('express');
const router = express.Router();
const EmailTemplate = require('../models/EmailTemplate');
const EmailCampaign = require('../models/EmailCampaign');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Get all email templates
router.get('/templates', async (req, res) => {
  try {
    const templates = await EmailTemplate.find()
      .populate('affiliate', 'name company')
      .sort({ createdAt: -1 });
    res.json(templates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get email templates by affiliate
router.get('/templates/affiliate/:affiliateId', async (req, res) => {
  try {
    const templates = await EmailTemplate.find({ affiliate: req.params.affiliateId })
      .populate('affiliate', 'name company')
      .sort({ createdAt: -1 });
    res.json(templates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get single email template
router.get('/templates/:id', async (req, res) => {
  try {
    const template = await EmailTemplate.findById(req.params.id)
      .populate('affiliate', 'name company');
    if (!template) {
      return res.status(404).json({ message: 'Email template not found' });
    }
    res.json(template);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create new email template
router.post('/templates', async (req, res) => {
  try {
    const newTemplate = new EmailTemplate(req.body);
    const template = await newTemplate.save();
    res.status(201).json(template);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update email template
router.put('/templates/:id', async (req, res) => {
  try {
    const template = await EmailTemplate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!template) {
      return res.status(404).json({ message: 'Email template not found' });
    }
    res.json(template);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete email template
router.delete('/templates/:id', async (req, res) => {
  try {
    const template = await EmailTemplate.findByIdAndDelete(req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Email template not found' });
    }
    res.json({ message: 'Email template removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get all email campaigns
router.get('/campaigns', async (req, res) => {
  try {
    const campaigns = await EmailCampaign.find()
      .populate('affiliate', 'name company')
      .populate('emailTemplate', 'name subject')
      .sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get email campaigns by affiliate
router.get('/campaigns/affiliate/:affiliateId', async (req, res) => {
  try {
    const campaigns = await EmailCampaign.find({ affiliate: req.params.affiliateId })
      .populate('affiliate', 'name company')
      .populate('emailTemplate', 'name subject')
      .sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get single email campaign
router.get('/campaigns/:id', async (req, res) => {
  try {
    const campaign = await EmailCampaign.findById(req.params.id)
      .populate('affiliate', 'name company')
      .populate('emailTemplate', 'name subject body');
    if (!campaign) {
      return res.status(404).json({ message: 'Email campaign not found' });
    }
    res.json(campaign);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create new email campaign
router.post('/campaigns', async (req, res) => {
  try {
    const newCampaign = new EmailCampaign(req.body);
    const campaign = await newCampaign.save();
    res.status(201).json(campaign);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update email campaign
router.put('/campaigns/:id', async (req, res) => {
  try {
    const campaign = await EmailCampaign.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!campaign) {
      return res.status(404).json({ message: 'Email campaign not found' });
    }
    res.json(campaign);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete email campaign
router.delete('/campaigns/:id', async (req, res) => {
  try {
    const campaign = await EmailCampaign.findByIdAndDelete(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Email campaign not found' });
    }
    res.json({ message: 'Email campaign removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Send test email
router.post('/send-test', async (req, res) => {
  try {
    const { templateId, testEmail } = req.body;
    
    if (!templateId || !testEmail) {
      return res.status(400).json({ message: 'Template ID and test email are required' });
    }
    
    const template = await EmailTemplate.findById(templateId)
      .populate('affiliate', 'name company');
    
    if (!template) {
      return res.status(404).json({ message: 'Email template not found' });
    }
    
    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    // Send email
    await transporter.sendMail({
      from: `"Menschgreifzu" <${process.env.EMAIL_USER}>`,
      to: testEmail,
      subject: template.subject,
      html: template.body
    });
    
    res.json({ message: 'Test email sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
