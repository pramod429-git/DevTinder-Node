const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["Intrested", "Ignored", "Accepted", "Rejected"],
        message: `{VALUE} invalid status`,
      },
    },
  },
  {
    timestamps: true,
  }
);
//compound index fetch record fast
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("cannot send request to yourself");
  }
  next();
});

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
