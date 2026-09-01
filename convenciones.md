# Convenciones - GestionDeSocios

Centro de Jubilados - Sistema de Gestión de Socios

## 1. Stack

- **Backend**: NestJS 11 (`src/main.ts`), TypeORM 0.3.28, SQLite (`database.sqlite`), `class-validator` + `class-transformer`. Módulos: `src/socio`, `src/estado`, `src/caja`, `src/direccion`, `src/telefono`, `src/cuota`.
- **Frontend**: Angular 20 standalone (`socios-frontend/src/app`), `CommonModule` + `FormsModule`, `HttpClient`, sin librería UI (no Angular Material/PrimeNG/ag-grid). Rutas en `socios-frontend/src/app/app.routes.ts`.
- **Tooling**: Node 22, TypeScript 5.7/5.8, Prettier (`singleQuote:true`, `trailingComma:"all"` en `.prettierrc:1-4`), ESLint `recommendedTypeChecked` + `prettier` (`eslint.config.mjs:7-38`), `nest-cli.json`, `angular.json`.

## 2. Estructura

```
src/socio/entities/socio.entity.ts       # Entity con ManyToOne Estado/Caja, ManyToMany Telefono
src/estado/entities/estado.entity.ts     # id, nombre, descripcion
socios-frontend/src/app/socio/socio.component.ts|html|css  # Listado principal, filtrado client-side actual
socios-frontend/src/app/models/socio.model.ts              # Interfaces Socio/Estado/Caja
socios-frontend/src/app/services/socio.service.ts          # API_URL http://localhost:3000/socio
```

## 3. Convenciones de Código

- TS strict, DTOs en `src/*/dto/` con validación.
- Backend `findAll` debe incluir `relations: ['direccion','caja','estado','telefonos']` (`src/socio/socio.service.ts:32`).
- Frontend components `standalone:true`, `imports: [CommonModule, FormsModule]`, `providedIn: 'root'` para services.
- **Prohibido hardcodear dominio**: nunca `=== 'Activo'` / `=== 'Adherente'` en TS/HTML/CSS. Fuente de verdad es `GET /estado` (`src/estado/estado.service.ts:20`). Badge actual en `socios-frontend/src/app/socio/socio.component.html:54` está hardcodeado y debe migrar a función `getEstadoClass(estado)` por `id`.
- Normalizar búsqueda con `normalize('NFD').replace(/[\u0300-\u036f]/g,'')` + `toLowerCase()` para acentos.

## 4. Reglas de Dependencias - CRÍTICO

- **PROHIBIDO `npm install` / `ng add` sin permiso explícito del owner.** Consultar antes en cada PR/issue.
- **PROHIBIDO dependencias con <24h de antigüedad en npm.** Verificar con `npm view <pkg> time` o `npm view <pkg> dist.publishTime` antes de proponer.
- Preferir implementación nativa Angular antes que librerías de tabla/filtro (ag-grid, primeng, ngx-datatable). Registrar en PR la alternativa descartada y motivo.
- No actualizar major de Angular/Nest sin issue previo.

## 5. API y Datos

- Controllers con prefijo singular: `@Controller('socio')` (`src/socio/socio.controller.ts:14`), `@Controller('estado')`.
- `Socio.estado` es `ManyToOne` (`src/socio/entities/socio.entity.ts:58`), puede venir `undefined` en frontend (`models/socio.model.ts:23` -> `nombre?`). Defender con `socio.estado?.nombre`.
- `API_URL` hardcodeada a `http://localhost:3000` (`socios-frontend/src/app/services/socio.service.ts:11`); a futuro migrar a `environment.ts`.

## 6. Filtros y Búsqueda (Filtro complejo)

- **Fase 1**: filtrado 100% client-side (103 registros actuales), priorizado front. Filtro por Estado dinámico (no hardcodeado): dropdown anclado al `<th>Estado</th>` con checkboxes generados desde `GET /estado`, `Seleccionar todo/Limpiar/Cerrar`, contador en header, cierre on-click-outside/ESC. Se resetea al recargar (sin persistencia).
- Lógica: `estadoFilter` interno `OR` (un socio no tiene dos estados), combinado con `searchTerm` en `AND` (la lupa respeta filtros activos). `startWith` con normalización de tildes `normalize('NFD')` + `toLowerCase()`. No hardcodear `Activo/Adherente`; fuente es `GET /estado`.
- Paginación client-side: `pageSize 20` por defecto (6 páginas para 103), `pages` con delta 2, `paginate` slice. Ordenamiento default `apellido asc`, configurable vía `sortBy` (`apellido|nombre|dni|numeroSocio|estado`) y `sortDir`. Utilidades puras en `socios-frontend/src/app/socio/socio.utils.ts:1` y `src/socio/socio.filter.spec.ts:1` para test.
- No hardcodear clases CSS de badge; mapear `estado.id -> clase` determinístico si se extiende. No crear estado `pendiente` (regla de negocio existente).

## 7. Estilos

- Paleta en `socios-frontend/src/app/socio/socio.component.css:8-15`: `--primary:#713e5a`, `--accent-green:#63a375`, `--border-color:#edc79b`, etc. Mantener variables CSS.
- Budgets Angular: `anyComponentStyle 16kB/25kB` en `angular.json:33-45` para permitir fuentes inline y estilos de filtro + paginación.

## 8. Git - Ramas y Commits

- Branch principal `main` protegido. Usar `develop` como integración. **Dos ramas diferenciadas**: `feature/*` o `test/*` para el filtro complejo — el commit actual se retrasa hasta que la verificación con testing esté verde; la rama de verificación puede nombrarse `test/filtro-complejo` (ej. `test/filtro-complejo` actual).
- **Commits**: prefijo `feat:`/`fix:`/`test:`/`chore:` en español, **no mencionar `excel` en el mensaje**; usar `filtro complejo por estado con paginación y ordenamiento` o similar. Ej: `feat: filtro complejo por estado con paginación y ordenamiento`. No `force push`. Verificar `git status`/`diff` antes de commit. Compartir vía PR, no push directo a `main`.
- Flujo: `feature/*` o `test/*` → PR a `develop` → tests verdes → PR a `main`.

## 9. Testing - Jest (front y back) - CRÍTICO

- **Framework**: Jest 30.5.0 (backend `package.json:48` y frontend `socios-frontend/package.json:13`), `jest-preset-angular 17.0.0`, `ts-jest 29.4.12`, `jest-environment-jsdom 30.5.0`. Todos con antigüedad >24h verificada (`npm view <pkg> time`). Instalación autorizada explícitamente.
- **Backend**: config en `package.json:60-76` (`rootDir: src`, `testRegex: .*\\.spec\\.ts`, `ts-jest`). Cada módulo debe tener spec: `src/socio/*.spec.ts`, `src/estado/*.spec.ts`, `src/caja/*.spec.ts`, `src/direccion/*.spec.ts`, `src/telefono/*.spec.ts`, `src/cuota/*.spec.ts`, más `src/socio/socio.filter.spec.ts` para lógica de filtro/paginación/orden. Mocks con `getRepositoryToken` y `jest.fn()`.
- **Frontend**: config en `socios-frontend/jest.config.js:1` (`preset: jest-preset-angular`, `setupFilesAfterEnv: setup-jest.ts` con `setupZoneTestEnv` de `jest-preset-angular/setup-env/zone`, `testEnvironment: jsdom`). `tsconfig.spec.json:7` incluye `jest`. Scripts: `npm test` (`jest --passWithNoTests`), `npm run test:watch`, `npm run test:cov`. Tests en `socios-frontend/src/app/socio/socio.utils.spec.ts` (lógica pura) y `socio.component.spec.ts` (componente con `TestBed`, mocks `SocioService`/`EstadoService`).
- **Regla de oro**: **Ningún push a `main` sin `npm test` verde en ambos proyectos y `npm run build`/`ng build` ok.** Ejecutar `npm test` en raíz (backend, 8 suites, 63 tests) y en `socios-frontend` (2 suites, 19 tests) antes de PR. Los tests deben ser aprobados (approved) antes de merge.

## 10. Verificación

- Antes de PR: `npm run lint`, `npm run build` (backend) y `ng build` (frontend), `npm test` (ambos), prueba manual con `database.sqlite` real. Revisar filtros OR, startWith con tildes (María = maria), paginación 20, orden apellido.
