import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import todoItemService from '../services/todoItemService';
import { 
  ITODOItemController, 
  IRequest, 
  IResponse, 
  ICreateTODOItem, 
  IUpdateTODOItem,
  APP_CONSTANTS 
} from '../types/todo';
import logger from '../utils/logger';

class TODOItemController implements ITODOItemController {
  // GET /api/todoitems - Récupérer tous les TODOItems
  async getAllTODOItems(req: IRequest, res: IResponse) {
    try {
      const { page = 1, limit = 10, status, search, todoListId } = req.query;
      
      const result = await todoItemService.getAllTODOItems({
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        status: status as any,
        search: search as string,
        todoListId: todoListId as string
      });
      
      res.json({
        success: true,
        message: APP_CONSTANTS.MESSAGES.SUCCESS.TODO_ITEMS_RETRIEVED,
        data: result.todoItems,
        pagination: result.pagination,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Erreur dans getAllTODOItems', error);
      res.status(500).json({
        success: false,
        message: APP_CONSTANTS.MESSAGES.ERROR.SERVER_ERROR,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // GET /api/todoitems/:id - Récupérer un TODOItem par ID
  async getTODOItemById(req: IRequest, res: IResponse) {
    try {
      const { id } = req.params;
      const todoItem = await todoItemService.getTODOItemById(id);
      
      if (!todoItem) {
        return res.status(404).json({
          success: false,
          message: APP_CONSTANTS.MESSAGES.ERROR.TODO_ITEM_NOT_FOUND,
          timestamp: new Date().toISOString()
        });
      }

      res.json({
        success: true,
        message: APP_CONSTANTS.MESSAGES.SUCCESS.TODO_ITEM_RETRIEVED,
        data: todoItem,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Erreur dans getTODOItemById', error);
      res.status(500).json({
        success: false,
        message: APP_CONSTANTS.MESSAGES.ERROR.SERVER_ERROR,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // GET /api/todoitems/list/:todoListId - Récupérer les TODOItems d'une TODOList
  async getTODOItemsByListId(req: IRequest, res: IResponse) {
    try {
      const { todoListId } = req.params;
      const todoItems = await todoItemService.getTODOItemsByListId(todoListId);
      
      res.json({
        success: true,
        message: APP_CONSTANTS.MESSAGES.SUCCESS.TODO_ITEMS_RETRIEVED,
        data: todoItems,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Erreur dans getTODOItemsByListId', error);
      res.status(500).json({
        success: false,
        message: APP_CONSTANTS.MESSAGES.ERROR.SERVER_ERROR,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // POST /api/todoitems - Créer un nouveau TODOItem
  async createTODOItem(req: IRequest, res: IResponse) {
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

      const todoItemData: ICreateTODOItem = req.body;
      const newTodoItem = await todoItemService.createTODOItem(todoItemData);
      
      res.status(201).json({
        success: true,
        message: APP_CONSTANTS.MESSAGES.SUCCESS.TODO_ITEM_CREATED,
        data: newTodoItem,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Erreur dans createTODOItem', error);
      
      if (error.message === 'TODOList non trouvée') {
        return res.status(404).json({
          success: false,
          message: 'TODOList non trouvée',
          timestamp: new Date().toISOString()
        });
      }
      
      res.status(500).json({
        success: false,
        message: APP_CONSTANTS.MESSAGES.ERROR.SERVER_ERROR,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // PUT /api/todoitems/:id - Mettre à jour un TODOItem
  async updateTODOItem(req: IRequest, res: IResponse) {
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
      const updateData: IUpdateTODOItem = req.body;
      
      const updatedTodoItem = await todoItemService.updateTODOItem(id, updateData);
      
      if (!updatedTodoItem) {
        return res.status(404).json({
          success: false,
          message: APP_CONSTANTS.MESSAGES.ERROR.TODO_ITEM_NOT_FOUND,
          timestamp: new Date().toISOString()
        });
      }

      res.json({
        success: true,
        message: APP_CONSTANTS.MESSAGES.SUCCESS.TODO_ITEM_UPDATED,
        data: updatedTodoItem,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Erreur dans updateTODOItem', error);
      res.status(500).json({
        success: false,
        message: APP_CONSTANTS.MESSAGES.ERROR.SERVER_ERROR,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // PATCH /api/todoitems/:id/toggle - Toggle le statut d'un TODOItem
  async toggleTODOItemStatus(req: IRequest, res: IResponse) {
    try {
      const { id } = req.params;
      const updatedTodoItem = await todoItemService.toggleTODOItemStatus(id);
      
      if (!updatedTodoItem) {
        return res.status(404).json({
          success: false,
          message: APP_CONSTANTS.MESSAGES.ERROR.TODO_ITEM_NOT_FOUND,
          timestamp: new Date().toISOString()
        });
      }

      res.json({
        success: true,
        message: APP_CONSTANTS.MESSAGES.SUCCESS.STATUS_TOGGLED,
        data: updatedTodoItem,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Erreur dans toggleTODOItemStatus', error);
      res.status(500).json({
        success: false,
        message: APP_CONSTANTS.MESSAGES.ERROR.SERVER_ERROR,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // DELETE /api/todoitems/:id - Supprimer un TODOItem
  async deleteTODOItem(req: IRequest, res: IResponse) {
    try {
      const { id } = req.params;
      const deletedTodoItem = await todoItemService.deleteTODOItem(id);
      
      if (!deletedTodoItem) {
        return res.status(404).json({
          success: false,
          message: APP_CONSTANTS.MESSAGES.ERROR.TODO_ITEM_NOT_FOUND,
          timestamp: new Date().toISOString()
        });
      }

      res.json({
        success: true,
        message: APP_CONSTANTS.MESSAGES.SUCCESS.TODO_ITEM_DELETED,
        data: deletedTodoItem,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Erreur dans deleteTODOItem', error);
      res.status(500).json({
        success: false,
        message: APP_CONSTANTS.MESSAGES.ERROR.SERVER_ERROR,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // GET /api/todoitems/stats - Récupérer les statistiques des TODOItems
  async getTODOItemStats(req: IRequest, res: IResponse) {
    try {
      const { todoListId } = req.query;
      const stats = await todoItemService.getTODOItemStats(todoListId as string);
      
      res.json({
        success: true,
        message: APP_CONSTANTS.MESSAGES.SUCCESS.STATS_RETRIEVED,
        data: stats,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Erreur dans getTODOItemStats', error);
      res.status(500).json({
        success: false,
        message: APP_CONSTANTS.MESSAGES.ERROR.SERVER_ERROR,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
}

export default new TODOItemController();
