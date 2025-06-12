import postcss from 'postcss';
import css from 'postcss-safe-parser';
import { JSDOM } from 'jsdom';
import cssSelect from 'css-select';
import specificity from 'specificity'; // 우선순위 비교용 
//  [2] CSS AST 파싱 →  [3] 선택자 매칭 →  [4] 스타일 누적 계산
// 1. CSS 파싱

// 1. CSS 읽기
const css = fs.readFileSync('./style.css', 'utf-8');

// 2. PostCSS로 파싱
const root = postcss().process(css, { parser: safeParser }).root;

// 3. selector → declarations + specificity 매핑
const rules = [];

root.walkRules(rule => 
{
    const selector = rule.selector;
    const declarations = {};

    rule.walkDecls(decl => 
    {
        declarations[decl.prop] = decl.value;
    });

    const spec = calculate(selector)[0].specificityArray; // [a, b, c]

    rules.push({
        selector,
        declarations,
        specificity: spec,
        position: rule.source.start.line // 같은 specificity일 경우 나중 라인 우선
    });
});

// 4. 셀렉터별 우선순위 비교 예시
rules.sort((a, b) => 
{
    for (let i = 0; i < 3; i++) 
    {
        if (a.specificity[i] !== b.specificity[i])
            return b.specificity[i] - a.specificity[i];
    }
    return b.position - a.position; // 동일하면 나중 선언 우선
});

console.log(rules);


/*
1. css-what
Cheerio, css-select 내부에서 사용되는 핵심 파서

CSS selector를 AST 형태로 파싱

예: "div > .item:hover" → 구조화된 배열로 반환


2. postcss-selector-parser
CSS 선택자를 파싱/변형/트리 분석 가능

PostCSS 플러그인 기반으로 선택자만 추출하여 분석 가능

✅ 선택자 구조 분석 및 수정, specificity 계산 가능

3. specificity
선택자의 **우선순위(정수 값)**만 계산

div#id .class:hover → [0,1,1,2] (inline, ID, class, tag)


4. css-tree
전체 CSS를 파싱해서 선택자 포함 AST 분석

CSS 전체를 통째로 다룰 수 있음 (선택자만 분리 가능)

✅ 선택자 포함한 전체 문맥 내 사용 시 유용 */
