# owl

## Backend

### Менеджер процессов [pm2](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/)
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

## Frontend

### API
```javascript
// Доступно в любом месте приложения
api('<service>/<operation>')
 .method('<get|post|put|delete>')
 .query({...})
 .body({...})

// Пример
class UsersStore {
 users = [];
 
 setUsers = (users) => {
  this.users = users;
 }
 
 getUsers = async(name) => {
  try {
   const users = await api('users.search')
    .method('get')
    .query({name});

   this.setUsers(users);
  } catch (err) {
   alert(err); // @todo
  }
 };
}
```
