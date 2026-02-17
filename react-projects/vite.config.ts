import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tailwind from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tailwind()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
})
