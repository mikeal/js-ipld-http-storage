'use strict'
const bent = require('bent')
const headers = { 'content-type': 'application/octet-stream' }
const { Block } = require('@ipld/stack')

const b32 = cid => cid.toBaseEncodedString('base32')

/* HTTP writer service requirements:
 * - Must accept the block body as binary.
 * - Must accept a base32 CID appended to the baseurl.
 * - Must return 201 on success.
 */

const createWriter = url => {
  let put = bent('PUT', 'string', 201, headers, url)
  let write = async block => {
    let [cid, data] = await Promise.all([block.cid(), block.encode()])
    return put(b32(cid), data)
  }
  return write
}

/* HTTP reader service requirements:
 * - Must accept a base32 CID appended to the baseurl
 * - Must return the block body as a binary response
 */

const createReader = url => {
  let get = bent(url, 'buffer')
  let read = async cid => Block.create(await get(b32(cid)), cid)
  return read
}

module.exports = (url1, url2) => [createWriter(url1), createReader(url2)]
module.exports.writer = createWriter
module.exports.reader = createReader
