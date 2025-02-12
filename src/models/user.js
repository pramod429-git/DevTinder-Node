const {
  type,
} = require("@testing-library/user-event/dist/cjs/utility/type.js");
const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 4,
      maxlength: 20,
    },
    lastName: {
      type: String,
      trim: true,
      minLength: 4,
      maxlength: 20,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 4,
      maxlength: 20,
    },
    age: {
      type: Number,
      trim: true,
      min: 18,
    },
    gender: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      //custom validation not effecting patch method update in the patch api call
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("not a valid gender");
        }
      },
    },
    about: {
      type: String,
      default: "simply cool",
      trim: true,
      minLength: 4,
      maxlength: 20,
    },
    photoUrl: {
      type: String,
      default:
        "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg",
      trim: true,
    },
    skills: {
      type: [String],
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
