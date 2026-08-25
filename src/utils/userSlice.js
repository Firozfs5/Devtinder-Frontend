import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    addUser: (state, action) => {
      return action.payload;
    },
    reduceReqCount: (state) => ({
      ...state,
      requestCount: state.requestCount - 1,
    }),
    removeUser: () => {
      return null;
    },
  },
});

export const { addUser, reduceReqCount, removeUser } = userSlice.actions;
export default userSlice.reducer;
