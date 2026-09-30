import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      all: true,
      include: [
        'src/middleware.ts',
        'src/app/[lang]/(auth)/login/actions.ts',
        'src/app/[lang]/(auth)/register/actions.ts',
        'src/app/[lang]/(auth)/recoverKey/actions.ts',
        'src/app/[lang]/(auth)/settingNewPassword/actions.ts',
        'src/app/[lang]/logout/actions.ts',
        'src/components/Modules/Event/EventBtns/eventBtnsActions.ts',
        'src/hooks/useEventHome.tsx',
        'src/services/authServerService.ts',
        'src/services/eventServiceServer.ts',
        'src/services/passwordServerService.ts',
        'src/services/userServiceServer.ts',
        'src/utils/cookies/localeCookiesServer.ts',
      ],
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
});
