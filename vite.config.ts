
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import path from 'path';

  export default defineConfig({
    plugins: [react()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        'vaul@1.1.2': 'vaul',
        'sonner@2.0.3': 'sonner',
        'recharts@2.15.2': 'recharts',
        'react-resizable-panels@2.1.7': 'react-resizable-panels',
        'react-hook-form@7.55.0': 'react-hook-form',
        'react-day-picker@8.10.1': 'react-day-picker',
        'next-themes@0.4.6': 'next-themes',
        'lucide-react@0.487.0': 'lucide-react',
        'input-otp@1.4.2': 'input-otp',
        'figma:asset/caaa6bda67f0c9c0327ee0a294c8443162bbb5d9.png': path.resolve(__dirname, './src/assets/caaa6bda67f0c9c0327ee0a294c8443162bbb5d9.png'),
        'figma:asset/b766f8675214a4f4f217947209ae5cc49050aca7.png': path.resolve(__dirname, './src/assets/b766f8675214a4f4f217947209ae5cc49050aca7.png'),
        'figma:asset/74b059042d7dc3c15b204ca2da8d99cd3c868cd5.png': path.resolve(__dirname, './src/assets/74b059042d7dc3c15b204ca2da8d99cd3c868cd5.png'),
        'figma:asset/3f5c98faccdae0268f7a43932d844a4fa3589a8b.png': path.resolve(__dirname, './src/assets/3f5c98faccdae0268f7a43932d844a4fa3589a8b.png'),
        'figma:asset/2de195124806517919438c639c6aa46474db3f13.png': path.resolve(__dirname, './src/assets/2de195124806517919438c639c6aa46474db3f13.png'),
        'figma:asset/28f2069c512501197478b70ded9fab3bda891d27.png': path.resolve(__dirname, './src/assets/28f2069c512501197478b70ded9fab3bda891d27.png'),
        'figma:asset/2487ffd81f6eb0aa5bff329df2b3e60b0fe4c80a.png': path.resolve(__dirname, './src/assets/2487ffd81f6eb0aa5bff329df2b3e60b0fe4c80a.png'),
        'figma:asset/1cbc7581d9d6c894971112a8406a67150a3cb62e.png': path.resolve(__dirname, './src/assets/1cbc7581d9d6c894971112a8406a67150a3cb62e.png'),
        'embla-carousel-react@8.6.0': 'embla-carousel-react',
        'cmdk@1.1.1': 'cmdk',
        'class-variance-authority@0.7.1': 'class-variance-authority',
        '@radix-ui/react-tooltip@1.1.8': '@radix-ui/react-tooltip',
        '@radix-ui/react-toggle@1.1.2': '@radix-ui/react-toggle',
        '@radix-ui/react-toggle-group@1.1.2': '@radix-ui/react-toggle-group',
        '@radix-ui/react-tabs@1.1.3': '@radix-ui/react-tabs',
        '@radix-ui/react-switch@1.1.3': '@radix-ui/react-switch',
        '@radix-ui/react-slot@1.1.2': '@radix-ui/react-slot',
        '@radix-ui/react-slider@1.2.3': '@radix-ui/react-slider',
        '@radix-ui/react-separator@1.1.2': '@radix-ui/react-separator',
        '@radix-ui/react-select@2.1.6': '@radix-ui/react-select',
        '@radix-ui/react-scroll-area@1.2.3': '@radix-ui/react-scroll-area',
        '@radix-ui/react-radio-group@1.2.3': '@radix-ui/react-radio-group',
        '@radix-ui/react-progress@1.1.2': '@radix-ui/react-progress',
        '@radix-ui/react-popover@1.1.6': '@radix-ui/react-popover',
        '@radix-ui/react-navigation-menu@1.2.5': '@radix-ui/react-navigation-menu',
        '@radix-ui/react-menubar@1.1.6': '@radix-ui/react-menubar',
        '@radix-ui/react-label@2.1.2': '@radix-ui/react-label',
        '@radix-ui/react-hover-card@1.1.6': '@radix-ui/react-hover-card',
        '@radix-ui/react-dropdown-menu@2.1.6': '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-dialog@1.1.6': '@radix-ui/react-dialog',
        '@radix-ui/react-context-menu@2.2.6': '@radix-ui/react-context-menu',
        '@radix-ui/react-collapsible@1.1.3': '@radix-ui/react-collapsible',
        '@radix-ui/react-checkbox@1.1.4': '@radix-ui/react-checkbox',
        '@radix-ui/react-avatar@1.1.3': '@radix-ui/react-avatar',
        '@radix-ui/react-aspect-ratio@1.1.2': '@radix-ui/react-aspect-ratio',
        '@radix-ui/react-alert-dialog@1.1.6': '@radix-ui/react-alert-dialog',
        '@radix-ui/react-accordion@1.2.3': '@radix-ui/react-accordion',
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'build',
    },
    server: {
      port: 3000,
      open: true,
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/setupTests.ts'],
      css: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'lcov', 'html'],
        reportsDirectory: 'coverage',
        thresholds: {
          lines: 60,
          functions: 60,
          branches: 50,
          statements: 60,
        },
        include: [
          'src/App.tsx',
          'src/hooks/useFormData.ts',
          'src/lib/utils.ts',
          'src/lib/api.ts',
          'server/**/*.js'
        ],
        exclude: ['server/index.js', 'server/db.js']
      },
      environmentMatchGlobs: [['server/**/*.test.ts', 'node']]
    },
  });