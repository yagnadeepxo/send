import { NextResponse } from 'next/server';
import { PublicKey } from '@solana/web3.js';

export async function POST(req: Request) {
  try {
    const { publicKey } = await req.json();
    
    // Validate the public key (you may want to add more robust validation)
    if (!publicKey || typeof publicKey !== 'string') {
      return NextResponse.json({ error: 'Invalid public key' }, { status: 400 });
    }

    // Generate the custom URL
    const customUrl = `${'sendsend.vercel.app'}/api/actions/transfer-send?to=${publicKey}`;

    return NextResponse.json({ url: customUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}