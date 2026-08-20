import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { cartCreate, cartLinesAdd } from "@/lib/shopify";
import type { CartInput } from "@/types/types";

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as CartInput;
    const cookieStore = await cookies();
    const existingCartId = cookieStore.get("shopifyCartId")?.value;

    const cart = existingCartId
      ? await cartLinesAdd(existingCartId, input.lines)
      : await cartCreate(input);

    const response = NextResponse.json({
      cart: {
        totalQuantity: cart.totalQuantity,
        checkoutUrl: cart.checkoutUrl,
      },
    });

    response.cookies.set({
      name: "shopifyCartId",
      value: cart.id,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to add item to cart",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
