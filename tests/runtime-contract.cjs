// Node24 and the patched CLI dependency graph must preserve encrypted addresses.
// Only an ephemeral synthetic key and made-up address are used; never private.key.
const assert = require('node:assert/strict');
const NodeRSA = require('node-rsa');
const key = new NodeRSA({ b: 2048 });
const synthetic = { name: 'Synthetic fixture', street: 'Test street', country: 'XX' };
const encrypted = key.encrypt(synthetic, 'base64');
assert.deepEqual(key.decrypt(encrypted, 'json'), synthetic);
assert.equal(typeof require('inquirer').prompt, 'function');
assert.equal(typeof require('chalk').green, 'function');
console.log('Synthetic RSA round-trip and CommonJS CLI imports passed.');
