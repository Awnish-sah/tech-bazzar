import serverless from 'serverless-http';
import app from '../../server/index.js';

// Export Netlify serverless handler
export const handler = serverless(app);
