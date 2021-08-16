const { override, addDecoratorsLegacy } = require('customize-cra');


module.exports = override(
    addDecoratorsLegacy() //配置修饰器械
)