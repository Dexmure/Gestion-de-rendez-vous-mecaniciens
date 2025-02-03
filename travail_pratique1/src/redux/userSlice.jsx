import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthentificated: false,
    user: null,
    paymentOptions: [], // Ajouter un tableau pour stocker les informations de paiement
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isAuthentificated = true;
            state.user = action.payload;
        },
        logout: (state) => {
            state.isAuthentificated = false;
            state.user = null;
            state.paymentOptions = []; // Vider les options de paiement à la déconnexion
        },
        addPaymentOption: (state, action) => {
            state.paymentOptions.push(action.payload); // Ajouter une option de paiement
        },
      
        deletePaymentOption: (state, action) => {
            state.paymentOptions = state.paymentOptions.filter(
                (option) => option.cardNumber !== action.payload
            );
        },
    },
});

export const { login, logout, addPaymentOption, updatePaymentOption, deletePaymentOption } = userSlice.actions;

export default userSlice.reducer;
