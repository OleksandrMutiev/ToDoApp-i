const { Schema, model } = require("mongoose");

const TodoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    deadline: {
      type: Date,
      required: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "UsersModel",
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true
    },
    active: {
      type: Boolean,
      default: true
    },
    archive: {
      type: Boolean,
      default: false
    }
  },
  {
    collection: "todos",
    timestamps: true
  }
);

module.exports = model("TodoModel", TodoSchema);
