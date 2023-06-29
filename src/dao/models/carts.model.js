import mongoose from 'mongoose';
const { Schema } = mongoose;

export const cartsCollection = 'carts'

const cartsSchema = new Schema({
  products: {
    type: [
      {
        productId: {
          type: String,
          required: true
        },
        quantity: {
          type: Number,
          default: 0,
          min: 0
        }      
      }
    ],
    default: []
  }
});

const CartsModel = mongoose.model(cartsCollection, cartsSchema);

export default CartsModel;