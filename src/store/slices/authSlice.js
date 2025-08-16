import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  // 'idle' -> estado inicial
  // 'loading' -> mientras se hace una petición (ej. a una API)
  // 'succeeded' -> la operación fue exitosa
  // 'failed' -> la operación falló
  status: 'idle',
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerUser: (state, action) => {
      // Tu lógica para omitir las contraseñas es una excelente práctica de seguridad.
      const { password, confirm, ...userData } = action.payload;
      state.user = userData;
      state.status = 'succeeded';
      state.error = null;
    },
    // Aquí podrías agregar más reducers, como logoutUser, loginUser, etc.
  },
});

// Exportamos las acciones para poder usarlas en los componentes (ej. con useDispatch)
export const { registerUser } = authSlice.actions;

// Exportamos el reducer para que el store lo pueda utilizar
export default authSlice.reducer;
