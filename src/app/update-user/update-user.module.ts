import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UpdateUserComponent } from './update-user.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [UpdateUserComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: UpdateUserComponent }])
  ]
})
export class UpdateUserModule {}
