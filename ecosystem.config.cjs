/**
 * PM2 process definition for the standalone Next build.
 *
 * Fork mode with a SINGLE instance, deliberately. The contact form's rate
 * limiter keeps its counters in process memory (src/lib/rate-limit.ts); running
 * cluster mode with N workers would multiply the allowance by N and let a
 * flooder through. If this ever needs to scale horizontally, move that limiter
 * to a shared store first — the limiter's own comment says the same thing.
 */
module.exports = {
  apps: [
    {
      name: 'portfolio',
      // deploy.sh copies the contents of .next/standalone to the release root,
      // so the server Next generated sits at the top level.
      script: 'server.js',
      cwd: '/var/www/portfolio/current',

      exec_mode: 'fork',
      instances: 1,

      env: {
        NODE_ENV: 'production',
        /**
         * The one place this port is written for the app itself; deploy.sh
         * reads it back from here for its health checks, so they cannot drift.
         *
         * The VPS runs other projects. If 3100 is taken, change it here AND in
         * the `portfolio_app` upstream in deploy/nginx.conf — deploy.sh refuses
         * to start if the port belongs to another process, but it cannot know
         * what nginx is pointed at.
         *
         * HOSTNAME binds to loopback only, so this is reachable through nginx
         * and not from the internet.
         */
        PORT: 3100,
        HOSTNAME: '127.0.0.1',
      },

      // Restart on crash, but stop flapping if it cannot start at all.
      autorestart: true,
      max_restarts: 10,
      min_uptime: '20s',
      restart_delay: 2000,

      // A Next server that has grown past this is leaking; recycle it rather
      // than let the box start swapping.
      max_memory_restart: '512M',

      // `pm2 reload` waits for this before cutting traffic over, so a deploy
      // does not drop the request that is in flight.
      wait_ready: false,
      listen_timeout: 15000,
      kill_timeout: 5000,

      error_file: '/var/log/portfolio/error.log',
      out_file: '/var/log/portfolio/out.log',
      merge_logs: true,
      time: true,
    },
  ],
};
