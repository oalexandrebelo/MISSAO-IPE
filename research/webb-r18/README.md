# Webb: seis medidas reais, uma pergunta científica

O caso do telescópio passa a usar **profundidade de trânsito de WASP-39 b**, observada pelo Webb/NIRSpec PRISM em **10 de julho de 2022**, processada pela equipe científica com **FIREFLy** e distribuída pelo **NASA Exoplanet Archive**. Os seis valores não são fluxos inventados nem duas exposições de três cores.

A pergunta para o participante é: **como entregar medidas espectrais suficientes, com suas incertezas, para comparar quanto da luz da estrela é bloqueado em diferentes comprimentos de onda?** Ela conecta uma necessidade científica à escolha de instrumento, à energia para operá-lo e à comunicação que permite ao cientista receber os resultados.

## O que foi preservado

- `WASP_39_b_3.11466_4988_2.tbl`: arquivo IPAC original da NASA, 95 bins, 68.673 bytes, sem edição. SHA-256 `49a41e9eacaec33457b5c5d249bb9803da1ab0a07ea99fa2b4b5a8d0e24de687`.
- `FIREFLY_REDUCTION.txt` e `AUTHOR_README.txt`: membros originais do depósito versionado dos autores. O README explicita unidades. O TXT mantém a precisão original em fração, antes da representação em porcentagem usada pelo arquivo NASA.
- `JWST_ERS_1st_LOOK_PAPER_DATA.zip`: depósito original completo, 375.091 bytes. O MD5 foi conferido contra o registro Zenodo. Os modelos teóricos que também existem no ZIP **não entram como observações no jogo**.
- `nasa-archive-metadata.json` e `zenodo-record-6959427.json`: respostas preservadas dos catálogos que identificam os produtos, a equipe e a licença.
- `provenance.json`: URLs, data de obtenção, hashes, unidades, versão, linhas, atribuição e limitações.
- `webb-spectrum-subset.json`: seis registros com proveniência por registro, prontos para integração.
- `extract.py`: extração determinística com biblioteca padrão do Python; nenhuma dependência adicional.

O navegador deve consumir a cópia local versionada do projeto. Nenhuma chamada ao arquivo científico externo é necessária durante a partida.

## Os seis bins

Cada linha abaixo é um bin de comprimento de onda distinto **do mesmo trânsito**, da mesma redução. A seleção usa o bin existente mais próximo dos pontos didáticos 3,6; 3,9; 4,2; 4,3; 4,5 e 4,9 µm. Não há interpolação, média, duplicação ou ajuste de modelo.

| Linha de dados NASA, começando em 1 | Linha física no `.tbl` | λ central (µm) | Largura (µm) | Profundidade (%) | Incerteza 1σ (p.p.) |
| --- | --- | --- | --- | --- | --- |
| 25 | 37 | 3,59308 | 0,02220 | 2,13814 | ±0,01009 |
| 39 | 51 | 3,89121 | 0,02046 | 2,10084 | ±0,01222 |
| 54 | 66 | 4,19111 | 0,02839 | 2,13836 | ±0,01171 |
| 58 | 70 | 4,30310 | 0,02761 | 2,24669 | ±0,01259 |
| 65 | 77 | 4,49196 | 0,02637 | 2,22426 | ±0,01393 |
| 80 | 92 | 4,89040 | 0,03207 | 2,15689 | ±0,01512 |

**Porcentagem e pontos percentuais:** em 4,30310 µm, o arquivo informa 2,24669% de profundidade e uma incerteza de 0,01259 ponto percentual. Essa incerteza não é 0,01259% do valor medido. O original dos autores usa frações: tanto `transit_depth` quanto `tran_unc` são multiplicados por 100 para comparação com o arquivo NASA. Os valores do jogo são os valores da tabela NASA, conservados sem alteração.

Profundidade de trânsito mede a diminuição relativa de luz da estrela associada ao planeta e à atmosfera durante a passagem. A base de aproximadamente 2% inclui o disco do planeta. Não representa concentração de CO₂, fração de atmosfera ou brilho superficial.

## Responsabilidade dos dois devs

**Dev de ciência/simulação:** usar `records` do JSON; exigir seis bins distintos e adequação do instrumento espectral; preservar valor, unidade, incerteza, data, pipeline e linha de origem. Os instantes de produção e transmissão são uma encenação didática da entrega de um resultado científico já publicado. Uma falha pode impedir que um registro seja entregue; não deve transformar seu valor real em um valor inventado. Não recalcular a incerteza científica a partir da bateria ou da antena fictícia.

**Dev de experiência/3D:** destacar o instrumento responsável, identificar a λ do registro e mostrar barras de erro nos gráficos. A luz infravermelha pode receber cores visíveis convencionais, explicitando que são uma codificação visual. Comunicações e filas devem mostrar o registro real que está sendo entregue. O modelo do Webb é uma referência geométrica; não dar a entender que uma troca de equipamento do jogo aconteceu na missão histórica. O espectro não é uma fotografia da atmosfera.

Na escolha de câmera versus espectrômetro, a limitação pertence à **câmera genérica do catálogo didático**. Não afirmar que nenhuma câmera faz espectroscopia: o NIRCam real do Webb também possui modos espectroscópicos.

## O que o participante pode concluir

Ele pode perceber a variação da profundidade com λ, comparar um valor com sua incerteza e explicar por que o instrumento certo e a entrega completa dos dados importam. Pode relacionar o sinal próximo de 4,3 µm à interpretação publicada de CO₂ no estudo completo. O recorte foi escolhido para contrastar regiões vizinhas e a feição; não é uma amostra estatística representativa de todo o espectro.

Ele **não** está reproduzindo a detecção científica: seis bins não substituem o ajuste dos 95 bins, os modelos atmosféricos nem o estudo de erros sistemáticos. Os arquivos usados não trazem matriz de covariância; não assumir independência estatística entre bins, combinar seus erros para anunciar uma significância ou oferecer um teste novo de presença de CO₂. O jogo também não demonstra vida, habitabilidade ou abundância molecular. As medidas são históricas, não telemetria ao vivo.

## Reproduzir e verificar

Na raiz do repositório:

```sh
python3 research/webb-r18/extract.py
```

O script verifica os hashes das duas tabelas, a ordenação dos 95 bins, a concordância de todos os valores NASA com o original dos autores após conversão de unidades e as seis linhas selecionadas. A tolerância de comparação é um último dígito exibido pela tabela NASA (`0,00001`); sua formatação não equivale sempre a arredondar a versão de precisão completa em uma só etapa. Isso não modifica nenhum número do arquivo. A saída JSON é idêntica em execuções repetidas.

Para obter uma nova cópia NASA, consultar `spectra` pelo TAP com a consulta registrada em `provenance.json`, abrir Atmospheric Spectroscopy, selecionar WASP-39 b / FIREFLy e conferir `spec_path`. A interface gera um endereço temporário de download; não usá-lo como dependência de produção. O DOI versionado dos autores oferece uma cópia independente e durável. Mudança de hash exige revisão explícita, nunca substituição silenciosa do snapshot.

## Fontes e atribuição

- [NASA Exoplanet Archive: Atmospheric Spectroscopy de WASP-39 b](https://exoplanetarchive.ipac.caltech.edu/cgi-bin/atmospheres/nph-firefly?atmospheres=&planet=WASP-39%20b), registro FIREFLy, 95 bins; [definições dos campos e unidades](https://exoplanetarchive.ipac.caltech.edu/docs/atmospheres/atmospheres_columns.html).
- [Depósito original dos autores, versão DOI 10.5281/zenodo.6959427](https://zenodo.org/records/6959427), licença **CC BY 4.0**. Criador: JWST Transiting Exoplanet Community Early Release Science Team.
- [Artigo: Identification of carbon dioxide in an exoplanet atmosphere](https://doi.org/10.1038/s41586-022-05269-w), publicado online em 2/9/2022; Nature 614, 649–652 (2023). As figuras 2 e 3 definem as barras como incertezas de 1σ; a seção de disponibilidade liga os dados ao MAST e ao depósito acima. [Texto aberto do artigo](https://pmc.ncbi.nlm.nih.gov/articles/PMC9946830/).
- [NASA: apresentação oficial do espectro NIRSpec](https://science.nasa.gov/asset/webb/exoplanet-wasp-39-b-nirspec-transmission-spectrum/), divulgada em 25/8/2022, confirma observação de 10/7/2022 e modo PRISM. A representação do planeta é ilustrativa, não imagem direta obtida nessa observação.

Atribuição reutilizável: **JWST Transiting Exoplanet Community Early Release Science Team; NASA/ESA/CSA Webb; redução FIREFLy; NASA Exoplanet Archive. Dados dos autores sob CC BY 4.0. Recorte didático de seis bins por MISSÃO IPÊ, valores preservados do arquivo NASA.** Não há endosso da NASA à equipe ou ao jogo.
