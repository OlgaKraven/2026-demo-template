from pathlib import Path
root=Path(__file__).resolve().parents[1]
p=root/'src/app.js';s=p.read_text(encoding='utf-8')
s=s.replace('c.years.find(y=>y.year===pref.year)',"c.years.find(y=>y.year===Number(new URLSearchParams(location.search).get('year')||pref.year))")
s=s.replace("const savePrefs=()=>set(prefKey,JSON.stringify({year:year.year,mode,variant:variant.id,module:module?.id,theme,stackChoice}));", "const savePrefs=()=>{set(prefKey,JSON.stringify({year:year.year,mode,variant:variant.id,module:module?.id,theme,stackChoice}));const url=new URL(location.href);url.searchParams.set('mode',mode);url.searchParams.set('year',year.year);history.replaceState(null,'',url);};")
s=s.replace("mode:next=>change(()=>{mode=next;})", "mode:next=>change(()=>{mode=next;if(next==='learn')module=year.modules.find(m=>m.id===year.exercise?.moduleId)||module;})")
s=s.replace("toast('Комплект '+chosenVariant().id+' подготовлен. Результаты решения на сайт не отправляются.')", "toast('Файл подготовлен: '+name+'. Результаты на сайт не отправляются.')")
p.write_text(s,encoding='utf-8')
print('Mode links and V00 navigation updated.')
