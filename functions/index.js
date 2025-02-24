require('dotenv').config({ path: ['.env', '.env.default'] });
const { initializeApp } = require('firebase-admin/app');
const { setGlobalOptions } = require('firebase-functions/v2');
const { onRequest } = require('firebase-functions/v2/https');
const fetch = require('node-fetch');
const logger = require('firebase-functions/logger');
const express = require('express');

setGlobalOptions({ region: 'asia-southeast1' });
initializeApp();

const app = express();
app.use(express.json());

app.get('/api/ping', (req, res) => {
  res.send('pong');
});

const AIR_QUALITY_DATA_URL = 'https://stations.airbkk.com/bma/marker.php';

app.get('/api/airQualityData', async (req, res) => {
  try {
    const resp = await fetch(AIR_QUALITY_DATA_URL);
    const data = await resp.text();
    logger.log('Air quality data fetched, status: ' + resp.status);
    res.status(resp.status).send(data);
  } catch (error) {
    logger.error('Air quality data fetch error:', error);
    res.status(500).send('Error fetching air quality data');
  }
});

exports.app = onRequest(app);
