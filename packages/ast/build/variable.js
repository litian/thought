/**
 * Created by litian on 2019/10/29.
 */
'use strict';
const recast = require("recast");
const {variableDeclaration, variableDeclarator} = recast.types.builders;

function variable(type, left, right) {
    return variableDeclaration(type, [
        variableDeclarator(left, right)
    ])
}

module.exports = {
    const: variable.bind(null, 'const'),
    let: variable.bind(null, 'let'),
    var: variable.bind(null, 'var'),
};
