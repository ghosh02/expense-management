import { createSlice } from "@reduxjs/toolkit";

const entrySlice = createSlice({
  name: "entry",
  initialState: {
    entries: [],
    totalIncome: 0,
    totalExpense: 0,
    lastThreeMonthsIncome: [],
  },
  reducers: {
    setEntry: (state, action) => {
      state.entries = action.payload;
    },
    setTotalIncome: (state, action) => {
      state.totalIncome = action.payload;
    },
    setTotalExpense: (state, action) => {
      state.totalExpense = action.payload;
    },
  },
});

export const { setEntry, setTotalIncome, setTotalExpense } = entrySlice.actions;
export default entrySlice.reducer;
