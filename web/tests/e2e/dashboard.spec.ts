import { test, expect } from '@playwright/test';
import { selectors } from './selectors';

// Mock data
const mockStats = {
  totalProjects: 12,
  activeProjects: 3,
  collaborators: 5,
  storageUsed: '2.5 GB',
};

const mockRecentActivity = [
  {
    id: '1',
    user: 'Alex Johnson',
    action: 'created',
    target: 'Project Alpha',
    time: '2 minutes ago',
  },
  {
    id: '2',
    user: 'Sam Wilson',
    action: 'updated',
    target: 'Project Beta',
    time: '15 minutes ago',
  },
  {
    id: '3',
    user: 'Taylor Swift',
    action: 'commented',
    target: 'Project Gamma',
    time: '1 hour ago',
  },
];

test.describe('Dashboard', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    // Use authenticated state
    test.use({ storageState: 'tests/state.json' });

    // Mock API responses
    await page.route('**/api/dashboard/stats', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockStats),
      });
    });

    await page.route('**/api/dashboard/activity', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockRecentActivity),
      });
    });

    await page.route('**/api/dashboard/projects', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: '1', name: 'Project Alpha', lastModified: new Date().toISOString() },
          { id: '2', name: 'Project Beta', lastModified: new Date().toISOString() },
        ]),
      });
    });

    // Navigate to dashboard
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display dashboard with all sections', async ({ page }) => {
    // Check page title and header
    await expect(page).toHaveTitle(/Dashboard | Rythm/);
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();

    // Check quick stats cards
    const statCards = page.locator(selectors.dashboard.statCards);
    await expect(statCards).toHaveCount(4);

    // Verify stat values
    for (const [key, value] of Object.entries(mockStats)) {
      const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      const card = page.locator(`${selectors.dashboard.statCards}:has-text("${formattedKey}")`);
      await expect(card).toContainText(String(value));
    }

    // Check recent activity section
    await expect(page.getByRole('heading', { name: /recent activity/i })).toBeVisible();
    const activityItems = page.locator(selectors.dashboard.activityItems);
    await expect(activityItems).toHaveCount(mockRecentActivity.length);

    // Check projects section
    await expect(page.getByRole('heading', { name: /recent projects/i })).toBeVisible();
    const projectItems = page.locator(selectors.dashboard.projectItems);
    await expect(projectItems).toHaveCount(2);
  });

  test('should update stats via WebSocket', async ({ page }) => {
    // Get initial stat value
    const initialStat = page.locator(`${selectors.dashboard.statCards}:has-text("Total Projects")`);
    const initialValue = (await initialStat.locator('h3').textContent()) || '';

    // Simulate WebSocket update
    await page.evaluate(
      ({ mockStats }) => {
        window.dispatchEvent(
          new MessageEvent('message', {
            data: JSON.stringify({
              event: 'dashboard:update',
              data: {
                type: 'stats',
                payload: {
                  ...mockStats,
                  totalProjects: mockStats.totalProjects + 1,
                },
              },
            }),
          })
        );
      },
      { mockStats }
    );

    // Verify the stat was updated
    await expect(initialStat.locator('h3')).not.toHaveText(initialValue);
    await expect(initialStat.locator('h3')).toContainText(String(mockStats.totalProjects + 1));

    // Verify update indicator
    await expect(initialStat.locator('.animate-pulse')).toBeVisible();
  });

  test('should show loading states', async ({ page }) => {
    // Test loading state for stats
    await page.route('**/api/dashboard/stats', route => {
      // Add delay to test loading state
      return new Promise<void>(resolve => {
        setTimeout(() => {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockStats),
          });
          resolve();
        }, 1000);
      });
    });

    // Reload to trigger loading state
    await page.reload();

    // Verify loading states
    const statCards = page.locator(selectors.dashboard.statCards);
    for (let i = 0; i < 4; i++) {
      await expect(statCards.nth(i).locator('.animate-pulse')).toBeVisible();
    }

    // Wait for content to load
    await expect(statCards.first().locator('h3')).not.toBeEmpty();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Override the stats endpoint to return an error
    await page.route('**/api/dashboard/stats', route => {
      return route.fulfill({
        status: 500,
        body: 'Internal Server Error',
      });
    });

    // Reload to trigger the error
    await page.reload();

    // Verify error state
    await expect(page.getByText(/failed to load dashboard stats/i)).toBeVisible();

    // Test retry functionality
    await page.route('**/api/dashboard/stats', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockStats),
      });
    });

    await page.getByRole('button', { name: /retry/i }).click();
    await expect(page.getByText(/failed to load dashboard stats/i)).not.toBeVisible();

    // Verify stats are now loaded
    const statCards = page.locator(selectors.dashboard.statCards);
    await expect(statCards.first().locator('h3')).not.toBeEmpty();
  });

  test('should navigate to project details when clicking on a project', async ({ page }) => {
    // Click on the first project
    const firstProject = page.locator(selectors.dashboard.projectItems).first();
    const projectName = await firstProject.locator('h3').textContent();
    await firstProject.click();

    // Verify navigation to project details
    await expect(page).toHaveURL(/\/projects\/\d+/);
    await expect(page.getByRole('heading', { name: projectName || '' })).toBeVisible();
  });

  test('should update activity feed in real-time', async ({ page }) => {
    // Get initial activity count
    const activityItems = page.locator(selectors.dashboard.activityItems);
    const initialCount = await activityItems.count();

    // Simulate new activity via WebSocket
    const newActivity = {
      id: 'new-activity',
      user: 'New User',
      action: 'created',
      target: 'New Project',
      time: 'just now',
    };

    await page.evaluate(activity => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: JSON.stringify({
            event: 'activity:new',
            data: activity,
          }),
        })
      );
    }, newActivity);

    // Verify new activity was added to the top
    await expect(activityItems).toHaveCount(initialCount + 1);
    await expect(activityItems.first()).toContainText(newActivity.user);
    await expect(activityItems.first()).toContainText(newActivity.target);

    // Verify notification badge updates
    const activityTab = page.locator('[role="tab"]:has-text("Activity")');
    await expect(activityTab.locator('.bg-primary')).toBeVisible();
  });
});
