import app from '../../server/src/app.js';

// Next must pass the original stream through to Express JSON/Multer middleware.
// All deployments use the same routes, authentication and upload handlers.
export const config = { api: { bodyParser: false, externalResolver: true } };

export default app;
