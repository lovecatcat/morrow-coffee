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
  id: string; // 修改/删除购物车商品：item.id 在购物车列表里面唯一标识商品的 ID
  quantity: number;
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
  merchandise: {
    id: string; // 商品变体 ID，只用于 Add to cart
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

export type CartLineUpdateInput = {
  id: string;
  quantity: number;
};

export type Cart = {
  id: string; // 定位整个购物车：cartId, 创建购物车，添加购物车
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
  cart: Cart | null;
};

export type CartLinesUpdateQueryResult = {
  cartLinesUpdate: {
    cart: Cart | null;
    userErrors: Array<{
      field: string[] | null;
      message: string;
      code?: string;
    }>;
  };
};
