# mvc-books-library

## Short description
Library server that allows browsing books, searching them, adding and deleting by admin. Backups and soft deletions exeuctes every 24 hours by cron with help of child_process. Pages renders by ejs.

## Technologies used:
- Mysql
- Node js
- Express js
- ejs
- multer
- cron
- express-session
- bootstrap

Developed on WSL2 Ubuntu and should be launched on Linux.

## How to setup?
1. In .env file write:
    ADMIN_LOGIN - admin login
    ADMIN_PASS - admin password
    HOST - hostname of server
    PORT - launch port
    DB_LOGIN - login for mysql db
    DB_PASS - password for mysql db
    DB_NAME - name of mysql db
    SID_COOKIE_NAME - naming of session cookie
    SID_SECRET - ecrypting secred for session cookie
2. a) Create in db tables for v1 by:
    npm run migration-v1:up
   b) If want v2 then run:
    npm run migration-v1:up && npm run migration-v2:up
3. Launch - compilation and launch:
    npm run dev