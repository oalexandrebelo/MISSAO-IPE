"""Render the round-four research and implementation dossier. No browser is required."""
from pathlib import Path
import base64, copy, hashlib, html, json, math, re, subprocess, textwrap
from datetime import datetime, timezone
from reportlab.platypus import (BaseDocTemplate, PageTemplate, Frame, Paragraph,
    Spacer, PageBreak, LongTable, TableStyle, Image, HRFlowable, CondPageBreak)
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from PIL import Image as PILImage
from matplotlib.mathtext import math_to_image
from matplotlib.font_manager import FontProperties

ROOT = Path(__file__).resolve().parents[1]
TMP = ROOT.parent/'tmp'/'ipe-r4-render'; TMP.mkdir(parents=True, exist_ok=True)
PDF = ROOT/'output/pdf/AB_Missao_Ipe_Dossie_Implementacao.pdf'; PDF.parent.mkdir(parents=True, exist_ok=True)
HTML = ROOT/'output/html/AB_Missao_Ipe_Estudo_Integral.html'; HTML.parent.mkdir(parents=True, exist_ok=True)
FILES = [ROOT/'README.md'] + sorted(p for p in (ROOT/'docs').glob('*.md') if not p.name.startswith('00-')) + sorted(p for p in (ROOT/'research').glob('*.md') if not p.name.startswith('00-'))
SHORT = [p.read_text().splitlines()[0].removeprefix('# ').strip() for p in FILES]
DOCS=[]
for idx,p in enumerate(FILES):
    run=subprocess.run(['pandoc','-f','markdown-smart+tex_math_single_backslash','-t','json',str(p)],
        text=True,capture_output=True,check=True)
    DOCS.append({'path':p,'id':f'cap-{idx:02d}','title':SHORT[idx],
        'ast':json.loads(run.stdout),'number':idx})
PATH_IDS={d['path'].resolve():d['id'] for d in DOCS}
APPENDIX_ID = next(d['id'] for d in DOCS if d['path'].name == '11-APENDICE-SCHEMA.md')
PATH_IDS[(ROOT/'prisma/schema.prisma').resolve()]=APPENDIX_ID
PATH_IDS[(ROOT/'prisma/prisma.config.ts').resolve()]=APPENDIX_ID

def plain(xs):
    out=[]
    for x in xs:
        t=x['t'];c=x.get('c')
        if t=='Str':out.append(c)
        elif t in ('Space','SoftBreak','LineBreak'):out.append(' ')
        elif t in ('Code','Math'):out.append(c[-1])
        elif t in ('Link','Image'):out.append(plain(c[1]))
        elif t in ('Span','Quoted'):out.append(plain(c[-1]))
        elif isinstance(c,list):out.append(plain([v for v in c if isinstance(v,dict) and 't' in v]))
    return ''.join(out)

def data_uri(path):
    mime='image/svg+xml' if path.suffix=='.svg' else 'application/json' if path.suffix=='.json' else 'application/pdf' if path.suffix=='.pdf' else 'text/plain'
    return 'data:'+mime+';base64,'+base64.b64encode(path.read_bytes()).decode()

def html_ast(doc):
    obj=copy.deepcopy(doc['ast']); counter=0
    def walk(x):
        nonlocal counter
        if isinstance(x,list):return [walk(v) for v in x]
        if not isinstance(x,dict):return x
        t=x.get('t');c=x.get('c')
        if t=='Header':
            c[1][0]=doc['id']+'-'+c[1][0]
            c[0]=min(6,c[0]+1)
        elif t=='Link':
            url=c[2][0]
            if url.startswith('#'):c[2][0]='#'+doc['id']+'-'+url[1:]
            elif not re.match(r'^[a-zA-Z][\w+.-]*:',url):
                file,_,frag=url.partition('#'); p=(doc['path'].parent/file).resolve()
                if p in PATH_IDS:
                    c[2][0]='#'+PATH_IDS[p]+('-'+frag if frag else '')
                elif p.is_file():
                    if p.stat().st_size>500000:
                        c[2][0]='#arquivos-editaveis';c[1].append({'t':'Str','c':' [arquivo bruto no ZIP]'})
                    else:
                        c[2][0]=data_uri(p);c[0][2].append(['download',p.name])
                else:
                    c[2][0]='#arquivos-editaveis'
        elif t=='CodeBlock' and 'mermaid' in c[0][1]:
            counter+=1;p=ROOT/'docassets'/f'{doc["path"].stem}-{counter:02d}.svg'
            svg=data_uri(p)
            source=html.escape(c[1])
            markup=f'<figure class="diagram"><img src="{svg}" alt="Diagrama {counter}: {html.escape(doc["title"])}"><figcaption>Fluxo do contrato de pesquisa. A evidência de execução e os pontos pendentes estão no capítulo de verificação.</figcaption><details><summary>Ver fonte Mermaid editável</summary><pre><code>{source}</code></pre></details></figure>'
            return {'t':'RawBlock','c':['html',markup]}
        return {k:walk(v) for k,v in x.items()}
    return walk(obj)

SECTIONS=[]
for d in DOCS:
    run=subprocess.run(['pandoc','-f','json','-t','html5','--wrap=none','--no-highlight','--mathml'],
        input=json.dumps(html_ast(d)),text=True,capture_output=True,check=True)
    SECTIONS.append(f'<section class="chapter" id="{d["id"]}" aria-label="{html.escape(d["title"])}">'
        f'<p class="chapter-kicker">CADERNO / {d["number"]:02d}</p>{run.stdout}</section>')
WIRE_HTML=''; APPENDICES=[]; proof_html=''; proofs=[]
NAV=''.join(f'<a href="#{d["id"]}"><span>{d["number"]:02d}</span> {html.escape(d["title"])}</a>' for d in DOCS)
CSS='''
:root{--ink:#17352f;--muted:#536860;--paper:#f6f7f2;--teal:#166a5b;--line:#d6dfd7;--gold:#bf7d26}*{box-sizing:border-box}html{scroll-behavior:auto}body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.65 system-ui,-apple-system,"Segoe UI",sans-serif}a{color:#126c63;text-underline-offset:3px}a:focus-visible,button:focus-visible,input:focus-visible,summary:focus-visible{outline:3px solid #d68924;outline-offset:3px}.skip{position:fixed;top:-100px;left:20px;background:white;padding:12px;z-index:9}.skip:focus{top:12px}aside{position:fixed;inset:0 auto 0 0;width:292px;background:#102d28;color:#f4f7ed;padding:26px 22px;overflow:auto;border-right:1px solid #21473e}.brand{font-size:25px;font-weight:760;letter-spacing:-.7px}.tag{font-size:11px;letter-spacing:1.8px;text-transform:uppercase;color:#b0c9bd}label{display:block;margin-top:22px;font-size:13px}input{width:100%;padding:10px;margin:7px 0;border:1px solid #75958a;border-radius:6px;font:inherit}#found{font-size:12px;color:#bcd0c7;min-height:20px}nav{display:grid;gap:3px;margin-top:14px}nav a{color:#e9f2e8;text-decoration:none;padding:8px 6px;border-radius:5px;font-size:13px;line-height:1.35}nav a:hover{background:#214b40}nav a span{display:inline-block;min-width:25px;color:#e6ba72;font-size:11px}main{margin-left:292px;max-width:1360px;padding:50px 54px 90px}.hero{padding:0 0 30px;border-bottom:3px solid var(--ink)}.eyebrow{font-size:12px;letter-spacing:2px;color:var(--teal);font-weight:750;text-transform:uppercase}h1{font-size:clamp(32px,4vw,58px);line-height:1.06;letter-spacing:-1.8px;margin:22px 0}h2{font-size:29px;line-height:1.25;margin:12px 0 24px;letter-spacing:-.6px}h3{font-size:22px;line-height:1.3;margin-top:34px}h4{font-size:18px;margin-top:26px}.lede{font-size:20px;max-width:850px}.status{border-left:4px solid var(--gold);background:#fff8e8;padding:14px 20px;font-size:15px;margin-top:24px}.metadata{font-size:13px;color:var(--muted)}.chapter{padding-top:52px;margin-top:18px;border-bottom:1px solid var(--line);padding-bottom:35px;scroll-margin-top:20px}.chapter-kicker{font-size:11px;font-weight:800;letter-spacing:2px;color:var(--teal)}.chapter h2:first-of-type{border-bottom:1px solid var(--line);padding-bottom:18px}p{margin:13px 0}li{margin:7px 0}table{width:100%;border-collapse:collapse;table-layout:auto;font-size:13px;line-height:1.5;margin:24px 0;background:#fff}th{background:#143f35;color:#fff;text-align:left;font-weight:650}td,th{padding:11px 12px;border:1px solid #cedbd3;vertical-align:top;overflow-wrap:anywhere}tbody tr:nth-child(even){background:#eff4ef}code{font: .88em/1.5 ui-monospace,"DejaVu Sans Mono",monospace;background:#e9eee7;padding:1px 4px;border-radius:3px;overflow-wrap:anywhere}pre{background:#142d27;color:#eef5ea;border-radius:7px;padding:21px;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;font-size:13px;line-height:1.6}pre code{background:none;padding:0;color:inherit}.diagram,.wire{margin:24px 0;background:white;border:1px solid var(--line);border-radius:8px;padding:18px}.diagram img{display:block;width:100%;max-height:1000px;object-fit:contain}.wire img{display:block;width:100%;height:auto}figcaption{color:var(--muted);font-size:12px;margin-top:15px}details{margin-top:15px}summary{cursor:pointer;color:var(--teal);font-size:13px}blockquote{margin:22px 0;padding:4px 20px;border-left:3px solid var(--teal);background:#edf2e9}.foot{font-size:13px;color:var(--muted);margin-top:50px}.hidden-by-search{display:none}.clear{background:#d5e8db;color:#163b2d;border:0;padding:8px 12px;border-radius:4px;cursor:pointer;font:inherit;font-size:12px}hr{border:0;border-top:1px solid var(--line);margin:24px 0}@media(max-width:1000px){aside{position:relative;width:auto;padding:22px}nav{grid-template-columns:repeat(2,minmax(0,1fr))}main{margin:0;padding:30px 22px 60px}table{font-size:12px}td,th{padding:8px}h2{font-size:26px}}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important}}@media print{aside,.skip,.clear{display:none}main{margin:0;max-width:none;padding:0;font-size:10pt}.chapter{break-before:page}pre{background:#f4f4f4;color:#111}table{font-size:8pt}thead{display:table-header-group}tr{break-inside:avoid}.diagram img{max-height:22cm}details{display:none}.hidden-by-search{display:block}}
'''
JS='''const search=document.getElementById('search');const sections=[...document.querySelectorAll('.chapter')];const normalize=s=>s.normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase();const texts=sections.map(s=>normalize(s.textContent));function filter(){const q=normalize(search.value.trim());let n=0;sections.forEach((s,i)=>{const visible=!q||texts[i].includes(q);s.classList.toggle('hidden-by-search',!visible);if(visible)n++;});document.getElementById('found').textContent=q?n+' seções contêm o termo':'Documento completo: '+sections.length+' seções';}search.addEventListener('input',filter);document.getElementById('clear').addEventListener('click',()=>{search.value='';filter();search.focus();});document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{search.value='';filter();}));filter();'''
page='''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'none'; base-uri 'none'; form-action 'none'"><title>Missão Ipê | Dossiê de pesquisa e implementação local</title><style>'''+CSS+'''</style></head><body><a class="skip" href="#conteudo">Ir ao conteúdo</a><aside><div class="tag">AB / Hackatur–Zer0Slop</div><div class="brand">Missão Ipê</div><p class="tag">Pesquisa · Produto · Engenharia</p><label for="search">Buscar nos capítulos</label><input id="search" type="search" placeholder="energia, replay, Prisma…" autocomplete="off"><div id="found" role="status" aria-live="polite"></div><button class="clear" id="clear">Mostrar tudo</button><nav aria-label="Capítulos">'''+NAV+'''</nav></aside><main id="conteudo"><header class="hero"><p class="eyebrow">Space Mission Design Game / pesquisa e implementação</p><h1>Ciência que chega.<br>Decisões que se sustentam.</h1><p class="lede">Implementação local, dados MODIS conferidos, dez pareceres integrais e uma trilha de decisões, testes e limites para o projeto brasileiro.</p><p class="metadata">14 de novembro de 2026 · Dez frentes Astra 6 Max · Coordenação para AB</p><div class="status"><strong>Estado da entrega:</strong> protótipo de P&D 0.1.1 com código, testes e builds. Desenvolvimento específico anterior à abertura local; elegibilidade e Resources pendentes. Navegador real, equipamentos de AB e estudo humano ainda não validados.</div></header>'''+''.join(SECTIONS[:1])+WIRE_HTML+''.join(SECTIONS[1:])+''.join(APPENDICES)+proof_html+'''<footer class="foot" id="arquivos-editaveis">Este HTML é autocontido. Os links externos abrem fontes quando houver conexão. Markdown, Mermaid, fontes, pareceres, ferramentas e recibos completos estão no ZIP editável; referências anteriores estão preservadas em sua pasta histórica. Conteúdo assistido por IA; nenhuma afiliação ou aprovação NASA é inferida.</footer></main><script>'''+JS+'''</script></body></html>'''
HTML.write_text(page)

# PDF: source-aware AST rendering, vector text, independent of a browser.
for name,file in [('DVS','DejaVuSans.ttf'),('DVS-Bold','DejaVuSans-Bold.ttf'),('DVS-Italic','DejaVuSans-Oblique.ttf'),('DVMono','DejaVuSansMono.ttf')]:
    pdfmetrics.registerFont(TTFont(name,'/usr/share/fonts/truetype/dejavu/'+file))
pdfmetrics.registerFontFamily('DVS',normal='DVS',bold='DVS-Bold',italic='DVS-Italic',boldItalic='DVS-Bold')
W,H=A4; M=43; CW=W-2*M; CH=H-98
INK=colors.HexColor('#18382F');TEAL=colors.HexColor('#176B59');MUTED=colors.HexColor('#596E63');LINE=colors.HexColor('#CDDAD0');PALE=colors.HexColor('#EDF3EE');GOLD=colors.HexColor('#BB7E29')
ST={
 'body':ParagraphStyle('body',fontName='DVS',fontSize=9.3,leading=13.6,textColor=INK,spaceAfter=7,allowWidows=0,allowOrphans=0,splitLongWords=True),
 'h1':ParagraphStyle('h1',fontName='DVS-Bold',fontSize=24,leading=29,textColor=INK,spaceAfter=18,keepWithNext=True),
 'h2':ParagraphStyle('h2',fontName='DVS-Bold',fontSize=15,leading=20,textColor=TEAL,spaceBefore=17,spaceAfter=10,keepWithNext=True),
 'h3':ParagraphStyle('h3',fontName='DVS-Bold',fontSize=11.5,leading=16,textColor=INK,spaceBefore=12,spaceAfter=7,keepWithNext=True),
 'small':ParagraphStyle('small',fontName='DVS',fontSize=8,leading=11.2,textColor=MUTED,spaceAfter=8,splitLongWords=True),
 'cell':ParagraphStyle('cell',fontName='DVS',fontSize=7.7,leading=10.6,textColor=INK,spaceAfter=0,splitLongWords=True),
 'headcell':ParagraphStyle('headcell',fontName='DVS-Bold',fontSize=7.6,leading=10.5,textColor=colors.white,spaceAfter=0,splitLongWords=True),
 'code':ParagraphStyle('code',fontName='DVMono',fontSize=8,leading=11.5,textColor=INK,backColor=PALE,borderPadding=0,leftIndent=6,rightIndent=6,spaceAfter=0,splitLongWords=True),
 'quote':ParagraphStyle('quote',fontName='DVS',fontSize=9.3,leading=13.6,textColor=TEAL,leftIndent=14,borderColor=LINE,borderPadding=7,spaceAfter=8),
}
IGNORED=[]
def safe_text(s):return html.escape(s.replace('\u2011','-').replace('\u2013','-').replace('\u2014',' - '))
def rich(xs,doc=None):
    out=[]
    for x in xs:
        t=x['t'];c=x.get('c')
        if t=='Str':out.append(safe_text(c))
        elif t in ('Space','SoftBreak'):out.append(' ')
        elif t=='LineBreak':out.append('<br/>')
        elif t=='Strong':out.append('<b>'+rich(c,doc)+'</b>')
        elif t=='Emph':out.append('<i>'+rich(c,doc)+'</i>')
        elif t=='Code':out.append('<font name="DVMono" size="8">'+safe_text(c[1])+'</font>')
        elif t=='Math':out.append('<i>'+safe_text(c[1].replace('\\in','∈').replace('\\times','×'))+'</i>')
        elif t=='Link':
            label=rich(c[1],doc);url=c[2][0]
            if url.startswith(('https://','http://')):out.append('<link href="'+html.escape(url,quote=True)+'" color="#176B59">'+label+'</link>')
            else:out.append('<font color="#176B59">'+label+'</font>')
        elif t in ('Span','Quoted'):out.append(rich(c[-1],doc))
        elif t=='Strikeout':out.append('<strike>'+rich(c,doc)+'</strike>')
        elif t=='Superscript':out.append('<super>'+rich(c,doc)+'</super>')
        elif t=='Subscript':out.append('<sub>'+rich(c,doc)+'</sub>')
        elif t=='RawInline':out.append(safe_text(c[-1]))
        elif t=='Image':out.append(safe_text(plain(c[1])))
        else:IGNORED.append('inline:'+t)
    return ''.join(out)
def P(text,kind='body',**kw):
    style=ParagraphStyle(kind+'var',parent=ST[kind],**kw) if kw else ST[kind]
    return Paragraph(text or '&#160;',style)
def cell_text(blocks,doc):
    chunks=[]
    for b in blocks:
        if b['t'] in ('Para','Plain'):chunks.append(rich(b['c'],doc))
        elif b['t']=='CodeBlock':chunks.append(safe_text(b['c'][1]))
        else:chunks.append(safe_text(str(b.get('c',''))))
    return '<br/>'.join(chunks)
def table(b,doc):
    c=b['c'];head=c[3][1];rows=list(head)
    for body in c[4]:rows.extend(body[2]);rows.extend(body[3])
    rows.extend(c[5][1]);n=len(c[2]);data=[];lens=[[] for _ in range(n)]
    for ri,row in enumerate(rows):
        cells=row[1];r=[]
        for ci,cell in enumerate(cells):
            s=cell_text(cell[4],doc);r.append(P(s,'headcell' if ri<len(head) else 'cell'))
            lens[ci].append(len(re.sub('<[^>]+>','',s)))
        data.append(r)
    weights=[max(28,min(280,sum(x)/max(1,len(x))))**0.64 for x in lens]
    if n==2:weights=[0.30,0.70]
    elif n==3 and lens[0] and sum(lens[0])/len(lens[0])<12:weights=[0.12,0.58,0.30]
    widths=[CW*w/sum(weights) for w in weights]
    t=LongTable(data,colWidths=widths,repeatRows=len(head),hAlign='LEFT',splitByRow=1,spaceBefore=6,spaceAfter=12)
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,len(head)-1),INK),('VALIGN',(0,0),(-1,-1),'TOP'),
        ('ROWBACKGROUNDS',(0,len(head)),(-1,-1),[colors.white,PALE]),('GRID',(0,0),(-1,-1),0.35,LINE),
        ('LEFTPADDING',(0,0),(-1,-1),7),('RIGHTPADDING',(0,0),(-1,-1),7),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7)]))
    return t
def add_image(path,max_h=610):
    iw,ih=PILImage.open(path).size;s=min(CW/iw,max_h/ih)
    return Image(str(path),width=iw*s,height=ih*s,hAlign='CENTER')
MATH_IMAGES=set()
def display_math(source):
    # Keep mathematical content in Markdown; render display equations for PDF
    # and native MathML for the offline HTML, without a remote MathJax loader.
    expression=' '.join(source.split()).replace('\\ne ', '\\neq ')
    path=TMP/('math-'+hashlib.sha256(expression.encode()).hexdigest()[:16]+'.png')
    math_to_image('$'+expression+'$',str(path),prop=FontProperties(size=12),dpi=240,format='png',color='#18382f')
    iw,ih=PILImage.open(path).size
    scale=min(72/240,CW/iw)
    MATH_IMAGES.add(path.name)
    return Image(str(path),width=iw*scale,height=ih*scale,hAlign='LEFT')
def code_paras(code):
    ans=[Spacer(1,5)]
    for line in code.expandtabs(4).splitlines():
        for wrapped in textwrap.wrap(line,100,replace_whitespace=False,drop_whitespace=False,subsequent_indent='    ') or [' ']:
            ans.append(P(safe_text(wrapped).replace(' ','&#160;'),'code'))
    ans.append(Spacer(1,11));return ans
def blocks(bs,doc,depth=0):
    out=[]
    for b in bs:
        t=b['t'];c=b.get('c')
        if t in ('Para','Plain'):
            if len(c)==1 and c[0]['t']=='Math' and c[0]['c'][0]['t']=='DisplayMath':
                out.extend([Spacer(1,4),display_math(c[0]['c'][1]),Spacer(1,10)])
            else:out.append(P(rich(c,doc),leftIndent=depth*12))
        elif t=='Header':
            level=c[0];title=rich(c[2],doc)
            p=P(title,'h1' if level==1 else 'h2' if level==2 else 'h3')
            if level==1:p.chapter=(doc['id'],doc['title'],doc['number'])
            out.append(p)
        elif t=='BulletList' or t=='OrderedList':
            items=c if t=='BulletList' else c[1];start=1 if t=='BulletList' else c[0][0]
            for j,item in enumerate(items):
                prefix='• ' if t=='BulletList' else str(start+j)+'. '
                if item and item[0]['t'] in ('Para','Plain'):
                    out.append(P(safe_text(prefix)+rich(item[0]['c'],doc),leftIndent=12*(depth+1),firstLineIndent=-10))
                    out.extend(blocks(item[1:],doc,depth+1))
                else:out.extend(blocks(item,doc,depth+1))
        elif t=='Table':out.append(table(b,doc))
        elif t=='CodeBlock':
            if 'mermaid' in c[0][1]:
                doc['diagramCounter']=doc.get('diagramCounter',0)+1
                stem=f'{doc["path"].stem}-{doc["diagramCounter"]:02d}'
                out.extend([add_image(ROOT/'docassets'/f'{stem}.png'),Spacer(1,6),P('Diagrama de especificação assistido por IA. Fonte Mermaid editável preservada no pacote.','small')])
            else:out.extend(code_paras(c[1]))
        elif t=='BlockQuote':
            for ch in c:
                if ch['t'] in ('Para','Plain'):out.append(P(rich(ch['c'],doc),'quote'))
                else:out.extend(blocks([ch],doc,depth+1))
        elif t=='HorizontalRule':out.append(HRFlowable(width='100%',thickness=.5,color=LINE,spaceBefore=10,spaceAfter=10))
        elif t=='Div':out.extend(blocks(c[1],doc,depth))
        elif t=='RawBlock':out.append(P(safe_text(c[1])))
        elif t=='DefinitionList':
            for term,defs in c:
                out.append(P('<b>'+rich(term,doc)+'</b>'))
                for definition in defs:out.extend(blocks(definition,doc,depth+1))
        else:IGNORED.append('block:'+t)
    return out

class Dossier(BaseDocTemplate):
    def __init__(self,*a,**kw):
        super().__init__(*a,**kw);self.running='Caderno de pesquisa e implementação';self.chapter_pages={}
    def afterFlowable(self,f):
        if hasattr(f,'chapter'):
            key,title,num=f.chapter;self.canv.bookmarkPage(key);self.canv.addOutlineEntry(title,key,0,False)
            self.notify('TOCEntry',(0,(f'{num:02d}  ' if isinstance(num,int) else '')+title,self.page,key))
            self.running=title;self.chapter_pages[key]=self.page
def footer(c,doc):
    if doc.page==1:return
    c.saveState();c.setStrokeColor(LINE);c.setLineWidth(.5);c.line(M,H-35,W-M,H-35)
    c.setFont('DVS',7.2);c.setFillColor(MUTED);c.drawString(M,H-25,'MISSÃO IPÊ  /  AB · HACKATUR–ZER0SLOP')
    c.drawRightString(W-M,H-25,'PESQUISA E IMPLEMENTAÇÃO · 14 NOV 2026')
    c.line(M,35,W-M,35);c.drawString(M,23,'Ciência que chega / dez frentes de pesquisa e implementação');c.drawRightString(W-M,23,str(doc.page));c.restoreState()
story=[]
story.extend([Spacer(1,54),P('AB / HACKATUR–ZER0SLOP','small'),Spacer(1,20),
    Paragraph('MISSÃO<br/>IPÊ',ParagraphStyle('cover',fontName='DVS-Bold',fontSize=60,leading=61,textColor=INK)),
    Spacer(1,22),P('Ciência que chega','h2'),P('IPÊ — Science Delivered','small'),
    P('Projeto, ciência verificável, arquitetura local,<br/>implementação, testes e dez pareceres completos.'),
    Spacer(1,16),HRFlowable(width='100%',thickness=3,color=TEAL),Spacer(1,18),
    P('DEZ FRENTES ASTRA 6 MAX · CADERNO INTEGRAL','small'),
    P('14 de novembro de 2026 · Rodada 4 · Protótipo 0.1.1','small'),
    Spacer(1,15),P('<b>Estado:</b> implementação de P&D com motor, interface, persistência, testes e builds. Desenvolvimento específico anterior ao evento: elegibilidade não estabelecida. Resources, navegador real e pesquisa com participantes permanecem pendentes.'),
    P('Conteúdo assistido por IA. Hipóteses, metas de desempenho e verificações futuras são identificadas. Nenhuma afiliação, aprovação científica ou elegibilidade NASA é inferida.','small'),PageBreak()])
story.extend([P('Navegação do caderno','h1'),P('Os capítulos preservam os contratos completos e a trilha de decisões. O HTML autocontido permite busca e leitura dos diagramas em tela; o ZIP mantém as fontes editáveis e os relatórios brutos.','body')])
toc=TableOfContents();toc.levelStyles=[ParagraphStyle('toc',fontName='DVS',fontSize=10,leading=18,textColor=INK,leftIndent=0,firstLineIndent=0,spaceBefore=3)]
story.extend([toc,PageBreak()])
for d in DOCS:
    d['diagramCounter']=0
    story.extend(blocks(d['ast']['blocks'],d));story.append(PageBreak())
doc=Dossier(str(PDF),pagesize=A4,title='Missão Ipê - Ciência que chega - Pesquisa e implementação',author='AB / Hackatur–Zer0Slop · assistência por IA',leftMargin=M,rightMargin=M,topMargin=48,bottomMargin=48)
doc.addPageTemplates(PageTemplate(id='main',frames=[Frame(M,48,CW,CH,leftPadding=0,rightPadding=0,topPadding=0,bottomPadding=0)],onPage=footer))
doc.multiBuild(story)
receipt={'generatedAt':datetime.now(timezone.utc).isoformat(),'scope':'Documentary rendering; execution claims are limited to the referenced receipts. Browser and participant validation remain pending.','documents':len(DOCS)-1,'diagrams':sum(d.get('diagramCounter',0) for d in DOCS),'displayEquations':len(MATH_IMAGES),'chapterPages':doc.chapter_pages,'unhandledAstNodes':sorted(set(IGNORED)),'files':[{'path':p.name,'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in [PDF,HTML]],'sourceFiles':[{'path':str(p.relative_to(ROOT)),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in FILES]}
(ROOT/'evidence/artifact-build.json').write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(receipt,ensure_ascii=False))
