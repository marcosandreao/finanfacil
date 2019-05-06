import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { FormResolver } from './form/form-resolver';
import { HomeGuard } from './core/home.guard';
import { UserResolver } from './core/user-resolver';

const routes: Routes = [
  { path: 'list', loadChildren: './list/list.module#ListModule', resolve: { user: UserResolver } },
  { path: 'form', loadChildren: './form/form.module#FormModule', resolve: { user: UserResolver } },
  {
    path: 'form/:id', loadChildren: './form/form.module#FormModule', resolve: {
      data: FormResolver,
      user: UserResolver
    }
  },
  { path: '', loadChildren: './home/home.module#HomePageModule', canActivate: [HomeGuard] }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  providers: [
    FormResolver,
    HomeGuard,
    UserResolver,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
