from pathlib import Path
import pymupdf, json, hashlib, zipfile
root=Path(__file__).resolve().parents[1]
out=root/'reports'/'sources'
out.mkdir(parents=True,exist_ok=True)
base=Path('C:/Users/gvadoskr/Yandex.Disk/2026-2027/ЛППР/ДЭ')
records=[]
for year in (2026,2027):
 folder=base/f'КОДы - {year} год'
 for f in folder.rglob('*'):
  if not f.is_file() or '09.02.07' not in str(f): continue
  r={'path':str(f),'year':year,'name':f.name,'size':f.stat().st_size,'sha256':hashlib.sha256(f.read_bytes()).hexdigest()}
  if f.suffix.lower()=='.pdf':
   doc=pymupdf.open(f)
   r['pages']=len(doc)
   name=f'{year}_{f.stem}.txt'
   (out/name).write_text('\n'.join(f'\n=== PAGE {i+1} ===\n'+p.get_text(sort=True) for i,p in enumerate(doc)),encoding='utf-8')
   r['extracted']=name
  elif f.suffix.lower()=='.zip':
   with zipfile.ZipFile(f) as z:r['entries']=[e.filename for e in z.infolist()]
  records.append(r)
(out/'inventory.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'files':len(records),'pdfs':sum('pages' in r for r in records),'archives':sum('entries' in r for r in records)},ensure_ascii=False))
