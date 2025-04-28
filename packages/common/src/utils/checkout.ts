import type {
  CheckoutOptions,
  OrderRequest,
  OrderResponse,
} from "../types/checkout";
import {
  checkoutProdBaseUrl,
  checkoutStagingBaseUrl,
  sdkMetadata,
} from "./config";

// Change this to your own default checkout options
export const defaultCheckoutOptions: CheckoutOptions = {
  locale: "en-US",
  appearance: {
    rules: {
      ReceiptEmailInput: {
        display: "hidden",
      },
      DestinationInput: {
        display: "hidden",
      },
    },
  },
  recipient: {
    walletAddress: "EbXL4e6XgbcC7s33cD5EZtyn5nixRDsieBjPQB7zf448", // Change to the user's wallet address
  },
  lineItems: {
    tokenLocator: "solana:6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN",
    executionParameters: {
      mode: "exact-in", // The execution method for the order. It tells Crossmint to operate in buying fungibles mode
      amount: "1", // Amount in USD
      maxSlippageBps: "500", // Optional - default slippage will be applied if not specified
    },
  },
  payment: {
    crypto: {
      enabled: false,
    },
    fiat: {
      enabled: true,
      allowedMethods: {
        card: false,
        applePay: true,
        googlePay: false,
      },
    },
    method: "checkoutcom-flow",
    defaultMethod: "fiat",
    receiptEmail: "robin+checkout@crossmint.com", // Change to the user's email
  },
};

// client
export const createOrder = async (
  apiUrl: string,
  orderData: OrderRequest
): Promise<OrderResponse> => {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to create order: ${JSON.stringify(errorData)}`);
  }

  return response.json();
};

export const generateCheckoutUrl = async (
  apiUrl: string,
  options: CheckoutOptions
): Promise<string> => {
  const order = await createOrder(apiUrl, options);

  const baseUrl =
    order.environment === "production"
      ? checkoutProdBaseUrl
      : checkoutStagingBaseUrl;

  const params = new URLSearchParams({
    locale: options.locale,
    orderId: order.order.orderId,
    clientSecret: order.clientSecret,
    recipient: JSON.stringify(options.recipient),
    payment: JSON.stringify(options.payment),
    appearance: JSON.stringify(options.appearance),
    sdkMetadata: JSON.stringify(sdkMetadata),
    lineItems: JSON.stringify(options.lineItems),
  });

  return `${baseUrl}?${params.toString()}`;
};
