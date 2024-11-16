import mongoose from "mongoose";

const carritoSchema = new mongoose.Schema(
  {
    products: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "productos",
          },
          quantity: Number,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);



export const carritosModelo = mongoose.model("carritos", carritoSchema);
