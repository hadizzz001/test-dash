import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { NextResponse } from 'next/server';

function generateRandomCode(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Add CORS headers function
function withCorsHeaders(response) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

// GET handler
export async function GET(req) {
  try {
    const codes = await prisma.code.findMany();
    const res = new Response(JSON.stringify(codes), { status: 200 });
    return withCorsHeaders(res);
  } catch (error) {
    console.error('Error fetching codes:', error);
    const res = new Response(JSON.stringify({ error: 'Failed to fetch codes' }), { status: 500 });
    return withCorsHeaders(res);
  }
}

// POST handler
export async function POST(req) {
  try {
    const generatedCode = generateRandomCode();
    const savedCode = await prisma.code.create({
      data: { code: generatedCode },
    });
    const res = new Response(
      JSON.stringify({ message: 'Code created successfully', code: savedCode }),
      { status: 201 }
    );
    return withCorsHeaders(res);
  } catch (error) {
    console.error('Error creating code:', error);
    const res = new Response(JSON.stringify({ error: 'Failed to create code' }), { status: 500 });
    return withCorsHeaders(res);
  }
}

// Handle preflight (OPTIONS) request
export async function OPTIONS(req) {
  return withCorsHeaders(new Response(null, { status: 204 }));
}
