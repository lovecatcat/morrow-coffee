export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  featuredImage: {
    url: string;
    altText: string | null;
  } | null;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants: {
    nodes: {
      id: string;
      title: string;
      availableForSale: boolean;
      quantityAvailable: number;
      price: {
        amount: string;
        currencyCode: string;
      };
    }[];
  };
};

// 单个商品在购物车中的详情
export type CartLine = {
  id: string;
  quantity: number;
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
  merchandise: {
    id: string;
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    product:{
      title: string;
      handle: string;
    };
    image?: {
      url: string;
      altText: string | null;
    } | null;
  };
};



export type CartInput = {
  lines: {
    merchandiseId: string;
    quantity: number;
  }[];
};

export type ProductsQueryResult = {
  products: {
    nodes: ShopifyProduct[];
  };
};

export type ProductQueryResult = {
  product: ShopifyProduct | null;
};
export type CartCreateQueryResult = {
    cartCreate: {
      cart: {
        id: string;
        totalQuantity: number;
        checkoutUrl: string;
      } | null;
      userErrors: Array<{
        field: string[] | null;
        message: string;
        code?: string;
      }>;
    };
};

export type CartLinesAddQueryResult = {
    cartLinesAdd: {
      cart: {
        id: string;
        totalQuantity: number;
        checkoutUrl: string;
      } | null;
      userErrors: Array<{
        field: string[] | null;
        message: string;
        code?: string;
      }>;
    };
};

// 请求的参数，购物车详情
export type CartQueryResult = {
    cart: {
        id: string;
        totalQuantity: number;
        checkoutUrl: string;
        cost: {
          subtotalAmount: {
            amount: string;
            currencyCode: string;
          };
          totalAmount: {
            amount: string;
            currencyCode: string;
          };
        };
        lines: {
          nodes: CartLine[];
        };
    } | null;
      
};
