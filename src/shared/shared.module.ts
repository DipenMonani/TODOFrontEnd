import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
@NgModule({
    imports: [CommonModule, ReactiveFormsModule],
    declarations: [
    ],
    exports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule
    ],
    providers: [],
    entryComponents: []
  })
  export class SharedModule {}
  