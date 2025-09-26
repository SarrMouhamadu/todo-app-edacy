import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding...');

  // Créer des TODOLists de test
  const todoList1 = await prisma.tODOList.create({
    data: {
      titre: 'Projet Web',
      status: 'IN_PROGRESS',
      items: {
        create: [
          {
            libelle: 'Créer la page d\'accueil',
            status: 'DONE'
          },
          {
            libelle: 'Implémenter l\'authentification',
            status: 'IN_PROGRESS'
          },
          {
            libelle: 'Ajouter les tests unitaires',
            status: 'NOT_DONE'
          }
        ]
      }
    }
  });

  const todoList2 = await prisma.tODOList.create({
    data: {
      titre: 'Formation JavaScript',
      status: 'TODO',
      items: {
        create: [
          {
            libelle: 'Apprendre les bases de JavaScript',
            status: 'DONE'
          },
          {
            libelle: 'Maîtriser les promesses',
            status: 'NOT_DONE'
          },
          {
            libelle: 'Comprendre les modules ES6',
            status: 'NOT_DONE'
          }
        ]
      }
    }
  });

  const todoList3 = await prisma.tODOList.create({
    data: {
      titre: 'Ménage de la maison',
      status: 'DONE',
      items: {
        create: [
          {
            libelle: 'Nettoyer la cuisine',
            status: 'DONE'
          },
          {
            libelle: 'Ranger le salon',
            status: 'DONE'
          },
          {
            libelle: 'Faire la lessive',
            status: 'DONE'
          }
        ]
      }
    }
  });

  const todoList4 = await prisma.tODOList.create({
    data: {
      titre: 'Préparation voyage',
      status: 'IN_PROGRESS',
      items: {
        create: [
          {
            libelle: 'Réserver les billets d\'avion',
            status: 'DONE'
          },
          {
            libelle: 'Trouver un hôtel',
            status: 'IN_PROGRESS'
          },
          {
            libelle: 'Préparer les valises',
            status: 'NOT_DONE'
          },
          {
            libelle: 'Vérifier les documents',
            status: 'NOT_DONE'
          }
        ]
      }
    }
  });

  const todoList5 = await prisma.tODOList.create({
    data: {
      titre: 'Apprentissage React',
      status: 'TODO',
      items: {
        create: [
          {
            libelle: 'Installer React',
            status: 'NOT_DONE'
          },
          {
            libelle: 'Comprendre les composants',
            status: 'NOT_DONE'
          },
          {
            libelle: 'Apprendre les hooks',
            status: 'NOT_DONE'
          }
        ]
      }
    }
  });

  console.log('✅ TODOLists créées:');
  console.log(`  - ${todoList1.titre} (${todoList1.status})`);
  console.log(`  - ${todoList2.titre} (${todoList2.status})`);
  console.log(`  - ${todoList3.titre} (${todoList3.status})`);
  console.log(`  - ${todoList4.titre} (${todoList4.status})`);
  console.log(`  - ${todoList5.titre} (${todoList5.status})`);

  // Afficher les statistiques
  const stats = await prisma.tODOList.aggregate({
    _count: {
      id: true
    }
  });

  const itemStats = await prisma.tODOItem.aggregate({
    _count: {
      id: true
    }
  });

  console.log(`📊 Statistiques:`);
  console.log(`  - ${stats._count.id} TODOLists créées`);
  console.log(`  - ${itemStats._count.id} TODOItems créés`);

  console.log('🎉 Seeding terminé avec succès!');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
