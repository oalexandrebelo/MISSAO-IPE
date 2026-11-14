from pathlib import Path
import re, json, subprocess, textwrap, html, hashlib

ROOT=Path(__file__).resolve().parents[1]
ASSETS=ROOT/'docassets'; ASSETS.mkdir(exist_ok=True)
MANIFEST=[]
def q(s):return json.dumps(s,ensure_ascii=False)
def label(s):
    s=s.strip().strip('"')
    return '\n'.join(textwrap.wrap(s,28,break_long_words=False)) or s
def node(token,nodes):
    m=re.fullmatch(r'([A-Za-z_]\w*|\[\*\])(?:\[(.*)\]|\{(.*)\})?',token.strip())
    if not m: raise ValueError('Node '+token)
    id=m[1]; key='start' if id=='[*]' else id
    if key not in nodes:nodes[key]={'label':key,'shape':'box'}
    if id=='[*]':nodes[key]={'label':'','shape':'point'}
    elif m[2] is not None:nodes[key]={'label':label(m[2]),'shape':'box'}
    elif m[3] is not None:nodes[key]={'label':label(m[3]),'shape':'diamond'}
    return key
def render_graph(code,out):
    nodes={}; edges=[]
    state=code.startswith('stateDiagram')
    for line in code.splitlines()[1:]:
        line=line.strip()
        if not line or line.startswith('%%'):continue
        if state:
            m=re.fullmatch(r'(\w+|\[\*\])\s*-->\s*(\w+|\[\*\])(?:\s*:\s*(.*))?',line)
            if not m:raise ValueError('State line '+line)
            a=node(m[1],nodes);b=node(m[2],nodes); edges.append((a,b,m[3] or '',False))
        else:
            arrow=re.search(r'\s*(-->|-\.\s*"[^"]+"\s*\.->)\s*(?:\|([^|]+)\|)?\s*',line)
            if not arrow:
                node(line,nodes);continue
            a=node(line[:arrow.start()],nodes); b=node(line[arrow.end():],nodes)
            lab=arrow[2] or ''
            dotted=arrow[1].startswith('-.')
            if dotted:lab=re.search('"([^"]+)"',arrow[1])[1]
            edges.append((a,b,lab,dotted))
    dot=['digraph G {','graph [rankdir=TB,bgcolor="white",pad="0.15",nodesep="0.22",ranksep="0.30",margin="0"];',
         'node [fontname="DejaVu Sans",fontsize=12,style="rounded,filled",fillcolor="#EEF6F4",color="#68988E",fontcolor="#143D38",margin="0.12,0.09"];',
         'edge [fontname="DejaVu Sans",fontsize=10,color="#567A73",fontcolor="#274C45",arrowsize=0.65];']
    for k,v in nodes.items():
        if state and v['label']==k:v['label']=re.sub(r'(?<=[a-záéíóú])(?=[A-ZÁÉÍÓÚ])',' ',k)
        dot.append(f'{q(k)} [label={q(v["label"])},shape={q(v["shape"])}];')
    for a,b,l,d in edges:dot.append(f'{q(a)} -> {q(b)} [label={q(l)},style={q("dashed" if d else "solid")}];')
    dot.append('}')
    out.with_suffix('.dot').write_text('\n'.join(dot))
    for fmt in ['svg','png']:
        run=subprocess.run(['dot',f'-T{fmt}','-Gdpi=160','-o',str(out.with_suffix('.'+fmt))],
                           input='\n'.join(dot),text=True,capture_output=True,timeout=20)
        if run.returncode:raise RuntimeError(run.stderr)
    return len(nodes),len(edges)
def render_sequence(code,out):
    participants=[]; edges=[]
    for line in code.splitlines()[1:]:
        line=line.strip()
        p=re.fullmatch(r'participant (\w+) as (.*)',line)
        if p:participants.append((p[1],p[2]));continue
        if not line:continue
        m=re.fullmatch(r'(\w+)(--?>>?)(\w+):\s*(.*)',line)
        if not m:raise ValueError('Seq line '+line)
        edges.append((m[1],m[3],m[4],m[2].startswith('--')))
    w=1000;h=150+len(edges)*84
    positions={p[0]:130+i*(w-260)/(max(1,len(participants)-1)) for i,p in enumerate(participants)}
    svg=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">',
         '<defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#356C60"/></marker></defs>',
         f'<rect width="{w}" height="{h}" fill="white"/>',
         '<g font-family="DejaVu Sans,sans-serif" fill="#173E37" font-size="19">']
    for k,l in participants:
        x=positions[k]
        svg.extend([f'<rect x="{x-105}" y="20" width="210" height="50" rx="8" fill="#EEF6F4" stroke="#68988E"/>',
                    f'<text x="{x}" y="52" text-anchor="middle">{html.escape(l)}</text>',
                    f'<line x1="{x}" x2="{x}" y1="70" y2="{h-25}" stroke="#B5C7C1" stroke-dasharray="7 7"/>'])
    for i,(a,b,l,d) in enumerate(edges):
        y=130+i*84; x1=positions[a];x2=positions[b];dash='stroke-dasharray="7 5"' if d else ''
        if a!=b:
            svg.append(f'<line x1="{x1}" y1="{y}" x2="{x2}" y2="{y}" stroke="#356C60" stroke-width="2" {dash} marker-end="url(#arrow)"/>')
            tx=(x1+x2)/2;ty=y-14
        else:
            svg.append(f'<path d="M{x1},{y-20} L{x1+105},{y-20} L{x1+105},{y+17} L{x1},{y+17}" stroke="#356C60" stroke-width="2" fill="none" marker-end="url(#arrow)"/>')
            tx=x1+220;ty=y-18
        for j,l2 in enumerate(textwrap.wrap(l,44 if a!=b else 24)):
            svg.append(f'<text x="{tx}" y="{ty+j*22}" text-anchor="middle">{html.escape(l2)}</text>')
    svg.append('</g></svg>');out.with_suffix('.svg').write_text('\n'.join(svg))
    run=subprocess.run(['inkscape',str(out.with_suffix('.svg')),'--export-type=png','--export-width=1600','--export-filename='+str(out.with_suffix('.png'))],
                       capture_output=True,text=True,timeout=25)
    if run.returncode:raise RuntimeError(run.stderr)
    return len(participants),len(edges)
fence=chr(96)*3
for p in sorted((ROOT/'docs').glob('*.md')):
    for idx,b in enumerate(re.findall(fence+r'mermaid\s*\n(.*?)'+fence,p.read_text(),re.S),1):
        b=b.strip();out=ASSETS/f'{p.stem}-{idx:02d}'
        out.with_suffix('.mmd').write_text(b+'\n')
        n,e=render_sequence(b,out) if b.startswith('sequenceDiagram') else render_graph(b,out)
        MANIFEST.append({'document':'docs/'+p.name,'index':idx,'base':'docassets/'+out.name,'nodes':n,'edges':e,'sourceSha256':hashlib.sha256((b+'\n').encode()).hexdigest(),'renderer':'Graphviz 2D projection; sequence SVG generated from source messages'})
(ROOT/'evidence/diagram-rendering.json').write_text(json.dumps({'method':'Documentation diagrams only. Mermaid CLI browser launch unavailable in this environment; preserved Mermaid source and generated equivalent static diagrams with Graphviz/SVG. No game assets.','diagrams':MANIFEST},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'rendered':len(MANIFEST),'diagrams':[{'name':x['base'],'nodes':x['nodes'],'edges':x['edges']} for x in MANIFEST]},ensure_ascii=False))

