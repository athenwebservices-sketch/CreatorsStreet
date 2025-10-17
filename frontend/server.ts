// server.ts - Next.js Standalone + Socket.IO
import { setupSocket } from '@/lib/socket';
import { createServer } from 'http';
import { Server } from 'socket.io';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const currentPort = 3000;
const hostname = '0.0.0.0';

// Custom server with Socket.IO integration
async function createCustomServer() {
  try {
    // Create Next.js app
    const nextApp = next({ 
      dev,
      dir: process.cwd(),
      conf: dev ? undefined : { distDir: './.next' }
    });

    await nextApp.prepare();
    const handle = nextApp.getRequestHandler();

    // Create HTTP server that will handle both Next.js and Socket.IO
    const server = createServer((req, res) => {
      const url = req.url || '';

      // =============================================================
      // == START: FIRST-TIME VISITOR REDIRECT LOGIC ================
      // =============================================================
      
      // A helper function to parse cookies from the request header
      const parseCookies = (req: any) => {
        const list: Record<string, string> = {}; // Fixed: Properly typed as Record<string, string>
        const rc = req.headers.cookie;
        rc && rc.split(';').forEach(function(cookie) {
          const parts = cookie.split('=');
          const key = parts.shift().trim();
          const value = decodeURI(parts.join('='));
          list[key] = value;
        });
        return list;
      };

      const cookies = parseCookies(req);

      // Check if our special cookie exists. If not, this is a first-time visit.
      if (!cookies.initial_redirect_done) {
        // Set the cookie so we don't redirect again on the next request.
        // 'Path=/' makes it available across the entire site.
        // 'HttpOnly' is a security best practice.
        res.setHeader('Set-Cookie', 'initial_redirect_done=true; Path=/; HttpOnly; SameSite=Lax');
        
        // Redirect to the home page.
        // 307 is a Temporary Redirect, which is appropriate here.
        res.writeHead(307, { Location: '/' });
        res.end();
        return; // Important: Stop processing the request further
      }

      // =============================================================
      // == END: FIRST-TIME VISITOR REDIRECT LOGIC ==================
      // =============================================================

      // If the cookie exists, proceed with normal request handling
      // Skip socket.io requests from Next.js handler
      if (url.startsWith('/api/socketio')) {
        return;
      }
      handle(req, res);
    });

    // Setup Socket.IO
    const io = new Server(server, {
      path: '/api/socketio',
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    setupSocket(io);

    // Start the server
    server.listen(currentPort, hostname, () => {
      console.log(`> Ready on http://${hostname}:${currentPort}`);
      console.log(`> Socket.IO server running at ws://${hostname}:${currentPort}/api/socketio`);
    });

  } catch (err) {
    console.error('Server startup error:', err);
    process.exit(1);
  }
}

// Start the server
createCustomServer();