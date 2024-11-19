# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules

VITE_MAINNET_PROGRAM_ID=
VITE_DEVNET_PROGRAM_ID=8gSTcn9WTN9xEJj2ZAn4EtzTiNYsCRFcQCACNjybm966
VITE_PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJiNzhlMmUyNC1kNWI3LTQ1YWYtYjc3ZS0wNTdmODFlOTIyNmIiLCJlbWFpbCI6Im1hcnJudWVsMTIzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJmNmYxNTdiZmI3MjIzZGQzZTU2ZSIsInNjb3BlZEtleVNlY3JldCI6IjBhYWZkMWI1MzUxMThlNDA3MDQzNDdiMDcyOWU2ZmQ1Nzc1YTRmMGEwOWJhNTg1NzcyNDU3NjVmOTVmOWZkNGEiLCJleHAiOjE3NjAwNjg3MDB9.FqfKj0afsyJoxIr0KAb6M4OxBUD-Dpv34beffG8nZks
VITE_ALCHEMY_SOLANA_MAINNET=https://solana-mainnet.g.alchemy.com/v2/zN5ptGczYeoj8SXFDCS5phGKAtB1tU1-
# VITE_ALCHEMY_SOLANA_DEVNET=https://solana-devnet.g.alchemy.com/v2/zN5ptGczYeoj8SXFDCS5phGKAtB1tU1-

VITE_HELIUS_SOLANA_DEVNET=https://devnet.helius-rpc.com/?api-key=bdb45793-138e-4ff8-b8f4-cd7dba5545df

VITE_APP_URL=https://northfund.com

    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
