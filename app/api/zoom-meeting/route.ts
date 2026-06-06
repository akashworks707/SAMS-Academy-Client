import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET(request: NextRequest) {
  const html = readFileSync(join(process.cwd(), "public", "zoom-meeting.html"), "utf-8");

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "credentialless", // less strict than require-corp, still enables SharedArrayBuffer
      "Cross-Origin-Resource-Policy": "cross-origin",
    },
  });
}