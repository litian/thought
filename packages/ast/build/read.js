#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const {run, visit,types,print} = require('recast');
const TNT = types.namedTypes;
const {
    identifier,
    expressionStatement,
    memberExpression,
    assignmentExpression,
    arrowFunctionExpression,
    blockStatement
} = types.builders;

const writeASTFile = function(ast, filename, rewriteMode){
    const newCode = print(ast).code;
    if(!rewriteMode){
        // 非覆盖模式下，将新文件写入*.export.js下
        filename = filename.split('.').slice(0,-1).concat(['export','js']).join('.')
    }
    // 将新代码写入文件
    fs.writeFileSync(path.join(process.cwd(),filename),newCode)
};

const options = process.argv.slice(2);
//如果没有参数，或提供了-h 或--help选项，则打印帮助
if(options.length===0 || options.includes('-h') || options.includes('--help')){
    console.log(`
    采用commonjs规则，将.js文件内所有函数修改为导出形式。

    选项： -r  或 --rewrite 可直接覆盖原有文件
    `);
    process.exit(0)
}
let rewriteMode = options.includes('-r') || options.includes('--rewrite');
// 获取文件名
const clearFileArg = options.filter((item)=>{
    return !['-r','--rewrite','-h','--help'].includes(item)
});

// 只处理一个文件
let filename = clearFileArg[0];

/*run(function (ast, printSource) {
    let funcIds = [];
    types.visit(ast,{
        visitFunctionDeclaration(path){
            const node = path.node;
            const {id,params,body} = node;
            funcIds.push(id.name);
            const rep = expressionStatement(assignmentExpression('=', memberExpression(identifier('exports'), id),
                arrowFunctionExpression(params, body)))
            path.replace(rep);
            // 停止遍历
            return false
        }
    });
    types.visit(ast, {
        // 遍历所有的函数调用
        visitCallExpression(path){
            const node = path.node;
            // 如果函数调用出现在函数定义中，则修改ast结构
            if (funcIds.includes(node.callee.name)) {
                node.callee = memberExpression(identifier('exports'), node.callee)
            }
            // 停止遍历
            return false
        }
    });
    printSource(ast)
});*/

function getExportsExp (name){
    let id = identifier(name);
    return assignmentExpression('=', memberExpression(identifier('exports'), id),id)
}

run(function (ast, printSource) {
    let fnMap = new Map();
    types.visit(ast,{
        visitFunctionDeclaration(path){
            const node = path.node;
            fnMap.set(node.id.name,node);
            // 停止遍历
            return false
        }
    });
    fnMap.forEach((node,name) => {
        //console.log(name);
        const rep = expressionStatement(getExportsExp(name));
        ast.program.body.push(rep);
    });

    writeASTFile(ast,filename,rewriteMode)
});
