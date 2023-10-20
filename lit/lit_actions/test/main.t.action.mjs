import {
  client,
  authSig,
  pkpPublicKey,
  getLitActionCode,
  errorLog,
} from '../utils.mjs';

const litActionCode = await getLitActionCode();

let res;

try {
  res = await client.executeJs({
    code: litActionCode,
    authSig,
    jsParams: {
      publicKey: pkpPublicKey,
      sigName: "main-action-sig"
    },
  });
  console.log(res);
} catch (e) {
  errorLog(e);
}
