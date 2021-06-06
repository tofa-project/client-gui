## Client GUI
GUI to communicate with [tofa-project/client-daemon](https://github.com/tofa-project/client-daemon). Built on top of [Electron](https://www.electronjs.org/).

- Frontend relies in `src/html`. Powered by VueJS, but is not SPA.
- Tor and Daemon binaries must be placed in `src/bin`
- Entry point is `src/main.js`

## Building
I successfully built it using Electron Forge: http://electronforge.io

- Use the latest Node/NPM LTS versions: http://nodejs.org
- Run `npm install`
- Run `npm run make`. Build configuration can be setup in `package.json` using makers from https://electronforge.io/config/makers

## Appendix
GUI alone is useless without [Daemon](https://github.com/tofa-project/client-daemon) and Tor binaries. 
