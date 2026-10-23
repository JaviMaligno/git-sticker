// Only an ephemeral synthetic key and made-up address are used; never private.key.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const NodeRSA = require('node-rsa');

(async () => {
  const { default: inquirer } = await import('inquirer');
  assert.equal(typeof inquirer.prompt, 'function');
  const chalk = require('chalk');
  assert.equal(typeof chalk.green, 'function');
  const key = new NodeRSA({ b: 2048 });
  const synthetic = {
    name: 'Synthetic fixture', street: 'Test street', street2: '', city: 'Fixture',
    state: 'XX', zip: '00000', country: 'XX', notes: 'Offline contract',
  };
  assert.deepEqual(key.decrypt(key.encrypt(synthetic, 'base64'), 'json'), synthetic);

  const cliPath = path.join(__dirname, '..', 'index.js');
  const source = fs.readFileSync(cliPath, 'utf8');
  const cliRequire = createRequire(cliPath);
  const originalPrompt = inquirer.prompt;
  const output = [];
  let promptCalls = 0;
  let keyReads = 0;
  try {
    inquirer.prompt = async questions => {
      promptCalls += 1;
      assert.deepEqual(Array.from(questions, question => question.name), Object.keys(synthetic));
      return synthetic;
    };
    const execution = vm.runInNewContext(source, {
      require(specifier) {
        if (specifier === 'fs') return {
          readFileSync(filename, encoding) {
            assert.equal(filename, 'public.key');
            assert.equal(encoding, 'utf8');
            keyReads += 1;
            return key.exportKey('public');
          },
        };
        return cliRequire(specifier);
      },
      console: { log: value => output.push(String(value)) },
    }, {
      filename: cliPath,
      importModuleDynamically: vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER,
    });
    await execution;
    assert.equal(promptCalls, 1);
    assert.equal(keyReads, 1);
    // The real CLI must emit an RSA-encrypted answer object between its markers.
    const stripColor = value => value.replace(/\u001b\[[0-9;]*m/g, '');
    assert.match(stripColor(output[0]), /copy below/);
    assert.deepEqual(key.decrypt(stripColor(output[1]), 'json'), synthetic);
    assert.match(stripColor(output[2]), /copy above/);
    assert.match(output[3], /stickers\//);
  } finally { inquirer.prompt = originalPrompt; }
  console.log('Synthetic RSA, ESM prompt API and actual CommonJS CLI contract passed.');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
