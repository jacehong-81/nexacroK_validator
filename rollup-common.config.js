import { globSync } from 'glob';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import typescript from '@rollup/plugin-typescript';
import sourcemaps from 'rollup-plugin-sourcemaps';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import commonjs from "@rollup/plugin-commonjs";
import replace from '@rollup/plugin-replace';
import { visualizer } from "rollup-plugin-visualizer";
import { execSync } from 'child_process';
import madge from 'madge';
import * as fs from 'fs';



import { createDiagram, TsUML2Settings } from 'tsuml2'
import { parse } from 'svg-parser'
//import fsExtra from 'fs-extra';
//const { readFile, writeFile } = fsExtra;
//import { Module, render } from 'viz.js/full.render.js'; // 여기 수정
//import Viz from 'viz.js';
import { execa } from 'execa';


const isProduction = process.env.NODE_ENV === 'production';

const __filename = fileURLToPath(import.meta.url);

const args = process.argv.slice(2);
const doc = args.includes('--docs') ? args[args.indexOf('--docs') + 1] : 'none';

/*
function convertGraphToDot(graph) 
{
    const nodes = Object.keys(graph.nodes || {});
    const edges = graph.edges || [];

    let dot = 'digraph G {\n';

    for (const node of nodes) 
    {
        dot += `  "${node}";\n`;
    }

    for (const edge of edges) 
    {
        dot += `  "${edge.from}" -> "${edge.to}";\n`;
    }

    dot += '}\n';
    return dot;
}
*/
function generateGraphPlugin(options = {}) 
{
    return;

    // graph 옵션 추가 필요

    const {
        graphJsonPath = 'graph.json',
        svgOutputPath = 'graph.svg',
    } = options;

    return {
        name: 'generate-graph',

        async writeBundle() 
        {
            /*  eslint-disable no-console */
            console.log('⚡ 터보 그래프 생성 중...');

            // 1. turbo run build --graph=graph.json
            await execa('turbo', ['run', 'build', '--graph=' + graphJsonPath], {
                stdio: 'inherit',
            });

            console.log('✅ graph.json 생성 완료');

            // 2. graph.json 읽기
            //const graphData = await readFile(graphJsonPath, 'utf-8');
            //const graph = JSON.parse(graphData);

            // 3. JSON을 DOT 형식으로 변환
            //const dot = convertGraphToDot(graph);

            // 4. DOT을 SVG로 변환
            //const viz = new Viz({ Module, render }); // 수정된 부분
            //const svg = await viz.renderString(dot);

            // 5. SVG 저장
            //await writeFile(svgOutputPath, svg, 'utf-8');

            console.log(`🎨 SVG 저장 완료: ${svgOutputPath}`);
        },
    };
}


const docs_config =
{
    useDocument: doc == 'all' ? true : false,
    useSVGToHtml: doc == 'all' ? true : false,
    dir: ["src"],
    writePath: "./docs",
    classDiagram: "class-diagram.svg",
    DSL: "class-diagram_d.dsl",
    dependencyGraph: "dependency-graph.svg",
    dependencyGraph2: "madge-dependency-graph.svg",
    bundleAnalyzer: "bundle_analyzer.html",
    graphOption: "full" //"short"|all""

}

export async function svgToHtml(config)
{
    const getSvgFiles = (dir) => 
    {
        try 
        {
            const files = fs.readdirSync(dir);
            const svgFiles = files.filter(file => path.extname(file) === '.svg');
            return svgFiles;
        }
        catch (error) 
        {

            console.error('read svg path error:', error);
            return [];
        }
    };
    const readSvgFiles = (dir, files) => 
    {
        return files.map(file => 
        {
            try 
            {
                const filePath = path.join(dir, file);
                const data = fs.readFileSync(filePath, 'utf8');
                const out = data
                // 멤버 제거 
                if (file == 'src-class-diagram.svg')
                {
                    //out = data.replace(/\[([^\|\]]+)\|[^]*?\]/g, '[$1|]');
                    //out = out.replace(/<text[^>]*>[^<]*<\/text>/g, '');
                }

                return {
                    fileName: file,
                    data: out
                };
            }
            catch (error) 
            {
                console.error(`${file} read svg file error:`, error);
                return null;
            }
        }).filter(fileData => fileData !== null);
    };

    const convertToHtmlString = (node) => 
    {
        if (node.type === 'text') 
        {
            return node.value;
        }

        let attributes = '';
        if (node.properties) 
        {
            attributes = Object.keys(node.properties)
                .map(key => `${key}="${node.properties[key]}"`)
                .join(' ');
        }

        let children = '';
        if (node.children) 
        {
            children = node.children.map(child => convertToHtmlString(child)).join('');
        }

        return `<${node.tagName} ${attributes}>${children}</${node.tagName}>`;
    };

    const svgFiles = getSvgFiles(config.writePath);
    if (svgFiles.length > 0)
    {
        const svgDataList = readSvgFiles(config.writePath, svgFiles);
        svgDataList.forEach(svg => 
        {
            const toJsonPath = svg.fileName.replace(".svg", ".json")
            const toHTMLPath = svg.fileName.replace(".svg", ".html")
            try
            {
                if (svg.data)
                {
                    const processedSvgContent = svg.data.replace(/<a[^>]*>(.*?)<\/a>/g, '$1');

                    const parsedSvg = parse(processedSvgContent);
                    fs.writeFileSync(path.join(config.writePath, toJsonPath), JSON.stringify(parsedSvg, null, 4), 'utf-8');
                    const htmlContent = convertToHtmlString(parsedSvg);
                    const htmlString = `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>${svg.fileName} - SVG to HTML Example</title>
                    </head>
                    <body>
                        <h1>${svg.fileName} - SVG to HTML Example</h1>
                        ${htmlContent}
                    </body>
                    </html>`;

                    fs.writeFileSync(path.join(config.writePath, toHTMLPath), htmlString, 'utf-8');
                }
            }
            catch (error)
            {
                console.error(`${svg.fileName} convert svg file error:`, error);
            }

        });
    }




}

export async function depcruiseGraphShort(src, filepath)
{
    const sourceDir = "^src"
    try 
    {
        execSync(`depcruise ${src} --no-config --include-only "${sourceDir}" --exclude "^dist" --ts-config ./tsconfig.json  --output-type dot | dot -T svg > ${filepath}`, { stdio: 'inherit' });

        console.log('Dependency graph SVG generated successfully.');
    }
    catch (error) 
    {
        console.error('Error generating dependency graph:', error);
    }
}
export async function depcruiseGraphAll(src, filepath)
{
    const sourceDir = "^.*"
    try 
    {
        execSync(`depcruise ${src} --no-config --include-only "${sourceDir}" --exclude "^dist" --ts-config ./tsconfig.json  --output-type dot | dot -T svg > ${filepath}`, { stdio: 'inherit' });

        console.log('Dependency graph SVG generated successfully.');
    }
    catch (error) 
    {
        console.error('Error generating dependency graph:', error);
    }
}

export async function madgeGraph(src, filepath)
{
    const graph = await madge(src, { fileExtensions: ['ts'] })
    const image = await graph.image(filepath)
    console.log('madgeGraph ' + image);
}
export const writePackageDocumentation = async (config = docs_config) =>
{
    const ensureDirectoryExistence = (filePath) =>
    {
        const currentDirectory = process.cwd();
        const full = path.join(currentDirectory, filePath)

        if (fs.existsSync(full))
        {
            return true;
        }

        fs.mkdirSync(full);
        return true
    };


    return {
        name: "PackageDocumentation",
        async writeBundle()
        {
            if (config.useDocument && ensureDirectoryExistence(config.writePath))
            {
                try
                {
                    for (const src of config.dir)
                    {
                        const cd = path.join(config.writePath, src + "-" + config.classDiagram)
                        const dga = path.join(config.writePath, src + "-a-" + config.dependencyGraph)
                        const dgs = path.join(config.writePath, src + "-s-" + config.dependencyGraph)
                        const dg2 = path.join(config.writePath, src + "-" + config.dependencyGraph2)

                        // add classDiagram
                        const settings = new TsUML2Settings();
                        settings.glob = `./${src}/**/!(*.d|*.spec|metadata_spec|type_decorators|type_class|type_metadata|method|metadata|property|class|event).ts`;
                        settings.outFile = cd
                        //settings.outDsl = dsl
                        settings.exportedTypesOnly = true
                        settings.memberAssociations = true
                        settings.typeLinks = false
                        settings.modifiers = false
                        settings.propertyTypes = false
                        settings.nomnoml = [

                        ] // 적용이 안된다
                        await createDiagram(settings);

                        // add dependencyGraph

                        if (config.graphOption == "all")
                        {

                            depcruiseGraphShort(src, dgs)
                            depcruiseGraphAll(src, dga)

                        }
                        else if (config.graphOption == "short")
                        {
                            depcruiseGraphShort(src, dgs)
                        }
                        else
                        {
                            depcruiseGraphAll(src, dga)
                        }
                        madgeGraph(src, dg2)
                    }

                    if (config.useSVGToHtml)
                    {
                        await svgToHtml(config)

                    }
                }
                catch (error)
                {
                    console.error(`Error writePackageDocumentation: ${error.message}`);

                }
            }

        }
    }


}

const getEntriesFromArray = (dir, url, arr) => Object.fromEntries(arr.map((file) => [
    path.relative(
        dir,
        file.slice(0, file.length - path.extname(file).length)
    ),
    fileURLToPath(new URL(file, url))
]));

export function getFileMapByGlob(pattern, option, url) 
{
    return globSync(pattern, option).map(file => [
        path.relative(
            './',
            file.slice(0, file.length - path.extname(file).length)
        ),
        fileURLToPath(new URL(file, url))
    ]);
}

export function getModuleConfig(option = {}, otherRollupConfig = {}) 
{
    const {
        inputFiles,
        outputDir = './',
        moduleRoot = './',
        preserveModules = undefined
    } = option;

    const outputPreserveModules = preserveModules === undefined ? !isProduction : !!preserveModules;

    const ret = {

        input: inputFiles,
        treeshake: true,
        output: [
            {
                dir: outputDir,
                /* if 'preserveModules' is true, it will create node_modules/tslib in dist */
                preserveModules: outputPreserveModules,
                preserveModulesRoot: moduleRoot,
                format: 'es',
                sourcemap: true,
                minifyInternalExports: false,
            }
        ],

        ...otherRollupConfig
    };

    return ret
}


export function TSBuildConfig(option = {}) 
{

    const {

        sourceDir,
        moduleUrl,
        entries,
        outputDir = './',
        preserveModules = undefined,
        pre_plugins = [],
        post_plugins = [],
        external = [],
        extensions = [],
    } = option;

    const entryPoints = getEntriesFromArray(sourceDir, moduleUrl, entries.map((name) =>
        path.join(sourceDir, name)));


    const ret = [getModuleConfig(
        {
            inputFiles: entryPoints,
            outputDir: outputDir,
            moduleRoot: sourceDir,
            preserveModules: preserveModules
        },
        {

            plugins: [

                ...pre_plugins,
                replace({
                    'preventAssignment': true,
                    'process.env.NODE_ENV': JSON.stringify('dev')
                }),


                typescript({

                    sourceMap: true,
                    inlineSources: true,
                    tsconfig: './tsconfig.json',
                    incremental: true,
                    exclude: ["**/*.d.ts"],  // .d.ts 파일 제외
                    transformers:
                    {
                        before: [],
                        after: [],
                        afterDeclarations: []
                    }

                }),
                resolve({
                    // browser 용인지 nodejs 우선인지에 따라 아래 두개 수정
                    browser: false, preferBuiltins: true, dedupe: ["nexacro-parser-core",
                        "nexacro-linter",
                        //"prototype-linter",
                        //"nexacro-cli",
                        //"nexacro-pack-legacy",
                        //"nexacro-extension-vscode",
                        //"nexacro-extension-theia"
                    ]
                }),
                commonjs({
                    extensions: [...extensions, '.js'],
                }),


                json({
                    preferConst: true,
                    compact: true
                }),

                !isProduction && sourcemaps(),
                isProduction && terser({
                    ecma: 2020,
                    module: true,
                    keep_classnames: true, // 클래스 이름 옵션
                    keep_fnames: true,     // 함수 이름을 유지 옵션
                }),

                ...post_plugins,
                writePackageDocumentation(docs_config),
                generateGraphPlugin({}),

                docs_config.useDocument ? visualizer({ filename: path.join(docs_config.writePath, docs_config.bundleAnalyzer) }) : {},
            ],
            external: [...external,
                'fs', 'path', 'os', 'child_process', 'url',
                'vscode', '@theia/core' // 확장용 타겟 포함
            ]
        }
    )];

    return ret
}
