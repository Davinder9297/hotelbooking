const mongoose = require('mongoose');

const roomsSchema = new mongoose.Schema({
    hostel_name: {
    type: String,
    unique: true,
    required: [true, 'Room name filed is required']
  },
  hostel_location: {
    type: String,
    unique: true,
    required: [true, 'Room name filed is required']
  },
  hostel_slug: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    required: [true, 'Room slug filed is required']
  },
  hostel_price: {
    type: Number,
    required: [true, 'Room price filed is required']
  },
  hostel_room: {
    type: Number,
    required: [true, 'Room price filed is required']
  },
  hostel_size: {
    type: Number,
    required: [true, 'Room size filed is required']
  },
  provide_breakfast: {
    type: Boolean,
    default: false
  },
  provide_lunch: {
    type: Boolean,
    default: false
  },
  mess: {
    type: Boolean,
    default: false
  },
  provide_dinner: {
    type: Boolean,
    default: false
  },
  featured_hostel: {
    type: Boolean,
    default: false
  },
  hostel_description: {
    type: String,
    required: [true, 'Room description filed is required']
  },
  extra_facilities: [String],
  hostel_images: [
    {
      url: {
        type: String,
        required: [true, 'Room image filed is required']
      }
    }
  ],
  hostel_status: {
    type: String,
    enum: ['available', 'unavailable', 'booked'],
    required: [true, 'Room status filed is required'],
    default: 'available'
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: [true, 'Room created by is required field']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Replace spaces with dashes in room_slug before saving
roomsSchema.pre('save', function (next) {
  if (this.hostel_slug) {
    this.hostel_slug = this.hostel_slug.replace(/\s/g, '-');
  }
  next();
});

module.exports = mongoose.model('Hostels', roomsSchema);
