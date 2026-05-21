# SKILL: Diseño Visual — Plataforma de Actividades Juveniles Barcelona

## Identidad del Proyecto

**Nombre tentativo:** Vivora / Activa BCN / Explora (por definir)
**Propósito:** Plataforma web donde padres y jóvenes (12-25 años) descubren, planifican y organizan actividades presenciales en Barcelona como alternativa saludable a las pantallas.
**Usuarios principales:** Padres/tutores que planifican, jóvenes que consultan su agenda.
**Ciudad:** Barcelona — el mar, la luz mediterránea, la energía urbana y los colores vivos son parte del ADN visual.

---

## Dirección Estética

**Concepto:** *"Energía mediterránea ordenada"*
Vibrante pero no caótico. Juvenil pero no infantil. Profesional pero no corporativo.
Inspiración: la luz de Barcelona, los colores del Mediterráneo, la energía de los mercados y la calle.

**Tono visual:** Fresco, optimista, activo, confiable.
NO usar: estética clínica/médica, tonos apagados, gradientes morados genéricos, aspecto de app de meditación/wellness genérica.

---

## Sistema de Color

```css
:root {
  /* Primarios */
  --color-primary:       #FF5C35;   /* Naranja mediterráneo — acción, energía */
  --color-primary-light: #FF8562;
  --color-primary-dark:  #D94420;

  /* Secundarios */
  --color-ocean:         #0EA5E9;   /* Azul mar — playa, exterior */
  --color-sand:          #F5ECD7;   /* Arena — fondos cálidos */
  --color-green:         #22C55E;   /* Verde — logro, confirmado, naturaleza */

  /* Neutros */
  --color-ink:           #1A1A2E;   /* Casi negro — textos principales */
  --color-ink-light:     #4A4A6A;   /* Textos secundarios */
  --color-surface:       #FAFAF8;   /* Fondo principal (blanco cálido) */
  --color-border:        #E8E4DC;   /* Bordes suaves */
  --color-card:          #FFFFFF;   /* Fondo de tarjetas */

  /* Estados */
  --color-success:       #22C55E;
  --color-warning:       #F59E0B;
  --color-error:         #EF4444;

  /* Categorías de actividades — cada una tiene su color */
  --cat-exterior:        #22C55E;   /* Verde naturaleza */
  --cat-playa:           #0EA5E9;   /* Azul océano */
  --cat-artistica:       #A855F7;   /* Violeta creativo */
  --cat-social:          #F59E0B;   /* Ámbar cálido */
  --cat-aprendizaje:     #FF5C35;   /* Naranja primario */
  --cat-deporte:         #EF4444;   /* Rojo energía */
}
```

---

## Tipografía

```css
/* Display / Títulos grandes */
font-family: 'Plus Jakarta Sans', sans-serif;
/* Weights usados: 700 (bold), 800 (extrabold) */
/* Importar: https://fonts.google.com/specimen/Plus+Jakarta+Sans */

/* Body / UI */
font-family: 'DM Sans', sans-serif;
/* Weights: 400 (regular), 500 (medium) */
/* Importar: https://fonts.google.com/specimen/DM+Sans */
```

### Escala tipográfica
```css
--text-xs:   0.75rem;   /* 12px — labels, badges */
--text-sm:   0.875rem;  /* 14px — texto secundario */
--text-base: 1rem;      /* 16px — body */
--text-lg:   1.125rem;  /* 18px — subtítulos */
--text-xl:   1.25rem;   /* 20px — títulos de card */
--text-2xl:  1.5rem;    /* 24px — títulos de sección */
--text-3xl:  1.875rem;  /* 30px — títulos de página */
--text-4xl:  2.25rem;   /* 36px — hero */
--text-5xl:  3rem;      /* 48px — hero grande */
```

---

## Espaciado y Layout

```css
--radius-sm:  6px;
--radius-md:  12px;
--radius-lg:  16px;
--radius-xl:  24px;
--radius-full: 9999px;  /* pills, badges */

/* Contenedor máximo */
--max-width-content: 1280px;
--max-width-text:    720px;

/* Grid de actividades */
/* Desktop: 3 columnas | Tablet: 2 columnas | Mobile: 1 columna */
```

---

## Componentes Clave

### Activity Card
- Imagen arriba (aspect-ratio 4/3), esquinas redondeadas `--radius-lg`
- Badge de categoría superpuesto arriba-izquierda con `--cat-*` color correspondiente
- Badge de precio arriba-derecha (verde si gratis, neutro si pago)
- Título en `Plus Jakarta Sans 700`, body en `DM Sans 400`
- Footer: icono de reloj + duración | icono de ubicación abreviada
- Hover: `translateY(-4px)` + sombra más pronunciada, transición 200ms ease

```jsx
// Estructura esperada
<ActivityCard>
  <CardImage />                    // imagen con overlays
  <CategoryBadge />                // pill coloreado
  <PriceBadge />                   // "Gratis" | "€12/sesión"
  <CardBody>
    <Title />
    <Description />                // máx 2 líneas, truncar
    <Provider />                   // nombre del proveedor, gris
  </CardBody>
  <CardFooter>
    <Duration />                   // "90 min"
    <Location />                   // "Barceloneta"
    <AddToAgendaButton />          // CTA principal
  </CardFooter>
</ActivityCard>
```

### Agenda Weekly Planner
- Vista de 7 columnas (lunes a domingo)
- Cada columna: header con día + fecha, body con activity chips apilados
- Activity chip: color de la categoría, título corto, horario
- Estado visual: `planned` (borde punteado), `confirmed` (sólido), `attended` (verde check)
- Indicador de carga diaria: barra de progreso bajo cada día (0-2 actividades = verde, 3 = amarillo)
- Mobile: scroll horizontal entre días, ver 1 día a la vez

```jsx
// Estructura esperada
<WeeklyPlanner>
  <WeekHeader weekStart={date} weekEnd={date} />
  {days.map(day => (
    <DayColumn key={day}>
      <DayHeader dayName weekLoad />          // "Lun 14" + indicador carga
      <ActivityChipList>
        {items.map(item => (
          <ActivityChip
            color={item.category.color}
            title={item.activity.title}
            time="10:00 - 12:00"
            status={item.status}
          />
        ))}
      </ActivityChipList>
      <AddSlotButton />                       // "+" para agregar actividad
    </DayColumn>
  ))}
</WeeklyPlanner>
```

### Category Filter Bar
- Fila horizontal scrolleable en mobile
- Cada categoría: pill con icono + nombre, color propio al activarse
- "Todas" como primera opción, activa por defecto en naranja primario

### Navigation
- Navbar fija con fondo blanco/blur al hacer scroll
- Logo izquierda, links centro (Explorar / Cómo funciona / Para padres)
- Botones derecha: "Iniciar sesión" (ghost) + "Empezar" (primary filled)
- Mobile: hamburger → drawer lateral

---

## Patrones de UI Específicos

### Hero Section (landing)
- Título grande en `Plus Jakarta Sans 800`, máx 3 líneas
- Subtítulo en `DM Sans 400`, color `--color-ink-light`
- CTA principal naranja + CTA secundario ghost
- Imagen/ilustración a la derecha (collage de actividades en mobile va debajo)
- Fondo: `--color-sand` con forma orgánica o wave SVG abajo

### Empty State (agenda vacía)
- Ilustración simple (SVG inline o emoji grande)
- Título motivador: "Tu verano está en blanco ✦ Añade la primera actividad"
- Botón directo a explorar actividades

### Página de detalle de actividad
- Hero con imagen full-width (max 480px altura)
- Info en panel sticky lateral en desktop (precio, horarios, botón reservar)
- Sección "Por qué esta actividad" con icono de cerebro/corazón — diferencial clave
- Proveedor: mini-card con logo, nombre, enlace

---

## Animaciones y Transiciones

```css
/* Transición estándar para hover states */
transition: all 200ms ease;

/* Entrada de cards en catálogo */
/* Usar: animation-delay escalonado por índice */
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Skeleton loading para cards */
/* Usar shimmer gradient animado mientras cargan datos */

/* Page transitions Next.js */
/* Fade suave entre rutas: opacity 0→1, 150ms */
```

---

## Iconografía

Usar **Lucide React** como librería principal.

Mapeo de iconos por categoría:
```
exterior    → TreePine
playa       → Waves
artistica   → Palette
social      → Users
aprendizaje → GraduationCap
deporte     → Dumbbell
```

Iconos de UI frecuentes:
```
clock       → Clock3
location    → MapPin
price       → Tag
add         → Plus
calendar    → CalendarDays
check       → CheckCircle2
youth       → User
parent      → Users2
```

---

## Responsive Breakpoints (Tailwind)

```
sm:  640px  — mobile landscape
md:  768px  — tablet portrait
lg:  1024px — tablet landscape / desktop pequeño
xl:  1280px — desktop
2xl: 1536px — desktop grande
```

Prioridad **mobile-first**. El joven consulta desde el móvil. El padre puede usar desktop.

---

## Accesibilidad

- Contraste mínimo AA en todos los textos
- Tamaño mínimo de tap target: 44x44px
- Focus visible en todos los elementos interactivos (`ring-2 ring-primary`)
- Labels en todos los inputs
- Alt text descriptivo en imágenes de actividades
- Reducir animaciones si `prefers-reduced-motion`

---

## Lo que NO hacer

- ❌ Gradientes morados genéricos
- ❌ Imágenes de stock corporativas (personas con trajes)
- ❌ Tipografías Inter / Roboto / Arial
- ❌ Cards planas sin profundidad visual
- ❌ Colores apagados o paleta monocromática
- ❌ Texto en mayúsculas sin propósito
- ❌ Más de 3 niveles de jerarquía visual en un mismo componente
- ❌ Modales innecesarios — preferir inline expansion o páginas nuevas

---

## Archivos y Estructura de Componentes Esperada

```
/components
  /ui             ← shadcn/ui base components
  /activities
    ActivityCard.tsx
    ActivityGrid.tsx
    CategoryFilterBar.tsx
    ActivityDetail.tsx
  /agenda
    WeeklyPlanner.tsx
    DayColumn.tsx
    ActivityChip.tsx
    WeekNavigation.tsx
  /layout
    Navbar.tsx
    Footer.tsx
    PageContainer.tsx
  /common
    Badge.tsx
    EmptyState.tsx
    SkeletonCard.tsx
    PriceTag.tsx
```

---

## Contexto de Negocio para decisiones de UI

- El padre es quien **organiza** — necesita claridad, control, visión de conjunto
- El joven es quien **consulta** — necesita simplicidad, motivación, nada intimidante
- La actividad es el **producto** — debe verse atractiva, con su propia identidad visual
- La agenda es el **valor diferencial** — debe verse ordenada pero no rígida
- El precio y la facilidad de reserva son **decisivos** — nunca ocultar precio, CTA siempre visible
