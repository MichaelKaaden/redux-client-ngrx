import angularEslint from "angular-eslint";
import ngrxPlugin from "@ngrx/eslint-plugin";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
    globalIgnores(["projects/**/*"]),
    {
        files: ["**/*.ts"],
        extends: [...angularEslint.configs.tsRecommended],
        processor: angularEslint.processInlineTemplates,
        languageOptions: {
            parserOptions: {
                project: ["tsconfig.json"],
                createDefaultProgram: true,
            },
        },
        rules: {
            "@angular-eslint/component-selector": ["error", {
                prefix: "mk",
                style: "kebab-case",
                type: "element",
            }],
            "@angular-eslint/directive-selector": ["error", {
                prefix: "mk",
                style: "camelCase",
                type: "attribute",
            }],
        },
    },
    {
        files: ["**/*.html"],
        extends: [...angularEslint.configs.templateRecommended],
        rules: {},
    },
    {
        files: ["**/*.ts"],
        plugins: { "@ngrx": ngrxPlugin },
        rules: {
            ...ngrxPlugin.configs.all.rules,
            "@ngrx/prefer-effect-callback-in-block-statement": "off",
        },
    },
]);