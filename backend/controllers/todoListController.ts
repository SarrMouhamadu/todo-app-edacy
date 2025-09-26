import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import todoListService from '../services/todoListService';
import { 
  ITODOListController, 
  IRequest, 
  IResponse, 
  ICreateTODOList, 
  IUpdateTODOList,
  APP_CONSTANTS 
} from '../types/todo';
import logger from '../utils/logger';

class TODOListController implements ITODOListController {
  // GET /api/todolists - Récupérer toutes les TODOList
  async getAllTODOLists(req: IRequest, res: IResponse) {
    try {
      const { page = 1, limit = 10, status, search, sortBy, sortOrder } = req.query;
      
      const result = await todoListService.getAllTODOLists({
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        status: status as any,
        search: search as string,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc'
      });
      
      res.json({
        success: true,
        message: APP_CONSTANTS.MESSAGES.SUCCESS.TODO_LISTS_RETRIEVED,
        data: result.todoLists,
        pagination: result.pagination,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Erreur dans getAllTODOLists', error);
      res.status(500).json({
        success: false,
        message: APP_CONSTANTS.MESSAGES.ERROR.SERVER_ERROR,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // GET /api/todolists/:id - Récupérer une TODOList par ID
  async getTODOListById(req: IRequest, res: IResponse) {
    try {
      const { id } = req.params;
      const todoList = await todoListService.getTODOListById(id);
      
      if (!todoList) {
        return res.status(404).json({
          success: false,
          message: APP_CONSTANTS.MESSAGES.ERROR.TODO_LIST_NOT_FOUND,
          timestamp: new Date().toISOString()
        });
      }

      res.json({
        success: true,
        message: APP_CONSTANTS.MESSAGES.SUCCESS.TODO_LIST_RETRIEVED,
        data: todoList,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Erreur dans getTODOListById', error);
      res.status(500).json({
        success: false,
        message: APP_CONSTANTS.MESSAGES.ERROR.SERVER_ERROR,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // GET /api/todolists/name/:titre - Récupérer une TODOList par nom
  async getTODOListByName(req: IRequest, res: IResponse) {
    try {
      const { titre } = req.params;
      const todoList = await todoListService.getTODOListByName(titre);
      
      if (!todoList) {
        return res.status(404).json({
          success: false,
          message: APP_CONSTANTS.MESSAGES.ERROR.TODO_LIST_NOT_FOUND,
          timestamp: new Date().toISOString()
        });
      }

      res.json({
        success: true,
        message: APP_CONSTANTS.MESSAGES.SUCCESS.TODO_LIST_RETRIEVED,
        data: todoList,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Erreur dans getTODOListByName', error);
      res.status(500).json({
        success: false,
        message: APP_CONSTANTS.MESSAGES.ERROR.SERVER_ERROR,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // GET /api/todolists/recent - Récupérer les TODOList récentes (BONUS)
  async getRecentTODOLists(req: IRequest, res: IResponse) {
    try {
      const { limit = 5 } = req.query;
      const todoLists = await todoListService.getRecentTODOLists(parseInt(limit as string));
      
      res.json({
        success: true,
        message: 'TODOLists récentes récupérées avec succès',
        data: todoLists,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Erreur dans getRecentTODOLists', error);
      res.status(500).json({
        success: false,
        message: APP_CONSTANTS.MESSAGES.ERROR.SERVER_ERROR,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // POST /api/todolists - Créer une nouvelle TODOList
  async createTODOList(req: IRequest, res: IResponse) {
    try {
      // Vérifier les erreurs de validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: APP_CONSTANTS.MESSAGES.ERROR.VALIDATION_FAILED,
          errors: errors.array(),
          timestamp: new Date().toISOString()
        });
      }

      const todoListData: ICreateTODOList = req.body;
      const newTodoList = await todoListService.createTODOList(todoListData);
      
      res.status(201).json({
        success: true,
        message: APP_CONSTANTS.MESSAGES.SUCCESS.TODO_LIST_CREATED,
        data: newTodoList,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Erreur dans createTODOList', error);
      res.status(500).json({
        success: false,
        message: APP_CONSTANTS.MESSAGES.ERROR.SERVER_ERROR,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // PUT /api/todolists/:id - Mettre à jour une TODOList
  async updateTODOList(req: IRequest, res: IResponse) {
    try {
      // Vérifier les erreurs de validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: APP_CONSTANTS.MESSAGES.ERROR.VALIDATION_FAILED,
          errors: errors.array(),
          timestamp: new Date().toISOString()
        });
      }

      const { id } = req.params;
      const updateData: IUpdateTODOList = req.body;
      
      const updatedTodoList = await todoListService.updateTODOList(id, updateData);
      
      if (!updatedTodoList) {
        return res.status(404).json({
          success: false,
          message: APP_CONSTANTS.MESSAGES.ERROR.TODO_LIST_NOT_FOUND,
          timestamp: new Date().toISOString()
        });
      }

      res.json({
        success: true,
        message: APP_CONSTANTS.MESSAGES.SUCCESS.TODO_LIST_UPDATED,
        data: updatedTodoList,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Erreur dans updateTODOList', error);
      res.status(500).json({
        success: false,
        message: APP_CONSTANTS.MESSAGES.ERROR.SERVER_ERROR,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // PATCH /api/todolists/:id/status - Changer le statut d'une TODOList
  async updateTODOListStatus(req: IRequest, res: IResponse) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status || !['TODO', 'IN_PROGRESS', 'DONE'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Statut invalide. Doit être TODO, IN_PROGRESS ou DONE',
          timestamp: new Date().toISOString()
        });
      }
      
      const updatedTodoList = await todoListService.updateTODOList(id, { status });
      
      if (!updatedTodoList) {
        return res.status(404).json({
          success: false,
          message: APP_CONSTANTS.MESSAGES.ERROR.TODO_LIST_NOT_FOUND,
          timestamp: new Date().toISOString()
        });
      }

      res.json({
        success: true,
        message: APP_CONSTANTS.MESSAGES.SUCCESS.STATUS_TOGGLED,
        data: updatedTodoList,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Erreur dans updateTODOListStatus', error);
      res.status(500).json({
        success: false,
        message: APP_CONSTANTS.MESSAGES.ERROR.SERVER_ERROR,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // DELETE /api/todolists/:id - Supprimer une TODOList
  async deleteTODOList(req: IRequest, res: IResponse) {
    try {
      const { id } = req.params;
      const deletedTodoList = await todoListService.deleteTODOList(id);
      
      if (!deletedTodoList) {
        return res.status(404).json({
          success: false,
          message: APP_CONSTANTS.MESSAGES.ERROR.TODO_LIST_NOT_FOUND,
          timestamp: new Date().toISOString()
        });
      }

      res.json({
        success: true,
        message: APP_CONSTANTS.MESSAGES.SUCCESS.TODO_LIST_DELETED,
        data: deletedTodoList,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Erreur dans deleteTODOList', error);
      res.status(500).json({
        success: false,
        message: APP_CONSTANTS.MESSAGES.ERROR.SERVER_ERROR,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // GET /api/todolists/stats - Récupérer les statistiques des TODOList
  async getTODOListStats(req: IRequest, res: IResponse) {
    try {
      const stats = await todoListService.getTODOListStats();
      
      res.json({
        success: true,
        message: APP_CONSTANTS.MESSAGES.SUCCESS.STATS_RETRIEVED,
        data: stats,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Erreur dans getTODOListStats', error);
      res.status(500).json({
        success: false,
        message: APP_CONSTANTS.MESSAGES.ERROR.SERVER_ERROR,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
}

export default new TODOListController();
