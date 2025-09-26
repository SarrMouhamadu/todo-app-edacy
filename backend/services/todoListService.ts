import { prisma } from '../lib/prisma';
import { 
  ITODOList, 
  ICreateTODOList, 
  IUpdateTODOList, 
  IQueryParams, 
  IPagination, 
  ITODOListStats,
  TODOStatus 
} from '../types/todo';
import logger from '../utils/logger';

class TODOListService {
  // Récupérer toutes les TODOList avec pagination et filtres
  async getAllTODOLists({ page = 1, limit = 10, status, search, sortBy = 'updatedAt', sortOrder = 'desc' }: IQueryParams) {
    try {
      const query: any = {};
      
      // Filtre par statut
      if (status) {
        query.status = status;
      }
      
      // Filtre par recherche
      if (search) {
        query.titre = {
          contains: search,
          mode: 'insensitive'
        };
      }
      
      // Configuration de la pagination
      const skip = (page - 1) * limit;
      
      // Configuration du tri
      const orderBy: any = {};
      orderBy[sortBy] = sortOrder;
      
      // Exécution de la requête
      const [todoLists, total] = await Promise.all([
        prisma.tODOList.findMany({
          where: query,
          orderBy,
          skip,
          take: parseInt(limit.toString()),
          include: {
            items: true
          }
        }),
        prisma.tODOList.count({ where: query })
      ]);
      
      logger.info('TODOLists récupérées', { count: todoLists.length, total, page, limit });
      
      return {
        todoLists,
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
      logger.error('Erreur lors de la récupération des TODOLists', error);
      throw error;
    }
  }

  // Récupérer une TODOList par ID
  async getTODOListById(id: string): Promise<ITODOList | null> {
    try {
      const todoList = await prisma.tODOList.findUnique({
        where: { id },
        include: {
          items: true
        }
      });
      
      if (todoList) {
        logger.info('TODOList récupérée', { id, titre: todoList.titre });
      } else {
        logger.warn('TODOList non trouvée', { id });
      }
      
      return todoList;
    } catch (error) {
      logger.error('Erreur lors de la récupération de la TODOList', { id, error: error.message });
      throw error;
    }
  }

  // Récupérer une TODOList par nom
  async getTODOListByName(titre: string): Promise<ITODOList | null> {
    try {
      const todoList = await prisma.tODOList.findFirst({
        where: { 
          titre: {
            equals: titre,
            mode: 'insensitive'
          }
        },
        include: {
          items: true
        }
      });
      
      if (todoList) {
        logger.info('TODOList récupérée par nom', { titre, id: todoList.id });
      } else {
        logger.warn('TODOList non trouvée par nom', { titre });
      }
      
      return todoList;
    } catch (error) {
      logger.error('Erreur lors de la récupération de la TODOList par nom', { titre, error: error.message });
      throw error;
    }
  }

  // Récupérer les TODOList récentes
  async getRecentTODOLists(limit: number = 5): Promise<ITODOList[]> {
    try {
      const todoLists = await prisma.tODOList.findMany({
        orderBy: { updatedAt: 'desc' },
        take: limit,
        include: {
          items: true
        }
      });
      
      logger.info('TODOLists récentes récupérées', { count: todoLists.length, limit });
      
      return todoLists;
    } catch (error) {
      logger.error('Erreur lors de la récupération des TODOLists récentes', error);
      throw error;
    }
  }

  // Créer une nouvelle TODOList
  async createTODOList(todoListData: ICreateTODOList): Promise<ITODOList> {
    try {
      const todoList = await prisma.tODOList.create({
        data: {
          titre: todoListData.titre,
          status: todoListData.status || 'TODO'
        },
        include: {
          items: true
        }
      });
      
      logger.info('TODOList créée', { 
        id: todoList.id, 
        titre: todoList.titre,
        status: todoList.status 
      });
      
      return todoList;
    } catch (error) {
      logger.error('Erreur lors de la création de la TODOList', { error: error.message });
      throw error;
    }
  }

  // Mettre à jour une TODOList
  async updateTODOList(id: string, updateData: IUpdateTODOList): Promise<ITODOList | null> {
    try {
      const todoList = await prisma.tODOList.update({
        where: { id },
        data: updateData,
        include: {
          items: true
        }
      });
      
      logger.info('TODOList mise à jour', { 
        id, 
        titre: todoList.titre,
        updatedFields: Object.keys(updateData)
      });
      
      return todoList;
    } catch (error) {
      if (error.code === 'P2025') {
        logger.warn('TODOList non trouvée pour mise à jour', { id });
        return null;
      }
      logger.error('Erreur lors de la mise à jour de la TODOList', { id, error: error.message });
      throw error;
    }
  }

  // Supprimer une TODOList
  async deleteTODOList(id: string): Promise<ITODOList | null> {
    try {
      const todoList = await prisma.tODOList.delete({
        where: { id },
        include: {
          items: true
        }
      });
      
      logger.info('TODOList supprimée', { id, titre: todoList.titre });
      
      return todoList;
    } catch (error) {
      if (error.code === 'P2025') {
        logger.warn('TODOList non trouvée pour suppression', { id });
        return null;
      }
      logger.error('Erreur lors de la suppression de la TODOList', { id, error: error.message });
      throw error;
    }
  }

  // Récupérer les statistiques des TODOLists
  async getTODOListStats(): Promise<ITODOListStats> {
    try {
      const [total, todo, inProgress, done] = await Promise.all([
        prisma.tODOList.count(),
        prisma.tODOList.count({ where: { status: 'TODO' } }),
        prisma.tODOList.count({ where: { status: 'IN_PROGRESS' } }),
        prisma.tODOList.count({ where: { status: 'DONE' } })
      ]);
      
      const stats = {
        total,
        todo,
        inProgress,
        done
      };
      
      logger.info('Statistiques TODOLists récupérées', stats);
      
      return stats;
    } catch (error) {
      logger.error('Erreur lors de la récupération des statistiques TODOLists', error);
      throw error;
    }
  }

  // Recherche avancée dans les TODOLists
  async searchTODOLists(searchParams: { query?: string; filters?: any; page?: number; limit?: number }) {
    try {
      const { query, filters = {}, page = 1, limit = 10 } = searchParams;
      
      const where: any = {};
      
      // Recherche textuelle
      if (query) {
        where.titre = {
          contains: query,
          mode: 'insensitive'
        };
      }
      
      // Appliquer les filtres
      if (filters.status) {
        where.status = filters.status;
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
      
      const [todoLists, total] = await Promise.all([
        prisma.tODOList.findMany({
          where,
          orderBy: { updatedAt: 'desc' },
          skip,
          take: parseInt(limit.toString()),
          include: {
            items: true
          }
        }),
        prisma.tODOList.count({ where })
      ]);
      
      logger.info('Recherche TODOLists effectuée', { 
        query, 
        filters, 
        results: todoLists.length, 
        total 
      });
      
      return {
        todoLists,
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
      logger.error('Erreur lors de la recherche TODOLists', error);
      throw error;
    }
  }
}

export default new TODOListService();
