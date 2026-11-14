// This reviewed preload prevents the upstream renderer from opening network connections.
import http from 'node:http';
import https from 'node:https';
import net from 'node:net';
import tls from 'node:tls';
import dns from 'node:dns';
import { syncBuiltinESMExports } from 'node:module';
const deny = () => { throw new Error('Architecture generation is offline: network use is disabled.'); };
globalThis.fetch = deny;
for (const module of [http, https]) { module.request = deny; module.get = deny; }
net.connect = deny; net.createConnection = deny; tls.connect = deny;
dns.lookup = deny; dns.resolve = deny;
syncBuiltinESMExports();
