import { Request, Response, NextFunction } from 'express';

// Types de base selon les spécifications
export type TODOStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type ItemStatus = 'DONE' | 'NOT_DONE';

// Interface TODOList selon les spécifications
export interface ITODOList {
  id: string;
  titre: string;
  status: TODOStatus;
  createdAt: Date;
  updatedAt: Date;
  items?: ITODOItem[];
}

// Interface TODOItem selon les spécifications
export interface ITODOItem {
  id: string;
  libelle: string;
  status: ItemStatus;
  createdAt: Date;
  updatedAt: Date;
  todoListId: string;
  todoList?: ITODOList;
}

// Interface pour la création d'une TODOList
export interface ICreateTODOList {
  titre: string;
  status?: TODOStatus;
}

// Interface pour la mise à jour d'une TODOList
export interface IUpdateTODOList {
  titre?: string;
  status?: TODOStatus;
}

// Interface pour la création d'un TODOItem
export interface ICreateTODOItem {
  libelle: string;
  status?: ItemStatus;
  todoListId: string;
}

// Interface pour la mise à jour d'un TODOItem
export interface IUpdateTODOItem {
  libelle?: string;
  status?: ItemStatus;
}

// Interface pour les paramètres de requête TODOList
export interface IQueryParams {
  page?: number;
  limit?: number;
  status?: TODOStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Interface pour les paramètres de requête TODOItem
export interface IItemQueryParams {
  page?: number;
  limit?: number;
  status?: ItemStatus;
  search?: string;
  todoListId?: string;
}

// Interface pour la pagination
export interface IPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Interface pour les statistiques TODOList
export interface ITODOListStats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
}

// Interface pour les statistiques TODOItem
export interface ITODOItemStats {
  total: number;
  done: number;
  notDone: number;
  completionRate: number;
}

// Interface pour la réponse API
export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
  pagination?: IPagination;
  timestamp: string;
}

// Interface pour les erreurs de validation
export interface IValidationError {
  field: string;
  message: string;
  value?: any;
}

// Types pour les middlewares
export interface IRequest extends Request {
  user?: any;
  startTime?: number;
}

export interface IResponse extends Response {
  success?: (data?: any, message?: string, statusCode?: number) => void;
  error?: (message?: string, statusCode?: number, errors?: any) => void;
}

export type INextFunction = NextFunction;

// Types pour les services TODOList
export interface ITODOListService {
  getAllTODOLists(params: IQueryParams): Promise<{ todoLists: ITODOList[]; pagination: IPagination }>;
  getTODOListById(id: string): Promise<ITODOList | null>;
  getTODOListByName(titre: string): Promise<ITODOList | null>;
  getRecentTODOLists(limit?: number): Promise<ITODOList[]>;
  createTODOList(todoListData: ICreateTODOList): Promise<ITODOList>;
  updateTODOList(id: string, updateData: IUpdateTODOList): Promise<ITODOList | null>;
  deleteTODOList(id: string): Promise<ITODOList | null>;
  getTODOListStats(): Promise<ITODOListStats>;
}

// Types pour les services TODOItem
export interface ITODOItemService {
  getAllTODOItems(params: IItemQueryParams): Promise<{ todoItems: ITODOItem[]; pagination: IPagination }>;
  getTODOItemById(id: string): Promise<ITODOItem | null>;
  getTODOItemsByListId(todoListId: string): Promise<ITODOItem[]>;
  createTODOItem(todoItemData: ICreateTODOItem): Promise<ITODOItem>;
  updateTODOItem(id: string, updateData: IUpdateTODOItem): Promise<ITODOItem | null>;
  deleteTODOItem(id: string): Promise<ITODOItem | null>;
  toggleTODOItemStatus(id: string): Promise<ITODOItem | null>;
  getTODOItemStats(todoListId?: string): Promise<ITODOItemStats>;
}

// Types pour les contrôleurs TODOList
export interface ITODOListController {
  getAllTODOLists(req: IRequest, res: IResponse): Promise<void>;
  getTODOListById(req: IRequest, res: IResponse): Promise<void>;
  getTODOListByName(req: IRequest, res: IResponse): Promise<void>;
  getRecentTODOLists(req: IRequest, res: IResponse): Promise<void>;
  createTODOList(req: IRequest, res: IResponse): Promise<void>;
  updateTODOList(req: IRequest, res: IResponse): Promise<void>;
  deleteTODOList(req: IRequest, res: IResponse): Promise<void>;
  getTODOListStats(req: IRequest, res: IResponse): Promise<void>;
}

// Types pour les contrôleurs TODOItem
export interface ITODOItemController {
  getAllTODOItems(req: IRequest, res: IResponse): Promise<void>;
  getTODOItemById(req: IRequest, res: IResponse): Promise<void>;
  getTODOItemsByListId(req: IRequest, res: IResponse): Promise<void>;
  createTODOItem(req: IRequest, res: IResponse): Promise<void>;
  updateTODOItem(req: IRequest, res: IResponse): Promise<void>;
  deleteTODOItem(req: IRequest, res: IResponse): Promise<void>;
  toggleTODOItemStatus(req: IRequest, res: IResponse): Promise<void>;
  getTODOItemStats(req: IRequest, res: IResponse): Promise<void>;
}

// Constantes de l'application
export const APP_CONSTANTS = {
  TODO_STATUS: {
    TODO: 'TODO' as TODOStatus,
    IN_PROGRESS: 'IN_PROGRESS' as TODOStatus,
    DONE: 'DONE' as TODOStatus
  },
  ITEM_STATUS: {
    DONE: 'DONE' as ItemStatus,
    NOT_DONE: 'NOT_DONE' as ItemStatus
  },
  MESSAGES: {
    SUCCESS: {
      TODO_LIST_CREATED: 'TODOList créée avec succès',
      TODO_LIST_UPDATED: 'TODOList mise à jour avec succès',
      TODO_LIST_DELETED: 'TODOList supprimée avec succès',
      TODO_LIST_RETRIEVED: 'TODOList récupérée avec succès',
      TODO_LISTS_RETRIEVED: 'TODOLists récupérées avec succès',
      TODO_ITEM_CREATED: 'TODOItem créé avec succès',
      TODO_ITEM_UPDATED: 'TODOItem mis à jour avec succès',
      TODO_ITEM_DELETED: 'TODOItem supprimé avec succès',
      TODO_ITEM_RETRIEVED: 'TODOItem récupéré avec succès',
      TODO_ITEMS_RETRIEVED: 'TODOItems récupérés avec succès',
      STATUS_TOGGLED: 'Statut mis à jour avec succès',
      STATS_RETRIEVED: 'Statistiques récupérées avec succès'
    },
    ERROR: {
      TODO_LIST_NOT_FOUND: 'TODOList non trouvée',
      TODO_ITEM_NOT_FOUND: 'TODOItem non trouvé',
      INVALID_DATA: 'Données invalides',
      VALIDATION_FAILED: 'Validation échouée',
      SERVER_ERROR: 'Erreur interne du serveur',
      DATABASE_ERROR: 'Erreur de base de données',
      UNAUTHORIZED: 'Non autorisé',
      FORBIDDEN: 'Accès interdit',
      NOT_FOUND: 'Ressource non trouvée',
      CONFLICT: 'Conflit de ressources',
      TOO_MANY_REQUESTS: 'Trop de requêtes',
      SERVICE_UNAVAILABLE: 'Service indisponible'
    }
  },
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
  },
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
    MIN_LIMIT: 1
  }
};

// Fonctions utilitaires pour les constantes
export const getMessage = (category: keyof typeof APP_CONSTANTS.MESSAGES, key: string) => {
  return APP_CONSTANTS.MESSAGES[category]?.[key] || 'Message non défini';
};

export const getHttpStatus = (key: keyof typeof APP_CONSTANTS.HTTP_STATUS) => {
  return APP_CONSTANTS.HTTP_STATUS[key] || 500;
};

export const isValidTODOStatus = (status: string): status is TODOStatus => {
  return Object.values(APP_CONSTANTS.TODO_STATUS).includes(status as TODOStatus);
};

export const isValidItemStatus = (status: string): status is ItemStatus => {
  return Object.values(APP_CONSTANTS.ITEM_STATUS).includes(status as ItemStatus);
};

export const getDefaultPagination = () => {
  return {
    page: APP_CONSTANTS.PAGINATION.DEFAULT_PAGE,
    limit: APP_CONSTANTS.PAGINATION.DEFAULT_LIMIT
  };
};
