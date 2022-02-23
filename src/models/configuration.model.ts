import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  guild_id: {
    type: String,
    unique: true,
    required: true,
  },
  logging_channel_id: {
    type: String,
    required: true,
  },
});

export default mongoose.model('configuration', schema);
