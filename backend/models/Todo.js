const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true,
    minlength: [3, 'Le titre doit contenir au moins 3 caractères'],
    maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'La description ne peut pas dépasser 500 caractères'],
    default: ''
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high'],
      message: 'La priorité doit être low, medium ou high'
    },
    default: 'medium'
  },
  dueDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value > new Date();
      },
      message: 'La date d\'échéance doit être dans le futur'
    }
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Un tag ne peut pas dépasser 20 caractères']
  }],
  category: {
    type: String,
    trim: true,
    maxlength: [50, 'La catégorie ne peut pas dépasser 50 caractères'],
    default: 'general'
  },
  estimatedTime: {
    type: Number, // en minutes
    min: [0, 'Le temps estimé ne peut pas être négatif'],
    max: [1440, 'Le temps estimé ne peut pas dépasser 24 heures']
  },
  actualTime: {
    type: Number, // en minutes
    min: [0, 'Le temps réel ne peut pas être négatif'],
    max: [1440, 'Le temps réel ne peut pas dépasser 24 heures']
  },
  progress: {
    type: Number,
    min: [0, 'Le progrès ne peut pas être négatif'],
    max: [100, 'Le progrès ne peut pas dépasser 100%'],
    default: 0
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  archivedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour optimiser les requêtes
todoSchema.index({ title: 'text', description: 'text' });
todoSchema.index({ completed: 1 });
todoSchema.index({ priority: 1 });
todoSchema.index({ createdAt: -1 });
todoSchema.index({ updatedAt: -1 });
todoSchema.index({ dueDate: 1 });
todoSchema.index({ category: 1 });
todoSchema.index({ isArchived: 1 });
todoSchema.index({ completed: 1, priority: 1, createdAt: -1 });

// Virtual pour calculer si le todo est en retard
todoSchema.virtual('isOverdue').get(function() {
  return this.dueDate && !this.completed && new Date() > this.dueDate;
});

// Virtual pour calculer le temps restant
todoSchema.virtual('timeRemaining').get(function() {
  if (!this.dueDate) return null;
  const now = new Date();
  const diff = this.dueDate - now;
  return diff > 0 ? diff : 0;
});

// Virtual pour calculer l'efficacité
todoSchema.virtual('efficiency').get(function() {
  if (!this.estimatedTime || !this.actualTime) return null;
  return Math.round((this.estimatedTime / this.actualTime) * 100);
});

// Middleware pre-save pour mettre à jour updatedAt
todoSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Mettre à jour completedAt si le statut change
  if (this.isModified('completed')) {
    if (this.completed && !this.completedAt) {
      this.completedAt = new Date();
    } else if (!this.completed && this.completedAt) {
      this.completedAt = undefined;
    }
  }
  
  // Archiver automatiquement si marqué comme archivé
  if (this.isModified('isArchived') && this.isArchived && !this.archivedAt) {
    this.archivedAt = new Date();
  }
  
  next();
});

// Méthodes d'instance
todoSchema.methods.toggle = function() {
  this.completed = !this.completed;
  return this.save();
};

todoSchema.methods.archive = function() {
  this.isArchived = true;
  this.archivedAt = new Date();
  return this.save();
};

todoSchema.methods.unarchive = function() {
  this.isArchived = false;
  this.archivedAt = undefined;
  return this.save();
};

todoSchema.methods.updateProgress = function(progress) {
  this.progress = Math.max(0, Math.min(100, progress));
  return this.save();
};

// Méthodes statiques
todoSchema.statics.findByStatus = function(status) {
  if (status === 'all') return this.find();
  return this.find({ completed: status === 'completed' });
};

todoSchema.statics.findByPriority = function(priority) {
  return this.find({ priority });
};

todoSchema.statics.findOverdue = function() {
  return this.find({
    dueDate: { $lt: new Date() },
    completed: false
  });
};

todoSchema.statics.findUpcoming = function(days = 7) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return this.find({
    dueDate: { $lte: futureDate, $gte: new Date() },
    completed: false
  });
};

todoSchema.statics.getStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        completed: { $sum: { $cond: ['$completed', 1, 0] } },
        pending: { $sum: { $cond: ['$completed', 0, 1] } },
        overdue: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $ne: ['$dueDate', null] },
                  { $lt: ['$dueDate', new Date()] },
                  { $eq: ['$completed', false] }
                ]
              },
              1,
              0
            ]
          }
        },
        highPriority: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } },
        mediumPriority: { $sum: { $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0] } },
        lowPriority: { $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] } }
      }
    }
  ]);
};

// Transformation JSON pour masquer les champs sensibles
todoSchema.methods.toJSON = function() {
  const todo = this.toObject();
  delete todo.__v;
  return todo;
};

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
