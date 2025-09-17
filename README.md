# Clarity Playground

Run Clarity code in the browser with the
[Clarinet SDK](https://www.npmjs.com/package/@hirosystems/clarinet-sdk-browser).

The playground gives access to the [Simnet](https://docs.hiro.so/clarinet/networks) in the browser.
It's possible to:

- deploy contracts,
- perform contract calls,
- execute clarinet commands, type `::help` to learn more

## MXS

The playground can be used with Mainnet Execution Simulation (MXS). Meaning, that it can access
mainnet data, and simulate transactions as if they were executed on mainnet.

To do so, pass the `remote_data` query parameter in the URL, with an optional `initial_height`
value: https://play.hiro.so/?remote_data=true&initial_height=3583219

## Contributing

This project is built using vanilla HTML, CSS, and JS. Dependencies are managers with esm.sh, have a
look at the `importmap` in the index.html. There is not built step at all.

### Run it locally

```sh
npm install
npm start
```

Visit http://localhost:3000 (or the url printed in the console).

### About NPM dependencies

The NPM dependencies are optional, it used for local development (with `serve`), and types
handlings.

VSCode is able to resolve the type dependencies from the `node_modules` even though the project is
built with esm.sh. The only caveat is that the esm.sh and the package.json dependencies have to be
kept in sync.
