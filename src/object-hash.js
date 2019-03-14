import hash from "@emotion/hash";

/**
 * object-hash npm package isn't working in codesandbox
 * https://github.com/CompuIves/codesandbox-client/issues/1602
 */
export default function objectHash(obj) {
  return hash(JSON.stringify(obj));
}
