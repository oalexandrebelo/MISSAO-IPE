# Missão Ipê — English copy for seven pitch slides

**Production note — not a slide.** This is English copy for assembling or exporting a seven-slide deck. It follows the seven `data-pitch="true"` sections, `quadro-01` through `quadro-07`, in `presentation/src/template.html`. It does not translate the HTML automatically, constitute an exported deck, or establish that the submission platform accepts this format. Presenter notes below are not additional slides. The separate 30-second script is maintained elsewhere in the presentation package.

**Evidence basis:** engine `0.1.1-rd`, catalog `ipe-64-v1`, `src/core/catalog.ts`, `tests/engine.test.mts`, `tests/adversarial.test.mts`, and `docs/09-VERIFICACAO.md`. This copy preserves the scope and chronology recorded in the project. It does not report new testing.

## Slide 1 — How much science reaches the ground?

**HTML section:** `quadro-01`

**On-slide copy**

MISSÃO IPÊ / SCIENCE DELIVERED

**How much science reaches the ground?**

A game about the decisions that turn space data into usable results.

AB · Product design with a technical foundation

Hackatur–Zer0Slop · Educational R&D · 14 November 2026

**Illustration labels**

- 6 results
- THE OBJECTIVE IS ON THE GROUND
- CONCEPTUAL DIAGRAM · FIXED ORBIT
- AI-GENERATED ILLUSTRATION

**Presenter notes**

Open with the receiving end of the mission. A full onboard memory is not the same as a useful scientific result delivered to a user. The question drives the game: which design gets all six valid results to the ground?

Describe this as an educational research prototype. Project-specific work began before the published local event start. Event eligibility has not been established; recording that chronology does not resolve it. The illustration is conceptual, and the orbit is fixed in the implemented model.

## Slide 2 — A mission ends with its user

**HTML section:** `quadro-02`

**On-slide copy**

01 / OBJECTIVE

**A mission ends with its user.**

**6 complete, valid NDVI results**

Three requested coordinates near Rio Verde. Two MOD13Q1.061 composites from 2024.

The game uses archived data to answer one fixed scientific question. The educational satellite does not acquire MODIS data during its simulated 180-minute mission.

| Mission segment | Display label |
|---|---|
| Launch | Fixed envelope |
| Space | Onboard resources |
| Ground | Complete reception |
| User | NDVI + quality |

Only a fully received record with accepted quality and verified NDVI counts toward the objective.

**Source footer**

NASA/ORNL DAAC archived data. NASA mission-design references inform the mission structure. Operational resources and parameters are educational assumptions.

**Presenter notes**

The six records combine three requested coordinates with two archived composites. Those coordinates should not be presented as precise pixel centers. The game checks the received data against its declared quality policy and NDVI calculation; “accepted quality” does not mean that the sample has the highest possible NASA quality rating.

RED and NIR support the same NDVI objective in both representations. Transmitting bands and transmitting a derived index are two ways to answer that fixed question. The assigned payload sizes and simulated schedule are model assumptions, separate from the scientific measurements and the JSON file sizes. The samples are not current observations or evidence of crop yield, agricultural diagnosis, or a regional trend.

NASA provenance is documented. Inclusion of a qualifying NASA source in the selected challenge's official Resources list remains unconfirmed. Do not describe this slide as proof that the competition data requirement has been satisfied.

## Slide 3 — Six choices affect one another

**HTML section:** `quadro-03`

**On-slide copy**

02 / DESIGN

**Six choices affect one another.**

2 × 2 × 2 × 2 × 2 × 2 = **64 configurations per scenario**

| Choice | Option A | Option B |
|---|---|---|
| Battery | 16 Wh | 24 Wh |
| Solar panel | 12 W | 18 W |
| Processing | RED/NIR bands | NDVI index |
| Radio | Economy | Fast |
| Memory | 512 Mbit | 1,536 Mbit |
| Contact policy | Every contact | Last contact |

**3.6 kg** maximum mass · **86 credits** available

A more capable component also changes mass, power demand, or cost.

**Source footer**

Catalog `ipe-64-v1`. Launch vehicle, orbit and each scenario's schedule are fixed. These limits are educational assumptions, not a real CubeSat specification.

**Presenter notes**

Keep the explanation focused on coupled decisions. The battery options differ in both stored energy and allowable discharge power. The NDVI-index option reduces the assigned transmission payload while increasing the processing job's power demand. Choosing one apparently better component can expose another limit.

There are six binary design choices, hence 64 configurations in each of the two contact scenarios. The scenario selector changes the contact schedule; it does not add a seventh design choice to the catalog. The mission's scientific objective stays fixed.

## Slide 4 — Shorter contacts leave science on board

**HTML section:** `quadro-04`

**On-slide copy**

03 / EXPERIMENT

**Shorter contacts leave science on board.**

| Same starting design | Long contacts | Short contacts |
|---|---:|---:|
| Available windows | 2 × 600 s | 2 × 240 s |
| Complete, usable results | **6/6** | **2/6** |

The same configuration gets less transmission time. A partially received record does not yet deliver a scientific result.

**Source footer**

Starting design: 16 Wh battery, 18 W panel, RED/NIR bands, economy radio, large memory, every contact. Results from the implemented mission engine.

**Presenter notes**

Only the contact duration changes between these two runs. Use the long-contact and short-contact baseline presets so the audience sees a controlled comparison. The long scenario uses two 600-second windows; the short scenario uses two 240-second windows.

The six scientific records and the question remain the same. In the short scenario, partial transmission can be preserved between contacts, but only complete, valid records count as delivered science. Do not describe the change from 6/6 to 2/6 as a decline in the underlying vegetation measurements. It is a delivery outcome in the educational model.

## Slide 5 — A repair starts with a hypothesis

**HTML section:** `quadro-05`

**On-slide copy**

04 / LIVE DEMONSTRATION

**A repair starts with a hypothesis.**

Same mission engine · Local execution

| Demonstration case | Observed result |
|---|---|
| 1. Long-contact baseline | **6/6 delivered** |
| 2. Short-contact baseline | **2/6 delivered** |
| 3. Change only to NDVI index | **Power-limit failure at 600 s** |
| 4. Larger battery + NDVI index | **6/6 delivered** |

**Less data to send. More power to process it.**

Assigned payload: **180 → 60 Mbit per record**

Total processing-job load: **26 → 38 W**

**Control labels**

- Contact scenario
- Long contacts · 2 × 600 s
- Short contacts · 2 × 240 s
- Run configuration
- Usable records
- Received · Final queue · Final energy · Job load
- Inspect energy in the trace
- Events and rules behind the result

**Source footer**

Payload volumes, processing loads and hardware limits are educational assumptions. The trace shows states calculated by the engine; moving the inspection control does not change the simulation.

**Presenter notes**

Run the short-contact baseline, then change only processing to NDVI index. The game stops at the first processing job, at 600 seconds, with a peak-power violation. This is a limit on instantaneous discharge power, not evidence that the battery has run out of stored energy. The isolated change produces no completed records before termination.

In this model, processing with the 18 W panel provides 9.9 W of solar power during the job. The 38 W job therefore draws approximately 29.58 W from the battery after the declared 95% discharge efficiency. That exceeds the 16 Wh battery's 20 W discharge limit. The 24 Wh battery permits 35 W of discharge, so the paired change addresses the power bottleneck while the NDVI-index representation reduces the transmission workload.

Use the two-change preset only after showing the short baseline and the isolated index change, matching the HTML's interaction gate. Keep all other choices unchanged. The repaired short-contact run delivers 6/6 under the same scientific objective. If presenting a static export, show the recorded cases as results and call them a demonstration sequence; do not imply that the exported slide itself runs the engine.

## Slide 6 — The smallest redesign has evidence

**HTML section:** `quadro-06`

**On-slide copy**

05 / DECISION EVIDENCE

**The smallest redesign has evidence.**

**2 minimum changes from the short-contact baseline**

24 Wh battery + NDVI index

**64 configurations evaluated**

9 successful · 49 failed · 6 invalid

The baseline and every one-change alternative fail. The two-change design delivers **6/6**.

**Interaction labels**

- Enumerate 64 configurations
- Try the solution
- S · Success
- F · Failure
- I · Invalid
- Select a cell to inspect its configuration

**Source footer**

Minimum number of changed choices within this catalog and these assumptions. Complete enumeration does not establish a universal optimum for spacecraft design.

**Presenter notes**

The search evaluates all 64 short-contact configurations. It counts design changes relative to the starting design, not money spent, physical battery size, component count, or development effort. There are seven configurations at distance zero or one: the baseline plus six single-choice changes. None succeeds. The 24 Wh battery plus NDVI index is the only successful configuration at distance two in the current catalog.

There are nine successful designs overall, so do not call the minimum-change witness the only working design. Six configurations violate the static envelope; they are reported as invalid rather than hidden. The current evidence has no indeterminate cases. The independent verification described in the project documentation covers both 64-configuration scenarios; the display here focuses on short contacts.

## Slide 7 — A decision should explain its outcome

**HTML section:** `quadro-07`

**On-slide copy**

MISSÃO IPÊ / SCIENCE DELIVERED

**A decision should explain its outcome.**

Predict the bottleneck. See what arrived. Redesign with a reason.

**Open the local game**

Explore the science and evidence · Read the project dossier

Educational prototype using archived NASA data.

Participant research and validation on the target equipment remain pending.

Project-specific development began before the event. Event eligibility and confirmation of the official challenge Resources list remain unresolved.

**Package footer**

The game and dossier links require the complete ZIP with its folder structure preserved. The standalone HTML retains the presentation and its demonstrator.

**Presenter notes**

Close on the intended learning behavior: a player makes a prediction, inspects a causal result, and explains a redesign. That is a research objective, not a measured learning gain. Automated checks and catalog enumeration support the implemented model; they do not establish classroom effectiveness, flight validity, or performance on AB's hardware.

Keep the two competition issues separate and visible. The GO Team requires at least one NASA source from the selected challenge's Resources list; this specific list has not been recovered and confirmed for the delivery. The documented pre-event development also leaves eligibility unresolved. No organizer decision about this team has been observed, and neither disclosure nor a later export grants eligibility.

For global submission, the current Navigator guidance calls for English content, or English subtitles for a video in another language, and a short demonstration of no more than 30 seconds or seven slides including title and closing. This file supplies the English slide copy. The current submission guide and actual form still need to be checked; seven sections in an HTML file are not, by themselves, proof of an accepted submission format.

Retain the actual AI-use and source disclosures in the exported artifact or its accompanying project materials. Any AI-generated image or video needs a visible generation label under the retrieved GO Team guidance. Do not add NASA branding to generated visuals or describe the project as NASA-approved.

**Sources for presenter preparation — not an eighth slide**

- Resource and AI guidance, GO Team: https://github.com/nasa/spaceapps/discussions/1849
- Demonstration format, Navigator: https://github.com/nasa/spaceapps/discussions/1947
- Submission language, Navigator: https://github.com/nasa/spaceapps/discussions/1973
- Current guide links, GO Team: https://github.com/nasa/spaceapps/discussions/2028
- Start-time guidance, GO Team: https://github.com/nasa/spaceapps/discussions/1827
- Specifications/prompts clarification, GO Team response: https://github.com/nasa/spaceapps/discussions/2009
- Full documentary review: `research/11-revisao-spaceapps-apresentacao.md`
- Retrieval record and authority levels: `evidence/spaceapps-review-r5.json`
