const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Milestone Schema (as a subdocument)
const milestoneSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Gross Motor', 'Fine Motor', 'Communication/Social', 'Cognitive/Adaptive', 'Other']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  expectedAge: {
    type: Number,
    required: [true, 'Expected age in months is required'],
    min: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedDate: {
    type: Date,
    default: null
  },
  delayDays: {
    type: Number,
    default: 0
  }
}, { _id: false });

// Baby Schema
const babySchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  birthDate: {
    type: Date,
    required: [true, 'Birth date is required']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['male', 'female', 'other']
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  milestones: [milestoneSchema]
});

// Calculate delay days before saving
babySchema.pre('save', function(next) {
  if (this.milestones && this.milestones.length > 0) {
    const birthDate = new Date(this.birthDate);
    
    this.milestones.forEach(milestone => {
      if (milestone.completed && milestone.completedDate) {
        const expectedAgeInDays = milestone.expectedAge * 30; // Approximate
  
        const expectedDate = new Date(birthDate);
        expectedDate.setDate(expectedDate.getDate() + expectedAgeInDays);
        
        milestone.delayDays = Math.max(0, Math.floor(
          (milestone.completedDate - expectedDate) / (1000 * 60 * 60 * 24)
        ));
      }else{
        milestone.completedDate = null;
        milestone.delayDays = 0;
      }
    });
  }
  next();
});


module.exports = mongoose.model('Baby', babySchema);