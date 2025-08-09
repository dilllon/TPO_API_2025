    registerUser: (state, action) => {
      // En una aplicación real, aquí manejarías la lógica asíncrona con createAsyncThunk.
      // Para este ejemplo, simplemente guardamos los datos del usuario en el estado.
      // Omitimos las contraseñas por seguridad.
      const { password, confirm, ...userData } = action.payload;
      state.user = userData;
      state.status = 'succeeded';
      state.error = null;
    },
  },
});

