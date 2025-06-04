# Guide de migration ESLint : eslintrc vers configuration plate adaptée à votre projet

Ce guide vous accompagne pour migrer votre configuration ESLint existante au format eslintrc (ex. `.eslintrc.cjs`) vers le nouveau format de configuration plate (`eslint.config.js`), en s’appuyant sur votre configuration actuelle.

---

## 1. Contexte actuel

### Configuration eslintrc.cjs (extrait)

```js
module.exports = {
  env: {
    node: true,
    'vitest/globals': true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['vitest'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:vitest/recommended',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
  },
};
```

### Configuration plate eslint.config.js (extrait)

```js
import js from "@eslint/js";
import globals from "globals";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import pluginReact from "eslint-plugin-react";
import pluginVitest from "eslint-plugin-vitest";
import pluginJest from "eslint-plugin-jest";
import { defineConfig } from "eslint/config";

export default defineConfig([
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    ignores: ["dist/", "**/dist/"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        "vitest/globals": true,
        "jest/globals": true,
      },
      sourceType: "module",
      parser: tsparser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      react: pluginReact,
      vitest: pluginVitest,
      jest: pluginJest,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "no-unused-vars": "off",
      "no-undef": "error",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
    languageOptions: {
      globals: {
        vitest: true,
        jest: true,
      },
    },
    plugins: {
      jest: pluginJest,
    },
    rules: {
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/prefer-to-have-length": "warn",
      "jest/valid-expect": "error"
    }
  },
]);
```

---

## 2. Étapes de migration

### a) Conversion des propriétés principales

| eslintrc                | Configuration plate (`eslint.config.js`)                      |
|-------------------------|---------------------------------------------------------------|
| `env`                   | `languageOptions.globals` (importer depuis `globals` package) |
| `parser`                | `languageOptions.parser` (importer le parser comme module)    |
| `parserOptions`         | `languageOptions.parserOptions`                               |
| `plugins`               | Importer les plugins comme modules et les déclarer dans `plugins` objet |
| `extends`               | Importer les configs recommandées et les inclure dans le tableau exporté |
| `rules`                 | Définir dans chaque objet de configuration                    |
| `overrides`             | Utiliser plusieurs objets dans le tableau avec `files` et règles spécifiques |
| `ignorePatterns` / `.eslintignore` | Utiliser la propriété `ignores` dans un objet dédié sans autres propriétés |

### b) Gestion des fichiers spécifiques

- Utiliser la propriété `files` dans chaque objet de configuration pour cibler des fichiers ou dossiers spécifiques.
- Exemple : fichiers de test avec règles spécifiques.

### c) Installation des dépendances nécessaires

```bash
npm install --save-dev @eslint/js globals @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react eslint-plugin-vitest eslint-plugin-jest
```

### d) Suppression des anciens fichiers

- Supprimer les fichiers `.eslintrc.*` pour éviter les conflits avec la configuration plate.

---

## 3. Conseils pratiques

- Vérifiez la compatibilité des plugins avec ESLint v9+ (API règles).
- Adaptez les règles et plugins selon vos besoins spécifiques.
- Mettez à jour les scripts npm et la configuration VSCode ESLint si nécessaire.
- Utilisez l’outil officiel de migration ESLint pour générer un point de départ :

```bash
npx @eslint/migrate-config .eslintrc.cjs
```

---

## 4. Résumé

Cette migration vous permet de bénéficier du nouveau système de configuration plate d’ESLint, plus flexible et moderne, tout en conservant vos règles et plugins actuels adaptés à votre projet.

---

N’hésitez pas à me demander si vous souhaitez que je vous aide à appliquer cette migration ou à ajuster votre configuration.
