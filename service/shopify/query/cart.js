

    const cartFields = `
    id
	discountCodes{
		code
		applicable
	}
	attributes {
		key
		value
	}
	buyerIdentity {
		countryCode
		email
		phone
	}
	checkoutUrl
	createdAt
	discountCodes {
		applicable
		code
	}
	discountAllocations {
		discountedAmount {
			amount
			currencyCode
		}
	}
	cost {
		subtotalAmount {
			amount
			currencyCode
		}
		totalAmount {
			amount
			currencyCode
		}
		totalTaxAmount {
			amount
			currencyCode
		}
		totalDutyAmount {
			amount
			currencyCode
		}
	}
	note
	updatedAt
	lines(first: 250) {
		edges {
			node {
				id
				quantity
				cost {
					amountPerQuantity {
						amount
						currencyCode
					}
					compareAtAmountPerQuantity {
						amount
						currencyCode
					}
					subtotalAmount {
						amount
						currencyCode
					}
					totalAmount {
						amount
						currencyCode
					}
				}
				discountAllocations {
					discountedAmount {
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
						compareAtPrice {
							amount
							currencyCode
						}
						image {
							id
							url
						}
						product {
							id
							title
							featuredImage {
								id
								url
							}
							description
							handle
						}
						sku
						requiresShipping
						selectedOptions {
							name
							value
						}
					}
				}
			}
		}
	}
    `;

    const getCartDataByID = () => {
        return `
        query getCart($id: ID!) {
            cart(id: $id) {
              ${cartFields}
            }
          }
        `
    }
export {
    getCartDataByID
}