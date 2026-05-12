"use strict";
const postcssPresetEnv = require("postcss-preset-env");
const flexbugsFixes = require("postcss-flexbugs-fixes");
const purgecss = require("@fullhuman/postcss-purgecss");

const postCssPresetEnv = postcssPresetEnv({
  features: {
    "nesting-rules": true,
  },
});

const plugins =
  process.env.NODE_ENV === "production"
    ? [
        purgecss({
          css: ["frontend/style/dsfr.min.css"],
          content: ["./src/**/*.{js,jsx,ts,tsx}"],
          safelist: {
            standard: [/html/, /body/, /anchor-link/],
            deep: [],
            greedy: [/maplibregl/],
          },
          fontFace: true,
        }),
        flexbugsFixes(),
        postCssPresetEnv,
      ]
    : [postCssPresetEnv];

module.exports = {
  plugins,
};
