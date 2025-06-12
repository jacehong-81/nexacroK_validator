const template = `
  <div>Hello, \${user.name}!</div>
  <p>Your count is \${state.count}</p>
`;

const exprRegex = /\$\{([^}]+)\}/g;

const context = {
    user: { name: 'Hong' },
    state: { count: 45 }
};

// Proxy로 global-like 환경 구성
// this 같은거를 쓰지 않고 순수 변수명만 전역처럼 쓰기 위함이라면
function createGlobalProxy(ctx) 
{
    return new Proxy({}, {
        has: () => true, // 변수 검사 통과시키기
        get: (_, key) => 
        {
            return key in ctx ? ctx[key] : undefined;
        }
    });
}

const rendered = template.replace(exprRegex, (_, expr) => 
{
    try 
    {
        const proxy = createGlobalProxy(context);
        const evaluator = new Function(...Object.keys(context), `return ${expr};`);
        return evaluator(...Object.values(context));
    }
    catch (e) 
    {
        console.warn('Eval error on:', expr, e);
        return '';
    }
});

console.log(rendered);