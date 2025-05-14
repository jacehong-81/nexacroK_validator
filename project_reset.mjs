let rimraf;
const deleteStore = process.argv.includes('--with-store');


import { spawnSync } from 'node:child_process';

if (process.platform === 'win32')
{
    /*  eslint-disable no-console */
    console.log('[reset] Attempting to kill turbo.exe...');
    const result = spawnSync('taskkill', ['/IM', 'turbo.exe', '/F'], {
        stdio: 'ignore',
    });

    if (result.error)
    {
        /*  eslint-disable no-console */
        console.warn('[reset] Failed to kill turbo.exe:', result.error.message);
    }
    else
    {
        /*  eslint-disable no-console */
        console.log('[reset] turbo.exe terminated if it was running.');
    }
}

try
{
    rimraf = await import('rimraf').then(m => m.rimraf);
}
catch (e)
{
    /*  eslint-disable no-console */
    console.warn('[reset] rimraf not found. Skipping cleanup.', e.message);
    process.exit(0);
}

const targets = [
    '**/node_modules',
    'pnpm-lock.yaml',
    '**/.turbo',
    '**/.rollup.cache',
    '**/dist/*',
    '**/doc/*',
    '**/tsconfig.tsbuildinfo',
    '**/.tsbuildinfo',
    '**/.eslintcache'
];
if (deleteStore)
{
    targets.push('.pnpm-store');
}
for (const target of targets)
{
    try
    {
        await rimraf(target, {
            glob: true,
            maxRetries: 3,
            retryDelay: 500
        });
    }
    catch (err)
    {
        /*  eslint-disable no-console */
        console.warn(`[reset] Failed to remove: ${target}`, err.message);
    }
}