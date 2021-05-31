# owl

## Менеджер процессов `pm2`
`npm install pm2 -g`
### Команды
Основная задача: автоматический перезапуск серверов при падении 
- `dev`: pm2 start index.js --name=owl --watch -i max --max-memory-restart 1G --log ./all.log --time
- `prod`: pm2 start index.js --name=owl -i max --max-memory-restart 1G --log ./all.log --time
- Логи: pm2 logs
- Список мониторинга: pm2 list
- Панель мониторинга: pm2 monit
- Запуск процессов при boot/reboot сервера: pm2 startup
- Сохранить конфигурацию для запуска процессов при boot/reboot сервера: pm2 save
