const Sequelize = require('sequelize')

const sequelize = new Sequelize('main','root','root',{
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.db'
})

const Prefix = sequelize.define('prefix', {
    guild_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true
    },
    prefix: Sequelize.STRING(5)
})

sequelize.sync({alter: true}).then(async () => {
    console.log('[+] Connection to Database successful');
    console.log('[+] Database synced')
    console.log('[*] Starting Discord Bot')
}).catch(console.error);

module.exports = {Prefix}


