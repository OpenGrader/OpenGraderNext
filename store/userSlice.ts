import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: number | null;
  name: string | null;
  email: string | null;
  givenName: string | null;
  familyName: string | null;
  role: "STUDENT" | "INSTRUCTOR" | null;
  authId: string | null;
}

interface SupaUser {
  id: number;
  given_name: string | null;
  family_name: string | null;
  auth_id: string | null;
}

const initialState: UserState = {
  id: null,
  name: null,
  email: null,
  givenName: null,
  familyName: null,
  role: null,
  authId: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loadUser: (state, action: PayloadAction<SupaUser>) => {
      const { payload: su } = action;
      state.id = su.id;
      state.givenName = su.given_name;
      state.familyName = su.family_name;
      state.name = [su.given_name, su.family_name].filter((v) => v).join(" ");
      state.authId = su.auth_id;
    },
    setRole: (state, { payload: role }: PayloadAction<"STUDENT" | "INSTRUCTOR">) => {
      state.role = role;
    },
    logout: (state) => {
      // reset to initial state
      Object.entries(initialState).forEach(([key, value]) => {
        state[key as keyof typeof state] = value;
      });
    },
  },
});

export const { loadUser, logout, setRole } = userSlice.actions;

export default userSlice.reducer;
