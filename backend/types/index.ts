import { Request, Response, NextFunction } from 'express';
import { Document } from 'mongoose';

// Types de base
export type TodoStatus = 'pending' | 'completed' | 'all';
export type TodoPriority = 'low' | 'medium' | 'high';

// Interface Todo
export interface ITodo extends Document {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: TodoPriority;
  dueDate?: Date;
  tags?: string[];
  category?: string;
  estimatedTime?: number;
  actualTime?: number;
  progress: number;
  isArchived: boolean;
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  
  // Virtuals
  isOverdue: boolean;
  timeRemaining: number | null;
  efficiency: number | null;
  
  // Méthodes d'instance
  toggle(): Promise<ITodo>;
  archive(): Promise<ITodo>;
  unarchive(): Promise<ITodo>;
  updateProgress(progress: number): Promise<ITodo>;
}

// Interface pour la création d'un todo
export interface ICreateTodo {
  title: string;
  description?: string;
  priority?: TodoPriority;
  dueDate?: Date;
  tags?: string[];
  category?: string;
  estimatedTime?: number;
}

// Interface pour la mise à jour d'un todo
export interface IUpdateTodo {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: TodoPriority;
  dueDate?: Date;
  tags?: string[];
  category?: string;
  estimatedTime?: number;
  actualTime?: number;
  progress?: number;
  isArchived?: boolean;
}

// Interface pour les paramètres de requête
export interface IQueryParams {
  page?: number;
  limit?: number;
  status?: TodoStatus;
  priority?: TodoPriority;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
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

// Interface pour les statistiques
export interface ITodoStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
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

// Interface pour les informations de santé
export interface IHealthInfo {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  memory: {
    used: number;
    total: number;
    external: number;
  };
  system: {
    platform: string;
    arch: string;
    cpus: number;
    loadAverage: number[];
  };
  database: {
    isConnected: boolean;
    readyState: number;
    host: string;
    port: number;
    name: string;
  };
}

// Interface pour les informations API
export interface IApiInfo {
  name: string;
  version: string;
  description: string;
  endpoints: {
    todos: {
      [key: string]: string;
    };
    health: {
      [key: string]: string;
    };
  };
  documentation: string;
}

// Interface pour les paramètres de recherche
export interface ISearchParams {
  query?: string;
  filters?: {
    completed?: boolean;
    priority?: TodoPriority;
    dateFrom?: Date;
    dateTo?: Date;
  };
  page?: number;
  limit?: number;
}

// Interface pour les résultats de recherche
export interface ISearchResults {
  todos: ITodo[];
  pagination: IPagination;
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

// Types pour les services
export interface ITodoService {
  getAllTodos(params: IQueryParams): Promise<{ todos: ITodo[]; pagination: IPagination }>;
  getTodoById(id: string): Promise<ITodo | null>;
  createTodo(todoData: ICreateTodo): Promise<ITodo>;
  updateTodo(id: string, updateData: IUpdateTodo): Promise<ITodo | null>;
  deleteTodo(id: string): Promise<ITodo | null>;
  toggleTodoStatus(id: string, completed: boolean): Promise<ITodo | null>;
  getTodoStats(): Promise<ITodoStats>;
  searchTodos(searchParams: ISearchParams): Promise<ISearchResults>;
}

export interface IDatabaseService {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getConnectionStatus(): any;
  getDatabaseStats(): Promise<any>;
  cleanDatabase(): Promise<void>;
  createIndexes(): Promise<void>;
}

// Types pour les contrôleurs
export interface ITodoController {
  getAllTodos(req: IRequest, res: IResponse): Promise<void>;
  getTodoById(req: IRequest, res: IResponse): Promise<void>;
  createTodo(req: IRequest, res: IResponse): Promise<void>;
  updateTodo(req: IRequest, res: IResponse): Promise<void>;
  deleteTodo(req: IRequest, res: IResponse): Promise<void>;
  toggleTodoStatus(req: IRequest, res: IResponse): Promise<void>;
  getTodoStats(req: IRequest, res: IResponse): Promise<void>;
}

export interface IHealthController {
  healthCheck(req: IRequest, res: IResponse): Promise<void>;
  apiInfo(req: IRequest, res: IResponse): Promise<void>;
}

// Types pour les constantes
export interface IAppConstants {
  TODO_STATUS: {
    PENDING: TodoStatus;
    COMPLETED: TodoStatus;
    ALL: TodoStatus;
  };
  TODO_PRIORITY: {
    LOW: TodoPriority;
    MEDIUM: TodoPriority;
    HIGH: TodoPriority;
  };
  MESSAGES: {
    SUCCESS: { [key: string]: string };
    ERROR: { [key: string]: string };
  };
  HTTP_STATUS: { [key: string]: number };
  PAGINATION: {
    DEFAULT_PAGE: number;
    DEFAULT_LIMIT: number;
    MAX_LIMIT: number;
    MIN_LIMIT: number;
  };
  RATE_LIMIT: {
    WINDOW_MS: number;
    MAX_REQUESTS: number;
    CREATE_WINDOW_MS: number;
    MAX_CREATE_REQUESTS: number;
    DELETE_WINDOW_MS: number;
    MAX_DELETE_REQUESTS: number;
    SEARCH_WINDOW_MS: number;
    MAX_SEARCH_REQUESTS: number;
  };
  VALIDATION: {
    TITLE: {
      MIN_LENGTH: number;
      MAX_LENGTH: number;
    };
    DESCRIPTION: {
      MAX_LENGTH: number;
    };
    SEARCH: {
      MAX_LENGTH: number;
    };
  };
  DATABASE: {
    CONNECTION_TIMEOUT: number;
    SOCKET_TIMEOUT: number;
    MAX_POOL_SIZE: number;
  };
  LOGGING: {
    LEVELS: { [key: string]: string };
    DEFAULT_LEVEL: string;
  };
  SECURITY: {
    MAX_REQUEST_SIZE: string;
    ALLOWED_ORIGINS: string[];
  };
  API: {
    VERSION: string;
    NAME: string;
    DESCRIPTION: string;
  };
}

// Types pour les tests
export interface ITestConfig {
  port: number;
  database: string;
  timeout: number;
}

export interface ITestData {
  validTodo: ICreateTodo;
  invalidTodo: Partial<ICreateTodo>;
  updateData: IUpdateTodo;
}

// Types pour les erreurs personnalisées
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Types pour les utilitaires
export interface ILogger {
  info(message: string, meta?: any): void;
  error(message: string, error?: any): void;
  warn(message: string, meta?: any): void;
  debug(message: string, meta?: any): void;
  request(req: IRequest, res: IResponse, responseTime: number): void;
}

export interface IResponseHelper {
  success(res: IResponse, data?: any, message?: string, statusCode?: number): void;
  error(res: IResponse, message?: string, statusCode?: number, errors?: any): void;
  validationError(res: IResponse, errors: IValidationError[]): void;
  notFound(res: IResponse, message?: string): void;
  unauthorized(res: IResponse, message?: string): void;
  forbidden(res: IResponse, message?: string): void;
  conflict(res: IResponse, message?: string): void;
  paginated(res: IResponse, data: any, pagination: IPagination, message?: string): void;
  created(res: IResponse, data: any, message?: string): void;
  updated(res: IResponse, data: any, message?: string): void;
  deleted(res: IResponse, data?: any, message?: string): void;
  tooManyRequests(res: IResponse, message?: string, retryAfter?: string): void;
  serviceUnavailable(res: IResponse, message?: string): void;
  formatValidationErrors(errors: any[]): IValidationError[];
  addPaginationHeaders(res: IResponse, pagination: IPagination): void;
}
