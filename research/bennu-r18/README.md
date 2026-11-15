# Bennu R18 — medidas publicadas, origem verificável

O jogo recebe **seis objetos distintos de seis sítios de Bennu**, medidos pela equipe OSIRIS-REx. A grandeza principal é **eixo maior, em metros**. Não existe rugosidade criada pelo jogo neste conjunto.

| Linha da tabela | Eixo maior (m) | Eixo menor (m) | Altura (m) |
|---|---:|---:|---:|
| 1 | 1,53 | 0,818 | 0,67 |
| 2 | 3,93 | 2,11 | 1,35 |
| 3 | 2,62 | 0,842 | 0,65 |
| 4a | 1,6 | 0,703 | 0,37 |
| 5 | 3,221 | 2,25 | 0,494 |
| 6 | 1,453 | 0,636 | 0,771 |

A tabela científica completa tem **sete linhas**: o sítio 4 contém dois clastos, 4a e 4b. Selecionamos 4a para representar esse sítio no exercício de seis registros. A linha 4b, cujo eixo maior é 0,927 m, permanece nos arquivos completos de auditoria; não foi duplicada, agregada ou tratada como valor ausente.

## Fonte e cadeia de evidência

- Registro NASA: [NTRS 20205007912](https://ntrs.nasa.gov/citations/20205007912).
- Publicação: DellaGiustina, D. N., Kaplan, H. H., Simon, A. A., et al. *Exogenic basalt on asteroid (101955) Bennu*. Nature Astronomy 5, 31–38 (2021), publicado em 21/09/2020. [DOI](https://doi.org/10.1038/s41550-020-1195-z).
- [Suplemento original vinculado pelo NTRS](https://static-content.springer.com/esm/art%3A10.1038%2Fs41550-020-1195-z/MediaObjects/41550_2020_1195_MOESM1_ESM.pdf): Tabela Suplementar 1, página física 12 do PDF, página impressa 11.
- [Contexto publicado pela NASA](https://www.nasa.gov/solar-system/nasas-osiris-rex-to-asteroid-bennu-youve-got-a-little-vesta-on-you/).

As dimensões combinam imagens PolyCam com terreno OLA. A legenda limita a precisão dos eixos pela escala de 5,25 cm/pixel; a precisão vertical estimada é 1 cm. Esses números **não são intervalos ±1σ**. A tabela não fornece instante individual por dimensão: o texto dos métodos lista imagens de morfologia adquiridas entre 27/02 e 28/03/2019. Não atribuir o horário de uma imagem usada para reflectância à dimensão obtida de um conjunto de imagens e terreno.

## Para os dois devs

**Dev de simulação e dados:** importe `bennu-handoff.json`. Mantenha a medida NASA constante; energia, instrumento, memória e comunicação determinam se o jogador obtém/entrega o registro no exercício. Não multiplique o tamanho da rocha pela eficiência dos equipamentos. O relógio de operação é didático e separado da data histórica da observação. Os valores aqui são resultados científicos publicados, não um processamento local de imagens PDS brutas.

**Dev de interface e 3D:** mostre o eixo em metros, a linha da fonte e a escala que limita a precisão. Barras ou objetos 3D podem comparar dimensões, identificados como representações de escala. As coordenadas vêm da tabela (norte +Z; longitude 0–360°), mas não houve registro do referencial do GLB; não apresentar marcadores como alinhamento cartográfico verificado. As dimensões não reconstroem formato real, orientação de cada rocha ou segurança de pouso. Esses sítios científicos não são Nightingale, Osprey ou locais de coleta.

## Pergunta científica e limite educativo

O jogador aprende a relacionar escala observável, capacidade do instrumento e entrega de evidência. Comparar os seis comprimentos descreve a diversidade desses objetos, sem demonstrar composição mineral. No estudo real, imagens motivaram a investigação e espectros OVIRS apoiaram a identificação de material com piroxênio, semelhante aos meteoritos HED. A origem na família de Vesta é uma interpretação científica apoiada; a trajetória de entrega via asteroide progenitor é uma hipótese. A sessão do jogo não reproduz essa análise espectral nem produz uma descoberta nova.

## Reprodução sem novas dependências

1. Os dois PDFs originais estão localmente em `originals/`; URLs, tamanhos e SHA256 estão em `provenance.json`.
2. Neste diretório, execute `swift -module-cache-path /tmp/ipe-swift-cache extract-table.swift` no macOS. O PDFKit extrai os **caracteres de cada célula**, não valores de pixels ou de curvas.
3. Execute `python3 build-handoff.py`. Ele verifica os hashes originais e gera CSV, handoff e proveniência.
4. `table1-extracted.json` e `bennu-table1.csv` contêm as sete linhas. Campos vazios de coordenadas da linha 4b permanecem vazios, conforme a tabela.

A tabela foi também conferida visualmente na página renderizada. Nenhuma dependência foi instalada. PDFs integrais e extrações de texto de leitura ficam ignorados pelo Git porque o registro NTRS avisa sobre possíveis trechos protegidos; o repositório pode publicar fatos numéricos, código de extração, textos originais deste handoff, hashes e links. Não presumir domínio público integral por hospedagem na NASA.

`bennu-vesta-nasa-context.png` é a versão leve oficial (768 × 383, 258.664 bytes) de uma imagem do artigo NASA, sem edição local. Crédito: **NASA/Goddard/University of Arizona**. Ela mostra duas vistas contextuais de rochas/clastos brilhantes; não substitui seis imagens individuais dos registros e não foi usada para medir valores. Fonte, hash e dimensão estão em `provenance.json`.

A coleção PDS OCAMS calibrada foi identificada, mas o servidor de arquivos respondeu com desafio Cloudflare 403. A coleta não contornou essa proteção. Este conjunto usa a tabela publicada primária explicitamente vinculada pela NASA, com os arquivos originais conferidos localmente.
