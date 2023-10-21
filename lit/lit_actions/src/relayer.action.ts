/**
 * NAME: signRelayerTransaction
 */
const signRelayerTransaction = async () => {
  try {
    const sigShare = await LitActions.signEcdsa({
      toSign,
      publicKey,
      sigName,
    });
  } catch (error) {
    console.error(error);
  }
};

signRelayerTransaction();
