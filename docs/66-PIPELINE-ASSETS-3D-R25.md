# MISSÃO IPÊ · referências 3D e autoria · R25

ISS, Lua e Marte têm referências visuais oficiais salvas no laboratório. A nave que o jogador monta usa a configuração do exercício. Os modelos de arquivo contextualizam o destino e os instrumentos reais, com crédito junto à visualização. [Catálogo científico e integração de Bruno](58-CATALOGO-NASA-E-INTEGRACAO-BRUNO-R22.md)

## Arquivos conferidos

| Missão | Arquivo em `public/models/nasa/` | Crédito e uso | Bytes | Primitivas · triângulos |
| --- | --- | --- | ---: | ---: |
| ISS | `iss-carbajal-b.glb` | NASA/Michael D. Carbajal. Referência externa da estação. [Fonte do modelo](https://science.nasa.gov/3d-resources/international-space-station-iss-b/) | 476.992 | 36 · 174.440 |
| Lua | `lro-meaney-a.glb` | NASA/Christopher R. Meaney. LRO como referência do levantamento lunar. [Fonte do modelo](https://science.nasa.gov/3d-resources/lunar-reconnaissance-orbiter-a/) | 654.500 | 55 · 76.349 |
| Marte | `mars-2020-perseverance.glb` | NASA/Jet Propulsion Laboratory. Referência do rover e de sua missão em Jezero. [Fonte do modelo](https://science.nasa.gov/3d-resources/mars-2020-perseverance-rover/) | 4.987.176 | 252 · 199.521 |

Baixamos os GLBs originais em 15/11/2026. Os três são GLB 2.0, autocontidos, com **6.118.668 bytes no total**. A leitura do cabeçalho e do JSON confirmou a presença de cenas, malhas e materiais. O decoder Draco já incluído no projeto decodificou **343/343 primitivas** e suas contagens corresponderam aos accessors. ISS e LRO usam materiais sem imagens. Perseverance tem 44 imagens JPEG, PNG e WebP embutidas. A aparência e as texturas devem ser verificadas no navegador da aplicação. Os hashes SHA-256, URLs diretos e contagens estão em `experiments/mission-design-lab/public/models/nasa/manifest-r25.json`.

Carregue uma referência de cada vez, sob demanda, com `DRACOLoader` apontado para o decoder local. Preserve a escala e o enquadramento como decisões de apresentação. O arquivo do Perseverance tem 252 primitivas e 44 imagens, então verificar sua carga e a fluidez é parte do aceite móvel. O jogo usa os modelos como referências educativas com créditos, conforme as condições da NASA. [Diretrizes de uso de mídias 3D da NASA](https://www.nasa.gov/nasa-brand-center/images-and-media/)

## DCC-MCP no Mac

O `dcc-mcp-cli 0.20.53` rodou via `uvx` em cache temporário fora do projeto. A lista de instâncias verificou o gateway local e retornou **zero hosts registrados**. A busca por Meshy no catálogo retornou itens por similaridade, sem uma entrada de provedor Meshy. A inspeção de PATH, diretórios de aplicativos e Spotlight também ficou sem um Blender operável neste Mac. A consulta ao catálogo e ao registro foi executada. Um host de autoria ainda precisa estar disponível para abrir, editar e exportar uma cena por MCP. [DCC-MCP Core e CLI](https://github.com/dcc-mcp/dcc-mcp-core) · [Catálogo DCC-MCP](https://dcc-mcp.github.io/marketplace/)

Para operar Blender pela via DCC-MCP, use um host Blender 4.5 ou posterior compatível com o adaptador atual, instale a extensão de plataforma do projeto e valide a sessão em `dcc-mcp-cli list`. Em uma cena de trabalho, use as ferramentas tipadas de importar, inspecionar e exportar. Guarde a fonte editável e valide a reimportação do GLB. [Adaptador DCC-MCP para Blender](https://github.com/dcc-mcp/dcc-mcp-blender)

## Meshy

O servidor MCP oficial é `@meshy-ai/meshy-mcp-server`. Ele usa `MESHY_API_KEY` para a conta e as tarefas da API consomem créditos. A sessão atual não tem o servidor conectado nem a variável de credencial disponível. A entrega usa os GLBs da NASA e não produziu modelos nem consumiu créditos pelo Meshy. [Integração oficial Meshy MCP](https://docs.meshy.ai/en/api/ai) · [Autenticação e início da API](https://docs.meshy.ai/en/api/quick-start)

Quando houver conta conectada e orçamento para gerar um asset didático, confira o saldo com `meshy_check_balance`, gere uma peça por vez e exporte o GLB com recursos embutidos. Registre a origem, o identificador da tarefa, a autorização de uso e o hash final. Teste separado dos originais NASA. Uma ilustração gerada pode representar o subsistema que o jogador escolhe, enquanto a fonte histórica sustenta as explicações científicas.

## Aceite na aplicação

1. Abra as três missões e confirme que a nave montável acompanha as escolhas antes de abrir a referência NASA.
2. Abra uma referência por vez. Observe a escala, a rotação, as texturas, o crédito e a URL sem dependência externa para o GLB ou o Draco.
3. No celular, compare a primeira carga da bancada com a carga sob demanda da referência. Confira foco, toque, movimento reduzido e a alternativa HTML/2D com WebGL indisponível.
4. Ao publicar, compare os hashes dos três arquivos servidos com o manifesto. Uma geometria decodificada no terminal comprova o conteúdo do arquivo. A inspeção móvel e do deploy completa a validação da experiência.
