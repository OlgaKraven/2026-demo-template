from pathlib import Path
import json,urllib.request,urllib.parse,hashlib,zipfile
root=Path(__file__).resolve().parents[1];results=[]
for slug in ('is','web','programmer'):
 c=json.loads((root/'content'/f'{slug}.json').read_text(encoding='utf-8'))
 for y in c['years']:
  p=y['practice'];urls=[p['zip']]+[t['zip'] for t in p['tasks']]+[f['url'] for t in p['tasks'] for f in t['files']]
  for url in urls:
   local=root/'dist'/slug/url
   with urllib.request.urlopen('http://127.0.0.1:4187/'+slug+'/'+urllib.parse.quote(url),timeout=10) as r:
    assert r.status==200;data=r.read();assert hashlib.sha256(data).digest()==hashlib.sha256(local.read_bytes()).digest()
   if url.endswith('.zip'):
    with zipfile.ZipFile(local) as z:
     assert z.testzip() is None
     assert not any(n.startswith(('ПУ/','ПА/')) for n in z.namelist())
     assert not any('solution' in n.lower() or 'expected.csv' in n for n in z.namelist())
  results.append({'course':slug,'year':y['year'],'tasks':len(p['tasks']),'httpFilesChecked':len(urls),'zipCount':1+len(p['tasks']),'status':'passed'})
(root/'reports/practice-http.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(results,ensure_ascii=False,indent=2))
