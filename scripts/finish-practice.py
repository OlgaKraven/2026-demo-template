from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
p=root/'src/practice.js';s=p.read_text(encoding='utf-8')
s=s.replace('</section>\n ${finished?summary()', '${assessmentDetails()}</section>\n ${finished?summary()')
s=s.replace('function navigation(tasks)', '''function assessmentDetails(){return `<details class="practice-assessment"><summary>Карта баллов · максимум ${ctx.year.assessment.maxPoints} за весь экзамен</summary><p class="small">Официальные критерии. Баллы не распределяются автоматически по вашим отметкам${kind==='exercise'?'; отдельному учебному упражнению баллы экзамена не присваиваются':''}.</p>${list(ctx.year.assessment.criteria.map(r=>r.title+' — '+r.points+' балл.'))}<a href="${E(ctx.year.source.url)}#page=${ctx.year.assessment.page}" target="_blank" rel="noopener">Таблица 7 · стр. ${ctx.year.assessment.page}</a></details>`;}
function navigation(tasks)''')
p.write_text(s,encoding='utf-8')
p=root/'package.json';c=json.loads(p.read_text(encoding='utf-8'));c['version']='0.3.0';c['scripts']['practice:build']='python scripts/build-practice.py';p.write_text(json.dumps(c,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Assessment visible in both practice modes.')
