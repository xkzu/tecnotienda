import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { RecoveryPasswordComponent } from './recovery-password.component';

const routes: Routes = [
  { path: '', component: RecoveryPasswordComponent }
];

@NgModule({
  declarations: [
    RecoveryPasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class RecoveryPasswordModule { }
