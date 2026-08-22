import "server-only";
import type {
  ProductsQueryResult,
  ProductQueryResult,
  CartInput,
  CartCreateQueryResult,
  CartLinesAddQueryResult,
  CartQueryResult,
  CartLinesUpdateQueryResult,
  CartLinesRemoveQueryResult,
  CartLineUpdateInput,
} from "@/types/types";

//shopifyFetch 是我们手写的通用 GraphQL 请求工具函数（不是官方 SDK），放在 lib/shopify.ts，
// 专门给 Next.js 服务端组件 / Route Handler调用 Shopify‑Storefront API，
// 封装了：请求头、POST、错误捕获、ISR 缓存，接收 GraphQL 字符串 + variables，返回 data，直接拿来用。
function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

const domain = getRequiredEnv("SHOPIFY_STORE_DOMAIN");
const storefrontToken = getRequiredEnv("SHOPIFY_STOREFRONT_ACCESS_TOKEN");
const shopifyEndpoint = `https://${domain}/api/2026-07/graphql.json`;

type ShopifyFetchOptions = {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
};

type ShopifyResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

export async function shopifyFetch<T>({
  query,
  variables = {},
  cache,
}: ShopifyFetchOptions): Promise<T> {
  let response: Response;

  try {
    response = await fetch(shopifyEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Shopify-Storefront-Private-Token": storefrontToken,
      },
      body: JSON.stringify({ query, variables }),
      ...(cache ? { cache } : { next: { revalidate: 60 } }),
    });
  } catch (error) {
    const cause =
      error instanceof Error && error.cause instanceof Error
        ? `: ${error.cause.message}`
        : "";

    throw new Error(`Unable to connect to Shopify${cause}`);
  }

  const result = (await response.json()) as ShopifyResponse<T>;

  if (!response.ok || result.errors?.length) {
    const message = result.errors?.map((error) => error.message).join(", ");

    throw new Error(message || `Shopify request failed (${response.status})`);
  }

  if (!result.data) {
    throw new Error("Shopify returned no data");
  }

  return result.data;
}

const productsQuery = `
  query Products($first: Int!) {
    products(first: $first) {
      nodes {
        id
        title
        handle
        description
        featuredImage {
          url
          altText
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

export async function getProducts(first: number) {
  const data = await shopifyFetch<ProductsQueryResult>({
    query: productsQuery,
    variables: { first },
  });

  return data.products.nodes;
}

const productQuery = `
    query Product($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        description
        featuredImage {
          url
          altText
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 10) {
          nodes {
            id
            title
            availableForSale
            quantityAvailable
            price {
              amount
              currencyCode
            }
          }
        }

      }
    }
  `;

export async function getProduct(handle: string) {
  const data = await shopifyFetch<ProductQueryResult>({
    query: productQuery,
    variables: { handle },
  });

  return data.product;
}

// 创建购物车
const cartCreateMutation = `
  mutation cartCreate($input: CartInput) {
    cartCreate(input: $input) {
      cart {
        id,
        totalQuantity,
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function cartCreate(input: CartInput) {
  const data = await shopifyFetch<CartCreateQueryResult>({
    query: cartCreateMutation,
    variables: { input },
    cache: "no-store",
  });

  const result = data.cartCreate;

  if (result.userErrors.length > 0) {
    throw new Error(result.userErrors.map((error) => error.message).join(", "));
  }

  if (!result.cart) {
    throw new Error("Shopify did not create a cart");
  }

  return result.cart;
}
// 如果购物车存在，添加购物车
const cartLinesAddMutation = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id,
        totalQuantity,
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;
export async function cartLinesAdd(cartId: string, lines: CartInput["lines"]) {
  const data = await shopifyFetch<CartLinesAddQueryResult>({
    query: cartLinesAddMutation,
    variables: { cartId, lines },
    cache: "no-store",
  });

  const result = data.cartLinesAdd;

  if (result.userErrors.length > 0) {
    throw new Error(result.userErrors.map((error) => error.message).join(", "));
  }

  if (!result.cart) {
    throw new Error("Shopify did not create a cart");
  }

  return result.cart;
}

// 获取购物车数量
const cartQuery = `
  query Cart($cartId: ID!) {
    cart(id: $cartId) {
      id
      totalQuantity
      checkoutUrl
      cost {
        subtotalAmount {
          amount
          currencyCode
        }
        totalAmount {
          amount
          currencyCode
        }
      }
      lines(first: 20) {
          nodes {
            id
            quantity
            cost {
              totalAmount {
                amount
                currencyCode
              }
            }
            merchandise {
              ... on ProductVariant {
                id
                title
                price {
                  amount
                  currencyCode
                }
                image {
                  url
                  altText
                }
                product {
                  title
                  handle
                }
              }
            }
          }
        }

    }
  }
`;
export async function getCart(cartId: string) {
  const data = await shopifyFetch<CartQueryResult>({
    query: cartQuery,
    variables: { cartId },
    cache: "no-store",
  });

  return data.cart;
}

// 购物车更新
const cartLinesUpdateMutation = `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        totalQuantity
        checkoutUrl
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 20) {
          nodes {
            id
            quantity
            cost {
              totalAmount {
                amount
                currencyCode
              }
            }
            merchandise {
              ... on ProductVariant {
                id
                title
                price {
                  amount
                  currencyCode
                }
                image {
                  url
                  altText
                }
                product {
                  title
                  handle
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

export async function cartLinesUpdate(
  cartId: string,
  lines: CartLineUpdateInput[],
) {
  const data = await shopifyFetch<CartLinesUpdateQueryResult>({
    query: cartLinesUpdateMutation,
    variables: { cartId, lines },
    cache: "no-store",
  });

  const result = data.cartLinesUpdate;

  if (result.userErrors.length > 0) {
    throw new Error(result.userErrors.map((error) => error.message).join(", "));
  }

  if (!result.cart) {
    throw new Error("Shopify did not update the cart");
  }

  return result.cart;
}

const cartLinesRemoveMutation = `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        totalQuantity
        checkoutUrl
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 20) {
          nodes {
            id
            quantity
            cost {
              totalAmount {
                amount
                currencyCode
              }
            }
            merchandise {
              ... on ProductVariant {
                id
                title
                price {
                  amount
                  currencyCode
                }
                image {
                  url
                  altText
                }
                product {
                  title
                  handle
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

export async function cartLinesRemove(cartId: string, lineIds: string[]) {
  const data = await shopifyFetch<CartLinesRemoveQueryResult>({
    query: cartLinesRemoveMutation,
    variables: { cartId, lineIds },
    cache: "no-store",
  });

  const result = data.cartLinesRemove;

  if (result.userErrors.length > 0) {
    throw new Error(result.userErrors.map((error) => error.message).join(", "));
  }

  if (!result.cart) {
    throw new Error("Shopify did not remove the cart line");
  }

  return result.cart;
}
