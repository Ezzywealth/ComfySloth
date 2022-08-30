import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  cart: {
    cartItems: Cookies.get("cartItem3444")
      ? JSON.parse(Cookies.get("cartItem3444"))
      : [],
    shippingAddress: Cookies.get("shipping")
      ? JSON.parse(Cookies.get("shipping"))
      : {},
  },
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      console.log(action.payload);
      const existItem = state.cart.cartItems.find(
        (item) => item.id === action.payload.id
      );
      console.log(action.payload);

      state.cart.cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item.name === action.payload.name ? action.payload : item
          )
        : [...state.cart.cartItems, action.payload];

      const cartItems = state.cart.cartItems.map((item) => ({
        category: item.category,
        colors: item.colors,
        company: item.company,
        description: item.description,
        id: item.id,
        images: item.images.map((image) => image?.url),
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        reviews: item.reviews,
        selectedColor: item.selectedColor,
        shipping: item.shipping,
        stars: item.stars,
        stock: item.stock,
      }));

      Cookies.set("cartItem3444", JSON.stringify([...cartItems]));
    },
    removeFromCart: (state, action) => {
      state.cart.cartItems = state.cart.cartItems.filter(
        (item) => item.id !== action.payload
      );
    },

    quantityUpdate: (state, action) => {
      const item = state.cart.cartItems.find(
        (product) => product.id === action.payload.id
      );
      item.quantity = action.payload.quantity;
    },
    clearShoppingCart: (state, action) => {
      return initialState;
    },
    addShippingAddress: (state, action) => {
      console.log(action.payload);
      const { fullName, address, city, postalCode, country } = action.payload;
      state.cart.shippingAddress = {
        fullName,
        address,
        city,
        postalCode,
        country,
      };
      Cookies.set(
        "shipping",
        JSON.stringify({ fullName, address, city, postalCode, country })
      );
    },
  },
});

export default cartSlice.reducer;
export const {
  addToCart,
  removeFromCart,
  quantityUpdate,
  deleteItem,
  clearShoppingCart,
  addShippingAddress,
} = cartSlice.actions;
