let rimraf;
const deleteStore = process.argv.includes('--with-store');

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
    '**/doc/*'
];
if (deleteStore)
{
    targets.push('.pnpm-store');
}
for (const target of targets)
{
    try
    {
        await rimraf(target, { glob: true });
    }
    catch (err)
    {
        /*  eslint-disable no-console */
        console.warn(`[reset] Failed to remove: ${target}`, err.message);
    }
}