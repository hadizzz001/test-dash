import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET method to fetch an order by ID
export async function GET(request, { params }) {
  const { id } = params;

  try {
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return new Response(JSON.stringify({ message: 'Order not found.' }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(order), { status: 200 });
  } catch (error) {
    console.error('Error fetching order:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

// DELETE method to delete an order by ID
export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    const deletedOrder = await prisma.order.delete({
      where: { id },
    });

    return new Response(JSON.stringify({ message: 'Order deleted successfully', deletedOrder }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete order' }), {
      status: 500,
    });
  }
}
