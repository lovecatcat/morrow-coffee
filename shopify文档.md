 因为 Hydrogen + Oxygen 是 Shopify 自己维护的“一体化 Headless 技术栈”，所以官网会优
  先推荐它。这不代表 Next.js 不能接 Shopify。

  它们分别负责：

  - Hydrogen：基于 React Router 的 Shopify 商城框架。
  - Oxygen：Shopify 为 Hydrogen 提供的边缘部署平台。
  - Storefront API：真正提供商品、购物车、Collection 和结账数据。
  - Next.js：可以直接调用 Storefront API，但部分商城能力需要自己封装。
  
主要区别如下：

   能力                  Hydrogen                        Next.js
  ━━━━━━━━━━━━━━━━━━━━  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ━━━━━━━━━━━━━━━━━━━━
   Shopify API 客户端    内置                            自己编写或安装 SDK
  ────────────────────  ──────────────────────────────  ────────────────────
   商品和购物车组件      提供现成工具                    自己实现
  ────────────────────  ──────────────────────────────  ────────────────────
   GraphQL 类型          官方工具支持                    自己定义或生成
  ────────────────────  ──────────────────────────────  ────────────────────
   缓存与国际化          Shopify 已适配                  自己设计
  ────────────────────  ──────────────────────────────  ────────────────────
   部署                  Oxygen                          通常使用 Vercel
  ────────────────────  ──────────────────────────────  ────────────────────
   学习成本              要学习 React Router/Hydrogen    你已经熟悉
  ────────────────────  ──────────────────────────────  ────────────────────
   框架通用性            Shopify 专用性更强              应用范围更广

  Shopify 官方将 Hydrogen + Oxygen
  称为推荐栈，是因为它减少了商城开发中的重复工作，例如 Token 管理、缓存、Cart、Shop
  Pay、Markets 和 Analytics。Hydrogen 与 Oxygen 官方说明
  (https://shopify.dev/docs/storefronts/headless/hydrogen/fundamentals)

  但官方也允许自带技术栈。Storefront API 本身与框架无关，所以 Next.js 完全成立。甚至
  Shopify 正在预览新版框架无关的 Hydrogen 工具包，可与 Next.js
  等框架配合，但目前仍属于 developer
  preview，不适合把它作为这个入门项目的基础。Hydrogen developer preview
  (https://shopify.dev/docs/storefronts/headless/developer-preview)

  对你这个项目，我建议继续 Next.js，原因是：

  1. 你已经熟悉 Next.js，可以专注学习 Shopify 数据模型。
  2. 亲手写一次 GraphQL 请求，能真正理解 Storefront API。
  3. Next.js + Shopify 对普通 React/Next.js 岗位也有展示价值。
  4. 项目部署到 Vercel更自然。



 merchandise.id → 商品变体 ID，只用于 Add to cart
  item.id        → 购物车行 ID，用于修改数量
  cartId         → 整个购物车 ID，由 Route 从 Cookie 获取