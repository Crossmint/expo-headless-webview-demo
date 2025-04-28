export type AppearanceVariables = {
  fontFamily?: string;
  spacingUnit?: string;
  fontSizeUnit?: string;
  borderRadius?: string;
  colors?: {
    borderPrimary?: string;
    backgroundPrimary?: string;
    textPrimary?: string;
    textSecondary?: string;
    danger?: string;
    warning?: string;
    accent?: string;
  };
};

export type AppearanceRules = {
  DestinationInput?: {
    display?: "hidden";
  };
  ReceiptEmailInput?: {
    display?: "hidden";
  };
  Label?: {
    font?: {
      family?: string;
      size?: string;
      weight?: string;
    };
    colors?: {
      text?: string;
    };
  };
  Input?: {
    borderRadius?: string;
    font?: {
      family?: string;
      size?: string;
      weight?: string;
    };
    colors?: {
      text?: string;
      background?: string;
      border?: string;
      boxShadow?: string;
      placeholder?: string;
    };
    hover?: {
      colors?: {
        text?: string;
        background?: string;
        border?: string;
        boxShadow?: string;
      };
    };
    focus?: {
      colors?: {
        background?: string;
        border?: string;
        boxShadow?: string;
      };
    };
  };
  Tab?: {
    borderRadius?: string;
    font?: {
      family?: string;
      size?: string;
      weight?: string;
    };
    colors?: {
      text?: string;
      background?: string;
      border?: string;
      boxShadow?: string;
    };
    hover?: {
      colors?: {
        text?: string;
        background?: string;
        border?: string;
        boxShadow?: string;
      };
    };
    selected?: {
      colors?: {
        text?: string;
        background?: string;
        border?: string;
        boxShadow?: string;
      };
    };
  };
  PrimaryButton?: {
    borderRadius?: string;
    font?: {
      family?: string;
      size?: string;
      weight?: string;
    };
    colors?: {
      text?: string;
      background?: string;
    };
    hover?: {
      colors?: {
        text?: string;
        background?: string;
      };
    };
    disabled?: {
      colors?: {
        text?: string;
        background?: string;
      };
    };
  };
};

export type Appearance = {
  variables?: AppearanceVariables;
  rules?: AppearanceRules;
};

export type Recipient = {
  walletAddress: string;
};

export type LineItems = {
  tokenLocator: string;
  executionParameters: {
    mode: string;
    amount: string;
    maxSlippageBps: string;
  };
};

export type Payment = {
  crypto: {
    enabled: boolean;
  };
  fiat: {
    enabled: boolean;
    allowedMethods?: {
      card?: boolean;
      applePay?: boolean;
      googlePay?: boolean;
    };
  };
  method: string;
  defaultMethod: "fiat" | "crypto";
  receiptEmail: string;
};

export type CheckoutOptions = {
  appearance: Appearance;
  recipient: Recipient;
  lineItems: LineItems;
  payment: Payment;
  locale: string;
};

export type OrderRequest = {
  locale: string;
  recipient: Recipient;
  lineItems: LineItems;
  payment: {
    method: string;
    receiptEmail: string;
  };
};

export type OrderResponse = {
  clientSecret: string;
  order: {
    orderId: string;
  };
  environment: "production" | "staging";
};
