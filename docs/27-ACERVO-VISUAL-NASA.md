# Acervo visual NASA — contexto, procedência e limites

**Corte documental: 14 de novembro de 2026.** Seis imagens históricas de fontes oficiais compõem um acervo educativo para o portal e o estudo do projeto Ipê. Nenhuma mostra uma nave Ipê real, comprova parceria com a NASA ou altera o escopo do beta: CubeSat fictício dedicado ao Cerrado. As imagens de comunicação, Sol e Bennu apoiam estudos de extensões futuras.

## Inventário verificável

Os seis arquivos JPEG somam **839.655 bytes (aproximadamente 0,84 MB)**. Cada um tem menos de 223 KB. As variantes foram fornecidas pelos servidores oficiais da NASA; não houve recorte, retoque, geração, compressão ou conversão local. A variante da Terra tem 720 pixels por lado; as demais têm entre 1.000 e 1.024 pixels de largura. O conjunto preserva proporções e conteúdo das variantes selecionadas.

| Fonte oficial e tema | Data da imagem | Arquivo em `web/media/` | Dimensões | Bytes |
| --- | --- | --- | --- | ---: |
| [Brasil central observado por MODIS](https://science.nasa.gov/earth/earth-observatory/central-brazil-1111/) | 2000-10-19 | `cerrado-terra-modis.jpg` | 1000 × 823 | 173985 |
| [A Terra vista pelo EPIC](https://science.nasa.gov/earth/earth-observatory/an-epic-new-view-of-earth-86257/) | 2015-07-06 | `terra-espaco.jpg` | 720 × 720 | 84122 |
| [CubeSats reais após a liberação](https://www.nasa.gov/image-article/trio-of-cubesats-are-deployed-outside-international-space-station/) | 2022-08-12 | `cubesats-iss.jpg` | 1024 × 683 | 69467 |
| [Antenas da rede de espaço profundo](https://science.nasa.gov/photojournal/dawn-in-the-apollo-valley/) | 2012-01-11 | `dsn-goldstone.jpg` | 1024 × 682 | 82038 |
| [Atividade solar observada pelo SDO](https://science.nasa.gov/science-research/heliophysics/how-nasa-tracked-the-most-intense-solar-storm-in-decades/) | 2024-05-11 | `sol-sdo.jpg` | 1024 × 1024 | 207346 |
| [Bennu observado pela OSIRIS-REx](https://science.nasa.gov/resource/bennu-mosaic/) | 2018-12-02 | `bennu-osiris-rex.jpg` | 1024 × 968 | 222697 |

O [manifesto de procedência](https://github.com/oalexandrebelo/PROJETO-IPE/blob/main/web/media/manifest.json) registra por imagem: identificador, arquivo, título, texto alternativo, legenda, crédito, missão, página de origem, URL exata da variante baixada, data da observação, publicação da fonte, dimensões, tamanho, SHA-256 e fundamento de reutilização. Os créditos completos permanecem no manifesto e devem acompanhar a exibição. No site, o mesmo conjunto é disponibilizado em `/media/`.

`sourceDate` representa a aquisição/observação, não a data de download. `sourcePublishedAt` registra a publicação da página. A coleta e a revisão ocorreram em 2026-11-14. Datas inseridas nos caminhos de migração dos sites não substituem as datas científicas.

## Contexto de cada imagem

### Brasil central: a observação que fundamenta o tema

A cena de 19/10/2000 foi obtida pelo MODIS a bordo do Terra. A página descreve áreas do Cerrado, Amazônia, agricultura e fumaça. O crédito completo nomeia os três responsáveis pela imagem e a equipe científica MODIS; está preservado literalmente no manifesto. [Fonte: Central Brazil](https://science.nasa.gov/earth/earth-observatory/central-brazil-1111/).

Uso no Ipê: mostrar por que observar vegetação do espaço é relevante. A cena ampla não é um dos seis registros MOD13Q1 utilizados no beta, não delimita a área de estudo do jogo e não demonstra condições atuais. Não extrair NDVI nem resultados ambientais dessa ilustração.

### Terra: escala planetária

A imagem de 06/07/2015 reúne bandas vermelha, verde e azul do EPIC, instrumento do DSCOVR. Crédito: equipe DSCOVR EPIC, conforme a fonte. [Fonte: An EPIC New View of Earth](https://science.nasa.gov/earth/earth-observatory/an-epic-new-view-of-earth-86257/).

Uso no Ipê: introduzir sensores e a diferença entre escalas de observação. DSCOVR observa de muito mais longe que uma órbita baixa; a imagem não representa a posição ou o campo de visão da nave fictícia.

### CubeSats: referência de hardware real

A fotografia `iss067e255675` mostra TUMnanoSAT, FUTABA e HSU-SAT1 após liberação junto ao módulo Kibo da ISS, em 12/08/2022. Crédito: NASA. O registro do catálogo identifica o centro JSC, sem nomear fotógrafo. [Página da imagem](https://www.nasa.gov/image-article/trio-of-cubesats-are-deployed-outside-international-space-station/) e [metadados NASA](https://images-api.nasa.gov/search?nasa_id=iss067e255675).

Uso no Ipê: explicar o formato de pequenos satélites e abrir a conversa sobre painéis, energia e comunicação. A foto não valida massa, órbita, componentes, lançamento ou desempenho do projeto.

### DSN: comunicação exige infraestrutura

A fotografia PIA17793 registra antenas de 34 metros em Goldstone em 11/01/2012. Crédito: NASA/JPL-Caltech. [Fonte: Dawn in the Apollo Valley](https://science.nasa.gov/photojournal/dawn-in-the-apollo-valley/).

Uso no estudo: ilustrar comunicação com missões distantes. A fotografia não informa ocupação atual; um feed público da DSN tampouco concede reserva de antena. Não vincular essa infraestrutura ao orçamento de comunicação do CubeSat Ipê sem uma proposta técnica própria.

### Sol: observação e evento precisam de contexto

A imagem SDO registra atividade associada à erupção X5.8 de maio de 2024, em ultravioleta extremo representado em cores. Crédito exibido na fonte: NASA SDO. O arquivo indica 01:22 UTC de 11/05; a legenda situa o pico às 21:23 EDT de 10/05, ou 01:23 UTC de 11/05. Não confundir o instante da imagem com o do pico. [Fonte NASA Science](https://science.nasa.gov/science-research/heliophysics/how-nasa-tracked-the-most-intense-solar-storm-in-decades/).

Uso no estudo: apresentar clima espacial e decisões operacionais. É um registro histórico; não é alerta em tempo real nem prova de dano a uma nave. Um futuro evento de jogo precisará separar observação, modelo de risco e regra pedagógica.

### Bennu: uma campanha futura possível

O mosaico reúne 12 imagens PolyCam da OSIRIS-REx adquiridas em 02/12/2018, a cerca de 24 km do asteroide. Crédito: NASA/Goddard/University of Arizona. [Fonte: Bennu Mosaic](https://science.nasa.gov/resource/bennu-mosaic/).

Uso no estudo: ilustrar a futura campanha de pequenos corpos proposta no projeto. Não implica que SBDB, Mission Design ou Horizons já estejam integrados. A extensão continua dependente da validação da campanha Cerrado; a imagem não é mapa científico com escala utilizável para navegação.

## Reutilização e apresentação

O fundamento consultado são as [NASA Images and Media Usage Guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/): uso educativo/informativo factual, com reconhecimento da fonte e sem sugerir endosso. A NASA também publica material protegido de terceiros; a permissão geral não transfere esses direitos. Não foi encontrada indicação de restrição de copyright de terceiros nas seis páginas selecionadas. Isso não transforma todo material hospedado pela NASA em licença irrestrita, nem apaga créditos de instituições parceiras.

A seleção não contém retratos de pessoas nem usa logotipos NASA como marca do Ipê. Preservar créditos, origem e caráter histórico. A licença do código do projeto não relicencia essas imagens. Para uso comercial promocional, produtos ou alterações futuras, reavaliar as regras aplicáveis ao uso específico.

## Contrato para os dois desenvolvedores

- Consumir `images` do manifesto; `file` e `filename` são o mesmo basename, sem diretórios. Os identificadores estáveis são `cerrado`, `terra`, `cubesats`, `dsn`, `sol` e `bennu`.
- Mostrar legenda, crédito e link para a fonte; a ficha de estudo pode exibir `mission`, `sourceDate` e `limitation`. Texto alternativo descreve o conteúdo visual; não deve virar uma lista de palavras-chave.
- Reservar largura e altura antes do carregamento e usar carregamento tardio fora da primeira tela. Não depender do domínio NASA para abrir a galeria: as cópias locais permitem a apresentação sem novas consultas externas.
- Manter a imagem completa disponível na visualização ampliada. Se a miniatura tiver enquadramento visual por CSS, ela não deve esconder detalhes na consulta completa nem sugerir uma nova observação científica.
- Ao substituir um arquivo, revisar fonte, crédito, data e limites; recalcular bytes, dimensões e SHA-256. Os hashes comprovam integridade dos bytes coletados, não validade científica nem imutabilidade futura da URL externa.

A verificação deste acervo incluiu abertura visual dos seis arquivos e conferência de formato JPEG, dimensões, tamanhos e hashes. Nenhuma API científica nova foi implementada por esta entrega. A disponibilidade pública final depende do recibo de publicação do projeto; a presença destes arquivos no repositório, isoladamente, não prova um deploy.
