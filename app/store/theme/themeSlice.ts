import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: string = "light"

export const themeSlice = createSlice({
    name: "themeSlice",
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<"dark" | "light">) => {
            return action.payload
        }
    }
})

export const { setTheme } = themeSlice.actions

export default themeSlice.reducer
