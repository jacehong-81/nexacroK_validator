import { TSBuildConfig } from '../../rollup-common.config.js';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { globSync } from 'glob';
import path from 'node:path';

const DIR = 'src';
const PATTERNS = [`${DIR}/**/*.ts`, `${DIR}/**/*.js`, `${DIR}/**/*.json`]
const prependDotSlash = str => `./${str}`;

/* bundle 결과에서 제외하고 싶은 파일을 지정*/

const ignore_files = []

const get_script_files = () =>
{
    let list = globSync(PATTERNS, { ignore: 'dist/**' }).map(file =>
        prependDotSlash(path.relative(DIR, file)).replace("\\", "/"));
    if (ignore_files.length > 0)
        list = list.filter(item => !ignore_files.includes(item));
    return list
}

export default TSBuildConfig({
    packages: "nexacro-validator",
    sourceDir: 'src',
    moduleUrl: import.meta.url,
    entries: get_script_files(),
    outputDir: 'dist',
    pre_plugins: [

        peerDepsExternal(),
    ],

});