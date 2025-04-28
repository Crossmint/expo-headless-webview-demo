export const apiKey = process.env.CROSSMINT_API_KEY ?? "";

if (!apiKey) {
  throw new Error("CROSSMINT_API_KEY is not set");
}

if (!apiKey.startsWith("sk")) {
  throw new Error("CROSSMINT_API_KEY must be a server api key");
}

export const environment = apiKey.startsWith("sk_production")
  ? "production"
  : "staging";

export const ordersBaseUrl =
  environment === "production"
    ? "https://www.crossmint.com/api/2022-06-09/orders"
    : "https://staging.crossmint.com/api/2022-06-09/orders";
