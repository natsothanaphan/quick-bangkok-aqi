/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { setGlobalOptions } = require("firebase-functions/v2");
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const fetch = require('node-fetch');

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

setGlobalOptions({ region: 'asia-southeast1' });

// This function acts as a proxy to the public URL.
exports.apiProxy = onRequest(async (req, res) => {
  // Build the target URL based on the incoming request.
  const targetUrl = 'https://stations.airbkk.com' + req.path.replace(/^\/api/, '');
  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      // headers: req.headers, // Forwarding headers gives error, perhaps due to host header
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    });
    const data = await response.text();
    logger.log('Proxy response with status ' + response.status);
    // Forward the status and response.
    res.status(response.status).send(data);
  } catch (error) {
    console.error('Error proxying request:', error);
    res.status(500).send('Proxy error');
  }
});
