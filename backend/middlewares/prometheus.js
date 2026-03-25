import client from 'prom-client';

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'path', 'status_code'],
  buckets: [50, 100, 200, 300, 400, 500, 1000]
});

export function metricsMiddleware(req, res, next) {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    end({ method: req.method, path: req.route?.path || req.path, status_code: res.statusCode });
  });
  next();
}

export function metricsRoute(req, res) {
  res.set('Content-Type', client.register.contentType);
  res.end(client.register.metrics());
}
