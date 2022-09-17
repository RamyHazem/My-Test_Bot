const mongoose = require("mongoose");

const requiredString = {
  type: String,
  required: true,
};

const donoSchema = new mongoose.Schema({
  guildID: requiredString,
  userID: requiredString,
  userTag: requiredString,
  donations: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("donoSchema", donoSchema);
