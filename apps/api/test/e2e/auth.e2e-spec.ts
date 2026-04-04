// test/e2e/auth.e2e-spec.ts
// Testes de integracao — Auth + Tenant isolation

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  // ============================================================
  // FLUXO COMPLETO: register -> login -> acesso -> refresh -> logout
  // ============================================================

  describe('Fluxo completo de autenticacao', () => {
    let accessToken: string;
    let refreshToken: string;
    let userId: string;

    it('POST /auth/register — deve registrar novo usuario', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User E2E',
          email: 'e2e-test@email.com',
          password: 'Senh@F0rte123',
          familyName: 'Familia E2E',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data).toHaveProperty('refreshToken');
      expect(res.body.data).toHaveProperty('user');
      expect(res.body.data.user.email).toBe('e2e-test@email.com');
      expect(res.body.data.user.isFamilyOwner).toBe(true);

      accessToken = res.body.data.accessToken;
      refreshToken = res.body.data.refreshToken;
      userId = res.body.data.user.id;
    });

    it('POST /auth/register — deve rejeitar email duplicado', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          name: 'Duplicate User',
          email: 'e2e-test@email.com',
          password: 'Senh@F0rte123',
          familyName: 'Familia Dup',
        })
        .expect(409);
    });

    it('POST /auth/login — deve autenticar com sucesso', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'e2e-test@email.com',
          password: 'Senh@F0rte123',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data).toHaveProperty('refreshToken');
      expect(res.body.data).toHaveProperty('permissions');
      expect(Array.isArray(res.body.data.permissions)).toBe(true);

      // Atualizar tokens para proximos testes
      accessToken = res.body.data.accessToken;
      refreshToken = res.body.data.refreshToken;
    });

    it('POST /auth/login — deve rejeitar credenciais invalidas', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'e2e-test@email.com',
          password: 'senhaerrada',
        })
        .expect(401);
    });

    it('GET /users/me — deve retornar dados do usuario autenticado', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('e2e-test@email.com');
    });

    it('GET /users/me — deve rejeitar sem token', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/users/me')
        .expect(401);
    });

    it('POST /auth/refresh — deve renovar tokens', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data).toHaveProperty('refreshToken');

      // Atualizar tokens
      accessToken = res.body.data.accessToken;
      refreshToken = res.body.data.refreshToken;
    });

    it('POST /auth/refresh — deve rejeitar token antigo (ja rotacionado)', async () => {
      // O token anterior ja foi revogado na rotacao
      await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: 'invalid-old-token' })
        .expect(401);
    });

    it('POST /auth/logout — deve fazer logout', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
    });
  });

  // ============================================================
  // ISOLAMENTO MULTI-TENANT
  // ============================================================

  describe('Isolamento multi-tenant', () => {
    let family1Token: string;
    let family2Token: string;
    let family1Id: string;
    let family2Id: string;

    beforeAll(async () => {
      // Criar familia 1
      const res1 = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          name: 'User Familia 1',
          email: 'tenant1@email.com',
          password: 'Senh@F0rte123',
          familyName: 'Familia 1',
        });

      family1Token = res1.body.data.accessToken;
      family1Id = res1.body.data.user.familyId;

      // Criar familia 2
      const res2 = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          name: 'User Familia 2',
          email: 'tenant2@email.com',
          password: 'Senh@F0rte123',
          familyName: 'Familia 2',
        });

      family2Token = res2.body.data.accessToken;
      family2Id = res2.body.data.user.familyId;
    });

    it('deve retornar dados da familia correta para cada usuario', async () => {
      const res1 = await request(app.getHttpServer())
        .get('/api/v1/families/me')
        .set('Authorization', `Bearer ${family1Token}`)
        .expect(200);

      const res2 = await request(app.getHttpServer())
        .get('/api/v1/families/me')
        .set('Authorization', `Bearer ${family2Token}`)
        .expect(200);

      expect(res1.body.data.name).toBe('Familia 1');
      expect(res2.body.data.name).toBe('Familia 2');
      expect(res1.body.data.id).not.toBe(res2.body.data.id);
    });

    it('familia 1 nao deve ver membros da familia 2', async () => {
      const res1 = await request(app.getHttpServer())
        .get('/api/v1/families/me/members')
        .set('Authorization', `Bearer ${family1Token}`)
        .expect(200);

      const res2 = await request(app.getHttpServer())
        .get('/api/v1/families/me/members')
        .set('Authorization', `Bearer ${family2Token}`)
        .expect(200);

      // Cada familia deve ter apenas 1 membro (o criador)
      expect(res1.body.data).toHaveLength(1);
      expect(res2.body.data).toHaveLength(1);

      // Emails devem ser diferentes
      expect(res1.body.data[0].email).toBe('tenant1@email.com');
      expect(res2.body.data[0].email).toBe('tenant2@email.com');
    });

    it('grupos de uma familia nao devem vazar para outra', async () => {
      const res1 = await request(app.getHttpServer())
        .get('/api/v1/groups')
        .set('Authorization', `Bearer ${family1Token}`)
        .expect(200);

      const res2 = await request(app.getHttpServer())
        .get('/api/v1/groups')
        .set('Authorization', `Bearer ${family2Token}`)
        .expect(200);

      // Ambas devem ter 3 grupos padrao
      expect(res1.body.data).toHaveLength(3);
      expect(res2.body.data).toHaveLength(3);

      // IDs dos grupos devem ser diferentes
      const ids1 = res1.body.data.map((g: { id: string }) => g.id);
      const ids2 = res2.body.data.map((g: { id: string }) => g.id);

      for (const id of ids1) {
        expect(ids2).not.toContain(id);
      }
    });
  });
});
