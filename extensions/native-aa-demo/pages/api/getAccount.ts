import { NextApiRequest, NextApiResponse } from 'next';
import { Hash, toBytes, fromHex, toHex, Hex } from 'viem-rip7560/src';
import * as dilithium from "pqc_dilithium";


async function sign({ hash }: { hash: Hash }): Promise<Hex> {
  const keys = dilithium.Keys.derive(toBytes("password"));
  const bytes = keys.sign_bytes(fromHex(hash, "bytes"), true);
  return toHex(bytes);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const hash = req.query.hash as Hex;
    if (!hash) {
      return res.status(400).json({ error: 'Hash is required and must be a string.' });
    }

    const signature = await sign({ hash });

    res.status(200).json({ signature });
  } catch (error) {
    console.error("Error fetching account:", error);
    res.status(500).json({ error: "Failed to fetch account" });
  }
}