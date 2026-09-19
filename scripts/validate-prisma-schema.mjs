import { readFileSync } from 'node:fs';
const schema = readFileSync('prisma/schema.prisma', 'utf8');
if (!/^generator client \{\n/m.test(schema)) throw new Error('Prisma generator block must use multiline syntax');
if (!/^  provider = "prisma-client-js"\n/m.test(schema)) throw new Error('Prisma client provider missing');
if (!/^datasource db \{\n/m.test(schema)) throw new Error('Prisma datasource block must use multiline syntax');
console.log('Prisma schema header syntax check passed.');
