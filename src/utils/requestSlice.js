import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "requests",
  initialState: null,
  reducers: {
    addRequests: (state, action) => action.payload,
    removeUserRequests: (state, action) => {
      console.log(action);
      const data = state.filter((user) => user.requestId !== action.payload);

      return data;
    },
  },
});
export const { addRequests, removeUserRequests } = requestSlice.actions;
export default requestSlice.reducer;
