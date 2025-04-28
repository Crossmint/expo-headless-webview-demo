// Export all types explicitly for better TypeScript support
export type {
  AppearanceVariables,
  AppearanceRules,
  Appearance,
  Recipient,
  LineItems,
  Payment,
  CheckoutOptions,
  OrderRequest,
  OrderResponse,
} from "./types/checkout";

// Export all functions and constants
export {
  defaultCheckoutOptions,
  generateCheckoutUrl,
  createOrder,
} from "./utils/checkout";

export {
  checkoutProdBaseUrl,
  checkoutStagingBaseUrl,
  sdkMetadata,
} from "./utils/config";
