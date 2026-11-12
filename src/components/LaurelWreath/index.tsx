import { memo } from 'react'

// Espada em ASCII (52 linhas x 30 colunas), já recortada na caixa
// do desenho: sem as dezenas de colunas de espaços que existiam nas laterais.
const SWORD = `              *#
            ++**##
            *++#%%
            ##*#%%
             %##%#
             %%@@
             %%@@
             %%@@
             @%@@
             %%@@
             @@@@
             %##%#
            ***#%%
  +*+     -+***#%%%#     +**#
 +++*++*#*==++*##%%##%#****##*
+*###%%#**##**#%%%%%#*#%%##%%#
           ++++#%%#
           =+++*##%
           ==+=*%#%
           --==**##
           ---=***%
           =--=+**%
           ---=+**#
            ::-+**#
            ::-***#
            ::-+**#
            ::-***%
            .:-+**%
            .:-+**%
            ::-+**%
            ::-***#
            ::-***#
            ::-*#*
            :-=*#*
            --=*#*
            --=*#*
            -==*#*
            ==+*#*
            ==+###
            =++#%#
            +++#%#
            +++#%#
            +++#%%
            ++*#%%
            ***#%%
            ***#%%
            ###%%@
            ###%%@
            ###%%@
             ##%%@
             %%%@
              %%%`

const ROWS = 65

interface LaurelWreathProps {
  containerStyle?: string
}

// Estático: sem JS de animação nem efeitos. O tamanho vem só de CSS — a caixa
// é um container de largura (cqw) e a fonte é a largura dividida pelo número
// de linhas, então a espada tem a mesma altura que o quadrado ocupado
// antes pela coroa de louros e continua centralizada no mesmo lugar.
function LaurelWreathBase({ containerStyle }: LaurelWreathProps) {
  return (
    <div
      role="img"
      aria-label="Espada em ASCII"
      className={`size-[20%] relative flex justify-center hover:scale-105 ease-in-out duration-300 ${containerStyle ?? ''}`}
      style={{ containerType: 'inline-size' }}
    >
      <pre
        aria-hidden="true"
        className="m-0 select-none font-mono text-white"
        style={{ fontSize: `calc(100cqw / ${ROWS})`, lineHeight: 1 }}
      >
        {SWORD}
      </pre>
    </div>
  )
}

export const LaurelWreath = memo(LaurelWreathBase)
