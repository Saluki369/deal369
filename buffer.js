const express = require('express');
const router = express.Router();
const BufferConfig = require('../models/BufferConfig');
const SocialPost = require('../models/SocialPost');
const axios = require('axios');

// Get Buffer configuration
router.get('/config', async (req, res) => {
  try {
    const config = await BufferConfig.findOne();
    if (!config) {
      return res.status(404).json({ message: 'Buffer configuration not found' });
    }
    res.json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update Buffer configuration
router.put('/config', async (req, res) => {
  try {
    let config = await BufferConfig.findOne();
    
    if (config) {
      config = await BufferConfig.findOneAndUpdate(
        {},
        req.body,
        { new: true, runValidators: true }
      );
    } else {
      config = new BufferConfig(req.body);
      await config.save();
    }
    
    res.json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Schedule a post to Buffer
router.post('/schedule', async (req, res) => {
  try {
    const { postId } = req.body;
    
    if (!postId) {
      return res.status(400).json({ message: 'Post ID is required' });
    }
    
    const post = await SocialPost.findById(postId).populate('affiliate');
    if (!post) {
      return res.status(404).json({ message: 'Social post not found' });
    }
    
    const config = await BufferConfig.findOne();
    if (!config) {
      return res.status(404).json({ message: 'Buffer configuration not found' });
    }
    
    // Find the profile ID for the platform
    const profile = config.connectedProfiles.find(p => p.platform === post.platform && p.active);
    if (!profile) {
      return res.status(400).json({ message: `No active Buffer profile found for ${post.platform}` });
    }
    
    // Schedule post to Buffer (mock implementation - would use Buffer API in production)
    // In a real implementation, we would use the Buffer API to schedule the post
    // This is a placeholder for the actual API call
    
    /*
    const response = await axios.post('https://api.bufferapp.com/1/updates/create.json', {
      access_token: config.accessToken,
      profile_ids: [profile.id],
      text: post.content,
      media: post.imageUrl ? { photo: post.imageUrl } : undefined,
      scheduled_at: post.scheduledDate.toISOString()
    });
    
    const bufferPostId = response.data.updates[0].id;
    */
    
    // Mock successful response
    const bufferPostId = 'buffer_' + Date.now();
    
    // Update post with Buffer ID and status
    post.bufferPostId = bufferPostId;
    post.status = 'scheduled';
    await post.save();
    
    res.json({ message: 'Post scheduled successfully', post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Sync posts from Buffer (get analytics)
router.post('/sync', async (req, res) => {
  try {
    const config = await BufferConfig.findOne();
    if (!config) {
      return res.status(404).json({ message: 'Buffer configuration not found' });
    }
    
    // Get posts with Buffer IDs
    const posts = await SocialPost.find({ 
      bufferPostId: { $exists: true, $ne: null },
      status: 'scheduled'
    });
    
    // Mock analytics update
    const updatedPosts = [];
    for (const post of posts) {
      // In a real implementation, we would fetch analytics from Buffer API
      // This is a placeholder for the actual API call
      
      /*
      const response = await axios.get(`https://api.bufferapp.com/1/updates/${post.bufferPostId}.json`, {
        params: { access_token: config.accessToken }
      });
      
      const bufferData = response.data;
      */
      
      // Mock analytics data
      post.status = 'posted';
      post.analytics = {
        likes: Math.floor(Math.random() * 50),
        shares: Math.floor(Math.random() * 20),
        comments: Math.floor(Math.random() * 10),
        clicks: Math.floor(Math.random() * 100)
      };
      
      await post.save();
      updatedPosts.push(post);
    }
    
    // Update last sync date
    config.lastSyncDate = new Date();
    await config.save();
    
    res.json({ 
      message: `Synced ${updatedPosts.length} posts from Buffer`, 
      posts: updatedPosts 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
