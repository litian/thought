## recast 笔记

- run: 通过命令行读取js文件，并转化成ast以供处理。
- tnt： 通过assert()和check()，可以验证ast对象的类型。
- visit: 遍历ast树，获取有效的AST对象并进行更改。

### recast.visit —— AST节点遍历

recast.visit将AST对象内的节点进行逐个遍历。

> - 你想操作函数声明，就使用visitFunctionDelaration遍历，想操作赋值表达式，就使用visitExpressionStatement。 只要在 AST对象文档中定义的对象，在前面加visit，即可遍历。
> - 通过node可以取到AST对象
> - 每个遍历函数后必须加上return false，或者选择以下写法，否则报错,或者使用 方式来定义遍历页面
> ```
> function(path){
>   let node = path.node; 
>   this.traverse(path)
> }
> ``` 

### TNT —— 判断AST对象类型

TNT，即recast.types.namedTypes，就像它的名字一样火爆，它用来判断AST对象是否为指定的类型。

- TNT.Node.assert()，就像在机器里埋好的炸药，当机器不能完好运转时（类型不匹配），就炸毁机器(报错退出)
- TNT.Node.check()，则可以判断类型是否一致，并输出False和True
- 上述Node可以替换成任意AST对象，例如TNT.ExpressionStatement.check(),TNT.FunctionDeclaration.assert()
