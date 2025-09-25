import { Component, OnInit } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { Todo } from '../models/todo.model';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  loading = true;
  error: string | null = null;
  filter: 'all' | 'completed' | 'pending' = 'all';

  constructor(private todoService: TodoService) { }

  ngOnInit() {
    this.loadTodos();
  }

  loadTodos() {
    this.loading = true;
    this.error = null;
    
    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.todos = todos;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement des tâches';
        this.loading = false;
        console.error('Erreur:', error);
      }
    });
  }

  onTodoAdded(newTodo: Todo) {
    this.todos.unshift(newTodo);
  }

  onTodoUpdated(updatedTodo: Todo) {
    const index = this.todos.findIndex(todo => todo._id === updatedTodo._id);
    if (index !== -1) {
      this.todos[index] = updatedTodo;
    }
  }

  onTodoDeleted(deletedTodoId: string) {
    this.todos = this.todos.filter(todo => todo._id !== deletedTodoId);
  }

  get filteredTodos(): Todo[] {
    switch (this.filter) {
      case 'completed':
        return this.todos.filter(todo => todo.completed);
      case 'pending':
        return this.todos.filter(todo => !todo.completed);
      default:
        return this.todos;
    }
  }

  get completedCount(): number {
    return this.todos.filter(todo => todo.completed).length;
  }

  get pendingCount(): number {
    return this.todos.filter(todo => !todo.completed).length;
  }

  setFilter(filter: 'all' | 'completed' | 'pending') {
    this.filter = filter;
  }
}
