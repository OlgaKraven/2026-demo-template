from pathlib import Path
root=Path(__file__).resolve().parents[1]
p=root/'src/app.js';s=p.read_text(encoding='utf-8')
s=s.replace("mode=pref.mode==='training'?'training':'learn'", "mode=['training','mock'].includes(new URLSearchParams(location.search).get('mode')||pref.mode)?(new URLSearchParams(location.search).get('mode')||pref.mode):'learn'")
s=s.replace("function loadTimer(){timer=null;key='';if(!module", "function loadTimer(){timer=null;key='';if(mode!=='learn')return;if(!module")
s=s.replace("if(timer?.status==='running'&&!confirm", "if((timer?.status==='running'||mode!=='learn'&&ExamPractice.isRunning())&&!confirm")
s=s.replace("${pending||!year.exercise?'disabled':''}>Моя тренировка</button><button class=\"btn\" disabled title=\"Не подключён полный комплект модулей и приложений\">Пробный экзамен</button>", "${pending||!year.practice?.ready?'disabled':''}>Моя тренировка</button><button data-mode=\"mock\" class=\"btn ${mode==='mock'?'active':''}\" ${pending||!year.practice?.ready?'disabled':''}>Пробный экзамен</button>")
s=s.replace("${pending?pendingContent():`${examMap()}", "${pending?pendingContent():mode!=='learn'?ExamPractice.render({c,year,mode,get,set}):`${examMap()}")
s=s.replace(' bind();tick();', " bind();if(mode!=='learn')ExamPractice.bind({rerender:render,download,mode:next=>change(()=>{mode=next;})});tick();")
s=s.replace('function tick(){', "function tick(){\n if(mode!=='learn'){ExamPractice.tick();return;}")
s=s.replace('Рабочий шаблон с учебными примерами, не полный курс ДЭ.', 'Тренировка по заданиям и пробный проход опубликованного образца.')
s=s.replace('Карты 2026 и 2027 сверены по переданным документам. В редакции 2026 есть один разобранный пример и 30 вариантов этого упражнения. Редакция 2027 содержит карту, критерии и таймеры; учебные задания ещё готовятся.', 'Выберите режим ниже: разбор отдельного примера, самостоятельная тренировка или весь образец с общим таймером. Подключены условия и исходные приложения 2026/2027. V01–V30 относятся к учебному упражнению 2026, а не к полному экзамену.')
s=s.replace('Архивы приложений учтены в реестре источников; в тренировочные комплекты автоматически не перенесены.', 'Приложения базового уровня распакованы и включены в комплекты опубликованного образца. Авторские упражнения V01–V30 используют отдельные учебные данные.')
p.write_text(s,encoding='utf-8')
p=root/'src/index.html';s=p.read_text(encoding='utf-8').replace('<script defer src="app.js">','<script defer src="practice.js"></script><script defer src="app.js">');p.write_text(s,encoding='utf-8')
p=root/'scripts/build.mjs';s=p.read_text(encoding='utf-8').replace("'stack-tools.js','app.js'","'stack-tools.js','practice.js','app.js'").replace("await fs.cp(path.join(root,'source-documents'", "await fs.cp(path.join(root,'practice-assets',slug),path.join(out,'practice'),{recursive:true});\n await fs.cp(path.join(root,'source-documents'")
p.write_text(s,encoding='utf-8')
p=root/'src/core.js';s=p.read_text(encoding='utf-8').replace("if(examReady) {", """if(y.practice?.ready){
          assert(y.practice.kind==='published-sample','Неизвестный вид пробного комплекта');
          assert(y.practice.tasks.length===y.modules.length,'Неполный образец');
          assert(y.practice.tasks.every((t,i)=>t.id===y.modules[i].id&&t.seconds===y.modules[i].durationSeconds&&t.text.length>100&&t.zip&&t.page),'Неполное задание образца');
          assert(y.practice.zip,'Нет комплекта образца');
        }
      if(examReady) {""");p.write_text(s,encoding='utf-8')
print('Practice and mock integrated into shared shell.')
