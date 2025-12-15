# App Taller - Gestión de Órdenes de Reparación

## Descripción

Esta aplicación simula la gestión de órdenes de reparación para un taller automotriz.  
Permite a **taller** y **cliente** interactuar con las órdenes siguiendo reglas de negocio estrictas: diagnóstico, autorización, reautorización, reparación y entrega.

### Funcionalidades principales

- Gestión completa de órdenes: creación, edición de servicios, cambio de estado.
- Flujo de estados de la orden: `CREATED → DIAGNOSED → AUTHORIZED → IN_PROGRESS → COMPLETED → DELIVERED`.
- Manejo de errores de negocio:
  - Intentos de transiciones inválidas generan errores.
  - Bloqueo de acciones tras cancelación o reautorización necesaria.
- Persistencia usando `localStorage`.
- Vista diferenciada para **taller** y **cliente**.
- Pruebas unitarias con **Vitest** que validan todos los flujos y reglas de negocio.

## Instalación

1. Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
cd nombre-del-proyecto

Instalar dependencias:
npm install

Para iniciar la aplicación en modo desarrollo:
npm run dev

Para correr las pruebas unitarias:
npm run test

Diseño y arquitectura

Estados de orden (OrderStatus): controlan el flujo completo de una orden.

Reglas de negocio (repairOrderRules.ts):

diagnoseOrder: diagnosticar solo si el estado es CREATED.

authorizeOrder: autorizar solo si hay servicios y estado DIAGNOSED.

checkOvercost / reauthorizeOrder: control de sobrecostos y reautorización.

startRepair, completeRepair, deliverOrder: manejo de flujo de reparación.

cancelOrder: bloquea todas las acciones posteriores.

canModifyServices: define si se pueden editar servicios según el estado.

Persistencia: todo se guarda en localStorage para mantener estado tras recarga.

Pruebas unitarias: validan flujos normales, errores de secuencia y bloqueo tras cancelación.

Estructura de carpetas
src/
├─ components/      # Componentes React
├─ domain/          # Definición de tipos y estados
├─ hooks/           # Hooks de manejo de órdenes
├─ mocks/           # Datos de ejemplo
├─ pages/           # Vistas de Taller y Cliente
├─ storage/         # Funciones de persistencia
├─ utils/           # Funciones auxiliares
└─ tests/           # Pruebas unitarias Vitest

Observaciones

El login es simulado y asigna el primer cliente de los mocks si se ingresa como cliente.

La aplicación es responsive y funciona en dispositivos móviles y desktop.

Todos los flujos de órdenes están cubiertos en pruebas unitarias (src/tests/tests.test.ts).
