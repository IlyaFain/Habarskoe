Habarskoe
=========

В прямом эфире с 7 до 16: http://109.195.150.4:81/Habarskoe/public/

В прямом эфире с 18 до 00: http://local.rmnv.ru/Habarskoe/public/


Чтобы править исходники (до сборки препроцессорами):

1. Скачать, установить ноду: https://www.npmjs.org;
1. Глобально установить coffeescript: $ npm install -g coffee-script;
1. Глобально установить slim: $ npm install -g slim;
1. В папке с проектом выполнить: $ npm install, это установит все зависимости из package.json в node_modules;
1. Команда gulp соберёт проект в /public;
1. Команда gulp watch соберёт проект, будте следить за изменениями в /sources и пересобирать изменяемые файлы.
