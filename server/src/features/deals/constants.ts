export const Include = {
    company: true,
    client_detail: {
        select: {
            first_name: true,
            last_name: true,
            emails: {
                select: {
                    email: true
                }
            },
            phones: {
                select: {
                    phone: true
                }
            }
        }
    },
    source: true,
    product: true,
    assigned_to: {
        select: {
            user: {
                select: {
                    first_name: true,
                    last_name: true,
                    id: true
                }
            }
        }
    },
    quotation: {
        select: {
            quotation_products: {
                select: {
                    name: true
                }
            }
        }
    }
}