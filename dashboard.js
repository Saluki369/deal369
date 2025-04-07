const express = require('express');
const router = express.Router();
const Affiliate = require('../models/Affiliate');
const LandingPage = require('../models/LandingPage');
const Lead = require('../models/Lead');
const SocialPost = require('../models/SocialPost');

// Main dashboard page
router.get('/', async (req, res) => {
  try {
    res.render('dashboard/index', {
      title: 'Dashboard - Menschgreifzu',
      activeTab: 'dashboard'
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { 
      title: 'Error', 
      message: 'Something went wrong!',
      error: process.env.NODE_ENV === 'development' ? err : {}
    });
  }
});

// Dashboard API - Get summary statistics
router.get('/api/stats', async (req, res) => {
  try {
    const affiliateCount = await Affiliate.countDocuments();
    const activeAffiliateCount = await Affiliate.countDocuments({ active: true });
    const landingPageCount = await LandingPage.countDocuments();
    const leadCount = await Lead.countDocuments();
    const conversionCount = await Lead.countDocuments({ status: 'converted' });
    const scheduledPostCount = await SocialPost.countDocuments({ status: 'scheduled' });
    
    // Calculate total views, leads, and conversions from landing pages
    const landingPageStats = await LandingPage.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$statistics.views' },
          totalLeads: { $sum: '$statistics.leads' },
          totalConversions: { $sum: '$statistics.conversions' }
        }
      }
    ]);
    
    const totalViews = landingPageStats.length > 0 ? landingPageStats[0].totalViews : 0;
    const totalLeads = landingPageStats.length > 0 ? landingPageStats[0].totalLeads : 0;
    const totalConversions = landingPageStats.length > 0 ? landingPageStats[0].totalConversions : 0;
    
    // Calculate conversion rate
    const conversionRate = totalLeads > 0 ? (totalConversions / totalLeads * 100).toFixed(2) : 0;
    
    res.json({
      affiliates: {
        total: affiliateCount,
        active: activeAffiliateCount
      },
      landingPages: landingPageCount,
      leads: {
        total: leadCount,
        converted: conversionCount
      },
      posts: {
        scheduled: scheduledPostCount
      },
      performance: {
        views: totalViews,
        leads: totalLeads,
        conversions: totalConversions,
        conversionRate: conversionRate
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Dashboard API - Get top performing affiliates
router.get('/api/top-affiliates', async (req, res) => {
  try {
    const topAffiliates = await Lead.aggregate([
      { $match: { status: 'converted' } },
      { $group: {
          _id: '$affiliate',
          conversionCount: { $sum: 1 },
          totalValue: { $sum: '$conversionValue' }
        }
      },
      { $sort: { conversionCount: -1 } },
      { $limit: 5 },
      { $lookup: {
          from: 'affiliates',
          localField: '_id',
          foreignField: '_id',
          as: 'affiliateInfo'
        }
      },
      { $unwind: '$affiliateInfo' },
      { $project: {
          _id: 1,
          name: '$affiliateInfo.name',
          company: '$affiliateInfo.company',
          conversionCount: 1,
          totalValue: 1
        }
      }
    ]);
    
    res.json(topAffiliates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Dashboard API - Get recent leads
router.get('/api/recent-leads', async (req, res) => {
  try {
    const recentLeads = await Lead.find()
      .populate('affiliate', 'name company')
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json(recentLeads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Dashboard API - Get upcoming social posts
router.get('/api/upcoming-posts', async (req, res) => {
  try {
    const upcomingPosts = await SocialPost.find({ 
      status: 'scheduled',
      scheduledDate: { $gte: new Date() }
    })
      .populate('affiliate', 'name company')
      .sort({ scheduledDate: 1 })
      .limit(10);
    
    res.json(upcomingPosts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
