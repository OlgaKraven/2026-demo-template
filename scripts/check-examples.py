import sqlite3,subprocess,json,decimal,pathlib,csv,io
base=pathlib.Path(__file__).resolve().parents[1];work=base/'reports';work.mkdir(exist_ok=True);out=[]
node='''import fs from 'node:fs';import './src/core.js';import './src/content-tools.js';const c=JSON.parse(fs.readFileSync('content/is.json','utf8'));console.log(JSON.stringify([c.example,...c.variants].map(v=>({id:v.id,sql:ExamContent.setupSql(c,v,'postgres'),query:ExamContent.query,expected:ExamContent.dataFor(c,v).expected}))));'''
rows=json.loads(subprocess.check_output(['node','--input-type=module','-e',node],cwd=base))
for item in rows:
 db=sqlite3.connect(':memory:');db.execute('PRAGMA foreign_keys=ON');db.executescript(item['sql']);actual=db.execute(item['query']).fetchall();expected=[(x['order_id'],x['total_cost']) for x in item['expected']]
 assert [(i,f'{v:.2f}') for i,v in actual]==expected,item['id'];db.close()
out.append({'check':'31 SQL examples: V00 + 30 variants','engine':'SQLite (not target DBMS)','status':'passed'})
py=base/'files/programmer/V00/python/solution.py';r=subprocess.run([__import__('sys').executable,str(py)],capture_output=True,text=True,check=True);assert 'T1 1699.15 False False' in r.stdout;assert len(r.stdout.strip().splitlines())==4
ns={};exec(compile(py.read_text(),str(py),'exec'),ns);f=ns['price_after_discount'];assert f('1.01',50)==decimal.Decimal('.51');assert f('150',100)==decimal.Decimal('0.00')
try:f('-1',15);raise AssertionError('invalid accepted')
except ValueError:pass
out.append({'check':'Python Decimal example + rounding/invalid boundary cases','status':'passed','output':r.stdout})
java=base/'files/programmer/V00/java';classes=work/'java-classes';classes.mkdir(exist_ok=True);subprocess.run(['javac','-d',str(classes),'PriceDemo.java'],cwd=java,check=True,capture_output=True);r=subprocess.run(['java','-cp',str(classes),'PriceDemo'],cwd=java,check=True,capture_output=True,text=True);assert 'T1 1699.15 false false' in r.stdout;assert len(r.stdout.strip().splitlines())==4
out.append({'check':'Java BigDecimal example compiled and executed','status':'passed','output':r.stdout})
out.append({'check':'C#/.NET execution','status':'not-run','reason':'dotnet executable is absent'})
(work/'examples-report.json').write_text(json.dumps(out,ensure_ascii=False,indent=2));print(json.dumps(out,ensure_ascii=False,indent=2))
