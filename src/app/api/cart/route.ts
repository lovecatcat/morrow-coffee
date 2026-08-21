import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { cartCreate, cartLinesAdd, cartLinesUpdate } from "@/lib/shopify";
import type { CartInput, CartLineUpdateInput } from "@/types/types";

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
    console.error("Failed to add item to cart:", error);

    return NextResponse.json(
      {
        error: "Failed to add item to cart",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as {
      lines: CartLineUpdateInput[];
    };

    const cookieStore = await cookies();
    const cartId = cookieStore.get("shopifyCartId")?.value;

    if (!cartId) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const linesAreValid = body.lines?.every(
      (line) =>
        typeof line.id === "string" &&
        line.id.length > 0 &&
        Number.isInteger(line.quantity) &&
        line.quantity > 0,
    );

    if (!body.lines?.length || !linesAreValid) {
      return NextResponse.json(
        { error: "A cart line id and a positive quantity are required" },
        { status: 400 },
      );
    }

    const cart = await cartLinesUpdate(cartId, body.lines);

    return NextResponse.json({ cart });
  } catch (error) {
    console.error("Failed to update cart:", error);

    return NextResponse.json(
      {
        error: "Failed to update cart",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
