import { defineConfig } from 'prisma/config';

export default defineConfig({
  datasources: {
    db: {
      url: 'postgresql://postgres:postgres@localhost:5432/dwaadekho',
    },
  },
});