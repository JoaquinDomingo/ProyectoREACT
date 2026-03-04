import { test, expect } from '@playwright/test';

// Variables para tests
const testUser = `testuser_${Date.now()}`;
const testPass = '123456';
const testGameTitle = `Playwright Test Game ${Date.now()}`;

test.describe('E2E GameManager App', () => {

    // 1. Registro de usuario y 2. Redirección por ruta protegida y Logout
    test('Registro, Login, Rutas protegidas y Logout', async ({ page }) => {
        // Intento entrar a ruta protegida sin sesión
        await page.goto('/games');
        // Debe redirigir a login
        await expect(page).toHaveURL(/.*\/login/);

        // Registro
        await page.click('text="Regístrate aquí"');
        await expect(page).toHaveURL(/.*\/register/);
        await page.fill('input[name="username"]', testUser);
        await page.fill('input[name="password"]', testPass);

        page.once('dialog', dialog => dialog.accept());
        await page.click('button[type="submit"]');

        // Tras el registro exitoso el sistema redirige al login
        await expect(page).toHaveURL(/.*\/login/);

        // Login Incorrecto
        await page.fill('input[name="username"]', testUser);
        await page.fill('input[name="password"]', 'bad_password');
        await page.click('button[type="submit"]');
        // Esperamos que salga algún mensaje de error
        await expect(page).toHaveURL(/.*\/login/);
        await expect(page.locator('.MuiAlert-message')).toBeVisible();

        // Login Correcto
        await page.fill('input[name="username"]', testUser);
        await page.fill('input[name="password"]', testPass);
        await page.click('button[type="submit"]');

        // Debe acceder a dashboard de juegos
        await expect(page).toHaveURL(/.*\/games/);

        // Logout
        await page.click('text="Cerrar Sesión"');
        await expect(page).toHaveURL(/.*\/login/);
    });

    // 3. Catálogo, renderizado, filtrado, búsqueda y paginación
    test('Listado, búsqueda, filtros y paginación', async ({ page }) => {
        // Login
        await page.goto('/login');
        await page.fill('input[name="username"]', testUser);
        await page.fill('input[name="password"]', testPass);
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(/.*\/games/);

        // Esperar al catálogo
        await page.waitForSelector('.MuiCard-root');
        const cards = await page.locator('.MuiCard-root').count();
        expect(cards).toBeGreaterThan(0);

        // Búsqueda usando el getByLabel
        await page.getByLabel('Buscar por nombre...').fill('ZZZNoExisteZZZ');

        // Debería estar vacío
        await page.waitForTimeout(1000);
        const emptyCards = await page.locator('.MuiCard-root').count();
        expect(emptyCards).toBe(0);

        // Limpiar búsqueda
        await page.getByLabel('Buscar por nombre...').fill('');
        await page.waitForTimeout(1000);

        // Verificamos paginación
        const pagination = await page.locator('.MuiPagination-root');
        await expect(pagination).toBeVisible();
    });

    // 4. Crear juego, Ver detalle y Eliminarlo (Flujo Completo CRUD)
    test('Flujo completo CRUD videojuego', async ({ page }) => {
        // Login
        await page.goto('/login');
        await page.fill('input[name="username"]', testUser);
        await page.fill('input[name="password"]', testPass);
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(/.*\/games/);

        // Ir a Nuevo Juego
        await page.click('text="Nuevo Juego"');
        await expect(page).toHaveURL(/.*\/create-game/);

        // Rellenar formulario
        await page.fill('input[name="name"]', testGameTitle);
        await page.fill('input[name="Compañia"]', 'Playwright Inc');
        await page.fill('input[name="Precio"]', '59.99');
        await page.fill('textarea[name="descripcion"]', 'Juego de prueba e2e');

        // Guardar
        await page.click('button[type="submit"]'); // Usamos submit para abarcar el Guardar Videojuego

        // Debe redireccionar o seguir en my-games tras la creación
        await page.waitForURL(/.*\/my-games/);

        // Buscarlo en mis juegos
        await expect(page.locator(`text=${testGameTitle}`)).toBeVisible();

        // Ver Detalle
        await page.locator(`text=${testGameTitle}`).click();
        await expect(page).toHaveURL(/.*\/games\/.*/);

        // Eliminar desde detalle
        page.once('dialog', dialog => dialog.accept());
        await page.click('button:has-text("Eliminar")');

        // Redirige
        await expect(page).toHaveURL(/.*\/my-games/);

        // Verificamos que ya no está visible
        await expect(page.locator(`text=${testGameTitle}`)).toHaveCount(0);
    });

});
