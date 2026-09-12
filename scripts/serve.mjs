import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
const base=path.resolve(import.meta.dirname,'../dist');
const port=Number(process.env.PORT||4173);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.pdf':'application/pdf','.zip':'application/zip','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document','.xlsx':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'};
http.createServer(async(req,res)=>{
 try{
  if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405,{'Allow':'GET, HEAD'});res.end('Read-only server');return;}
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(pathname==='/'){
   res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end('<!doctype html><html lang="ru"><meta charset="utf-8"><title>Локальная проверка трёх сборок</title><style>body{font:20px/1.7 Arial;max-width:800px;margin:60px auto;padding:20px}a{display:block;margin:20px 0}</style><h1>Три независимые сборки</h1><p>Эта страница — только локальный навигатор разработчика. На хостинг публикуется одна папка сайта.</p><a href="/web/">Веб и мультимедийные приложения</a><a href="/is/">Информационные системы</a><a href="/programmer/">Программист</a></html>');return;
  }
  let f=path.resolve(base,'.'+pathname);if(!f.startsWith(base+path.sep))throw Error('path');
  if((await fs.stat(f)).isDirectory())f=path.join(f,'index.html');
  const data=await fs.readFile(f);res.writeHead(200,{'Content-Type':mime[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:data);
 }catch{res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('Файл не найден');}
}).listen(port,'127.0.0.1',()=>console.log(`Preview: http://127.0.0.1:${port}`));
