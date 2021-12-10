import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  guild_id: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  user_tag: {
    type: String,
    required: false,
  },
});

export default mongoose.model('whitelist', schema);