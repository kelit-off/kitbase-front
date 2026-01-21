module.exports = {
  apps: [
    {
      name: 'kitbase-front',
      script: 'npm',
      args: 'run start',
      instances: 1, // mets "max" pour cluster
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
    },
  ],
};
