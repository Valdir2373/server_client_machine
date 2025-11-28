module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current",
        },
        modules: "commonjs",
      },
    ],
    "@babel/preset-typescript",
  ],
  plugins: [
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/plugin-proposal-class-properties", { loose: true }],

    ["babel-plugin-add-import-extension", { extension: "cjs" }],
    [
      "babel-plugin-module-resolver",
      {
        alias: {},
      },
    ],
  ],
  ignore: ["**/*.d.ts"],
};
