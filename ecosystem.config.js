module.exports = {
  apps: [
    {
      name: 'academia-frontend',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'academia-backend',
      script: 'npm',
      args: 'run start --workspace=cms',
      env: {
        NODE_ENV: 'production',
        PORT: 1337
      }
    }
  ]
};
