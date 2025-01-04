
import { PrismaClient } from '@prisma/client';
import sampleData from './sample-data';

export default async function main(){
const prisma = new PrismaClient();

await prisma.product.deleteMany();
await prisma.product.createMany({
    data:sampleData.products
})
console.log("Database seeding completed")
}
main()