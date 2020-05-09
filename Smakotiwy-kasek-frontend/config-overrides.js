const { override, fixBabelImports, addLessLoader } = require("customize-cra");

module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      "@primary-color": "#8ae6ff",
      // "@link-color": "#ffa591",
      // "@success-color": "#ffa591",
      // "@warning-color": "#ffa591",
      // "@error-color": "#ffa591",
      // "@font-size-base": "14px",
      // "@text-color": "#ffa591",
      // "@text-color-secondary": "#ffa591",
      "@disabled-color": "#ffa591",
      // "@border-radius-base": "4px",
      // "@border-color-base": "#ffa591",
      // "@box-shadow-base": "0 2px 8px #ffa591",
    },
  })
);
