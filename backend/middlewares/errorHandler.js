export default function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const body = {
    error: {
      message: err.message || 'Internal Server Error',
      details: err.details || undefined,
    }
  };

  if (process.env.NODE_ENV === 'production' && status === 500) {
    res.status(500).json({ error: { message: 'Internal Server Error' } });
    return;
  }

  res.status(status).json(body);
}
