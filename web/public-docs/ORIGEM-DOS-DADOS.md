# Origem dos dados e hipótese de missão

O jogo usa seis registros reais de arquivo do produto **MOD13Q1.061**, extraídos do serviço NASA ORNL DAAC para três coordenadas solicitadas no entorno de Rio Verde. São duas composições de 16 dias iniciadas em **28/08/2024** e **13/09/2024**, com observações selecionadas em **01/09/2024** e **23/09/2024**.

As coordenadas solicitadas não são apresentadas como centros exatos dos pixels. Três pontos não sustentam diagnóstico de lavoura, rendimento ou tendência regional.

## O que o motor confere

O NDVI é calculado como `(NIR − RED) / (NIR + RED)`. A política declarada confere bandas, escala de 0,0001, metadados temporais, campos de qualidade e concordância com o produto em tolerância de 0,0001. Um resultado só conta depois da recepção integral do lote e da aceitação científica.

| Registro | Início da composição | Observação selecionada |
|---|---|---|
| A–A2024241 | 2024-08-28 | 2024-09-01 |
| A–A2024257 | 2024-09-13 | 2024-09-23 |
| B–A2024241 | 2024-08-28 | 2024-09-01 |
| B–A2024257 | 2024-09-13 | 2024-09-23 |
| C–A2024241 | 2024-08-28 | 2024-09-01 |
| C–A2024257 | 2024-09-13 | 2024-09-23 |

## O que pertence ao modelo didático

A missão usa uma agenda de 180 minutos com trabalhos, iluminação e contatos fixos. Os lotes de 60 ou 180 Mbit representam uma carga lógica do jogo. Esses valores não são o tamanho dos JSONs, a telemetria real de MODIS ou uma especificação de hardware NASA.

As escolhas de bateria, painel, processamento, rádio, memória e política de contato alteram a viabilidade operacional. O objetivo científico permanece fixo nas duas condições.

## Fontes e arquivos preservados

- [Guia MOD13 C6.1](https://modis-land.gsfc.nasa.gov/pdf/MOD13_User_Guide_V61.pdf).
- [Serviço NASA ORNL DAAC TESViS](https://modis.ornl.gov/data/modis_webservice.html).
- Produto: DOI `10.5067/MODIS/MOD13Q1.061`.
- Serviço: DOI `10.3334/ORNLDAAC/1600`.
- [JSON original A](../public/data/mod13q1-A-raw.json), [JSON original B](../public/data/mod13q1-B-raw.json) e [JSON original C](../public/data/mod13q1-C-raw.json).
- [Pack de pesquisa](../public/data/mod13q1-research-pack.json) com procedência e recuperação, distinto do contrato executável do jogo.

Os originais científicos publicados preservam os bytes recebidos. Eles não são dados gerados por IA. A inclusão específica dessas fontes nos Resources do desafio ainda precisa de confirmação oficial.
