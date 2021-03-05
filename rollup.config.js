import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";
import postcss from 'rollup-plugin-postcss'

const extensions = [".js", ".jsx", ".ts", ".tsx"];
const input = "src/index.ts";
const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];
const plugins = [
  typescript({
    typescript: require("typescript"),
  }),
  postcss({
    plugins: []
  })
];

export default [
  {
    input,
    output: {
      file: pkg.module,
      format: "esm",
      sourcemap: true,
    },
    plugins,
    external
  },
  {
    input,
    output: {
      file: pkg.main,
      format: "cjs",
      sourcemap: true,
    },
    plugins,
  },
];