import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
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
import { ContactComponent } from './pages/contact/contact.component';
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


const routes: Routes = [
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
    path: 'contact', component: ContactComponent
  },
  {
    path: 'state', component: StateComponent
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
    path: 'auth-callback', component: AuthCallbackComponent 
  },
];


const routerOptions: ExtraOptions = {
  useHash: true // <-- Importante para GitHub Pages
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    StateComponent,
    ContactComponent,
    CuestionarioComponent,
    RegisterComponent,
    MainviewComponent,
    QuestionselectComponent,
    LoadingComponent,
    ModalNotificationComponent,
    ResultsComponent,
    AuthCallbackComponent,

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
