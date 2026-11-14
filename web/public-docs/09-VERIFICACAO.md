# Verificação · edição pública R6

Este resumo público preserva os resultados e limites dos recibos anteriores. Ele não substitui os recibos originais e não declara validações novas de navegador ou participantes. O manifesto identifica as projeções públicas de evidência.

## Evidência já registrada

| Camada | Resultado registrado | Alcance |
|---|---|---|
| Núcleo e persistência simulada | 51/51 testes Node | Motor, ciência, busca, importação, replay e contratos. |
| Jornada da aplicação | 9 contagens TAP DOM | Componentes reais em ambiente DOM simulado. |
| Servidor local anterior | 8 casos HTTP | Arquivos, métodos e rejeição de caminhos inválidos. |
| Oráculo independente | 128 configurações | Duas condições completas, com integração alternativa. |
| Apresentação R5 | 25/25 verificações DOM | Navegação, gate, casos, catálogo, ciência, trace e ausência de chamadas de rede. |

Nove contagens TAP não representam nove jornadas humanas nem nove navegadores. O QA da apresentação compara o HTML ao motor real e não constitui outro oráculo físico.

## Catálogo fechado

| Condição | Configurações | Sucessos | Falhas | Inválidas | Indeterminadas |
|---|---:|---:|---:|---:|---:|
| Contatos longos | 64 | 17 | 41 | 6 | 0 |
| Contatos curtos | 64 | 9 | 49 | 6 | 0 |

A base longa entrega 6/6. A base curta entrega 2/6 por limitação de contato. Trocar somente para ÍNDICE no caso curto gera falha de potência aos 600 s. Bateria grande mais ÍNDICE entrega 6/6, com 3,5 kg e 84 créditos. É a única solução a duas mudanças da base nesse catálogo. Todas as sete configurações a distância zero ou um falham.

## Benchmark do núcleo

A medição registrada usa Node 24.22.1 em um executor AMD EPYC 9V45, com 30 aquecimentos e 200 amostras por carga. Busca de 64 configurações: p95 longo **4,936 ms** e curto **4,237 ms**. O valor máximo curto foi **32,073 ms**.

O benchmark exclui inicialização, transporte Worker, interface, persistência e GPU. Não foi medido no equipamento de apresentação e não constitui promessa de latência ou FPS. A [projeção pública do recibo](../evidence/engine-benchmark.json) preserva protocolo e resultados.

## Análise estática AB-R3A

O corte registrado analisou 43 arquivos e identificou 596 observações estruturais, com cobertura de aplicação parcial e semântica parcial/truncada. Esses números não são vulnerabilidades confirmadas nem certificação de segurança. O [digest público](../evidence/ab-r3a-digest.json) preserva esses limites. O relatório bruto não integra o site.

## Gates abertos

Ainda precisam de evidência própria: navegador real, inspeção visual, foco nativo, leitor de tela, impressão, execução em equipamento de apresentação e pesquisa com participantes. A existência de um endereço público não fecha esses gates.

Elegibilidade temporal, Resources específicos e adequação integral ao formulário também continuam pendentes. [Estado do projeto](ESTADO-PUBLICO.html) e [plano de release](15-PLANO-RELEASE.html) apresentam esses limites.
