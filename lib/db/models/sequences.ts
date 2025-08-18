import mongoose from "mongoose";

export interface ISequence {
  _id: mongoose.Types.ObjectId;
  proteinName: string;
  pdbId: string;
  sequenceId: string;
  length: number;
  sequence: string
}

export interface ISequenceDocument extends ISequence, Document {
  createdAt: Date;
  updatedAt: Date;
}

const SequenceSchema = new mongoose.Schema<ISequenceDocument>(
  {
    proteinName: {
      type: String,
      required: true
    },
    pdbId: {
      type: String,
      required: true
    },
    sequenceId: {
      type: String,
      required: true
    },
    length: {
      type: Number,
      required: true
    },
    sequence: {
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
