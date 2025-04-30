const Transformation = require('../models/Transformation');
const User = require('../models/User');
const geminiService = require('../services/ai/gemini.service');

// Helper function to check if type is for email
const isEmailType = (type) => type.startsWith('email_');

// Helper function to check if type is for insights
const isInsightType = (type) => type.startsWith('insight_');

// @desc    Transform text using AI
// @route   POST /api/transform/text
// @access  Private
exports.transformText = async (req, res) => {
  try {
    const { text, type, audience = 'general', subject = '', recipient = '' } = req.body;
    
    if (!text || !type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide text and transformation type'
      });
    }
    
    // Process the request based on transformation type
    let transformedText = '';
    let analysisData = null;
    let emailMetadata = {};
    
    if (isEmailType(type)) {
      // Email polishing transformation
      const emailType = type.replace('email_', '');
      transformedText = await geminiService.polishEmail(text, emailType, audience);
      
      // Store email metadata
      emailMetadata = {
        subject,
        recipient,
        emailType
      };
    } else if (isInsightType(type)) {
      // Text insights analysis
      const insightType = type.replace('insight_', '');
      const analysisResult = await geminiService.analyzeText(text, insightType);
      
      // For insights, we try to parse the result as structured data if possible
      try {
        // Check if the result is already a JSON object
        if (typeof analysisResult === 'object') {
          analysisData = analysisResult;
          transformedText = JSON.stringify(analysisResult);
        } else {
          // Try to parse as JSON if it's a string
          analysisData = JSON.parse(analysisResult);
          transformedText = analysisResult;
        }
      } catch (error) {
        // If parsing fails, just use the text as is
        console.log('Failed to parse analysis result as JSON', error);
        analysisData = null;
        transformedText = analysisResult;
      }
    } else {
      // Standard text transformation
      transformedText = await geminiService.transformText(text, type, audience);
    }
    
    // Create transformation record with the appropriate fields based on type
    const transformationData = {
      userId: req.user.id,
      originalText: text,
      transformedText,
      transformationType: type,
      audience
    };
    
    // Add email metadata if it's an email transformation
    if (isEmailType(type) && Object.keys(emailMetadata).length > 0) {
      transformationData.emailMetadata = emailMetadata;
    }
    
    // Add analysis data if it's an insights transformation
    if (isInsightType(type) && analysisData) {
      transformationData.analysisData = analysisData;
    }
    
    const transformation = await Transformation.create(transformationData);
    
    // Increment user transformation count
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { transformationCount: 1 }
    });
    
    res.status(200).json({
      success: true,
      data: transformation
    });
  } catch (error) {
    console.error('Transform text error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to transform text'
    });
  }
};

// @desc    Get user's transformation history
// @route   GET /api/transform/history
// @access  Private
exports.getTransformationHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const type = req.query.type;
    const category = req.query.category; // Can be 'transform', 'email', or 'insight'
    const search = req.query.search;
    
    let query = { userId: req.user.id };
    
    // Handle category filter
    if (category) {
      switch (category) {
        case 'transform':
          query.transformationType = { $nin: [
            /^email_/, /^insight_/
          ]};
          break;
        case 'email':
          query.transformationType = { $regex: /^email_/ };
          break;
        case 'insight':
          query.transformationType = { $regex: /^insight_/ };
          break;
      }
    }
    
    // Add specific type filter if provided
    if (type && type !== 'all') {
      query.transformationType = type;
    }
    
    // Add saved filter if provided
    if (req.query.saved === 'true') {
      query.saved = true;
    }
    
    // Add search filter if provided
    if (search) {
      query.$or = [
        { originalText: { $regex: search, $options: 'i' } },
        { transformedText: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Execute query
    const transformations = await Transformation.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);
    
    // Get total count for pagination
    const total = await Transformation.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: transformations.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: transformations
    });
  } catch (error) {
    console.error('Get transformation history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single transformation
// @route   GET /api/transform/:id
// @access  Private
exports.getSingleTransformation = async (req, res) => {
  try {
    const transformation = await Transformation.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!transformation) {
      return res.status(404).json({
        success: false,
        message: 'Transformation not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: transformation
    });
  } catch (error) {
    console.error('Get single transformation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Save transformation (toggle saved status)
// @route   PUT /api/transform/:id/save
// @access  Private
exports.saveTransformation = async (req, res) => {
  try {
    const transformation = await Transformation.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!transformation) {
      return res.status(404).json({
        success: false,
        message: 'Transformation not found'
      });
    }
    
    // Toggle saved status
    transformation.saved = !transformation.saved;
    await transformation.save();
    
    res.status(200).json({
      success: true,
      data: transformation
    });
  } catch (error) {
    console.error('Save transformation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete transformation
// @route   DELETE /api/transform/:id
// @access  Private
exports.deleteTransformation = async (req, res) => {
  try {
    const transformation = await Transformation.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!transformation) {
      return res.status(404).json({
        success: false,
        message: 'Transformation not found'
      });
    }
    
    // In mongoose 6+ use deleteOne() instead of remove()
    await transformation.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete transformation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get transformation statistics
// @route   GET /api/transform/stats
// @access  Private
exports.getTransformationStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get total count
    const totalCount = await Transformation.countDocuments({ userId });
    
    // Get count by type
    const typeStats = await Transformation.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$transformationType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Get saved count
    const savedCount = await Transformation.countDocuments({ 
      userId, 
      saved: true 
    });
    
    // Get count by category
    const standardCount = await Transformation.countDocuments({ 
      userId,
      transformationType: { $nin: [/^email_/, /^insight_/] }
    });
    
    const emailCount = await Transformation.countDocuments({ 
      userId,
      transformationType: { $regex: /^email_/ }
    });
    
    const insightCount = await Transformation.countDocuments({ 
      userId,
      transformationType: { $regex: /^insight_/ }
    });
    
    res.status(200).json({
      success: true,
      data: {
        total: totalCount,
        saved: savedCount,
        byCategory: {
          standard: standardCount,
          email: emailCount,
          insight: insightCount
        },
        byType: typeStats
      }
    });
  } catch (error) {
    console.error('Get transformation stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};