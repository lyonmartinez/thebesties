module.exports = {
  apps: [{
    name: 'thebesties-bot',
    script: './server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_file: './logs/pm2-combined.log',
    time: true,
    merge_logs: true,
    // Restart khi crash
    min_uptime: '10s',
    max_restarts: 10,
    restart_delay: 4000
  }]
};

