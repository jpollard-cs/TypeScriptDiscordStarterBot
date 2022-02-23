import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  guild_id: {
    type: String,
    unique: true,
    required: true,
  },
  admin_reporting_channel_id: {
    type: String,
    required: true,
  },
  help_user_id_image_url: {
    type: String,
    required: true,
  },
});

export default mongoose.model('configuration', schema);