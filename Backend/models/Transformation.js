const mongoose = require('mongoose');

const TransformationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    originalText: {
      type: String,
      required: [true, 'Please add original text'],
      trim: true
    },
    transformedText: {
      type: String,
      required: [true, 'Please add transformed text'],
      trim: true
    },
    transformationType: {
      type: String,
      enum: [
        // Standard text transformations
        'formal', 'casual', 'joke', 'shakespearean', 'emoji', 'grammar', 'concise',
        // Email polishing types
        'email_professional', 'email_followup', 'email_networking', 'email_application', 'email_outreach',
        // Text insights types
        'insight_sentiment', 'insight_readability', 'insight_keywords', 'insight_language', 'insight_suggestion'
      ],
      required: [true, 'Please specify transformation type']
    },
    audience: {
      type: String,
      enum: ['general', 'child', 'expert', 'marketer'],
      default: 'general'
    },
    saved: {
      type: Boolean,
      default: false
    },
    tags: [{
      type: String,
      trim: true
    }],
    // For text insights, we can store structured analysis data
    analysisData: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    // For email polishing, we can store additional metadata
    emailMetadata: {
      subject: String,
      recipient: String,
      emailType: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    lastModified: {
      type: Date,
      default: Date.now
    },
    // Track which AI service was used for this transformation
    serviceUsed: {
      type: String,
      enum: ['gemini', 'huggingface', 'openai', 'custom'],
      default: 'gemini'
    }
  }
);

// Create indexes for faster queries
TransformationSchema.index({ userId: 1, createdAt: -1 });
TransformationSchema.index({ transformationType: 1 });
TransformationSchema.index({ saved: 1 });

// Update lastModified on save
TransformationSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

module.exports = mongoose.model('Transformation', TransformationSchema);