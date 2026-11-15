# Regras do jogo

## Objetivos

- **Objetivo principal:** chegar ao destino da missão.
- **Objetivo científico:** preservar instrumentos e dados para realizar pesquisas.
- O sucesso considera capacidade de carga, massa, energia, orçamento, capacidade científica e eficiência do projeto.

## Missões

Cada missão define destino, carga de referência, duração-base, tema científico, desafios e recompensa de experiência. Os temas representam categorias de pesquisa inspiradas em missões e pesquisas da NASA:

- **ISS:** atmosfera e qualidade do ar, em contexto de pesquisa na Estação Espacial Internacional.
- **Lua:** gelo e recursos lunares, com referências ao Lunar Reconnaissance Orbiter.
- **Marte:** clima e geologia, com referências à missão Mars 2020 Perseverance.
- **Europa:** gelo, oceano e composição da superfície, com referências à Europa Clipper.
- **Bennu:** composição de asteroides e origem do Sistema Solar, com referências à OSIRIS-REx.

A duração-base é uma estimativa didática em dias, convertida das durações apresentadas no briefing quando necessário.

## Etapas da missão

1. **Montar a nave:** escolher veículo, propulsão, energia, proteção e navegação. Os indicadores de saldo futuro, capacidade científica e dias são atualizados a cada escolha.
2. **Instalar itens científicos:** escolher um card na grade de itens disponíveis e adicionar à lista lateral de slots da missão por arraste ou pelo botão de seta. A coluna mostra os compartimentos da nave; cada instrumento ocupa o número de slots indicado em sua ficha. Não é possível exceder slots nem capacidade de massa. Itens do inventário do engenheiro podem ser reutilizados; unidades adicionais têm compra prevista. A carga é revisada antes do lançamento.

## Engenheiro, orçamento e inventário

O engenheiro começa com **US$ 25 milhões** e inventário científico vazio. O perfil, saldo, projetos por missão, inventário, durabilidade e progresso ficam salvos no navegador e são compartilhados entre as missões.

- A seleção de componentes da nave e instrumentos mostra uma **previsão**, não cobra imediatamente.
- No lançamento, são debitados os componentes selecionados, os instrumentos que precisarem ser comprados e o custo operacional calculado.
- Um instrumento já disponível no inventário não é comprado outra vez.
- Cada unidade possui sua própria durabilidade. Ao ser usada, perde uma missão de durabilidade; se ainda tiver usos, volta ao inventário. Ao chegar a zero, é descartada.
- Itens já reservados em outro projeto não são contados como disponíveis gratuitamente.
- Em caso de sucesso, ao concluir o relatório da missão, o engenheiro recebe **US$ 5 milhões + US$ 1 milhão por nível da missão + US$ 0,1 milhão por ponto percentual de capacidade científica**. Uma missão sem sucesso não paga recompensa financeira.

## Nave e equipamentos

A nave é montada com um veículo e equipamentos de propulsão, energia, proteção e navegação. Cada componente informa:

- **Massa:** soma-se à carga da missão para obter a massa total.
- **Preço:** integra o custo de compra previsto; só é debitado quando a missão é lançada.
- **Energia:** valor positivo representa consumo e valor negativo representa geração ou armazenamento.
- **Confiabilidade:** participa do cálculo da capacidade científica.
- **Propriedade específica:** por exemplo, capacidade de carga, potência ou precisão.
- **Regra do item:** informa efeitos de jogo, como modificadores de dias e capacidade científica.

O veículo precisa comportar a carga-base da missão e a massa dos instrumentos. Cada veículo também define um número de compartimentos científicos; itens com mais de um compartimento usam sua capacidade indicada. A massa total é a carga-base mais as massas dos componentes e instrumentos. A capacidade de tripulantes prevista para o projeto é de 0 a 5; tripulantes ainda não são selecionáveis na montagem atual.

### Energia

A energia disponível começa em 64 unidades. Subtrai-se o consumo dos sistemas e soma-se a geração dos equipamentos. A reserva deve ser de pelo menos 30 unidades para a missão ser aprovada.

### Dias de viagem

Os dias são recalculados a cada escolha de equipamento:

1. Calcule o fator de massa: `1 + max(0, massa total − 800) / 10.000`.
2. Multiplique os dias-base da missão pelo fator de massa e pelos fatores de viagem da propulsão, proteção e navegação.
3. Arredonde o resultado para cima ao próximo dia inteiro.

Um fator menor que 1 reduz os dias; um fator maior que 1 os aumenta. A massa adicional também pode prolongar a viagem.

### Orçamento e custo

O orçamento é compartilhado pelo engenheiro entre missões. O custo previsto de uma missão combina:

- soma dos preços dos componentes da nave;
- custo dos instrumentos selecionados que não estejam disponíveis no inventário;
- custo operacional de **US$ 0,0005 milhão (US$ 500) por dia** multiplicado pelos dias calculados.

O painel da montagem e da carga científica mostra o saldo do engenheiro e o saldo previsto depois do lançamento. Selecionar ou trocar equipamento **não debita** o orçamento: a compra e a operação só são pagas quando a missão é lançada. Uma missão não pode ser lançada se o custo previsto superar o saldo disponível.

### Capacidade científica e sucesso

A capacidade científica é calculada a partir de **25% da média da confiabilidade dos cinco sistemas**, do modificador científico da proteção e da contribuição dos instrumentos. Para cada instrumento, a contribuição é `bônus científico do item × afinidade percentual com o tema da missão`. O resultado é arredondado e limitado a 0–100%. Assim, instrumentos alinhados ao tema contribuem mais, e a capacidade pode variar significativamente de acordo com nave e pesquisa selecionada.

A eficiência compara capacidade científica e custo previsto:

`eficiência = capacidade científica (pontos percentuais) / custo previsto (US$ milhões)`

A missão é aprovada quando a carga-base e os instrumentos cabem no veículo e nos compartimentos, a massa total é inferior a 1.800 kg, a reserva de energia é de pelo menos 30 unidades, o custo cabe no saldo do engenheiro, a capacidade científica é de pelo menos 95% e a eficiência é de pelo menos 5 pontos percentuais por US$ milhão. Uma missão pode ser lançada com indicadores científicos ou de energia abaixo da meta, se a carga couber e houver saldo, mas o resultado será parcial e não haverá recompensa financeira.

## Regras por categoria

- **Veículo:** limita a massa da carga que pode ser transportada. Sua massa também participa do fator de duração da viagem.
- **Propulsão:** modifica a duração conforme o fator do equipamento e consome energia. Mais dias aumentam o custo operacional.
- **Energia:** geração e armazenamento compensam o consumo de propulsão, navegação e outros sistemas. A reserva mínima é obrigatória.
- **Proteção:** altera a capacidade científica e a duração conforme o modificador indicado no item; seus equipamentos também podem consumir energia.
- **Navegação:** modifica a duração conforme o fator do equipamento e consome energia.
- **Instrumentos científicos:** cada item tem massa, preço, espaços ocupados, durabilidade, bônus científico, afinidades temáticas e uma regra própria. É possível selecionar mais de uma unidade, respeitando massa e espaços do veículo.

## Dados científicos

Os textos principais dos detalhamentos apresentam fatos ou conceitos reais associados a tecnologias e missões espaciais. O quadro **Regra do jogo** mostra o efeito daquele item no simulador; a ficha também apresenta propriedades e valores. Referências consultadas:

- [Pesquisa na Estação Espacial Internacional](https://www.nasa.gov/international-space-station/space-station-research-and-technology/)
- [Lunar Reconnaissance Orbiter](https://science.nasa.gov/mission/lro/)
- [Mars 2020 Perseverance](https://science.nasa.gov/mission/mars-2020-perseverance/)
- [Instrumentos da Europa Clipper](https://science.nasa.gov/mission/europa-clipper/spacecraft-instruments/)
- [OSIRIS-REx](https://science.nasa.gov/mission/osiris-rex/)

Massas, preços, bônus, durabilidade, capacidades e fatores exibidos são parâmetros didáticos, não especificações oficiais ou preços reais da NASA.
