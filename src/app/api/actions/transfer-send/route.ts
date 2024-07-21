import {
    ActionPostResponse,
    ACTIONS_CORS_HEADERS,
    createPostResponse,
    ActionGetResponse,
    ActionPostRequest,
  } from "@solana/actions";
  import {
    clusterApiUrl,
    Connection,
    PublicKey,
    Transaction,
  } from "@solana/web3.js";

  import { getAssociatedTokenAddress, createTransferInstruction } from "@solana/spl-token";
  
  // Replace this with the actual SEND token mint address
  const SEND_TOKEN_MINT = new PublicKey("SENDdRQtYMWaQrBroBrJ2Q53fgVuq95CV9UPGEvpCxa");
  
  export const GET = async (req: Request) => {
    try {
      const { searchParams } = new URL(req.url);
      const toPubkey = searchParams.get('to');
  
      if (!toPubkey) {
        return Response.json({ error: 'Missing recipient public key' }, { status: 400 });
      }
  
      const baseHref = `/api/actions/transfer-send?to=${toPubkey}`;
      const payload: ActionGetResponse = {
        title: "Donate SEND",
        icon: new URL("/send.jpeg", req.url).toString(),
        description: "Transfer SEND tokens to your favorite creator",
        label: "Transfer",
        links: {
          actions: [
            {
              label: "Send 10000 SEND",
              href: `${baseHref}&amount=${"1"}`,
            },
            {
              label: "Send 50000 SEND",
              href: `${baseHref}&amount=${"5"}`,
            },
            {
              label: "Send 100000 SEND",
              href: `${baseHref}&amount=${"10"}`,
            },
            {
              label: "Send SEND",
              href: `${baseHref}&amount={amount}`,
              parameters: [
                {
                  name: "amount",
                  label: "Enter the amount of SEND to send",
                  required: true,
                },
              ],
            },
          ],
        },
      };
  
      return Response.json(payload, {
        headers: ACTIONS_CORS_HEADERS,
      });
    } catch (err) {
      console.log(err);
      let message = "An unknown error occurred";
      if (typeof err == "string") message = err;
      return new Response(message, {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }
  };

  export const OPTIONS = GET
  
  export const POST = async (req: Request) => {
    try {
      const { searchParams } = new URL(req.url);
      const account = new PublicKey(searchParams.get('to') || '');
      const amount = parseFloat(searchParams.get('amount') || '0');

      if (!account || isNaN(amount) || amount <= 0) {
        return new Response('Invalid "to" or "amount" parameter', {
          status: 400,
          headers: ACTIONS_CORS_HEADERS,
        });
      }

      const body: ActionPostRequest = await req.json();
      const sender_pubkey = new PublicKey(body.account);
      
      const connection = new Connection(clusterApiUrl("mainnet-beta"));
  
      
      const fromTokenAccount = await getAssociatedTokenAddress(SEND_TOKEN_MINT, sender_pubkey, false);
      const toTokenAccount = await getAssociatedTokenAddress(SEND_TOKEN_MINT, account, false);
    
      const transaction = new Transaction().add(
        createTransferInstruction(
          fromTokenAccount,
          toTokenAccount,
          sender_pubkey,
          amount * Math.pow(10, 6)
        )
      );
  
      transaction.feePayer = sender_pubkey;
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  
      const payload: ActionPostResponse = await createPostResponse({
        fields: {
          transaction,
          message: `Sent ${amount} SEND to ${account.toBase58()}`,
        },
      });
  
      return Response.json(payload, {
        headers: ACTIONS_CORS_HEADERS,
      });
    } catch (err) {
      console.log(err);
      let message = "An unknown error occurred";
      if (typeof err == "string") message = err;
      return new Response(message, {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }
  };
  
  function validatedQueryParams(requestUrl: URL) {
    let toPubkey: PublicKey;
    let amount: number;
  
    try {
      if (requestUrl.searchParams.get("to")) {
        toPubkey = new PublicKey(requestUrl.searchParams.get("to")!);
      } else {
        throw "Missing 'to' parameter";
      }
    } catch (err) {
      throw "Invalid input query parameter: to";
    }
  
    try {
      if (requestUrl.searchParams.get("amount")) {
        amount = parseFloat(requestUrl.searchParams.get("amount")!);
      } else {
        throw "Missing 'amount' parameter";
      }
  
      if (amount <= 0) throw "amount is too small";
    } catch (err) {
      throw "Invalid input query parameter: amount";
    }
  
    return {
      amount,
      toPubkey,
    };
  }