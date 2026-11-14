# A2 — Auditoria de física e dados: Missão Ipê / Space Mission Design

Pesquisa: 14/11/2026. Entrega de pesquisa e especificação; nenhum motor de voo foi implementado.

**Decisão após localizar o projeto existente:** preservar a campanha Missão Ipê, CubeSat LEO de observação do Cerrado, seu catálogo e sua agenda didática. A evolução física pode existir em um laboratório separado, com experiências de Kepler, Tsiolkovsky, energia e telecomunicações. Missão lunar polar é a segunda campanha; Marte é extensão posterior. Os números abaixo são referências para verificações e explicações, não previsões da agenda operacional atual.

## 1. Correções que realmente importam

| Premissa perigosa | Formulação defensável |
|---|---|
| O CubeSat deve possuir o delta-v da superfície até LEO | O serviço de lançamento entrega uma massa em uma órbita declarada. Só manobras posteriores à separação entram no orçamento de propelente do CubeSat. |
| Existe um delta-v único para Lua ou Marte | O valor depende de órbita inicial/final, energia de lançamento, transferência, captura, aerofrenagem, correções, plano orbital e responsável por cada manobra. |
| Hohmann da Terra à Lua resolve a missão lunar | Hohmann entre círculos do mesmo corpo é um problema de dois corpos. Para a Lua, uma aproximação por cônicas remendadas exige também velocidade relativa de chegada e captura lunar; fase e plano precisam de hipóteses explícitas. |
| Potência do painel × eficiência da célula sempre | Se a ficha já informa potência elétrica em W ou W/m², a eficiência da célula já foi aplicada. Aplicá-la novamente reduz artificialmente a geração. |
| W pode ser somado à bateria em Wh | Energia é a integral de potência no tempo; segundos exigem divisão por 3600. A sombra deve interromper a geração no instante correspondente. |
| Banda X ou Ka é automaticamente melhor | Ganhos, aberturas, frequência, potência RF, temperatura de ruído, perdas e apontamento determinam o link. A frequência isolada não ordena antenas. |
| Ciência coletada equivale a ciência entregue | Pontuar somente pacotes únicos completamente recebidos na Terra. Separar coleta, memória, transmissão, propagação e recepção. A base existente já segue essa direção. |
| Margem NASA universal de 20% ou 30% | Há requisitos de programas/centros e fases específicas, com diferentes denominadores. Expor a convenção usada. |
| Massa/custo de catálogo estimado é dado NASA | Marcar como parâmetro didático. Não atribuir precisão de aquisição a custo em créditos ou a estimativas sem produto/configuração. |
| Dados MODIS significam MODIS dentro do CubeSat | São dados de referência que contextualizam a missão. O instrumento MODIS real tem aproximadamente 229 kg e 162,5 W de potência média orbital [F23]. |

A NASA recomenda adequar a fidelidade do modelo à decisão de projeto e evitar complexidade excessiva na fase conceitual [F16]. Isso apoia um laboratório explicativo separado, sem substituir uma agenda didática coerente por uma promessa de previsão orbital.

## 2. Natureza dos números e rastreabilidade

Usar três classes em qualquer painel de dados:

- **Referência física:** constante ou especificação publicada, com fonte, unidade, versão e contexto.
- **Derivado:** resultado calculado de referências e hipóteses declaradas; mostrar equação e condições.
- **Didático:** escolha de cenário, balanceamento, custo, qualidade de ciência, reserva, taxa de falha ou hardware fictício.

Cada parâmetro deve carregar valor, unidade, classe, fonte, data de acesso, contexto e transformação aplicada. Uma eficiência retirada de ficha de célula não é automaticamente a eficiência do conjunto painel + cabos + regulador. Preservar valores originais de dados científicos; separar claramente campos reais de pesos de pontuação inventados.

| Parâmetro | Valor de referência | Fonte e ressalva |
|---|---:|---|
| μ Terra | 398600,435507 km³/s² | JPL DE440 [F01]; multiplicar por 10⁹ se usar m³/s² |
| μ Lua | 4902,800118 km³/s² | JPL DE440 [F01] |
| μ Sol | 1,32712440041279419 × 10²⁰ m³/s² | JPL [F01] |
| μ sistema Marte | 42828,375816 km³/s² | JPL [F01]; fonte diz sistema, não planeta isolado |
| Raio equatorial Terra | 6378,1366 km | JPL [F02]; usar esfera com esse raio é uma simplificação |
| Raio médio Lua | 1737,4 km | JPL [F03] |
| Distância Terra–Lua de referência | 384400 km | NASA [F04]; não é distância instantânea |
| c | 299792458 m/s | JPL/CODATA [F01] |
| 1 au | 149597870700 m | JPL/IAU [F01] |
| Dia sideral médio terrestre | 86164,09054 s | JPL [F01]; diferente de 24 horas |
| Irradiância solar de referência a 1 au | 1361 W/m² | NASA [F05]; perpendicular aos raios, fora da atmosfera |
| g₀ na definição de Isp | 9,80665 m/s² | aceleração padrão; não é gravidade local lunar |

Recomendação de unidades internas: m, s, kg, rad, W, Wh, bit/s e byte. Evitar alternar km e m silenciosamente. O g₀ de Isp continua terrestre mesmo em manobras na Lua.

## 3. Kepler e a referência LEO a 500 km

Para órbita circular de raio r = R + h:

$$v_c=\sqrt{\mu/r},\qquad n=\sqrt{\mu/r^3},\qquad T=2\pi\sqrt{r^3/\mu}.$$

Para elipse:

$$v^2=\mu(2/r-1/a),\qquad M(t)=M_0+n(t-t_0),\qquad E-e\sin E=M.$$

Essas equações são de dois corpos; não incluir implicitamente arrasto, J₂, manobras ou perturbações lunares. Uma órbita polar tem i = 90°; isso não a torna automaticamente heliossíncrona [F06].

**Resultados calculados independentemente para uma Terra esférica, h = 500 km, e = 0:**

| Grandeza | Resultado |
|---|---:|
| Raio geocêntrico | 6878,1366 km |
| Velocidade circular | 7,61261 km/s |
| Período | 94,6163 min |
| Eclipse máximo do modelo cilíndrico, β = 0° | 35,7537 min |
| Trecho iluminado nesse caso | 58,8625 min |
| β crítico sem eclipse | aproximadamente 68,0187° |

β é o ângulo entre a direção do Sol e o plano orbital. Não é inclinação, latitude ou estação do ano. Para Sol distante e sombra cilíndrica:

$$f_\mathrm{eclipse}=\frac{1}{\pi}\arccos\left(\frac{\sqrt{r^2-R^2}}{r\cos\beta}\right)$$

quando |β| < arcsin(R/r); fora dessa condição, o eclipse é zero. Em β = 0, a expressão reduz a arcsin(R/r)/π. A NASA descreve a dependência de eclipse com β e altitude [F07].

No passo de simulação, é mais útil testar geometria: com posição relativa r e direção unitária para o Sol s, há sombra cilíndrica quando r·s < 0 e a distância ao eixo de sombra, ||r − (r·s)s||, é menor que R. Usar um teste por corpo ocultador quando relevante.

**Não transportar esses horários para a agenda original.** Eles são casos verificáveis do laboratório. Para prever passagens por Rio Verde seria necessário definir época, inclinação, nó ascendente, fase, estação e referencial. “Uma passagem de 8 minutos a cada órbita” não é uma propriedade geral de uma estação terrestre.

## 4. Energia por tempo: W, Wh, sombra e bateria

Duas formas corretas, mutuamente exclusivas, de representar o painel:

$$P_\mathrm{solar}=S_0(1\mathrm{au}/d_\odot)^2 A_\mathrm{ativa}\eta_\mathrm{célula}
\max(0,\hat n\cdot\hat s)\,k_\mathrm{demais}\,I_\mathrm{sol}$$

ou, se a entrada já é potência elétrica nominal:

$$P_\mathrm{solar}=P_{\mathrm{el,ref}}(d_\mathrm{ref}/d_\odot)^2
\max(0,\hat n\cdot\hat s)\,k_\mathrm{relativo}\,I_\mathrm{sol}.$$

Não aplicar η da célula na segunda forma. Registrar quais efeitos estão incluídos na ficha nominal para não repetir temperatura, radiação, regulador ou fator de preenchimento. A NASA apresenta células espaciais próximas de 30% e destaca ausência de geração em eclipse e degradação durante a missão [F08].

Se Pnet = Pgeração − Pcarga, com Δt em segundos:

$$E_{k+1}=E_k+\left[\eta_c\max(P_\mathrm{net},0)
-\frac{\max(-P_\mathrm{net},0)}{\eta_d}\right]\Delta t/3600.$$

Também limitar potência de carga/descarga, capacidade e SOC operacional. Se faltar energia durante um passo, calcular o instante da falta e desligar cargas conforme a política; simplesmente limitar E a zero depois de executar ciência cria energia fictícia. Excesso após bateria cheia é energia descartada, não capacidade adicional.

O rádio consome potência elétrica DC; a potência irradiada RF é só uma parte dela. Se o catálogo informa consumo elétrico total do transmissor, não somar novamente seus watts de RF. Cargas incrementais devem ser distinguidas de modos que já incluem o consumo do barramento.

**Caso didático de verificação, sem representar produto comercial:**

| Entrada | Valor |
|---|---:|
| Área ativa do painel | 0,050 m² |
| Eficiência da célula | 0,30 |
| Fator restante de geração | 0,80 |
| Apontamento em Sol | normal ao Sol, cosθ = 1 |
| Barramento ligado | 5 W |
| Instrumento, adicional | 14 W por 5 min |
| Rádio DC, adicional | 10 W por 6 min |
| Bateria | 20 Wh; SOC permitido 20% a 100% |
| Eficiência carga/descarga | 0,95 em cada sentido |

No caso LEO acima: potência solar = 16,332 W; geração bruta por órbita = 16,022 Wh; consumo desse perfil = 10,051 Wh. Eclipse só com barramento requer 3,136 Wh retirados da bateria; se contiver os seis minutos de rádio, 4,189 Wh. A bateria tem 16 Wh na faixa utilizável. Esses totais são verificações de escala; a integração temporal ainda decide SOC, recarga e limites de pico.

Reduzir a área a 0,025 m² fornece somente 8,011 Wh brutos por órbita nesse mesmo caso: há déficit antes mesmo das perdas de recarga. Aumentar a bateria posterga a falha, mas não resolve um déficit energético recorrente.

Os cinco minutos de instrumento e seis de rádio são um perfil de teste. A campanha só deve executar observações e downlinks permitidos por sua agenda ou geometria; não prometer sobrevoo do Cerrado a cada órbita.

## 5. Contatos, Friis e taxa de dados

Separar três condições: visada geométrica; serviço de estação disponível; link RF suficiente. Estar acima do horizonte não garante estação agendada, compatibilidade de rádio ou taxa máxima.

Em uma esfera de raio R, satélite de raio r, elevação mínima ε:

$$\rho=\sqrt{r^2-R^2\cos^2\epsilon}-R\sin\epsilon.$$

Em LEO a 500 km, a distância inclinada varia de 500 km no zênite a 1695,09 km em elevação de 10°. Uma passagem exatamente sobre uma estação fixa, desprezando rotação terrestre, dura aproximadamente 7,383 min acima de 10°. Isso é um caso geométrico ideal, não duração universal de contato.

Para computar a elevação, colocar estação e espaçonave no mesmo referencial: com u sendo a direção local vertical da estação e l a direção unitária estação→espaçonave, ε = arcsin(u·l). Na Lua, também testar a interseção do segmento de rádio com o corpo lunar. Estação na Terra ainda precisa satisfazer seu próprio horizonte.

Friis, com ganhos lineares e perda multiplicativa L ≥ 1:

$$P_r=P_t G_tG_r\left(\frac{c}{4\pi df}\right)^2/L.$$

Em decibéis:

$$L_\mathrm{FS}=20\log_{10}(4\pi df/c),$$
$$P_r[\mathrm{dBW}]=P_t[\mathrm{dBW}]+G_t[\mathrm{dBi}]+G_r[\mathrm{dBi}]-L_\mathrm{FS}-L_\mathrm{outros}.$$

$$N_0=10\log_{10}(k_BT_\mathrm{sys})\ [\mathrm{dBW/Hz}],$$
$$C/N_0=P_r-N_0,\qquad E_b/N_0=C/N_0-10\log_{10}(R_b).$$

O relatório JPL 90-27 explicita a relação de C/N₀ com EIRP, perda de espaço livre, G/T e constante de Boltzmann [F09]. A NASA detalha os compromissos de frequência, abertura, atmosfera e apontamento [F10–F11].

Para uma abertura circular idealizada:

$$G=\eta_\mathrm{ap}\left(\pi D/\lambda\right)^2.$$

Logo: frequência maior aumenta a perda com ganhos fixos, mas também aumenta ganho para uma abertura física fixa. Esse é o motivo pelo qual “frequência mais alta perde mais” e “antena de mesmo tamanho ganha mais” podem ser verdadeiros ao mesmo tempo. Antena de maior ganho também exige melhor apontamento.

Taxa permitida = menor entre capacidade do equipamento, limite da largura de banda/modulação e limite do orçamento de Eb/N₀. Não usar Shannon como taxa automaticamente alcançável; não usar o mesmo Eb/N₀ mínimo para todas as modulações/códigos como se fosse um fato.

**Caso didático LEO para validar cálculos:** f = 2,2 GHz; Pt RF = 2 W; Gt = 2 dBi; Gr = 30 dBi; perdas agregadas = 3 dB; Tsys = 300 K; d = 1695,09 km. Resultado: FSPL = 163,880 dB; Pr = −131,870 dBW; C/N₀ = 71,958 dBHz. A 1 Mbit/s, Eb/N₀ = 11,958 dB. Se o código fictício exige 4 dB, a margem é 7,958 dB. Os 4 dB são parâmetro do exemplo, não requisito universal.

Uma taxa bruta de 1 Mbit/s com eficiência de protocolo de 0,8 por 6 min transporta 36 MB decimais. Definir se a taxa já é líquida antes de aplicar overhead; não descontar codificação duas vezes. Bytes, bits, MB e MiB devem aparecer consistentemente.

## 6. Latência, memória e ciência entregue

$$t_\mathrm{prop}=d/c.$$

Em LEO de 500 km, o tempo de propagação unidirecional no exemplo varia de 1,668 a 5,654 ms. A 384400 km, é 1,282 s. O número usual de 1,3 s lunar refere-se à propagação, não ao ciclo completo de operação; processamento, fila e disponibilidade de estação acrescentam tempo. NASA informa aproximadamente 3–22 min para comandos Terra–Marte conforme a geometria [F12].

Contrato recomendado de pacote: ID único, origem, instante de aquisição, tamanho, bytes transmitidos, qualidade, valor de ciência, instante final de recepção. Estados distintos: coletado → armazenado → em transmissão → em propagação → recebido. Só conceder ciência na recepção completa; retransmissões não pontuam outra vez.

Preservar memória finita, transferências parciais, interrupção de contato, política de descarte e tempo de emissão do último bit. O último bit chega após a duração da transmissão mais a propagação. Uma atividade enviada da Terra também só pode começar após chegada do comando, quando esse nível de detalhe estiver habilitado.

Invariantes: bytes únicos entregues ≤ adquiridos; ciência entregue não diminui nem cresce por repetição do mesmo pacote; não transmitir sem contato/potência; memória nunca negativa nem acima da capacidade; só executar uma coleta quando suas condições são válidas.

Para os seis registros MODIS existentes, conservar dados e procedência. Tratar uso em missão CubeSat como cenário educacional. Os limites do instrumento fictício e seu tamanho de arquivo não devem ser apresentados como características reais de MODIS. Visível/refletido depende de iluminação; sensores térmicos de emissão podem observar à noite. Não impor “somente de dia” a todo payload.

## 7. Delta-v, propelente e extensão lunar

Para um estágio com Isp constante e queima impulsiva ideal:

$$\Delta v_\mathrm{cap}=I_{sp}g_0\ln(m_0/m_f),$$
$$m_\mathrm{após}=m_\mathrm{antes}\exp[-\Delta v/(I_{sp}g_0)].$$

A NASA apresenta essa relação e suas hipóteses [F13]. Usar logaritmo natural e massas do mesmo veículo/estágio; massa final inclui tudo que permanece a bordo, inclusive propelente reservado. Não deduzir um consumo percentual constante por manobra. Custos de gravidade/arrasto do lançador não desaparecem na equação ideal.

Contrato do lançador: capacidade de massa e envelope, órbita/energia entregue, responsabilidade pelo estágio de transferência e preço didático ou cotação identificada. Para escape, C₃ = v∞²; tabelas de capacidade em LEO não podem ser reutilizadas como capacidade para Marte. Para transferências ligadas à Terra, C₃ entendido como duas vezes a energia específica pode ser negativo; não tirar raiz de C₃ negativo [F14].

**Segunda campanha recomendada:** orbitador lunar polar a 100 km, começando após entrega em transferência translunar. Evita adicionar pouso, solo, navegação terminal e sobrevivência de um rover antes de estabilizar operações orbitais.

Uma experiência educativa pode usar uma elipse terrestre com perigeu a 200 km e apogeu em 384400 km:

$$a_t=(r_1+r_2)/2,\quad
\Delta v_\mathrm{TLI}=\sqrt{\mu_E(2/r_1-1/a_t)}-\sqrt{\mu_E/r_1},$$
$$t_t=\pi\sqrt{a_t^3/\mu_E}.$$

Resultados: Δv TLI = 3,131 km/s; tempo = 4,978 dias. **Isso é uma aproximação de transferência mínima simplificada, não a trajetória de Apollo nem uma solução de encontro lunar validada.**

Na aproximação coplanar e tangencial, velocidade relativa de chegada ≈ 0,832 km/s. Para captura diretamente em círculo lunar de 100 km:

$$\Delta v_\mathrm{LOI}=\sqrt{v_\infty^2+2\mu_M/r_p}-\sqrt{\mu_M/r_p},$$

resultando ≈ 0,822 km/s. Fase, plano de chegada e geometria favorável à órbita polar são hipóteses do cenário. Não adicionar gratuitamente uma rotação de plano de 90°. Uma alteração separada de plano em velocidade v custa 2v sin(Δi/2) no caso ideal.

Separar no painel: serviço de lançamento/TLI; LOI da espaçonave; correções; manutenção; reserva. Correções e manutenção não receberam aqui valores “NASA”: se for necessário, selecionar uma reserva didática transparente. Exemplo de Isp = 320 s e requisito total de 1000 m/s demanda fração ideal de propelente de 27,29%; Isp e requisito são escolhas do exercício.

Na órbita lunar de 100 km: v = 1,63350 km/s; T = 117,791 min; eclipse por sombra lunar em β = 0 = 46,469 min. **Também existem eclipses causados pela Terra.** Um documento NASA de ambientes inclui, para seu caso de 26/06/2029 e altitude lunar de 100 km, até 233 min sem fluxo solar [F15]. Não transformar esse caso em frequência universal, nem dimensionar uma missão longa só pelo eclipse de 46 min.

Regiões polares de superfície não recebem Sol continuamente por definição: topografia cria iluminação prolongada e sombras permanentes [F17]. Isso não deve ser confundido com o eclipse de um orbitador. Para ciência lunar, uma câmera comum não revela automaticamente gelo em sombra permanente. O payload e sua condição de observação devem corresponder à tarefa científica.

## 8. MMRTG: o que é fato, e o que é modelo

- NASA/JPL documenta cerca de **110 W elétricos no início da missão**, aproximadamente **45 kg**, declínio de alguns por cento por ano e projeto para pelo menos 14 anos [F18]. A potência térmica é muito maior; não confundir W térmicos e elétricos.
- Uma ficha de configuração mais antiga informa 43,6 kg e 1975 W térmicos [F19]. Não tratar 43,6 e 45 como uma contradição que exige “média”: versão/configuração/arredondamento precisam acompanhar o dado.
- Pu-238 possui meia-vida de aproximadamente 87,7–88 anos [F20]. Isso descreve decaimento do combustível; **a saída elétrica também cai com envelhecimento dos conversores**.
- NASA/TM-2019-219935 usa dados de Curiosity para discutir cerca de 4,8%/ano, incluindo aproximadamente 0,8% de decaimento e 4% de degradação termelétrica [F21]. Não apresentar 4,8% como taxa garantida universal para todo MMRTG.
- Se o exercício adotar P(t) = 110 × 0,952ᵗ, rotular como modelo anual composto de referência histórica. Não multiplicar novamente pelo decaimento de Pu-238. Ele resulta em cerca de 55,25 W após 14 anos; somente a meia-vida daria 98,48 W, diferença educacional relevante.
- Não há nesta pesquisa evidência para preço corrente universal por unidade. A solicitação NASA New Frontiers de 2016 apresentou custos para propostas de US$ 103 milhões para um MMRTG, US$ 133 milhões para dois e US$ 163 milhões para três, em dólares FY2015, com custos de aprovação incluídos [F22]. Isso demonstra contexto de programa e custos não lineares; não é tabela de varejo de 2026.

MMRTG não é uma opção proporcional ao CubeSat LEO atual. Pode ser objeto de comparação no laboratório ou extensão de superfície/Marte. Não converter o catálogo existente em “hardware nuclear de 45 kg para o mesmo CubeSat”.

## 9. Margens: evitar falsa autoridade

O documento ARC-STD-8070.1 para sistemas classes C/D lista margens de massa seca por revisão: SRR 30%, PDR 20%, CDR 15% e SIR 5%, com condições para hardware de herança [F24]. Sua fórmula é:

$$margem\%=100\frac{alocação-CBE}{alocação}.$$

Isso não equivale a “adicionar 20% ao CBE”. Se CBE = 100 kg, uma margem de 20% da alocação exige 125 kg de alocação; adicionar 20% ao CBE resulta em 120 kg. Mostrar o denominador. Não generalizar margens de massa para potência, dados, propulsão ou custo.

No jogo, separar “reserva escolhida no cenário” de “regra publicada para determinado programa”. Indicadores melhores: SOC mínimo, memória máxima ocupada, margem RF durante contato, propelente restante e capacidade do lançamento. Uma média positiva em W não prova sobrevivência no eclipse.

## 10. Motor temporal futuro, sem substituir a agenda atual

Uma arquitetura pequena e verificável:

1. Relógio da simulação independente de animação; cenário e semente reprodutíveis.
2. Provedor de eventos/geometria: agenda existente, ou órbita analítica para laboratório. Ambos entregam sol/sombra, alvos visíveis e contatos ao mesmo contrato.
3. Máquina de modos: espera, coleta, transmissão, carga, proteção. Regras de simultaneidade e apontamento explícitas.
4. Em cada passo: determinar eventos e modos válidos; calcular geração/cargas; limitar atividades pela energia disponível; integrar energia e bytes; agendar recepções; atualizar ciência apenas ao receber.
5. Separar passos nos limites de contato, eclipse, conclusão de pacote e esgotamento de bateria. Passo inicial de 10 s é uma escolha de desempenho; validar contra 1 s.
6. Registrar ledger de energia, bytes e eventos. Renderização lê o estado; FPS não altera resultado.

Não é necessário integrar numericamente forças para ensinar Kepler: propagação analítica de dois corpos evita deriva. Se futuramente usar SGP4, não misturar elementos médios TLE com elementos osculadores de um Kepler simplificado, nem referencias TEME/J2000 sem conversão.

**Testes de alto valor para o laboratório:**

- r₁ = r₂ produz transferência Hohmann com Δv = 0.
- Δv = 0 não consome propelente; aumentar massa seca reduz capacidade para o mesmo propelente; queima nunca consome massa seca.
- Período e velocidade reproduzem as referências LEO/lunar acima.
- β = 0 dá maior eclipse do modelo; acima do β crítico o eclipse é zero.
- Painel fora do Sol ou voltado de costas gera zero; dobro da área dobra potência; dobro da distância ao Sol reduz potência a um quarto.
- 10 W por 360 s = 1 Wh; carga/descarga com perdas não cria energia; trocar potência elétrica nominal por área/eficiência equivalente produz o mesmo resultado.
- Dobrar distância do link aumenta FSPL em 6,0206 dB; dobrar potência RF aumenta potência recebida em 3,0103 dB; dobrar taxa reduz Eb/N₀ em 3,0103 dB.
- Sem contato, sem transmissão; pacote parcial não pontua; retransmissão não duplica ciência; latência aumenta linearmente com distância.
- Resultado em passos de 10 s converge ao de 1 s; mesmos eventos e decisões com FPS diferente.
- Casos impossíveis falham com causa específica: energia, memória, massa, ausência de contato ou link insuficiente.

O motor existente já tem testes próprios e oracle independente segundo a frente principal; estes são testes para o novo laboratório, não uma exigência de reescrever o que passou.

## 11. Bibliotecas e repositórios validados

| Projeto | Verificado | Uso apropriado |
|---|---|---|
| nasa/muscat | Repositório público NASA; MuSCAT, simulação de baixa fidelidade e autonomia; MATLAB, MICE/SPICE e arquivos auxiliares; Apache-2.0 [F25] | Referência de separação ambiente/subsistemas, múltiplas escalas de tempo e ciência. Não é pacote JS pronto. |
| nasa/cml | Repositório público NASA; C++ para Trick/JEOD; licença NASA Open Source Agreement 1.3 [F26–F27] | Referência de modelos e verificação. Não confundir CML com catálogo de massas/custos. |
| cosinekitty/astronomy | Projeto original Astronomy Engine; MIT; JavaScript/TypeScript entre implementações; precisão alvo de cerca de 1 minuto de arco [F28] | Direções aproximadas de Sol/Lua/planetas e eventos educacionais. O próprio autor diz que não basta para navegação de espaçonaves. |
| shashwatak/satellite-js | Projeto original; MIT; SGP4/SDP4, TLE/OMM, transformações e utilidades [F29] | Visualização de satélites terrestres a partir de elementos apropriados. Não é propagador genérico de missões lunares/interplanetárias. |

CML recomenda releases oficiais porque commits intermediários podem não ter verificação formal concluída; a maturidade é documentada por modelo [F26]. Usar código NASA não certifica automaticamente uma implementação derivada. Para o MVP, uma implementação pequena das equações do laboratório é mais simples que incorporar MATLAB/C++ ou compilar um simulador inteiro.

## 12. Extensão Marte

Manter a mesma camada de energia, contato, memória e ciência. Acrescentar geometria heliocêntrica, chegada/captura e interrupções de comunicação por conjunção solar quando essa fidelidade for desejada.

O modelo circular coplanar com Terra a 1 au e Marte a 1,52371034 au [F30] produz transferência Hohmann de aproximadamente 258,87 dias; v∞ de saída terrestre ≈ 2,945 km/s; v∞ de chegada marciana ≈ 2,649 km/s. Não somar os dois como se fossem as queimas locais de saída/captura: cada uma depende da gravidade e da órbita junto ao planeta. Não prometer que 259 dias é a duração real de qualquer missão.

Irradiância no raio orbital médio adotado ≈ 586,21 W/m², cerca de 43% da terrestre. Esse é fluxo fora da atmosfera; painéis em superfície também dependem de atmosfera, poeira, estação e ângulo. Latência deve vir de distância instantânea; Terra e Marte não permanecem a uma distância fixa. MMRTG se torna uma comparação útil, sem eliminar bateria para picos de carga.

## 13. Fontes primárias consultadas

Todas as fontes físicas são NASA/JPL. Os quatro repositórios foram consultados nos canais dos próprios mantenedores. Datas de pesquisa não substituem datas originais dos documentos.

| ID | Fonte / URL | Data de consulta |
|---|---|---|
| F01 | JPL, Astrodynamic Parameters — https://ssd.jpl.nasa.gov/astro_par.html | 14/11/2026 |
| F02 | JPL, Planetary Physical Parameters — https://ssd.jpl.nasa.gov/planets/phys_par.html | 14/11/2026 |
| F03 | JPL, Satellite Physical Parameters — https://ssd.jpl.nasa.gov/sats/phys_par/sep.html | 14/11/2026 |
| F04 | NASA, Moon Facts — https://science.nasa.gov/moon/facts/ | 14/11/2026 |
| F05 | NASA GSFC, Solar Irradiance Science — https://earth.gsfc.nasa.gov/climate/projects/solar-irradiance/science | 14/11/2026 |
| F06 | NASA, Basics of Space Flight, Planetary Orbits — https://science.nasa.gov/learn/basics-of-space-flight/chapter5-1/ | 14/11/2026 |
| F07 | NASA Thermal Control Engineering Guidebook — https://ntrs.nasa.gov/api/citations/20230013900/downloads/NASA%20Thermal%20Control%20Engineering%20Guidebook%20v4.pdf | 14/11/2026 |
| F08 | NASA, Small Spacecraft Technology, Power — https://www.nasa.gov/smallsat-institute/sst-soa/power-subsystems/ | 14/11/2026 |
| F09 | JPL Publication 90-27, equação de C/N₀ — https://ntrs.nasa.gov/api/citations/19910002641/downloads/19910002641.pdf | 14/11/2026 |
| F10 | NASA, Small Spacecraft Technology, Communications — https://www.nasa.gov/smallsat-institute/sst-soa/soa-communications/ | 14/11/2026 |
| F11 | NASA, Ground Data Systems and Mission Operations — https://www.nasa.gov/smallsat-institute/sst-soa/ground-data-systems-and-mission-operations/ | 14/11/2026 |
| F12 | NASA, Speaking Percy's Language — https://science.nasa.gov/blog/speaking-percys-language-how-to-talk-so-perseverance-will-listen/ | 14/11/2026 |
| F13 | NASA Glenn, Ideal Rocket Equation — https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/ideal-rocket-equation/ | 14/11/2026 |
| F14 | JPL, NEO Deflection App Handbook, definição C₃ — https://cneos.jpl.nasa.gov/nda/nda_handbook_v6.pdf | 14/11/2026 |
| F15 | NASA SLS-SPEC-159, eclipse lunar de referência — https://ntrs.nasa.gov/api/citations/20190027643/downloads/20190027643.pdf | 14/11/2026 |
| F16 | NASA SSRI, Mission Simulation and Analysis — https://s3vi.ndc.nasa.gov/ssri-kb/topics/2/ | 14/11/2026 |
| F17 | NASA, South Pole Illumination Map — https://science.nasa.gov/photojournal/south-pole-illumination-map/ | 14/11/2026 |
| F18 | JPL, Perseverance Launch Press Kit, Power — https://www.jpl.nasa.gov/news/press_kits/mars_2020/launch/mission/spacecraft/power/ | 14/11/2026 |
| F19 | NASA, Mars 2020 MMRTG presentation — https://www.nasa.gov/wp-content/uploads/2015/08/4_mars_2020_mmrtg.pdf | 14/11/2026 |
| F20 | NASA, About Plutonium-238 — https://science.nasa.gov/planetary-science/programs/radioisotope-power-systems/about-plutonium-238/ | 14/11/2026 |
| F21 | NASA/TM-2019-219935 — https://ntrs.nasa.gov/api/citations/20200000369/downloads/20200000369.pdf | 14/11/2026 |
| F22 | NASA NF4, anúncio 07/11/2016 e tabela FY2015 — https://newfrontiers.larc.nasa.gov/NF4/announcements.html | 14/11/2026 |
| F23 | NASA MODIS, Technical Specifications — https://modis.gsfc.nasa.gov/about/specifications.php | 14/11/2026 |
| F24 | NASA ARC, Space Flight System Design and Environmental Test — https://www.nasa.gov/sites/default/files/atoms/files/std8070.1.pdf | 14/11/2026 |
| F25 | NASA MuSCAT — https://github.com/nasa/muscat | 14/11/2026 |
| F26 | NASA CML docs — https://nasa.github.io/cml/ | 14/11/2026 |
| F27 | NASA CML license — https://github.com/nasa/cml/blob/main/LICENSE | 14/11/2026 |
| F28 | Astronomy Engine — https://github.com/cosinekitty/astronomy | 14/11/2026 |
| F29 | Satellite.js — https://github.com/shashwatak/satellite-js/blob/develop/README.md | 14/11/2026 |
| F30 | JPL, Approximate Positions of the Planets — https://ssd.jpl.nasa.gov/planets/approx_pos.html | 14/11/2026 |
| F31 | NASA, Basics of Space Flight, Trajectories — https://science.nasa.gov/learn/basics-of-space-flight/chapter4-1/ | 14/11/2026 |

Fórmulas e resultados numéricos deste relatório foram recomputados localmente em Python, sem dependência dos valores exibidos pelo jogo. São casos de validação do modelo declarado.
