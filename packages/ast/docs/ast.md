##AST 学习笔记

`Node`对象是javascript的标准对象，所有的节点类型都实现了接口：
```
interface Node {
    type: string;
    loc: SourceLocation | null;
}
```
`type`AST变量类型  `SourceLocation`节点的源位置信息
```
interface SourceLocation {
    source: string | null;
    start: Position;
    end: Position;
} 
```

每个 `Position` 包括一个 `line` 数字 `(1-indexed) `和 `column` 数字 `(0-indexed)`:

````
interface Position {
    line: uint32 >= 1;
    column: uint32 >= 0;
}
````

###Programs 项目

```
interface Program <: Node {
    type: "Program";
    body: [ Statement ];
}
```

###Functions 函数

``` 
interface Function <: Node {
    id: Identifier | null;
    params: [ Pattern ];
    defaults: [ Expression ];
    rest: Identifier | null;
    body: BlockStatement | Expression;
    generator: boolean;
    expression: boolean;
}
```

###Statements 语句
- 任意语句.
``` 
interface Statement <: Node { }
```
- 一个空语句,也就是,一个孤立的分号.
``` 
interface EmptyStatement <: Statement {
    type: "EmptyStatement";
}
```
- 一个语句块,也就是由大括号包围的语句序列.
``` 
interface BlockStatement <: Statement {
    type: "BlockStatement";
    body: [ Statement ];
}
```
- 一个表达式语句,也就是,仅有一个表达式组成的语句.
```
interface ExpressionStatement <: Statement {
    type: "ExpressionStatement";
    expression: Expression;
}
```
- 一个if语句.
``` 
interface IfStatement <: Statement {
    type: "IfStatement";
    test: Expression;
    consequent: Statement;
    alternate: Statement | null;
}
```
- 一个标签语句,也就是, a statement prefixed by a `break`/`continue` label.
``` 
interface LabeledStatement <: Statement {
    type: "LabeledStatement";
    label: Identifier;
    body: Statement;
}
```
- 一个break语句.
``` 
interface BreakStatement <: Statement {
    type: "BreakStatement";
    label: Identifier | null;
}
```
- 一个continue语句.
``` 
interface ContinueStatement <: Statement {
    type: "ContinueStatement";
    label: Identifier | null;
}
```
- 一个 with 语句.
``` 
interface WithStatement <: Statement {
    type: "WithStatement";
    object: Expression;
    body: Statement;
}
```
- 一个switch语句
``` 
interface SwitchStatement <: Statement {
    type: "SwitchStatement";
    discriminant: Expression;
    cases: [ SwitchCase ];
    lexical: boolean;
}
```
- 一个return语句.
``` 
interface ReturnStatement <: Statement {
    type: "ReturnStatement";
    argument: Expression | null;
}
```
- 一个throw语句.
``` 
interface ThrowStatement <: Statement {
    type: "ThrowStatement";
    argument: Expression;
}
```
- 一个try语句.
``` 
interface TryStatement <: Statement {
    type: "TryStatement";
    block: BlockStatement;
    handlers: [ CatchClause ];
    finalizer: BlockStatement | null;
}
```
- 一个while语句.
``` 
interface WhileStatement <: Statement {
    type: "WhileStatement";
    test: Expression;
    body: Statement;
}
```
- 一个do/while语句.
``` 
interface DoWhileStatement <: Statement {
    type: "DoWhileStatement";
    body: Statement;
    test: Expression;
}
```
- 一个for语句.
``` 
interface ForStatement <: Statement {
    type: "ForStatement";
    init: VariableDeclaration | Expression | null;
    test: Expression | null;
    update: Expression | null;
    body: Statement;
}
```
- 一个for/in语句, or, if `each` is `true`, a for `each`/`in` statement.
``` 
interface ForInStatement <: Statement {
    type: "ForInStatement";
    left: VariableDeclaration |  Expression;
    right: Expression;
    body: Statement;
    each: boolean;
}
```
- 一个let语句.
``` 
interface LetStatement <: Statement {
    type: "LetStatement";
    head: [ { id: Pattern, init: Expression | null } ];
    body: Statement;
}
```
- 一个debugger语句.
``` 
interface DebuggerStatement <: Statement {
    type: "DebuggerStatement";
}
```
###Declarations 声明 

``` 
interface Declaration <: Statement { }
```
- 一个函数声明.
``` 
interface FunctionDeclaration <: Function, Declaration {
    type: "FunctionDeclaration";
    id: Identifier;
    params: [ Pattern ];
    defaults: [ Expression ];
    rest: Identifier | null;
    body: BlockStatement | Expression;
    generator: boolean;
    expression: boolean;
}
```
> 注: id字段不能为null.单独函数声明不能是匿名函数，所以id不能为null。在函数表达式和函数参数中才能声明匿名函数

- 一个变量声明,可以通过var, let, 或const.
``` 
interface VariableDeclaration <: Declaration {
    type: "VariableDeclaration";
    declarations: [ VariableDeclarator ];
    kind: "var" | "let" | "const";
}
```
- 一个变量声明符.
``` 
interface VariableDeclarator <: Node {
    type: "VariableDeclarator";
    id: Pattern;
    init: Expression | null;
}
```

###Expressions 表达式
- 任意表达式节点.
``` 
interface Expression <: Node, Pattern { }
```

- 一个this表达式.
``` 
interface ThisExpression <: Expression {
    type: "ThisExpression";
}
```

- 一个数组表达式.
``` 
interface ArrayExpression <: Expression {
    type: "ArrayExpression";
    elements: [ Expression | null ];
}
```

- 一个对象表达式.
``` 
interface ObjectExpression <: Expression {
    type: "ObjectExpression";
    properties: [ { key: Literal | Identifier,
                    value: Expression,
                    kind: "init" | "get" | "set" } ];
}
```
> A literal property in an object expression can have either a string or number as its value. Ordinary property initializers have a kind value "init"; getters and setters have the kind values "get" and "set", respectively.

- 一个函数表达式.
``` 
interface FunctionExpression <: Function, Expression {
    type: "FunctionExpression";
    id: Identifier | null;
    params: [ Pattern ];
    defaults: [ Expression ];
    rest: Identifier | null;
    body: BlockStatement | Expression;
    generator: boolean;
    expression: boolean;
}
```

- 一个序列表达式,也就是一个由逗号分割的表达式序列.
``` 
interface SequenceExpression <: Expression {
    type: "SequenceExpression";
    expressions: [ Expression ];
}
```

- 一元运算符表达式。
``` 
interface UnaryExpression <: Expression {
    type: "UnaryExpression";
    operator: UnaryOperator;
    prefix: boolean;
    argument: Expression;
}
```

- 一个二元运算符表达式.
``` 
interface BinaryExpression <: Expression {
    type: "BinaryExpression";
    operator: BinaryOperator;
    left: Expression;
    right: Expression;
}
```

- 赋值运算符表达式。
``` 
interface AssignmentExpression <: Expression {
    type: "AssignmentExpression";
    operator: AssignmentOperator;
    left: Expression;
    right: Expression;
}
```

- 更新(递增或递减)运算符表达式。
``` 
interface UpdateExpression <: Expression {
    type: "UpdateExpression";
    operator: UpdateOperator;
    argument: Expression;
    prefix: boolean;
}
```

- 一个逻辑运算符表达式.
``` 
interface LogicalExpression <: Expression {
    type: "LogicalExpression";
    operator: LogicalOperator;
    left: Expression;
    right: Expression;
}
```

- 一个条件运算符表达式, i.e., a ternary ?/: expression.
``` 
interface ConditionalExpression <: Expression {
    type: "ConditionalExpression";
    test: Expression;
    alternate: Expression;
    consequent: Expression;
}
```

- A new expression.
``` 
interface NewExpression <: Expression {
    type: "NewExpression";
    callee: Expression;
    arguments: [ Expression ] | null;
}
```

- A function or method call expression.
``` 
interface CallExpression <: Expression {
    type: "CallExpression";
    callee: Expression;
    arguments: [ Expression ];
}
```

- 一个member表达式.
``` 
interface MemberExpression <: Expression {
    type: "MemberExpression";
    object: Expression;
    property: Identifier | Expression;
    computed : boolean;
}
```
> If computed === true, the node corresponds to a computed e1[e2] expression and property is an Expression. If computed === false, the node corresponds to a static e1.x expression and property is an Identifier.

- A yield expression.
``` 
interface YieldExpression <: Expression {
    argument: Expression | null;
}
```

- An array comprehension. 
``` 
interface ComprehensionExpression <: Expression {
    body: Expression;
    blocks: [ ComprehensionBlock ];
    filter: Expression | null;
}
```
> The blocks array corresponds to the sequence of for and for each blocks. The optional filter expression corresponds to the final if clause, if present.

- A generator expression. 
``` 
interface GeneratorExpression <: Expression {
    body: Expression;
    blocks: [ ComprehensionBlock ];
    filter: Expression | null;
}
```
> As with array comprehensions, the blocks array corresponds to the sequence of for and for each blocks, and the optional filter expression corresponds to the final if clause, if present.

- A graph expression, aka "sharp literal," such as #1={ self: #1# }.
``` 
interface GraphExpression <: Expression {
    index: uint32;
    expression: Literal;
}
```

- 一个graph索引表达式,又称为"井号变量",比如#1#.
``` 
interface GraphIndexExpression <: Expression {
    index: uint32;
}
```

- 一个let表达式.
``` 
interface LetExpression <: Expression {
    type: "LetExpression";
    head: [ { id: Pattern, init: Expression | null } ];
    body: Expression;
}
```

###Patterns 模式

``` 
interface Pattern <: Node { }
```

- An object-destructuring pattern.
``` 
interface ObjectPattern <: Pattern {
    type: "ObjectPattern";
    properties: [ { key: Literal | Identifier, value: Pattern } ];
}
```

- An array-destructuring pattern.
``` 
interface ArrayPattern <: Pattern {
    type: "ArrayPattern";
    elements: [ Pattern | null ];
}
```

### Clauses
- A case (if test is an Expression) or default (if test === null) clause in the body of a switch statement.
``` 
interface SwitchCase <: Node {
    type: "SwitchCase";
    test: Expression | null;
    consequent: [ Statement ];
}
```

- A catch clause following a try block. The optional guard property corresponds to the optional expression guard on the bound variable.
``` 
interface CatchClause <: Node {
    type: "CatchClause";
    param: Pattern;
    guard: Expression | null;
    body: BlockStatement;
}
```

- A for or for each block in an array comprehension or generator expression.
``` 
interface ComprehensionBlock <: Node {
    type: "ComprehensionBlock";
    left: Pattern;
    right: Expression;
    each: boolean;
}
```

- An if filter in an array comprehension or generator filter.
``` 
interface ComprehensionIf <: Node {
    type: "ComprehensionIf";
    test: Expression;
}
```

### Miscellaneous 杂项

- An identifier. 一个标识符
``` 
interface Identifier <: Node, Expression, Pattern {
    type: "Identifier";
    name: string;
}
```
> Note that an identifier may be an expression or a destructuring pattern.

- A literal token. 文字令牌
``` 
interface Literal <: Node, Expression {
    type: "Literal";
    value: string | boolean | null | number | RegExp;
}
```
> Note that a literal can be an expression.

- A unary operator token.
``` 
enum UnaryOperator {
    "-" | "+" | "!" | "~" | "typeof" | "void" | "delete"
}
```

- A binary operator token.
``` 
enum BinaryOperator {
    "==" | "!=" | "===" | "!=="
         | "<" | "<=" | ">" | ">="
         | "<<" | ">>" | ">>>"
         | "+" | "-" | "*" | "/" | "%"
         | "|" | "^" | "&" | "in"
         | "instanceof" | ".."
}
```

- A logical operator token.
``` 
enum LogicalOperator {
    "||" | "&&"
}
```

- An assignment operator token.
``` 
enum AssignmentOperator {
    "=" | "+=" | "-=" | "*=" | "/=" | "%="
        | "<<=" | ">>=" | ">>>="
        | "|=" | "^=" | "&="
}
```

- An update (increment or decrement) operator token.
``` 
enum UpdateOperator {
    "++" | "--"
}
```
