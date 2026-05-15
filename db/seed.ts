import { db } from './connection';
import { streets } from './schema';

const streetNames = [
  'Estrada Mirandela',
  'Rua Doutor Manoel Reis',
  'Avenida Getúlio Vargas'
];

async function seedStreets() {
  console.log('Seeding streets table...');
  
  for (const name of streetNames) {
    await db.insert(streets).values({ name });
  }
  
  console.log(`Inserted ${streetNames.length} streets`);
}

seedStreets().catch(console.error);
