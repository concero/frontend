import { FC } from 'react'

import { CryptoSymbolType } from '../../../types/CryptoSymbol'
import classNames from './CryptoSymbol.module.pcss'

export interface CryptoSymbolProps {
  name: CryptoSymbolType
  symbol: string
}

export const CryptoSymbol: FC<CryptoSymbolProps> = ({ name, symbol }) => (
  <div className={classNames.container}>
    <div className={classNames.iconContainer}>
      <object data={`src/assets/cryptoSymbols/${name}.svg`} type="image/svg+xml" width={18} height={18} />
    </div>
    <p>{symbol}</p>
  </div>
)
