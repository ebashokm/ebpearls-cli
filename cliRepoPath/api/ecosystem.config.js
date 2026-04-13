module.exports = {
  apps: [
    {
      name: 'api',
      script: './dist/apps/api/main.js',
      instances: process.env.INSTANCES || 1, // default instance count || max
      exec_mode: 'cluster', // use cluster mode || fork
      watch: true,
      env: {
        NODE_ENV: 'development',
      },
    },
    {
      name: 'cms-api',
      script: './dist/apps/cms-api/main.js',
      instances: process.env.INSTANCES || 1, // default instance count
      exec_mode: 'cluster', // use cluster mode
      watch: true,
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};

//pm2 delete all
//pm2 list
//pm2 start ecosystem.config.js --only api -i 4
//pm2 scale api 3 
//pm2 start ecosystem.config.js
//pm2 start ./dist/apps/cms-api/main.js --name cms-api --instances 2 --exec-mode cluster
//pm2 logs
//pm2 reload all
//INSTANCES=4 pm2 start ecosystem.config.js --only api