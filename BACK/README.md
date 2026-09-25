# BACK
1. npm init -y inicializar el proyecto 
2. cambiar a module
3. Instalamos las dependencias 
* npm i express 
* npm i nodemon
* npm i mongodb
* npm i mongoose
* npm i fs-extra
* npm i bcryptjs
* npm i jsonwebtoken
* npm i cors
* npm i dotenv
* npm i multer 
* npm i morgan
4. Organizar los archivos con los que voy a trabajar 
5. importamos las dependencias
6. creamos los archivos para la conexion a la bd y al servidor 
7. inciamos el CRUD de objetos
8. primero creamos el Schema de la bd 
9. creamos el controlador (logica o CRUD)
10. creamos las rutas
11. llamamos a esas rutas en el servidor


# FRONT 
1. Instalar angular npm i -g @angular/cli
2. crear nuestro proyecto ng new proyecto
3. responder preguntas ccs enter yes y yes none enter
4. entar al proyecto cd proyecto
5. generar los componentes ng generate component nombre del componente o carpeta/nombre componenete --skip-tests
6. ejecutar el servidor localhost:4200  ng serve / ng s
7. eliminar basura app.html  borramos todo excepto router-oulet
8. importar las vistas que deseamos que queden fijas en todas vistas // vamos a app.ts import { Navigation } from './components/navigation/navigation';
en el imports debemos agregarlo 
imports: [RouterOutlet, Navigation],
9. configuramos las rutas de nuestro navegador
app.routers.ts , importamos los componentes y dentro del export trazamos su camino
import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { PageNotFound } from './components/page-not-found/page-not-found';

export const routes: Routes = [
    {path: 'home', title: 'Home', component:Home},
    {path: 'login', title: 'Login', component: Login},
    {path: 'register', title: 'Register', component: Register},
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: '**', title: '404|Page Not Found', component: PageNotFound}
    
];
10. usar Router Link en nuestro navegador 
navigation.ts / 
import { RouterLink } from '@angular/router';
imports[RouterLink] lo activo en el imports
11. si tenemos un hipervinculo  asi <a href="">
lo modificamos asi <a routerLink="aqui la ruta tal cual la conguramos en app.routes.ts">

# USO DE BOOSTRAP
1. Instalar dependencias
# link https://getbootstrap.com/
en la primera vista encontramos npm i bootstrap@5.3.8
vamos a icons npm i bootstrap-icons
instalamos cors npm i cors
instalamos toastr npm i ngx-toastr
2. luego de instalar modificamos angular.json en nuestros estilos anexar 
 "styles": [
              "node_modules/bootstrap/scss/bootstrap.scss",
              "node_modules/bootstrap-icons/font/bootstrap-icons.min.css",
              "node_modules/ngx-toastr/toastr.css",
              "src/styles.css"
            ],
"scripts": [
              "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
            ],
3. podemos crear el diseno con bootstrap

verificar que cada link me envie a donde me debe enviar 
