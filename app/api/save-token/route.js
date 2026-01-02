import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { token, guestId } = await req.json();

    if (!token || !guestId) {
      return new Response(
        JSON.stringify({ error: 'Missing token or guestId' }),
        { status: 400 }
      );
    }

    // Upsert by token (ONE TOKEN = ONE DEVICE)
    await prisma.pushToken.upsert({
      where: { token },
      update: { guestId },
      create: { token, guestId },
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('Error saving token:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to save token' }),
      { status: 500 }
    );
  }
}
