const mongoose = require("mongoose");
const { schema } = require("./connectionRequest");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      require: true,
      ref: "User",
    },
    paymentId: {
      type: String,
      //no require because some failuer payment not having payment id
    },
    orderId: {
      type: String,
      required: true,
    },

    amount: {
      type: String,
      require: true,
    },
    currency: {
      type: String,
      require: true,
    },
    membership: {
      type: String,
      require: true,
    },
    notes: {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      membershipType: {
        type: String,
      },
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Payment", paymentSchema);
