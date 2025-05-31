import { createNetworkConfig } from '@mysten/dapp-kit'
import { getFullnodeUrl } from '@mysten/sui/client'
import {
  PACKAGE_ID_DEVNET,
  PACKAGE_ID_TESTNET,
  PACKAGE_ID_MAINNET,
} from './constants'

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl('devnet'),
      variables: {
        counterPackageId: PACKAGE_ID_DEVNET,
      },
    },
    testnet: {
      url: getFullnodeUrl('testnet'),
      variables: {
        counterPackageId: PACKAGE_ID_TESTNET,
      },
    },
    mainnet: {
      url: getFullnodeUrl('mainnet'),
      variables: {
        counterPackageId: PACKAGE_ID_MAINNET,
      },
    },
  })

export { useNetworkVariable, useNetworkVariables, networkConfig }
