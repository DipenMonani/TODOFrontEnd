import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AppComponent } from './app.component';
import { SharedModule } from '../shared/shared.module';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRouting } from './app.routing';
import { TodoComponent } from './todo/todo.component';
import { HTTPListener, HTTPStatus } from './_helpers/http.listener';
import { ToDoService } from './_services/todo.service';
import { NgbModule, NgbPaginationModule, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { OwlDateTimeModule, OwlNativeDateTimeModule, OwlDateTimeIntl } from "ng-pick-datetime";
@NgModule({
  declarations: [
    AppComponent,
    TodoComponent
  ],
  imports: [
    BrowserModule,
    AppRouting,
    SharedModule,
    HttpClientModule,
    NgbPaginationModule,
    BrowserAnimationsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgbModule.forRoot(),
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
    })
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA, 
    NO_ERRORS_SCHEMA
  ],
  providers: [
    HTTPStatus,
    { provide: HTTP_INTERCEPTORS, useClass: HTTPListener, multi: true },
    ToDoService,  NgbActiveModal
  ],
  entryComponents: [TodoComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
