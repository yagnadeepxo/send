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
      const requestUrl = new URL(req.url);
      const { toPubkey } = validatedQueryParams(requestUrl);
  
      const baseHref = new URL(
        `/api/actions/transfer-send?to=${toPubkey.toBase58()}`,
        requestUrl.origin,
      ).toString();
  
      const payload: ActionGetResponse = {
        title: "Actions Example - Transfer SEND Token",
        icon: new URL("/send.jpeg", requestUrl.origin).toString(),
        description: "Transfer SEND tokens to another Solana wallet",
        label: "Transfer",
        links: {
          actions: [
            {
              label: "Send 1 SEND",
              href: `${baseHref}&amount=${"1"}`,
            },
            {
              label: "Send 5 SEND",
              href: `${baseHref}&amount=${"5"}`,
            },
            {
              label: "Send 10 SEND",
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
  
  export const POST = async (req: Request) => {
    try {
      const requestUrl = new URL(req.url);
      const { amount, toPubkey } = validatedQueryParams(requestUrl);
  
      const body: ActionPostRequest = await req.json();
  
      let account: PublicKey;
      try {
        account = new PublicKey(body.account);
      } catch (err) {
        return new Response('Invalid "account" provided', {
          status: 400,
          headers: ACTIONS_CORS_HEADERS,
        });
      }
  
      const connection = new Connection(clusterApiUrl("mainnet-beta"));
  
      // Get the associated token accounts
      const fromTokenAccount = await getAssociatedTokenAddress(SEND_TOKEN_MINT, account);
      const toTokenAccount = await getAssociatedTokenAddress(SEND_TOKEN_MINT, toPubkey);
  
      // Fetch token mint info to get decimals
      const mintInfo = await connection.getParsedAccountInfo(SEND_TOKEN_MINT);
      const decimals = (mintInfo.value?.data as any).parsed.info.decimals;
  
      const transaction = new Transaction().add(
        createTransferInstruction(
          fromTokenAccount,
          toTokenAccount,
          account,
          amount * Math.pow(10, decimals)
        )
      );
  
      transaction.feePayer = account;
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  
      const payload: ActionPostResponse = await createPostResponse({
        fields: {
          transaction,
          message: `Send ${amount} SEND to ${toPubkey.toBase58()}`,
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