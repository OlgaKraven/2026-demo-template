from pathlib import Path
import shutil,json
p=Path(__file__).resolve().parents[1]
f=p/'src/app.js';s=f.read_text(encoding='utf-8').replace('МОДУЛЬ ${m.number}',"${year.year===2027?'ЗАДАНИЕ':'МОДУЛЬ'} ${m.number}")
s=s.replace('<span class="pill">30 тренировочных вариантов</span>', '<span class="pill">${year.exercise?\'30 вариантов упражнения\':\'Карта заданий и критериев\'}</span>')
s=s.replace("${pending?'disabled':''}","${pending||!year.exercise?'disabled':''}")
f.write_text(s,encoding='utf-8')
f=p/'README.md';old=f.read_text(encoding='utf-8');(p/'docs/README-0.1-history.md').write_text(old,encoding='utf-8')
f.write_text('''# Общий шаблон подготовки к ДЭ · 09.02.07

Версия 0.2.0 · 12 сентября 2026 года.

Готовы три независимые сборки, карты 2026/2027 с баллами и временем, тема солнце/луна, локальные таймеры и 8 смешиваемых учебных стеков. Это шаблон для наполнения, а не готовый полный курс.

Открыть: `dist/is/index.html`, `dist/web/index.html`, `dist/programmer/index.html`.
Надёжное сохранение таймера: `node scripts/serve.mjs` и адрес, напечатанный сервером.

Полный разбор источников, изменения, ограничения и правила расширения: [UPDATE-0.2.md](docs/UPDATE-0.2.md).
Фактические проверки текущей версии: [QA-0.2.md](docs/QA-0.2.md).

## Команды

```sh
node scripts/validate.mjs
node --test tests/core.test.mjs
node scripts/test-stacks.mjs
node scripts/build.mjs
node scripts/serve.mjs
```

Для проверки стеков нужен Python (по умолчанию `python`, можно задать EXAM_PYTHON) и Node.js 22.14+. Внешние пакеты не требуются. Сервер просмотра по умолчанию использует 4173; другой порт задаётся PORT.

`node scripts/validate.mjs --exam-ready` намеренно отклоняет неполные курсы. Удалять этот барьер без наполнения нельзя.

Общий код — `src/`; содержание — `content/`; копии шести PDF для встроенных ссылок — `source-documents/`; анализ всех переданных источников — `reports/sources/`. Содержимое отдельных `dist/<program>` готовится для самостоятельного размещения.

Публикация ожидает просмотра и одобрения автора. Исторические README и QA версии 0.1 не подтверждают проверки текущей версии.
''',encoding='utf-8')
print('Updated labels and documentation.')
