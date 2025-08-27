import { NextResponse } from "next/server";
import { stripe } from "../../../../../lib/stripe";
import { db } from "../../../../../lib/db";
import Stripe from "stripe";

export const runtime = "nodejs";

// We expect STRIPE_WEBHOOK_SECRET in env
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string | undefined;

export async function POST(req: Request) {
  let event: Stripe.Event;
  try {
    if (!webhookSecret) {
      console.error("Missing STRIPE_WEBHOOK_SECRET");
      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 500 }
      );
    }

    const bodyText = await req.text();
    const sig = req.headers.get("stripe-signature");
    if (!sig) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    event = stripe.webhooks.constructEvent(bodyText, sig, webhookSecret);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error verifying signature";
    console.error("Webhook signature verification failed.", errorMessage);
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      console.log("[stripe] event received:", {
        id: event.id,
        type: event.type,
      });
      const session = event.data.object as Stripe.Checkout.Session & {
        metadata?: { userId?: string; items?: string };
      };

      // Get the line items with expanded product
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id,
        {
          expand: ["data.price.product"],
        }
      );
      console.log("[stripe] line items received:", lineItems.data.length);

      // Build order items from Stripe line items
      const items: Array<{
        productId: string;
        quantity: number;
        price: number;
      }> = [];
      for (const li of lineItems.data) {
        const qty = li.quantity ?? 0;
        const priceUnit = (li.price?.unit_amount ?? 0) / 100;

        // product can be string or object — after expand it should be object
        const productObj = li.price?.product as
          | Stripe.Product
          | string
          | undefined;
        const productId =
          typeof productObj === "object"
            ? productObj.metadata?.productId
            : undefined;

        console.log("[stripe] li ->", {
          qty,
          unit_amount: li.price?.unit_amount,
          hasProductMetaId: Boolean(productId),
        });

        if (!productId) continue;
        items.push({ productId, quantity: qty, price: priceUnit });
      }
      console.log("[stripe] built items:", items);

      // Fallback to session.metadata.items if no items built
      if (items.length === 0) {
        try {
          const metaItems = session.metadata?.items
            ? (JSON.parse(session.metadata.items) as Array<{
                productId: string;
                quantity: number;
                price: number;
              }>)
            : [];
          if (Array.isArray(metaItems) && metaItems.length > 0) {
            console.log("[stripe] using metadata.items fallback", metaItems);
            items.push(...metaItems);
          }
        } catch {
          console.warn("[stripe] failed to parse metadata.items fallback");
        }
      }

      // Decrement stock + create order
      if (items.length > 0) {
        await db.$transaction(async (tx) => {
          for (const it of items) {
            console.log("[stripe] decrement stock:", it);
            const product = await tx.product.findUnique({
              where: { id: it.productId },
            });
            if (!product) continue;

            const dec = Math.min(it.quantity, Math.max(0, product.quantity));
            if (dec <= 0) continue;

            await tx.product.update({
              where: { id: it.productId },
              data: { quantity: { decrement: dec } },
            });
          }

          const userId = session.metadata?.userId;
          if (userId) {
            const total = items.reduce(
              (acc, it) => acc + it.price * it.quantity,
              0
            );
            const order = await tx.order.create({
              data: {
                userId,
                status: "PAID",
                total,
              },
            });
            console.log("[stripe] created order:", order.id);

            for (const it of items) {
              await tx.orderItem.create({
                data: {
                  orderId: order.id,
                  productId: it.productId,
                  quantity: it.quantity,
                  price: it.price,
                },
              });
            }
          }
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    const errorMessage =
      e instanceof Error ? e.message : "Unknown webhook processing error";
    console.error("webhook processing error", errorMessage);
    return NextResponse.json(
      { error: errorMessage || "Webhook error" },
      { status: 500 }
    );
  }
}
