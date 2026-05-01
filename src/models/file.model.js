import { Schema, model } from "mongoose";

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
  },
  {
    timestamps: true,
  },
);
export const File = model("File", fileSchema);
