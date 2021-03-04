// const postCssPurge = require("@fullhuman/vue-cli-plugin-purgecss");

// module.exports = {
//   plugins: [
//     postCssPurge({
//       content: [`./public/*.html`, `./src/**/*.vue`],
//       defaultExtractor(content) {
//         const contentWithoutStyleBlocks = content.replace(
//           /<style[^]+?<\/style>/gi,
//           ""
//         );
//         return (
//           contentWithoutStyleBlocks.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g) ||
//           []
//         );
//       },
//       safelist: [
//         /-(leave|enter|appear)(|-(to|from|active))$/,
//         /^(?!(|.*?:)cursor-move).+-move$/,
//         /^router-link(|-exact)-active$/,
//         /data-v-.*/,
//       ],
//     }),
//   ],
// };
