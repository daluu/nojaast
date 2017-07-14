# nojaast

nojaast = NOde.js Just Another Application Server Template

Just barebones templating for REST/HTTP APIs, serving client side content, etc.

TODO - include API/routes documentation automatic generation?

## Usage ##

Run `npm install` after cloning repo then...

`node server.js [-a hostname] [-p port] [-v]` or `npm start`

(Rerun npm install whenever there are updates that require new dependencies to be pulled in)

-v for verbose, if hostname not provided, it may default to localhost. For running on an actual server with FQDN, you may have to use the `-a` flag for it to bind correctly to the host. Also check if any existing server instances are running (on current/same host) so as to start new instance on a non-conflicting port.

Once server started, point browser to http://host[:port] to get the home page. Port is optional if running on default port 80.

To terminate server, just invoke `Ctrl+C` or equivalent interrupt signal, or kill the process.

If starting server with `npm start`, it starts with defaults (localhost binding, port 8080) and with verbose mode on, unless reconfigured in package.json.

server does not log to file specifically, logging goes to stdout and stderr.
