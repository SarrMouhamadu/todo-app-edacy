import { prisma } from '../lib/prisma';
import { 
  ITODOItem, 
  ICreateTODOItem, 
  IUpdateTODOItem, 
  IItemQueryParams, 
  IPagination, 
  ITODOItemStats,
  ItemStatus 
} from '../types/todo';
import logger from '../utils/logger';

class TODOItemService {
  // Récupérer tous les TODOItems avec pagination et filtres
  async getAllTODOItems({ page = 1, limit = 10, status, search, todoListId }: IItemQueryParams) {
    try {
      const query: any = {};
      
      // Filtre par statut
      if (status) {
        query.status = status;
      }
      
      // Filtre par TODOList
      if (todoListId) {
        query.todoListId = todoListId;
      }
      
      // Filtre par recherche
      if (search) {
        query.libelle = {
          contains: search,
          mode: 'insensitive'
        };
      }
      
      // Configuration de la pagination
      const skip = (page - 1) * limit;
      
      // Exécution de la requête
      const [todoItems, total] = await Promise.all([
        prisma.tODOItem.findMany({
          where: query,
          orderBy: { updatedAt: 'desc' },
          skip,
          take: parseInt(limit.toString()),
          include: {
            todoList: true
          }
        }),
        prisma.tODOItem.count({ where: query })
      ]);
      
      logger.info('TODOItems récupérés', { count: todoItems.length, total, page, limit });
      
      return {
        todoItems,
        pagination: {
          page: parseInt(page.toString()),
          limit: parseInt(limit.toString()),
          total,
          pages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      logger.error('Erreur lors de la récupération des TODOItems', error);
      throw error;
    }
  }

  // Récupérer un TODOItem par ID
  async getTODOItemById(id: string): Promise<ITODOItem | null> {
    try {
      const todoItem = await prisma.tODOItem.findUnique({
        where: { id },
        include: {
          todoList: true
        }
      });
      
      if (todoItem) {
        logger.info('TODOItem récupéré', { id, libelle: todoItem.libelle });
      } else {
        logger.warn('TODOItem non trouvé', { id });
      }
      
      return todoItem;
    } catch (error) {
      logger.error('Erreur lors de la récupération du TODOItem', { id, error: error.message });
      throw error;
    }
  }

  // Récupérer les TODOItems par ID de TODOList
  async getTODOItemsByListId(todoListId: string): Promise<ITODOItem[]> {
    try {
      const todoItems = await prisma.tODOItem.findMany({
        where: { todoListId },
        orderBy: { createdAt: 'asc' },
        include: {
          todoList: true
        }
      });
      
      logger.info('TODOItems récupérés par TODOList', { todoListId, count: todoItems.length });
      
      return todoItems;
    } catch (error) {
      logger.error('Erreur lors de la récupération des TODOItems par TODOList', { todoListId, error: error.message });
      throw error;
    }
  }

  // Créer un nouveau TODOItem
  async createTODOItem(todoItemData: ICreateTODOItem): Promise<ITODOItem> {
    try {
      // Vérifier que la TODOList existe
      const todoList = await prisma.tODOList.findUnique({
        where: { id: todoItemData.todoListId }
      });
      
      if (!todoList) {
        throw new Error('TODOList non trouvée');
      }
      
      const todoItem = await prisma.tODOItem.create({
        data: {
          libelle: todoItemData.libelle,
          status: todoItemData.status || 'NOT_DONE',
          todoListId: todoItemData.todoListId
        },
        include: {
          todoList: true
        }
      });
      
      logger.info('TODOItem créé', { 
        id: todoItem.id, 
        libelle: todoItem.libelle,
        status: todoItem.status,
        todoListId: todoItem.todoListId
      });
      
      return todoItem;
    } catch (error) {
      logger.error('Erreur lors de la création du TODOItem', { error: error.message });
      throw error;
    }
  }

  // Mettre à jour un TODOItem
  async updateTODOItem(id: string, updateData: IUpdateTODOItem): Promise<ITODOItem | null> {
    try {
      const todoItem = await prisma.tODOItem.update({
        where: { id },
        data: updateData,
        include: {
          todoList: true
        }
      });
      
      logger.info('TODOItem mis à jour', { 
        id, 
        libelle: todoItem.libelle,
        updatedFields: Object.keys(updateData)
      });
      
      return todoItem;
    } catch (error) {
      if (error.code === 'P2025') {
        logger.warn('TODOItem non trouvé pour mise à jour', { id });
        return null;
      }
      logger.error('Erreur lors de la mise à jour du TODOItem', { id, error: error.message });
      throw error;
    }
  }

  // Supprimer un TODOItem
  async deleteTODOItem(id: string): Promise<ITODOItem | null> {
    try {
      const todoItem = await prisma.tODOItem.delete({
        where: { id },
        include: {
          todoList: true
        }
      });
      
      logger.info('TODOItem supprimé', { id, libelle: todoItem.libelle });
      
      return todoItem;
    } catch (error) {
      if (error.code === 'P2025') {
        logger.warn('TODOItem non trouvé pour suppression', { id });
        return null;
      }
      logger.error('Erreur lors de la suppression du TODOItem', { id, error: error.message });
      throw error;
    }
  }

  // Toggle le statut d'un TODOItem
  async toggleTODOItemStatus(id: string): Promise<ITODOItem | null> {
    try {
      const todoItem = await prisma.tODOItem.findUnique({
        where: { id }
      });
      
      if (!todoItem) {
        logger.warn('TODOItem non trouvé pour toggle', { id });
        return null;
      }
      
      const newStatus: ItemStatus = todoItem.status === 'DONE' ? 'NOT_DONE' : 'DONE';
      
      const updatedItem = await prisma.tODOItem.update({
        where: { id },
        data: { status: newStatus },
        include: {
          todoList: true
        }
      });
      
      logger.info('Statut du TODOItem modifié', { 
        id, 
        libelle: updatedItem.libelle,
        oldStatus: todoItem.status,
        newStatus: updatedItem.status
      });
      
      return updatedItem;
    } catch (error) {
      logger.error('Erreur lors du changement de statut du TODOItem', { id, error: error.message });
      throw error;
    }
  }

  // Récupérer les statistiques des TODOItems
  async getTODOItemStats(todoListId?: string): Promise<ITODOItemStats> {
    try {
      const where = todoListId ? { todoListId } : {};
      
      const [total, done, notDone] = await Promise.all([
        prisma.tODOItem.count({ where }),
        prisma.tODOItem.count({ where: { ...where, status: 'DONE' } }),
        prisma.tODOItem.count({ where: { ...where, status: 'NOT_DONE' } })
      ]);
      
      const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;
      
      const stats = {
        total,
        done,
        notDone,
        completionRate
      };
      
      logger.info('Statistiques TODOItems récupérées', { ...stats, todoListId });
      
      return stats;
    } catch (error) {
      logger.error('Erreur lors de la récupération des statistiques TODOItems', error);
      throw error;
    }
  }

  // Recherche avancée dans les TODOItems
  async searchTODOItems(searchParams: { query?: string; filters?: any; page?: number; limit?: number }) {
    try {
      const { query, filters = {}, page = 1, limit = 10 } = searchParams;
      
      const where: any = {};
      
      // Recherche textuelle
      if (query) {
        where.libelle = {
          contains: query,
          mode: 'insensitive'
        };
      }
      
      // Appliquer les filtres
      if (filters.status) {
        where.status = filters.status;
      }
      
      if (filters.todoListId) {
        where.todoListId = filters.todoListId;
      }
      
      if (filters.dateFrom || filters.dateTo) {
        where.createdAt = {};
        if (filters.dateFrom) {
          where.createdAt.gte = new Date(filters.dateFrom);
        }
        if (filters.dateTo) {
          where.createdAt.lte = new Date(filters.dateTo);
        }
      }
      
      const skip = (page - 1) * limit;
      
      const [todoItems, total] = await Promise.all([
        prisma.tODOItem.findMany({
          where,
          orderBy: { updatedAt: 'desc' },
          skip,
          take: parseInt(limit.toString()),
          include: {
            todoList: true
          }
        }),
        prisma.tODOItem.count({ where })
      ]);
      
      logger.info('Recherche TODOItems effectuée', { 
        query, 
        filters, 
        results: todoItems.length, 
        total 
      });
      
      return {
        todoItems,
        pagination: {
          page: parseInt(page.toString()),
          limit: parseInt(limit.toString()),
          total,
          pages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      logger.error('Erreur lors de la recherche TODOItems', error);
      throw error;
    }
  }
}

export default new TODOItemService();
