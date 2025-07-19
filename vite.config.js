import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  server: {
    port: 3000,
    open: '/index.html'
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        services: 'services.html',
        'technician-profile': 'technician-profile.html',
        booking: 'booking.html',
        emergency: 'emergency.html',
        support: 'support.html',
        tracking: 'tracking.html',
        admin: 'admin.html',
        login: 'login.html',
        register: 'register.html'
      }
    }
  }
})