import {createSlice, type PayloadAction} from '@reduxjs/toolkit';

export interface Order {
  orderId: string;
  price: number;
  rider?: string;
  start: {latitude: number; longitude: number};
  end: {latitude: number; longitude: number};
}
const initialState: {orders: Order[]; deliveries: Order[]} = {
  orders: [],
  deliveries: [],
};
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addOrder(state, action: PayloadAction<Order>) {
      state.orders.push(action.payload);
    },
    acceptOrder(state, action: PayloadAction<string>) {
      const index = state.orders.findIndex(v => v.orderId === action.payload);
      if (index > -1) {
        state.deliveries.push(state.orders[index]);
        state.orders.splice(index, 1);
      }
    },
    rejectOrder(state, action: PayloadAction<string>) {
      const orderIndex = state.orders.findIndex(
        v => v.orderId === action.payload,
      );
      if (orderIndex > -1) {
        state.orders.splice(orderIndex, 1);
      }
      const deliveryIndex = state.orders.findIndex(
        v => v.orderId === action.payload,
      );
      if (deliveryIndex > -1) {
        state.deliveries.splice(deliveryIndex, 1);
      }
    },
  },
  extraReducers: _ => {},
});

export default orderSlice;
