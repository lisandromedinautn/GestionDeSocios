import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app'; // Asegúrate que el nombre del archivo sea app.component.ts

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
