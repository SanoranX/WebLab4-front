import {NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';

import { WorkComponent } from './work/work.component';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {LoginComponent} from './login/login.component';
import { VisualComponent } from './visual/visual.component';


const appRoutes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'admin', component: WorkComponent }
];

@NgModule({
  // tslint:disable-next-line:max-line-length
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    HttpClientModule,
  ],
  declarations: [
    AppComponent,
    WorkComponent,
    LoginComponent,
    VisualComponent
  ],
  bootstrap: [ AppComponent ],
  providers: []

})
export class AppModule {}
