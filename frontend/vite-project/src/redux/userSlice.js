import {createSlice} from "@reduxjs/toolkit";

const userSlice=createSlice({
    name:"user",
    initialState:{
        userData: null,
        loading: true,  // true until first fetch completes
    },
    reducers:{
        setUserData:(state, action) => {
            state.userData = action.payload;
            state.loading = false;
        },
    }
});

export const { setUserData } = userSlice.actions;
export default userSlice.reducer;