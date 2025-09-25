import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { Todo } from '../models/todo.model';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() todoUpdated = new EventEmitter<Todo>();
  @Output() todoDeleted = new EventEmitter<string>();

  isEditing = false;
  editTitle = '';
  editDescription = '';
  isUpdating = false;
  isDeleting = false;

  constructor(private todoService: TodoService) { }

  toggleComplete() {
    if (this.isUpdating) return;
    
    this.isUpdating = true;
    this.todoService.toggleTodo(this.todo._id!, !this.todo.completed).subscribe({
      next: (updatedTodo) => {
        this.todoUpdated.emit(updatedTodo);
        this.isUpdating = false;
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour:', error);
        this.isUpdating = false;
      }
    });
  }

  startEdit() {
    this.isEditing = true;
    this.editTitle = this.todo.title;
    this.editDescription = this.todo.description || '';
  }

  cancelEdit() {
    this.isEditing = false;
    this.editTitle = '';
    this.editDescription = '';
  }

  saveEdit() {
    if (this.isUpdating || !this.editTitle.trim()) return;

    this.isUpdating = true;
    const updateData = {
      title: this.editTitle.trim(),
      description: this.editDescription.trim()
    };

    this.todoService.updateTodo(this.todo._id!, updateData).subscribe({
      next: (updatedTodo) => {
        this.todoUpdated.emit(updatedTodo);
        this.isEditing = false;
        this.isUpdating = false;
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour:', error);
        this.isUpdating = false;
      }
    });
  }

  deleteTodo() {
    if (this.isDeleting) return;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      this.isDeleting = true;
      this.todoService.deleteTodo(this.todo._id!).subscribe({
        next: () => {
          this.todoDeleted.emit(this.todo._id!);
          this.isDeleting = false;
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          this.isDeleting = false;
        }
      });
    }
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
