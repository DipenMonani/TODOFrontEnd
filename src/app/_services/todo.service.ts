import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map, catchError, finalize } from "rxjs/operators";
import { throwError, BehaviorSubject, of, Observable } from "rxjs";
import { ToDo } from '../_models/todo.modal';

@Injectable({
    providedIn: "root"
})
export class ToDoService {
    API_URL = `${environment.apiUrl}/api/todos`;
    constructor(private http: HttpClient) { }
    /* get All */
    getTodos(filter,
        pageNumber,
        pageSize,
        sortField,
        sortOrder): Observable<any[]> {
        return this.http.get<any[]>(`${this.API_URL}/events`,
            {
              params: new HttpParams().set('keyword', filter.keyword || '')
            .set('pageId', pageNumber.toString())
            .set('limit', pageSize.toString())
            }
        );
    }

   
    getTodoById(id: number): Observable<any> {
        return this.http.get<any[]>(`${this.API_URL}/events/${id}`);
    }

    add(todo: ToDo): Observable<any> {
        var payload = {
            title: todo.title,
            description: todo.description,
            createdDate: todo.eventTime

        }
       
        return this.http.post<any>(`${this.API_URL}/events`, payload);
    }

    
    update(todo: ToDo): Observable<any> {
        var todo_={
            title: todo.title,
            description: todo.description,
            createdDate: todo.eventTime
        }
        
        return this.http.put<any>(`${this.API_URL}/events/${todo.todoId}`, todo_);
    }

    delete(todoIds): Observable<any> {
        const todo = {
            "eventIdList": todoIds
        }
      
        return this.http.delete(`${this.API_URL}/events`,{
            params: new HttpParams().set('ids', todoIds)} );
    }

}
