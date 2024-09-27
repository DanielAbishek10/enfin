import { ApiVersion } from "@shopify/shopify-api";
import { createStorefrontApiClient } from "@shopify/storefront-api-client";
import { getCartDataByID } from "../../service/shopify/query/cart.js";
import Shopify from "shopify-api-node";

export const storefrontClientInit = async (storeDetail) => {
  try {
    const shopifyClient = await createStorefrontApiClient({
      storeDomain: storeDetail.shop_url,
      apiVersion: ApiVersion.July24,
      publicAccessToken: storeDetail.storefront_access_token,
    });
    return shopifyClient;
  } catch (error) {
    throw error;
  }
};

export const shopifyClientInit = async (storeDetail) => {
    try {
        const shopifyClient = await new Shopify({
            shopName: storeDetail.shop_id,
            accessToken: storeDetail.shopify_access_token
        });
        
        return shopifyClient;
    } catch (error) {
        throw error;
    }
};

export const fetchCart = async (client, cartID) => {
  const variables = {
    id: cartID, // Pass the cart ID here
  };
  try {
    const { data, errors, extensions } = await client.request(
      getCartDataByID(),
      { variables }
    );
    return data.cart;
  } catch (error) {
    console.error("Errors occurred:", error);
    return error;
  }
};

export const createOrder = async (client, param) => {
    try {
        const order = await client.order.create({
          line_items: param.lineItems,
          billing_address: param.billingAddress,
          shipping_address: param.shippingAddress,
          current_total_discounts: param.discountAmount,
          current_total_price: param.totalAmount,
            current_subtotal_price: param.subtotalAmount,
            current_total_tax: param.totalTaxAmount,
            subtotal_price: "6739.80",
    discounts: [
        {
            code: "CODE_DISCOUNT_BLACKFRIDAY",
            amount: "-3287.89",
        },
    ],
    shipping_lines: [
        {
            title: "Standard",
            price: "5000.00",
            code: "Get50",
        },
    ],
    taxes: [
        {
            title: "IGST",
            rate: "18%",
            amount: "147.95",
        },
    ],
          transactions: [
            {
              kind: "authorization",
              status: "success",
              amount: param.totalAmount,
            },
          ],
        });
        return order;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

