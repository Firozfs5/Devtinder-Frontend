import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    participants: [],
    messages: [],
  },
  reducers: {
    addParticipants: (state, action) => {
      state.participants = action.payload;
    },
    addMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    removeParticipants: (state) => {
      state.participants = [];
    },
    removeMessages: (state) => {
      state.messages = [];
    },
  },
});

export const {
  addParticipants,
  addMessages,
  removeParticipants,
  removeMessages,
  addMessage,
} = chatSlice.actions;
export default chatSlice.reducer;
