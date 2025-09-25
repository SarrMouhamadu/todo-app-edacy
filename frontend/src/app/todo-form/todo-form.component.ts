import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TodoService } from '../services/todo.service';
import { Todo } from '../models/todo.model';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.css']
})
export class TodoFormComponent {
  @Output() todoAdded = new EventEmitter<Todo>();
  
  todoForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private todoService: TodoService
  ) {
    this.todoForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['']
    });
  }

  onSubmit() {
    if (this.todoForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const todoData = {
        title: this.todoForm.value.title,
        description: this.todoForm.value.description || ''
      };

      this.todoService.createTodo(todoData).subscribe({
        next: (newTodo) => {
          this.todoAdded.emit(newTodo);
          this.todoForm.reset();
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Erreur lors de la création du todo:', error);
          this.isSubmitting = false;
        }
      });
    }
  }

  get title() {
    return this.todoForm.get('title');
  }

  get description() {
    return this.todoForm.get('description');
  }
}
