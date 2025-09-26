import { createLogger } from '@sonatel-os/juf-xpress-logger';

// Configuration du logger Sonatel
const sonatelLogger = createLogger({
  service: 'todo-app-api',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
  enableConsole: true,
  enableFile: process.env.NODE_ENV === 'production',
  logDirectory: './logs',
  maxFileSize: '10MB',
  maxFiles: 5,
  datePattern: 'YYYY-MM-DD',
  compress: true
});

// Wrapper pour intégrer le logger Sonatel avec notre interface
class SonatelLoggerWrapper {
  private logger = sonatelLogger;

  // Log des informations générales
  info(message: string, meta?: any) {
    this.logger.info(message, {
      timestamp: new Date().toISOString(),
      service: 'todo-app-api',
      ...meta
    });
  }

  // Log des erreurs
  error(message: string, error?: any) {
    this.logger.error(message, {
      timestamp: new Date().toISOString(),
      service: 'todo-app-api',
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : error
    });
  }

  // Log des avertissements
  warn(message: string, meta?: any) {
    this.logger.warn(message, {
      timestamp: new Date().toISOString(),
      service: 'todo-app-api',
      ...meta
    });
  }

  // Log de debug
  debug(message: string, meta?: any) {
    this.logger.debug(message, {
      timestamp: new Date().toISOString(),
      service: 'todo-app-api',
      ...meta
    });
  }

  // Log des requêtes HTTP avec détails
  request(req: any, res: any, responseTime: number) {
    const requestData = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
      headers: {
        'content-type': req.get('Content-Type'),
        'authorization': req.get('Authorization') ? '[REDACTED]' : undefined
      },
      body: req.method !== 'GET' ? this.sanitizeRequestBody(req.body) : undefined,
      query: req.query,
      params: req.params
    };

    this.logger.info('HTTP Request', requestData);
  }

  // Log des opérations de base de données
  database(operation: string, collection: string, data?: any, error?: any) {
    if (error) {
      this.logger.error(`Database ${operation} failed`, {
        operation,
        collection,
        error: error.message,
        stack: error.stack
      });
    } else {
      this.logger.info(`Database ${operation}`, {
        operation,
        collection,
        data: this.sanitizeData(data)
      });
    }
  }

  // Log des opérations métier
  business(operation: string, entity: string, data?: any, error?: any) {
    if (error) {
      this.logger.error(`Business ${operation} failed`, {
        operation,
        entity,
        error: error.message,
        stack: error.stack
      });
    } else {
      this.logger.info(`Business ${operation}`, {
        operation,
        entity,
        data: this.sanitizeData(data)
      });
    }
  }

  // Log des performances
  performance(operation: string, duration: number, metadata?: any) {
    this.logger.info(`Performance: ${operation}`, {
      operation,
      duration: `${duration}ms`,
      ...metadata
    });
  }

  // Log de sécurité
  security(event: string, details: any) {
    this.logger.warn(`Security: ${event}`, {
      event,
      ...details,
      timestamp: new Date().toISOString()
    });
  }

  // Log des erreurs de validation
  validation(errors: any[], requestData?: any) {
    this.logger.warn('Validation failed', {
      errors: errors.map(error => ({
        field: error.param || error.path,
        message: error.msg || error.message,
        value: error.value
      })),
      requestData: this.sanitizeData(requestData)
    });
  }

  // Log des erreurs d'authentification
  auth(event: string, details: any) {
    this.logger.warn(`Auth: ${event}`, {
      event,
      ...details,
      timestamp: new Date().toISOString()
    });
  }

  // Log des erreurs de rate limiting
  rateLimit(details: any) {
    this.logger.warn('Rate limit exceeded', {
      ...details,
      timestamp: new Date().toISOString()
    });
  }

  // Nettoyer les données sensibles
  private sanitizeData(data: any): any {
    if (!data || typeof data !== 'object') return data;

    const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth', 'authorization'];
    const sanitized = { ...data };

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  // Nettoyer le body de la requête
  private sanitizeRequestBody(body: any): any {
    if (!body || typeof body !== 'object') return body;
    return this.sanitizeData(body);
  }

  // Log des erreurs système
  system(event: string, details: any) {
    this.logger.error(`System: ${event}`, {
      event,
      ...details,
      timestamp: new Date().toISOString()
    });
  }

  // Log des erreurs d'API
  api(endpoint: string, method: string, error: any, requestData?: any) {
    this.logger.error(`API Error: ${method} ${endpoint}`, {
      endpoint,
      method,
      error: error.message,
      stack: error.stack,
      requestData: this.sanitizeData(requestData)
    });
  }

  // Log des erreurs de base de données
  dbError(operation: string, error: any, query?: any) {
    this.logger.error(`Database Error: ${operation}`, {
      operation,
      error: error.message,
      stack: error.stack,
      query: this.sanitizeData(query)
    });
  }

  // Log des erreurs de validation de données
  dataValidation(entity: string, errors: any[], data?: any) {
    this.logger.warn(`Data Validation Failed: ${entity}`, {
      entity,
      errors: errors.map(error => ({
        field: error.field,
        message: error.message,
        value: error.value
      })),
      data: this.sanitizeData(data)
    });
  }

  // Log des erreurs de business logic
  businessError(operation: string, entity: string, error: any, context?: any) {
    this.logger.error(`Business Error: ${operation}`, {
      operation,
      entity,
      error: error.message,
      stack: error.stack,
      context: this.sanitizeData(context)
    });
  }

  // Log des erreurs de service
  serviceError(service: string, operation: string, error: any, context?: any) {
    this.logger.error(`Service Error: ${service}.${operation}`, {
      service,
      operation,
      error: error.message,
      stack: error.stack,
      context: this.sanitizeData(context)
    });
  }

  // Log des erreurs de middleware
  middlewareError(middleware: string, error: any, requestData?: any) {
    this.logger.error(`Middleware Error: ${middleware}`, {
      middleware,
      error: error.message,
      stack: error.stack,
      requestData: this.sanitizeData(requestData)
    });
  }

  // Log des erreurs de contrôleur
  controllerError(controller: string, method: string, error: any, requestData?: any) {
    this.logger.error(`Controller Error: ${controller}.${method}`, {
      controller,
      method,
      error: error.message,
      stack: error.stack,
      requestData: this.sanitizeData(requestData)
    });
  }
}

export default new SonatelLoggerWrapper();
