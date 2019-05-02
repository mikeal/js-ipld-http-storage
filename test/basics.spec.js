'use strict'
const storage = require('../')
const assert = require('assert')
const tsame = require('tsame')
const { it } = require('mocha')
const { Block } = require('@ipld/stack')

const test = it

const same = (x, y) => assert.ok(tsame(x, y))

test('basic write', async () => {
  let url = 'https://echo-server.mikeal.now.sh/src/echo.js?statusCode=201&body='
  let [ write ] = storage(url, '')
  let block = Block.encoder({ hello: 'world' }, 'dag-json')
  let resp = await write(block)
  same(resp, (await block.cid()).toBaseEncodedString('base32'))
})

test('basic read', async () => {
  let url = 'https://echo-server.mikeal.now.sh/src/info.js?cid='
  let read = storage.reader(url)
  let block = Block.encoder({ hello: 'world' }, 'dag-json')
  let cid = await block.cid()
  let resp = await read(cid)
  let info = JSON.parse(resp.opts.data.toString())
  // assert(Block.isBlock(block))
  same(info.url, '/src/info.js?cid=baguqeerasords4njcts6vs7qvdjfcvgnume4hqohf65zsfguprqphs3icwea')
})
