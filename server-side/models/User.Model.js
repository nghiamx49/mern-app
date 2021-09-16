const mongoose = require("mongoose");
const CryptoJS = require("crypto-js");

const UserSchema = mongoose.Schema({
  username: String,
  password: String,
  fullName: String,
  dateOfBirth: Date,
  role: String,
  avatar: String,
});

UserSchema.pre("save", async function (next) {
  try {
    const user = this;
    if (!user.isModified("passowrd")) {
      next();
    }
    user.password = CryptoJS.AES.encrypt(
      user.password,
      process.env.ENCRYPT_KEY,
    ).toString();
    next();
  } catch (error) {
    next(error);
  }
}, { collection: 'users' });

UserSchema.methods.comparePassword = function (password, next) {
  try {
    const decrypted = CryptoJS.AES.decrypt(
      this.password,
      process.env.ENCRYPT_KEY,
    );
    const rawPassword = decrypted.toString(CryptoJS.enc.Utf8);
    if (rawPassword === password) {
      return next(null, this);
    } else {
      return next(null, false);
    }
  } catch (error) {
    return next(error);
  }
};

module.exports = mongoose.model("User", UserSchema);
