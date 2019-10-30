/**
 * Created by litian on 2019/10/29.
 */
'use strict';
const recast = require("recast");
const fs = require('fs');
const {functionExpression} = recast.types.builders;
const variable = require('./variable');
//const ast = recast.parse(code);

let file = fs.readFileSync('../src/add.js',{encoding:'utf-8'});
const ast = recast.parse(file);
const add  = ast.program.body[1];

ast.program.body[1] = variable.const(add.id,functionExpression(
    null, // Anonymize the function expression.
    add.params,
    add.body
));

//const add  = ast.program.body[0]

//console.log(JSON.stringify(ast,null,4));
fs.writeFile('../src/add.ast.json', JSON.stringify(ast, null, 4), err => {
    console.log('write-res:', err);
});

fs.writeFile('../src/add.to.js', recast.print(ast).code, err => {
    console.log('to-res:', err);
});
