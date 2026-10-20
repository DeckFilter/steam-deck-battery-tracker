import deckyPlugin from '@decky/rollup';
import typescript from '@rollup/plugin-typescript';
import ts from 'typescript';

const compiler = {
  ...ts,
  createWatchCompilerHost(...args) {
    const host = ts.createWatchCompilerHost(...args);
    // One-shot builds must not leave TypeScript filesystem watchers running.
    if (process.env.ROLLUP_WATCH !== 'true') {
      host.watchFile = host.watchDirectory = () => ({ close() {} });
    }
    return host;
  },
};

const config = deckyPlugin({});
config.plugins = config.plugins.map((plugin) =>
  plugin.name === 'typescript' ? typescript({ typescript: compiler }) : plugin
);

export default config;
