const Transformation = require('../models/Transformation');
const User = require('../models/User');

// @desc    Get user dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
exports.getStats = async (req, res) => {
  try {
    // Get user
    const user = await User.findById(req.user.id);
    
    // Get total transformations count
    const totalTransformations = user.transformationCount;
    
    // Get saved transformations count
    const savedTransformations = await Transformation.countDocuments({
      userId: req.user.id,
      saved: true
    });
    
    // Get recent transformations
    const recentTransformations = await Transformation.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Get transformation types distribution
    const typeDistribution = await Transformation.aggregate([
      { $match: { userId: req.user.id } },
      { $group: { _id: '$transformationType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Get daily activity for the past 7 days
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const dailyActivity = await Transformation.aggregate([
      { 
        $match: { 
          userId: req.user.id,
          createdAt: { $gte: sevenDaysAgo }
        } 
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        transformations: totalTransformations,
        saved: savedTransformations,
        recent: recentTransformations,
        typeDistribution,
        dailyActivity
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};