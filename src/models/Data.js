const { Schema, model, Types } = require('mongoose')
//TODO add/change properties depending on exam description
const dataSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  elevation: {
    type: Number,
    required: true,
  },
  lastEruption: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  typeVolcano: {
    type: String,
    enum: ['Supervolcanoes', 'Submarine', 'Subglacial', 'Mud', 'Stratovolcanoes', 'Shield'],
    required: true
  },
  description: {
    type: String,
    required: true,
  },
  votes: {
    type: [Types.ObjectId],
    ref: 'User',
    default: []
  },
  author: {
    type: Types.ObjectId,
    ref: 'User'
  }

})

const Data = model('Data', dataSchema)

module.exports = {
  Data
}