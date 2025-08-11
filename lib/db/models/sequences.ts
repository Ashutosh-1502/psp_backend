import mongoose from "mongoose";

export interface ISequence {
  _id: mongoose.Types.ObjectId;
  sequence: string;
  sequenceDetails: string;
}

export interface ISequenceDocument extends ISequence, Document {
  createdAt: Date;
  updatedAt: Date;
}

const SequenceSchema = new mongoose.Schema<ISequenceDocument>(
  {
    sequence: {
      type: String,
      required: true,
    },
    sequenceDetails: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

SequenceSchema.index({ name: "text" });

export const Sequence = mongoose.model<ISequenceDocument>(
  "Sequence",
  SequenceSchema,
);
