import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HomeComponent } from './pages/Home/home.component';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { LoginComponent } from './pages/login/login.component';
import { StateComponent } from './pages/state/state.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CuestionarioComponent } from './pages/cuestionario/cuestionario.component';
import { RegisterComponent } from './pages/register/register.component';
import { MainviewComponent } from './pages/mainview/mainview.component';
import { QuestionselectComponent } from './components/questionselect/questionselect.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LoadingComponent } from './components/loading/loading.component';
import { ModalNotificationComponent } from './components/modal-notification/modal-notification.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { ResultsComponent } from './pages/results/results.component';
import { AuthCallbackComponent } from './pages/auth-callback/auth-callback.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { MainviewGlobalComponent } from './pages/mainview-global/mainview-global.component';
import { ModelViewComponent } from './pages/model-view/model-view.component';


const routes: Routes = [
  {
    path: 'mainview-global', component: MainviewGlobalComponent
  } ,
  {
    path:'', component: HomeComponent
  },
  {
    path:'login', component: LoginComponent
  },
  {
    path:'cuestionario', component: CuestionarioComponent
  },

  {
    path: 'state/:id', component: StateComponent
  },
  {
    path: 'register', component: RegisterComponent
  },
  {
    path: 'mainview', component: MainviewComponent
  },
  {
    path: 'resultados/:id', component: ResultsComponent
  },
  {
    path: 'model-view', component: ModelViewComponent
  },
  { 
    path: 'auth-callback', component: AuthCallbackComponent 
  },
  { 
    path: '**', component: HomeComponent 

  },


];


const routerOptions: ExtraOptions = {
  useHash: true // <-- Importante para GitHub Pages
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    StateComponent,
    CuestionarioComponent,
    RegisterComponent,
    MainviewComponent,
    QuestionselectComponent,
    LoadingComponent,
    ModalNotificationComponent,
    ResultsComponent,
    AuthCallbackComponent,
    MainviewGlobalComponent,
    ModelViewComponent,

  ],
  imports: [
    MatCardModule,
    MatExpansionModule,
    MatGridListModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes,routerOptions),
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatSnackBarModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDialogModule,
    
  ],
  providers: [

    { provide: LocationStrategy, useClass: HashLocationStrategy } // <-- Se usa Hash
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
