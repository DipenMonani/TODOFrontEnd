import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { ToDo } from '../_models/todo.modal';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToDoService } from '../_services/todo.service';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { NoWhitespaceValidator } from '../_directives/no-whitespace.validator';
import { DateTimeAdapter } from 'ng-pick-datetime';
@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  todoForm: FormGroup;
  showDeleteTodoButton: boolean = false;
  public hasFormErrors = false;
  todoList: any[] = [];
  isMainCheckboxSelected = false;

  private modelRef: NgbModalRef;

  public currentPage = 1;

  public totalrecords = 1;

  public pagesize = 10;

  public filterKeyword = '';

  allSelectedCheckbox = false;
  todoSelectedIds: string;
  todoSelectedIds_;
  today = new Date();
  minDate = new Date(
    this.today.getFullYear(),
    this.today.getMonth(),
    this.today.getDate(),
    this.today.getHours(),
    this.today.getMinutes()
  );
  private selectedToDo: ToDo = new ToDo();
  public sortField: string = "title";
  public sortOrder: string = 'desc';
  constructor(private modalService: NgbModal,
    private dateTimeAdapter: DateTimeAdapter<any>,
    private formBuilder: FormBuilder,
    private todoService: ToDoService,
    private toastr: ToastrService) {
  }

  ngOnInit() {
    this.getTodoList();
  }
  getTodoList() {
    this.todoService.getTodos({
      keyword: this.filterKeyword
    }, this.currentPage, this.pagesize, this.sortField, this.sortOrder).pipe(
      catchError(() => of([]))
    )
      .subscribe((res: any) => {
        if (res && res.data) {
          if (res.data.content) {
            this.todoList = res.data.content.map(element => {
              element.selected = false;
              return element;
            });
          }
          this.totalrecords = res.data.totalElements;
        }
      });
  }
  changePage() {
    this.getTodoList();
  }

  createForm() {
    this.todoForm = this.formBuilder.group({
      id: [this.selectedToDo.todoId],
      title: [this.selectedToDo.title, [Validators.required, NoWhitespaceValidator]],
      description: [this.selectedToDo.description, [NoWhitespaceValidator]],
      eventTime: [this.selectedToDo.eventTime, [Validators.required]]
    });
  }
  filterTextChange() {

    this.getTodoList();
  }
  ShowModal(content) {
    this.selectedToDo = new ToDo();
    this.modelRef = this.modalService
      .open(content, {
        windowClass: "add-new-todo"
      });
    this.createForm();
  }

  showEditModal(content, id) {
    if (id != null) {
      this.todoService.getTodoById(id).subscribe(res => {
        console.log(res);
        if (res && res.data) {
          if(res.data.id){
            this.selectedToDo.todoId = res.data.id;
          }
         
          this.selectedToDo.description = res.data.description;
          this.selectedToDo.title = res.data.title;

          this.createForm();
          if (res.data && res.data.formatedDate) {
            this.selectedToDo.eventTime = res.data.formatedDate;

            this.todoForm.controls.eventTime.setValue(new Date(this.selectedToDo.eventTime));
          } this.modelRef = this.modalService
            .open(content, {
              windowClass: "edit-todo"
            });
        }
      });
    }

  }

  save(content) {
    this.hasFormErrors = false;

    const controls = this.todoForm.controls;
    /** check form */
    if (this.todoForm.invalid) {
      Object.keys(controls).forEach(controlName => {
        controls[controlName].markAsTouched()
      }

      );
      this.hasFormErrors = true;
      return;
    }

    const todo = this.prepareData();
    if (todo.todoId) {
      this.update(todo);
    } else {
      this.createToDo(todo);
    }

  }
  get f() { return this.todoForm.controls; }
  showOptions() {
    if (this.todoSelectedIds) {
      this.showDeleteTodoButton = true;
    } else {
      this.showDeleteTodoButton = false;
    }
  }
  prepareData() {
    const controls = this.todoForm.controls;
    const todo = new ToDo();
    if (this.selectedToDo.todoId) {
      todo.todoId = this.selectedToDo.todoId;
    }
    todo.title = controls.title.value;
    todo.description = controls.description.value;
    todo.eventTime = controls.eventTime.value;
    var startDate_ = new Date(todo.eventTime);
    var start_month = ("0" + (startDate_.getMonth() + 1)).slice(-2);
    var eventDateTime_ =
      ("0" + startDate_.getDate()).slice(-2) + "/" + start_month + "/" +
      startDate_.getFullYear() +
      " " + startDate_.getHours() + ":" + startDate_.getMinutes() + ":" + startDate_.getSeconds();
    console.log(eventDateTime_);
    todo.eventTime = eventDateTime_;
    return todo;

  }
  selectTodos() {
    this.todoSelectedIds_ = this.todoList
      .filter(element => element.selected)
      .map(element => element.id);
    this.todoSelectedIds = this.todoSelectedIds_.join(",");
    this.showOptions();
  }
  selectAll() {

    this.allSelectedCheckbox = !this.allSelectedCheckbox;
    if (this.allSelectedCheckbox) {
      this.todoSelectedIds_ = this.todoList.map(element => {
        element.selected = true;
        return element;
      });
      this.todoSelectedIds = this.todoSelectedIds_.join(",");
      this.showOptions();
    } else {
      this.todoSelectedIds_ = this.todoList.map(element => {
        element.selected = false;
        return element;
      });
      this.showDeleteTodoButton = false;
      this.todoSelectedIds = this.todoSelectedIds_.join(",");
    }
    this.todoSelectedIds_ = this.todoList
      .filter(element => element.selected)
      .map(element => element.id);
    this.todoSelectedIds = this.todoSelectedIds_.join(",");
    

  }
  update(todo: ToDo) {
    this.todoService.update(todo).subscribe(res => {
      if (res && res.status == "OK") {
        this.toastr.success("Event updated successfully !", "Success");
        this.modelRef.close();
        this.selectedToDo = new ToDo();
        this.getTodoList();
      } else {
        this.toastr.error(res.message, "Error");
      }
    });
  }

  createToDo(todo: ToDo) {

    this.todoService.add(todo).subscribe(res => {
      if (res.status == "OK") {
        this.modelRef.close();
        this.toastr.success(res.message);
        this.getTodoList();
      } else {
        this.toastr.error(res.messag);
      }
    });
  }
  confirmDelete(content) {
    this.modalService
      .open(content, {
        windowClass: "remove-todo"
      }).result.then(res => {
        console.log(this.todoSelectedIds);
        this.todoService.delete(this.todoSelectedIds).subscribe(res => {

          if (res && res.status == "OK") {
            this.toastr.success(res.message);
            this.getTodoList();
          }
          this.showDeleteTodoButton = false;
        }, err => {
          // this.toastr.error("error", "Error");
        })
      }).catch(() => { });
  }
  sort(sortField, sortOrder) {
    this.sortField = sortField;
    this.sortOrder = sortOrder;
    this.getTodoList();

  }
}
