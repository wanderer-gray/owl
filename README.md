# owl

## Менеджер процессов [pm2](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/)

### Команды
* dev
```
pm2 start ecosystem.config.js
```
* prod
```
pm2 start ecosystem.config.js --env productio
```
* Мониторинг
  * Логи: pm2 logs
  * Список: pm2 list
  * Панель: pm2 monit
