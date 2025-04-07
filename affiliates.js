const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Affiliate = require('../models/Affiliate');
const LandingPage = require('../models/LandingPage');
const SocialPost = require('../models/SocialPost');
const Lead = require('../models/Lead');

// Get all affiliates
router.get('/', async (req, res) => {
  try {
    const affiliates = await Affiliate.findAll();
    res.render('affiliates/index', { 
      title: 'Affiliate Management',
      affiliates
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { 
      title: 'Error', 
      message: 'Error retrieving affiliates',
      error: process.env.NODE_ENV === 'development' ? err : {}
    });
  }
});

// Display add affiliate form
router.get('/add', (req, res) => {
  res.render('affiliates/add', { 
    title: 'Add New Affiliate'
  });
});

// Add an affiliate
router.post('/add', async (req, res) => {
  try {
    const {
      name,
      company,
      email,
      phone,
      website,
      category,
      description,
      affiliateLink,
      commissionRate,
      paymentMethod,
      paymentDetails,
      status
    } = req.body;

    // Validation
    if (!name || !email || !affiliateLink || !category) {
      return res.status(400).render('affiliates/add', {
        title: 'Add New Affiliate',
        error: 'Please fill in all required fields',
        affiliate: req.body
      });
    }

    // Create affiliate
    const affiliate = await Affiliate.create({
      name,
      company,
      email,
      phone,
      website,
      category,
      description,
      affiliateLink,
      commissionRate,
      paymentMethod,
      paymentDetails,
      status: status || 'pending'
    });

    res.redirect('/affiliates');
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { 
      title: 'Error', 
      message: 'Error adding affiliate',
      error: process.env.NODE_ENV === 'development' ? err : {}
    });
  }
});

// Display edit affiliate form
router.get('/edit/:id', async (req, res) => {
  try {
    const affiliate = await Affiliate.findByPk(req.params.id);
    if (!affiliate) {
      return res.status(404).render('error', {
        title: 'Error',
        message: 'Affiliate not found',
        error: {}
      });
    }
    
    res.render('affiliates/edit', {
      title: 'Edit Affiliate',
      affiliate
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { 
      title: 'Error', 
      message: 'Error retrieving affiliate',
      error: process.env.NODE_ENV === 'development' ? err : {}
    });
  }
});

// Update affiliate
router.post('/edit/:id', async (req, res) => {
  try {
    const affiliate = await Affiliate.findByPk(req.params.id);
    if (!affiliate) {
      return res.status(404).render('error', {
        title: 'Error',
        message: 'Affiliate not found',
        error: {}
      });
    }

    const {
      name,
      company,
      email,
      phone,
      website,
      category,
      description,
      affiliateLink,
      commissionRate,
      paymentMethod,
      paymentDetails,
      status
    } = req.body;

    // Validation
    if (!name || !email || !affiliateLink || !category) {
      return res.status(400).render('affiliates/edit', {
        title: 'Edit Affiliate',
        error: 'Please fill in all required fields',
        affiliate: { ...affiliate.toJSON(), ...req.body }
      });
    }

    // Update affiliate
    await affiliate.update({
      name,
      company,
      email,
      phone,
      website,
      category,
      description,
      affiliateLink,
      commissionRate,
      paymentMethod,
      paymentDetails,
      status
    });

    res.redirect('/affiliates');
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { 
      title: 'Error', 
      message: 'Error updating affiliate',
      error: process.env.NODE_ENV === 'development' ? err : {}
    });
  }
});

// Delete affiliate
router.post('/delete/:id', async (req, res) => {
  try {
    const affiliate = await Affiliate.findByPk(req.params.id);
    if (!affiliate) {
      return res.status(404).render('error', {
        title: 'Error',
        message: 'Affiliate not found',
        error: {}
      });
    }

    await affiliate.destroy();
    res.redirect('/affiliates');
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { 
      title: 'Error', 
      message: 'Error deleting affiliate',
      error: process.env.NODE_ENV === 'development' ? err : {}
    });
  }
});

// Batch import affiliates
router.post('/batch-import', async (req, res) => {
  try {
    const { affiliates } = req.body;
    
    if (!affiliates || !Array.isArray(affiliates)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid data format' 
      });
    }

    const createdAffiliates = await Promise.all(
      affiliates.map(affiliate => Affiliate.create(affiliate))
    );

    res.json({ 
      success: true, 
      message: `Successfully imported ${createdAffiliates.length} affiliates`,
      affiliates: createdAffiliates
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false, 
      message: 'Error importing affiliates',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Server error'
    });
  }
});

// Get affiliate dashboard
router.get('/dashboard/:id', async (req, res) => {
  try {
    const affiliate = await Affiliate.findByPk(req.params.id);
    if (!affiliate) {
      return res.status(404).render('error', {
        title: 'Error',
        message: 'Affiliate not found',
        error: {}
      });
    }

    // Get related data
    const landingPages = await LandingPage.findAll({ 
      where: { affiliateId: affiliate.id } 
    });
    
    const socialPosts = await SocialPost.findAll({ 
      where: { affiliateId: affiliate.id } 
    });
    
    const leads = await Lead.findAll({ 
      where: { affiliateId: affiliate.id } 
    });

    res.render('affiliates/dashboard', {
      title: `${affiliate.name} Dashboard`,
      affiliate,
      landingPages,
      socialPosts,
      leads,
      stats: {
        totalLeads: leads.length,
        convertedLeads: leads.filter(lead => lead.status === 'converted').length,
        conversionRate: leads.length > 0 
          ? (leads.filter(lead => lead.status === 'converted').length / leads.length * 100).toFixed(2) 
          : 0,
        totalPosts: socialPosts.length,
        publishedPosts: socialPosts.filter(post => post.status === 'published').length
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { 
      title: 'Error', 
      message: 'Error retrieving affiliate dashboard',
      error: process.env.NODE_ENV === 'development' ? err : {}
    });
  }
});

module.exports = router;
