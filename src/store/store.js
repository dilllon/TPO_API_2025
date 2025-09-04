import { configureStore } from '@reduxjs/toolkit';

// Reducer básico temporal para evitar errores
const dummyReducer = (state = {}, action) => state;

// Store básico sin autenticación (se usa AuthContext ahora)
export const store = configureStore({
  reducer: {
    // Reducer temporal para evitar errores
    dummy: dummyReducer,
    // Aquí se pueden agregar otros reducers según sea necesario
    // Por ejemplo: productos, carrito, etc.
  },
});
