(function(root){
'use strict';
const options={ui:[['vanilla','HTML + JavaScript'],['components','Web Components']],server:[['python','Python · стандартная библиотека'],['node','Node.js · встроенные модули']],store:[['sqlite','SQLite'],['json','JSON-файл']]};
function files(course,choice){
 for(const k of Object.keys(options))if(!options[k].some(([id])=>id===choice[k]))throw Error('Unknown stack component');
 const records=course.example.items.map((name,i)=>({id:i+1,name}));
 const css='body{font:18px/1.6 system-ui;max-width:760px;margin:50px auto;padding:24px;background:#f4f4f6;color:#222}li{background:white;padding:16px;margin:12px 0;border-left:4px solid #ed131c;list-style:none}ul{padding:0}';
 const js=choice.ui==='vanilla'?`fetch('/api/items').then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json()}).then(items=>{const list=document.querySelector('#items');for(const item of items){const li=document.createElement('li');li.textContent=item.id+' · '+item.name;list.append(li)}document.querySelector('#status').textContent='Получено записей: '+items.length}).catch(e=>document.querySelector('#status').textContent='Ошибка: '+e.message);`:
 `class CatalogItem extends HTMLElement{set item(value){const shadow=this.attachShadow({mode:'open'});const p=document.createElement('p');p.textContent=value.id+' · '+value.name;shadow.append(p)}}customElements.define('catalog-item',CatalogItem);fetch('/api/items').then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json()}).then(items=>{for(const item of items){const li=document.createElement('li'),card=document.createElement('catalog-item');card.item=item;li.append(card);document.querySelector('#items').append(li)}document.querySelector('#status').textContent='Получено записей: '+items.length}).catch(e=>document.querySelector('#status').textContent='Ошибка: '+e.message);`;
 const result={'data.json':JSON.stringify(records,null,2),'public/index.html':'<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Учебный каталог V00</title><link rel="stylesheet" href="style.css"><h1>Учебный каталог V00</h1><p>Интерфейс → сервер → данные</p><p id="status" role="status">Загрузка…</p><ul id="items"></ul><script src="app.js"></script></html>','public/style.css':css,'public/app.js':js};
 if(choice.server==='python')result['server.py']=`from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
import json, sqlite3
ROOT = Path(__file__).resolve().parent
${choice.store==='sqlite'?`db = sqlite3.connect(ROOT / 'catalog.sqlite')
db.execute('CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY, name TEXT NOT NULL)')
db.executemany('INSERT OR IGNORE INTO items VALUES (:id, :name)', json.loads((ROOT / 'data.json').read_text(encoding='utf-8')))
db.commit()
def items():
    return [dict(zip(('id','name'), row)) for row in db.execute('SELECT id, name FROM items ORDER BY id')]
`:`def items():
    return json.loads((ROOT / 'data.json').read_text(encoding='utf-8'))
`}
class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        route = self.path.split('?')[0]
        if route == '/api/items':
            body, mime = json.dumps(items(), ensure_ascii=False).encode('utf-8'), 'application/json; charset=utf-8'
        elif route in ('/', '/index.html', '/app.js', '/style.css'):
            name = 'index.html' if route == '/' else route[1:]
            body = (ROOT / 'public' / name).read_bytes()
            mime = {'html':'text/html', 'js':'text/javascript', 'css':'text/css'}[name.split('.')[-1]] + '; charset=utf-8'
        else:
            self.send_error(404)
            return
        self.send_response(200)
        self.send_header('Content-Type', mime)
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)
server = HTTPServer(('127.0.0.1', 8080), Handler)
print('http://127.0.0.1:8080', flush=True)
server.serve_forever()
`;
else result['server.mjs']=`import http from 'node:http';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
${choice.store==='sqlite'?`import {DatabaseSync} from 'node:sqlite';
const db=new DatabaseSync(fileURLToPath(new URL('catalog.sqlite',import.meta.url)));
db.exec('CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY, name TEXT NOT NULL)');
const insert=db.prepare('INSERT OR IGNORE INTO items VALUES (?, ?)');
for(const item of JSON.parse(readFileSync(new URL('data.json',import.meta.url),'utf8')))insert.run(item.id,item.name);
const items=()=>db.prepare('SELECT id, name FROM items ORDER BY id').all();`:`const items=()=>JSON.parse(readFileSync(new URL('data.json',import.meta.url),'utf8'));`}
http.createServer((req,res)=>{
 if(req.method!=='GET'){res.writeHead(405);return res.end()}
 const route=new URL(req.url,'http://localhost').pathname;
 if(route==='/api/items'){res.writeHead(200,{'Content-Type':'application/json; charset=utf-8'});return res.end(JSON.stringify(items()))}
 if(!['/','/index.html','/app.js','/style.css'].includes(route)){res.writeHead(404);return res.end()}
 const name=route==='/'?'index.html':route.slice(1);
 const type={html:'text/html',js:'text/javascript',css:'text/css'}[name.split('.').pop()];
 res.writeHead(200,{'Content-Type':type+'; charset=utf-8'});res.end(readFileSync(new URL('public/'+name,import.meta.url)));
}).listen(8080,'127.0.0.1',()=>console.log('http://127.0.0.1:8080'));
`;
 result['README.md']=`# Смешиваемый учебный пример V00

${course.specialty} · ${course.specialtyTitle}
${course.qualification}

Выбрано: ${Object.entries(choice).map(([k,v])=>options[k].find(x=>x[0]===v)[1]).join(' + ')}.

Это самостоятельный вводный пример связи слоёв, вне официальной карты баллов. Он показывает чтение каталога, но не заменяет экзаменационное приложение, авторизацию, CRUD или выбранное задание. JSON — файловый источник, а не СУБД.

## Запуск
Распакуйте весь архив. Нужен ${choice.server==='python'?'Python 3.10+':'Node.js 22.14+ (node:sqlite в ветке 22 имеет экспериментальный статус)'}. Внешних пакетов нет.
В каталоге комплекта выполните: ${choice.server==='python'?'python server.py':'node server.mjs'}
Откройте http://127.0.0.1:8080 . Остановка: Ctrl+C. Если порт занят, остановите предыдущий пример.

## Как связаны компоненты
public/app.js запрашивает GET /api/items. Сервер возвращает JSON-массив объектов {id: целое число, name: строка}. Сервер читает ${choice.store==='sqlite'?'таблицу items; файл catalog.sqlite создаётся при первом запуске из data.json':'data.json при запросе'}. UI использует textContent и не исполняет названия как HTML.
Интерфейс и сервер заменяются независимо, пока сохраняется этот контракт. Запускайте только один сервер на порту 8080. SQLite и JSON — альтернативы хранения одного набора; одновременная работа двух хранилищ не нужна.

## Проверка
Ожидается ${records.length} записей. Первая: ${records[0].name}. Проверьте также /api/items в браузере. Если UI не загрузился, проверьте запуск сервера и адрес; index.html не открывается двойным щелчком, поскольку ему нужен API.
Поменяйте вариант интерфейса и повторите проверку: состав данных не должен измениться.

## Развитие преподавателем
Замените источник данных и контракт согласованно с выбранным заданием. Допуск языка, СУБД и среды на экзамене проверяется отдельно по площадке. Для PostgreSQL, MySQL и SQL Server используйте диалектные SQL-примеры соответствующего курса; драйвер подключения к данному серверу здесь не реализован.
`;
 return result;
}
root.ExamStacks={options,files};
})(globalThis);
