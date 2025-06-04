// scripts/check-backend.ts
import axios from 'axios';
import chalk from 'chalk';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.dev' }); // adapte selon ton env

const BASE_URL = process.env.API_URL || 'http://localhost:3000';
const TENANT_ID = process.env.TEST_TENANT_ID || 'test-tenant';

const endpoints = [
  { method: 'get', url: '/healthcheck' },
  { method: 'get', url: '/users' },
  { method: 'get', url: '/organizations' },
  { method: 'get', url: '/donations' },
  { method: 'get', url: '/missions' },
  { method: 'get', url: '/tasks' },
];

async function checkEndpoint(method: 'get' | 'post', url: string) {
  const fullUrl = `${BASE_URL}${url}`;
  try {
    const response = await axios({
      method,
      url: fullUrl,
      headers: { 'x-tenant-id': TENANT_ID },
    });
    const status = response.status;
    if (status >= 200 && status < 300) {
      console.log(chalk.green(`✅ ${method.toUpperCase()} ${url} => ${status}`));
    } else {
      console.log(chalk.yellow(`⚠️ ${method.toUpperCase()} ${url} => ${status}`));
    }
  } catch (error: any) {
    if (error.response) {
      console.log(
        chalk.red(
          `❌ ${method.toUpperCase()} ${url} => ${error.response.status} ${JSON.stringify(error.response.data)}`,
        ),
      );
    } else if (error.request) {
      console.log(chalk.red(`❌ ${method.toUpperCase()} ${url} => No response received`));
    } else {
      console.log(chalk.red(`❌ ${method.toUpperCase()} ${url} => ${error.message}`));
    }
    if (error.stack) {
      console.log(chalk.red(error.stack));
    }
  }
}

async function main() {
  console.log(chalk.blue(`🔍 Vérification du backend Solia (${BASE_URL})`));

  for (const endpoint of endpoints) {
    await checkEndpoint(endpoint.method as 'get' | 'post', endpoint.url);
  }

  console.log(chalk.blue(`🔐 Test authentification...`));
  try {
    const loginRes = await axios.post(
      `${BASE_URL}/auth/login`,
      {
        email: 'test@solia.org',
        password: 'test123',
      },
      {
        headers: { 'x-tenant-id': TENANT_ID },
      },
    );

    const token = loginRes.data?.token;
    if (token) {
      console.log(chalk.green(`✅ Authentification réussie, token reçu.`));
    } else {
      console.log(chalk.red(`❌ Authentification échouée : token manquant.`));
    }
  } catch (err: any) {
    if (err.response) {
      console.log(
        chalk.red(
          `❌ Authentification échouée : ${err.response.status} ${JSON.stringify(err.response.data)}`,
        ),
      );
    } else if (err.request) {
      console.log(chalk.red(`❌ Authentification échouée : No response received`));
    } else {
      console.log(chalk.red(`❌ Authentification échouée : ${err.message}`));
    }
    if (err.stack) {
      console.log(chalk.red(err.stack));
    }
  }
}

main();
