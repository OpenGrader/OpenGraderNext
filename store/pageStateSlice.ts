import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Section } from "types";

interface PageState {
  name: string;
  courseId: string | null;
}

const initialState: PageState = {
  name: "OpenGrader",
  courseId: null,
};

export const pageStateSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCourseId: (state, { payload: courseId }: PayloadAction<string>) => {
      state.courseId = courseId;
    },
    setName: (state, { payload: name }: PayloadAction<string>) => {
      state.name = name;
    },
    setCurrentPage: (state, { payload: newPage }: PayloadAction<PageState>) => {
      state.name = newPage.name;
      state.courseId = newPage.courseId;
    },
    resetPage: (state) => {
      state.name = "OpenGrader";
      state.courseId = null;
    },
  },
});

export const { setCurrentPage, resetPage, setCourseId, setName } = pageStateSlice.actions;

export default pageStateSlice.reducer;
