# Gestión de Socios — Centro de Jubilados

Sistema de gestión de socios para centro de jubilados. CRUD de socios, cuotas, cajas, estados, direcciones y teléfonos. Filtrado avanzado en el listado principal sin hardcodeo.

> Stack: **NestJS 11 + TypeORM + SQLite** (backend) y **Angular 20 standalone** (frontend). Ver `convenciones.md` para reglas de dependencias, branching y testing.

## Stack y requisitos

- **Backend**: NestJS 11, TypeORM 0.3.28, SQLite (`database.sqlite`), `class-validator`/`class-transformer`. Node 22, TypeScript 5.7. Entrada `src/main.ts:5`, módulos en `src/socio`, `src/estado`, `src/caja`, `src/direccion`, `src/telefono`, `src/cuota`.
- **Frontend**: Angular 20 standalone (`socios-frontend/src/app`), `CommonModule`+`FormsModule`, `HttpClient`, `RxJS 7.8`. Rutas en `socios-frontend/src/app/app.routes.ts:10`. Sin librería UI externa.
- **Tooling**: Prettier (`singleQuote:true` en `.prettierrc:1`), ESLint `recommendedTypeChecked` (`eslint.config.mjs:7`), `nest-cli.json`, `angular.json` (budgets `anyComponentStyle 16kB/25kB` en `angular.json:33`).

## Estructura del repo

```
.
├── src/                          # Backend NestJS
│   ├── main.ts                   # Bootstrap + CORS localhost:4200 + ValidationPipe
│   ├── app.module.ts             # TypeOrmModule sqlite + imports de módulos
│   ├── socio/                    # Entity Socio (ManyToOne Estado/Caja, ManyToMany Telefono, OneToMany Cuota)
│   │   ├── entities/socio.entity.ts
│   │   ├── dto/
│   │   ├── socio.service.ts      # findAll con relations, create/update/remove
│   │   ├── socio.controller.ts   # @Controller('socio')
│   │   ├── socio.service.spec.ts
│   │   └── socio.filter.spec.ts  # tests del filtro complejo (OR, startWith, tildes, paginación)
│   ├── estado/                   # Entity Estado {id,nombre,descripcion}
│   │   ├── estado.service.spec.ts
│   │   └── ...
│   ├── caja/ caja.service.spec.ts
│   ├── direccion/ direccion.service.spec.ts
│   ├── telefono/ telefono.service.spec.ts
│   └── cuota/ cuota.service.spec.ts
├── socios-frontend/              # Frontend Angular
│   ├── src/app/
│   │   ├── socio/
│   │   │   ├── socio.component.ts     # Listado + filtro complejo + paginación + orden
│   │   │   ├── socio.component.html   # Dropdown dinámico por Estado, sort-bar, paginador
│   │   │   ├── socio.component.css    # Paleta artesanal + dropdown/paginación
│   │   │   ├── socio.utils.ts         # filterSocios, sortSocios, paginate, normalize (testeable)
│   │   │   ├── socio.utils.spec.ts
│   │   │   └── socio.component.spec.ts
│   │   ├── models/socio.model.ts
│   │   ├── services/socio.service.ts  # API_URL http://localhost:3000/socio
│   │   │           estado.service.ts  # GET /estado (fuente dinámica, no hardcode)
│   │   └── app.routes.ts
│   ├── jest.config.js            # preset jest-preset-angular 17.0.0, jsdom
│   ├── setup-jest.ts             # setupZoneTestEnv
│   └── tsconfig.spec.json
├── database.sqlite               # DB SQLite (103 socios, 2 estados: Activo/Adherente)
├── iniciar_sistema.bat           # Script Windows: install + start backend + frontend + abre navegador
├── convenciones.md               # Reglas de código, dependencias (>24h), git flow, testing
└── package.json / socios-frontend/package.json
```

Ver `convenciones.md:2` para detalle de `src/socio/entities/socio.entity.ts:58` y `socios-frontend/src/app/models/socio.model.ts:21`.

## Instalación

```bash
# Requisitos: Node 22
# Backend (raíz)
npm install

# Frontend
cd socios-frontend
npm install
cd ..
```

O ejecutar `iniciar_sistema.bat` en Windows: verifica Node, instala `node_modules` si falta, inicia `NestJS_Backend` (`npm run start:dev`) y `Angular_Frontend` (`npm start`), espera 15s y abre `http://localhost:4200`.

## Ejecución

```bash
# Backend
npm run start:dev   # http://localhost:3000 - watch
npm run start       # dev
npm run start:prod  # node dist/main

# Frontend (desde socios-frontend/)
npm start           # ng serve -> http://localhost:4200
npm run build       # ng build (prod, budgets 16kB/25kB)
npm run watch       # build --watch development
```

CORS backend habilitado sólo para `http://localhost:4200` en `src/main.ts:18`.

## Funcionalidades principales

### Socios CRUD
- Listado en `socios-frontend/src/app/socio/socio.component.ts:16` con `SocioService.getSocios()` (`GET /socio` con `relations`). Crear/ver/editar/eliminar vía `/socios/crear`, `/socios/ver/:id`, `/socios/editar/:id`.
- Cuotas: `src/cuota/cuota.service.ts:26` `generarCuotasAnuales(anio)` y `togglePago`.

### Filtro complejo (sin hardcodeo)
- **Fuente dinámica**: estados desde `GET /estado` (`EstadoService.findAll()` en `socio.component.ts:75`), nunca `=== 'Activo'`. Soporta nuevos estados (ej. `Vitalicio`) sin deploy front.
- **Dropdown en header Estado**: funnel con badge `selectedEstadoIds.size`, lista de checkboxes, `Seleccionar todo/Limpiar/Cerrar`, contador, cierre on-click-outside (`HostListener` en `socio.component.ts:51`). Se resetea al recargar.
- **Lógica**: `estadoFilter` interno `OR` (`socio.estado.id IN set`), combinado con búsqueda `AND` (lupa respeta filtros activos). Implementado en `socios-frontend/src/app/socio/socio.utils.ts:10` (`filterSocios`).
- **Búsqueda lupa**: `startWith` (no `contains`) + `normalize` tildes (`src/socio/socio.filter.spec.ts:7`): `María` = `maria`, `José` = `jose`, case-insensitive. Busca por `apellido/nombre/dni/estado.nombre` con `startsWith`.
- **Paginación**: client-side `pageSize 20` por defecto (`socio.component.ts:34`), 6 páginas para 103 socios, `paginate`/`getTotalPages` en `socio.utils.ts:59`, controles `Anterior/Siguiente`, selector 10/20/50, `paginationInfo` `1-20 de 103`.
- **Ordenamiento**: default `apellido asc` (`sortBy/sortDir` en `socio.component.ts:37`), configurable vía `select` (`apellido|nombre|dni|numeroSocio|estado`) y botón `▲/▼` (`sortSocios` en `socio.utils.ts:32`).

No se crea estado `pendiente` (regla de negocio existente en `socio.component.html:54`).

## Testing con Jest

Instalación autorizada: `jest 30.5.0` (2026-08-28), `jest-preset-angular 17.0.0` (2026-06-16), `ts-jest 29.4.12` (2026-07-22), `jest-environment-jsdom 30.5.0` — todos >24h (`npm view <pkg> time`).

### Backend (`package.json:60`)

```bash
npm test          # jest -- rootDir src, 8 suites, 63 tests
npm run test:watch
npm run test:cov  # coverage ../coverage
npm run test:e2e  # jest --config ./test/jest-e2e.json
```

Specs por módulo (mocks con `getRepositoryToken`):
- `src/app.controller.spec.ts`
- `src/socio/socio.service.spec.ts`, `src/socio/socio.filter.spec.ts` (filtro OR/startWith/tildes/sort/paginate)
- `src/estado/estado.service.spec.ts` (fuente dinámica)
- `src/caja/caja.service.spec.ts`, `src/direccion/direccion.service.spec.ts`, `src/telefono/telefono.service.spec.ts`, `src/cuota/cuota.service.spec.ts`

### Frontend (`socios-frontend/jest.config.js:1`)

```bash
cd socios-frontend
npm test          # jest --passWithNoTests (2 suites, 19 tests)
npm run test:watch
npm run test:cov  # coverage
npm run build     # verifica budgets 16kB/25kB
```

- `jest.config.js` preset `jest-preset-angular`, `setupFilesAfterEnv: setup-jest.ts` (`setupZoneTestEnv` de `setup-env/zone`), `testEnvironment: jsdom`, `tsconfig.spec.json` con `types: ["jest"]`.
- `src/app/socio/socio.utils.spec.ts` (lógica pura) y `socio.component.spec.ts` (TestBed con mocks `SocioService`/`EstadoService`).

**Regla de oro (ver `convenciones.md:9`): ningún push a `main` sin `npm test` verde en ambos proyectos y `npm run build`/`ng build` OK. Tests deben ser *approved* antes de merge.**

## Scripts útiles

```bash
# Backend raíz
npm run lint      # eslint --fix
npm run format    # prettier --write
npm run build     # nest build

# Frontend
npm run lint      # (si se añade) / ng lint
```

## API (Nest)

Prefijo singular: `@Controller('socio')` (`src/socio/socio.controller.ts:14`), `@Controller('estado')`, etc.

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/socio` | Lista con `relations` |
| GET | `/socio/:id` | Detalle |
| POST | `/socio` | Crear |
| PATCH | `/socio/:id` | Actualizar (`preload`) |
| DELETE | `/socio/:id` | Eliminar |
| GET | `/estado` | Lista estados (filtro dinámico) |
| GET | `/caja`, `/direccion`, `/telefono` | CRUD estándar |
| GET | `/cuota/:socioId/:anio` | Cuotas por año |
| PATCH | `/cuota/toggle/:id` | Toggle `isPagado` |
| POST | `/cuota/generar-cuotas/:anio` | Genera 12 cuotas por socio |

`API_URL` hardcodeada a `http://localhost:3000` en `socios-frontend/src/app/services/*.service.ts:11` (migrar a `environment.ts` a futuro).

## Git y convenciones

Ver `convenciones.md:8` y `convenciones.md:9`.

- Ramas: `main` protegido, `develop` integración, `feature/*` o `test/*` (ej. `test/filtro-complejo` actual — commit retrasado hasta tests verdes). No `force push`.
- Commits: `feat:/fix:/test:/chore:` en español, **no usar `excel` en el mensaje**; usar `filtro complejo por estado con paginación y ordenamiento`. Flujo `test/*` → PR `develop` → tests verdes → PR `main`.
- Dependencias: **prohibido `npm install` sin permiso y paquetes con <24h**. Verificar `npm view <pkg> time`. Preferir implementación nativa antes que `ag-grid/primeng`.

## Deployment

```bash
npm run build         # backend -> dist/
npm run start:prod    # node dist/main
# Frontend
cd socios-frontend; npm run build  # dist/socios-frontend
```

Para Nest en producción ver [deployment](https://docs.nestjs.com/deployment) o `Mau`: `npm i -g @nestjs/mau && mau deploy`.

## Recursos

- [NestJS Docs](https://docs.nestjs.com), [Angular Docs](https://angular.dev)
- `convenciones.md` para detalle de filtros, budgets y testing

## Licencia

UNLICENSED (privado)
