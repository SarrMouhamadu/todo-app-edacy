class ResponseHelper {
  // Réponse de succès standard
  static success(res, data = null, message = 'Opération réussie', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }

  // Réponse d'erreur standard
  static error(res, message = 'Erreur interne du serveur', statusCode = 500, errors = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString()
    });
  }

  // Réponse de validation échouée
  static validationError(res, errors) {
    return res.status(400).json({
      success: false,
      message: 'Données de validation invalides',
      errors,
      timestamp: new Date().toISOString()
    });
  }

  // Réponse de ressource non trouvée
  static notFound(res, message = 'Ressource non trouvée') {
    return res.status(404).json({
      success: false,
      message,
      timestamp: new Date().toISOString()
    });
  }

  // Réponse non autorisée
  static unauthorized(res, message = 'Non autorisé') {
    return res.status(401).json({
      success: false,
      message,
      timestamp: new Date().toISOString()
    });
  }

  // Réponse interdite
  static forbidden(res, message = 'Accès interdit') {
    return res.status(403).json({
      success: false,
      message,
      timestamp: new Date().toISOString()
    });
  }

  // Réponse de conflit
  static conflict(res, message = 'Conflit de ressources') {
    return res.status(409).json({
      success: false,
      message,
      timestamp: new Date().toISOString()
    });
  }

  // Réponse avec pagination
  static paginated(res, data, pagination, message = 'Données récupérées avec succès') {
    return res.json({
      success: true,
      message,
      data,
      pagination,
      timestamp: new Date().toISOString()
    });
  }

  // Réponse créée
  static created(res, data, message = 'Ressource créée avec succès') {
    return res.status(201).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }

  // Réponse mise à jour
  static updated(res, data, message = 'Ressource mise à jour avec succès') {
    return res.json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }

  // Réponse supprimée
  static deleted(res, data = null, message = 'Ressource supprimée avec succès') {
    return res.json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }

  // Réponse de trop de requêtes
  static tooManyRequests(res, message = 'Trop de requêtes', retryAfter = null) {
    const response = {
      success: false,
      message,
      timestamp: new Date().toISOString()
    };

    if (retryAfter) {
      response.retryAfter = retryAfter;
    }

    return res.status(429).json(response);
  }

  // Réponse de service indisponible
  static serviceUnavailable(res, message = 'Service temporairement indisponible') {
    return res.status(503).json({
      success: false,
      message,
      timestamp: new Date().toISOString()
    });
  }

  // Formater les erreurs de validation
  static formatValidationErrors(errors) {
    if (Array.isArray(errors)) {
      return errors.map(error => ({
        field: error.param || error.path,
        message: error.msg || error.message,
        value: error.value
      }));
    }
    return errors;
  }

  // Ajouter des headers de pagination
  static addPaginationHeaders(res, pagination) {
    res.set({
      'X-Total-Count': pagination.total,
      'X-Page': pagination.page,
      'X-Limit': pagination.limit,
      'X-Total-Pages': pagination.pages
    });
  }
}

module.exports = ResponseHelper;
