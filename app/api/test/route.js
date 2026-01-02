import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH() {
  try {
    const products = await prisma.product.findMany();

    const updatePromises = products.map(async (product) => {
      if (typeof product.box === 'string') {
        // Convert single string into array of string
        return prisma.product.update({
          where: { id: product.id },
          data: {
            box: [product.box],
          },
        });
      }
      return null;
    });

    const results = await Promise.all(updatePromises);
    const updatedCount = results.filter(Boolean).length;

    return new Response(
      JSON.stringify({ message: `${updatedCount} products migrated.` }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Migration error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to migrate box field to array format' }),
      { status: 500 }
    );
  }
}
