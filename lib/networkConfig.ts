import { createNetworkConfig } from '@mysten/dapp-kit'
import { getFullnodeUrl } from '@mysten/sui/client'
import {
  POKER_PACKAGE_ID_DEVNET,
  POKER_PACKAGE_ID_TESTNET,
  POKER_PACKAGE_ID_MAINNET,
} from './constants'

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl('devnet'),
      variables: {
        pokerPackageId: POKER_PACKAGE_ID_DEVNET,
      },
    },
    testnet: {
      url: getFullnodeUrl('testnet'),
      variables: {
        pokerPackageId: POKER_PACKAGE_ID_TESTNET,
      },
    },
    mainnet: {
      url: getFullnodeUrl('mainnet'),
      variables: {
        pokerPackageId: POKER_PACKAGE_ID_MAINNET,
      },
    },
  })

export { useNetworkVariable, useNetworkVariables, networkConfig }
