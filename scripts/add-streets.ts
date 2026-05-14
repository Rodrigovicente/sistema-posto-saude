import { db } from '../db/connection';
import { streets } from '../db/schema';

const streetNames = ['test str', 'Rua tal', 'Avenida Foo'];

async function main() {
  for (const name of streetNames) {
    await db.insert(streets).values({ name });
    console.log(`Inserted: ${name}`);
  }
}

main().catch(console.error);
