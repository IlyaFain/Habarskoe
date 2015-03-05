Habarskoe
=========

В прямом эфире с 7 до 16: http://109.195.150.4:81/Habarskoe/public/

В прямом эфире с 18 до 00: http://local.rmnv.ru/Habarskoe/public/


Чтобы править исходники (до сборки препроцессорами):

1. Скачать, установить ноду: https://www.npmjs.org;
1. Скачать, установить руби: http://rubyinstaller.org
1. Установить coffeescript: $ npm install -g coffee-script;
1. Установить в шаблонизатор слим: $ gem install slim --source "http://rubygems.org";
1. В папке с проектом выполнить: $ npm install, это установит все зависимости из package.json в node_modules;
1. Команда gulp соберёт проект в /public;
1. Команда gulp watch соберёт проект, будте следить за изменениями в /sources и пересобирать изменяемые файлы.

Поставить лето по-умолчанию:
1. span.plink.season data-role="switchBlock toSummer" data-targets="hero-season" data-target="summer" → span.plink.season.is-active data-role="switchBlock toSummer" data-targets="hero-season" data-target="summer" (сделает активной псевдоссылку «лето»)
1. span.plink.season.is-active data-role="switchBlock toWinter" data-targets="hero-season" data-target="winter" → span.plink.season data-role="switchBlock toWinter" data-targets="hero-season" data-target="winter" (сделает неактивной псевдоссылку «зима»)
1. .headerNav → .headerNav.headerNav--summer (покрасит меню в оранжевый)
1. .hero-season.hero-season--summer data-role="hero-season summer" → .hero-season.hero-season--summer.is-visible data-role="hero-season summer"
1. .hero-season.hero-season--winter.is-visible data-role="hero-season winter" → .hero-season.hero-season--winter data-role="hero-season winter" (покажет праивльную картинку в герое)

