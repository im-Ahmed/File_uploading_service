import mongoose, { Schema, model } from "mongoose";

const fileSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);
export const File = model("File", fileSchema);
