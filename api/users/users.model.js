const { Schema, model } = require("mongoose");
const { hashSync, compareSync } = require("bcryptjs");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"]
    },
    login: {
      type: String,
      trim: true,
      unique: true,
      required: true
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true
    }
  },
  {
    collection: "users",
    timestamps: true
  }
);

userSchema.statics = {
  localStrategyAuth: async function(req, email, password, cb) {
    const user = await this.findOne({ email })
      .select("password")
      .lean()
      .exec();

    if (!user) {
      return cb({ status: 404, message: "Email or password is incorrect" });
    }

    if (!compareSync(password, user.password)) {
      return cb({ status: 403, message: "Email or password is incorrect" });
    }

    cb(null, user._id);
  },
  serializeUser: (user_id, cb) => {
    cb(null, user_id);
  },
  deserializeUser: async function(user_id, cb) {
    const user = await this.findOne({ _id: user_id })
      .select("email role")
      .lean()
      .exec();
    cb(null, user);
  }
};

userSchema.pre("save", function(next) {
  if (this.isNew || this.isModified("password")) {
    this.password = hashSync(this.password, 8);
  }
  next();
});

module.exports = model("UsersModel", userSchema);
