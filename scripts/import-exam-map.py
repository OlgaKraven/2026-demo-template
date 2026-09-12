from pathlib import Path
import json,re,shutil,pymupdf
root=Path(__file__).resolve().parents[1]
inventory=json.loads((root/'reports/sources/inventory.json').read_text(encoding='utf-8'))
config={'is':(5,12,27,28,[20,30,20,60,60,20],['Проектирование ER-диаграммы','Разработка базы данных на основании ER-диаграммы','Создание запроса','Разработка информационной системы','Интеграция программных модулей','Разработка проектной документации']), 'programmer':(2,12,28,30,[50,40,60,60],['Разработка базы данных средствами СУБД','Разработка алгоритма и создание приложения','Разработка последовательного пользовательского интерфейса','Добавление в функционал Администратора и Менеджера возможности работы с заказами']), 'web':(3,13,29,29,[90,60,60],['Проектирование и разработка приложения','Разработка элементов графического дизайна приложения','Оптимизация производительности, разработка интерактивности веб-приложения'])}
for slug,(num,page26,time26,time27,minutes,titles) in config.items():
 path=root/'content'/f'{slug}.json'; c=json.loads(path.read_text(encoding='utf-8')); c['templateVersion']='0.2.0'
 for y in c['years']:
  year=y['year']; prefix='КОД' if year==2026 else 'КИМ'
  r=next(r for r in inventory if r['name']==f'{prefix} 09.02.07-{num}-{year} Том 1.pdf')
  doc=pymupdf.open(r['path']); page=page26 if year==2026 else 13
  rows=doc[page-1].find_tables().tables[0].extract(); criteria=[]; group=''
  for row in rows:
   if row[-1] and re.fullmatch(r'\d+,\d+',row[-1]) and not any(v and 'ИТОГО' in v for v in row):
    title=row[-2]; group=row[-3] or group
    criteria.append({'id':f'K{len(criteria)+1:02}','title':' '.join(title.split()),'group':' '.join(group.split()),'points':float(row[-1].replace(',','.'))})
  assert sum(r['points'] for r in criteria)==(50 if year==2026 else 75),(slug,year,criteria)
  dest=root/'source-documents'/slug;dest.mkdir(parents=True,exist_ok=True)
  shutil.copyfile(r['path'],dest/f'{year}.pdf')
  for p in (page, time26 if year==2026 else time27):doc[p-1].get_pixmap().save(str(root/'reports/sources'/f'{slug}-{year}-p{p}.png'))
  y['assessment']={'maxPoints':sum(r['points'] for r in criteria),'page':page,'table':'7','criteria':criteria,'scope':'ГИА · базовый уровень','note':'Баллы указаны по критериям таблицы 7. Дробление на отдельные действия и модули здесь не установлено; сайт не выставляет оценку.'}
  y['documentCode']=f'09.02.07-{num}-{year}'
  y['source']={'url':f'sources/{year}.pdf','title':r['name'],'kind':'provided-official-document','checkedAt':'2026-09-12','timingPage':time26 if year==2026 else time27,'taskPages':'раздел 3.5','sha256':r['sha256'],'approval':'29.09.2025 № 01-09-538/2025' if year==2026 else '27.08.2026 № 01-09-285/2026'}
  y['contentVersion']=f'map-{year}-2'
  if year==2027:
   y.update(status='passport',totalSeconds=sum(minutes)*60,exercise=None,notice='Паспорт, критерии и время сверены по переданному КИМ. Учебные задания этой редакции ещё не наполнены.',modules=[{'id':f'M{i+1}','number':i+1,'title':t,'durationSeconds':m*60,'ready':False} for i,(t,m) in enumerate(zip(titles,minutes))])
  y['attachments']=[{'name':z['name'],'files':len(z['entries']),'sha256':z['sha256']} for z in inventory if 'entries' in z and f'09.02.07-{num}-{year}' in z['name']]
 path.write_text(json.dumps(c,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Six exam maps imported, criteria totals verified.')
