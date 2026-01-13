import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'

const srcDir = path.resolve(__dirname, 'src')
const manifestFile = process.env.BROWSER === 'firefox' ? 'manifest.firefox.json' : 'manifest.json'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        content: path.resolve(srcDir, 'content/content.ts'),
        background: path.resolve(srcDir, 'background/background.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'content') return 'content.js'
          if (chunkInfo.name === 'background') return 'background.js'
          return '[name].js'
        },
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
  plugins: [
    {
      name: 'copy-manifest',
      generateBundle() {
        const manifestPath = path.resolve(srcDir, manifestFile)
        const manifest = fs.readFileSync(manifestPath, 'utf-8')
        this.emitFile({
          type: 'asset',
          fileName: 'manifest.json',
          source: manifest,
        })
      },
    },
  ],
})

