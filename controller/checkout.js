import {ShopifyStore} from "../db/model/store.js";
import { createOrder, fetchCart, shopifyClientInit, storefrontClientInit } from "../service/shopify/shopify.service.js";

export const getCartController = async (req, res) => {
    console.log(req);
    try {
        const data = await ShopifyStore.findOne({
            where: {
                shop_id: req.query.shopID
            }
        });
        if (!data) {
            res.status(404).send("Shopify store not found");
        }
        const shopifyClient = await storefrontClientInit(data)
        console.log(shopifyClient)
        let cart = await fetchCart(shopifyClient, req.query.cartID)
    
        res.send({"data": cart});

    } catch (error) {
        res.status(500, error);
    }
}

export const createOrderController = async (req, res) => {
    try {
        const data = await ShopifyStore.findOne({
            where: {
                shop_id: req.body.shopID
            }
        });
        if (!data) {
            res.status(404).send("Shopify store not found");
        }
        const storefrontClient = await storefrontClientInit(data)
        let cart = await fetchCart(storefrontClient, req.body.cartID)
        const shopifyClient = await shopifyClientInit(data)
        let orderParam = {}
        orderParam.lineItems = cart.lines.edges.map(data => {
            const variantSplit = data.node.merchandise.id.split('/')
            return {
                variant_id: variantSplit[variantSplit.length - 1],
                quantity: data.node.quantity,
            }
        })
        cart.discountAllocations.forEach(discount => {
            orderParam.discountAmount = (parseFloat(orderParam.discountAmount) + parseFloat(discount.discountedAmount.amount)).toFixed(2)
        })
        orderParam.totalAmount = cart.cost.totalAmount.amount
        orderParam.subtotalAmount = cart.cost.subtotalAmount.amount
        orderParam.totalTaxAmount = cart.cost.totalTaxAmount
        orderParam.shippingAddress = req.body.shippingAddress
        orderParam.billingAddress = req.body.billingAddress
        const result = await createOrder(shopifyClient, orderParam)
        res.send({"data": result});

    } catch (error) {
        res.status(500, error);
    }
}

