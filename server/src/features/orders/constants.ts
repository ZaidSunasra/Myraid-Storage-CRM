const Include = {
    deal: {
        select: {
            company: {
                select: {
                    name: true
                }
            },
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
            }
        }
    },
    quotation: {
        select: {
            quotation_no: true
        }
    },
    advance: true,
    colour_change: {
        select: {
            id: true,
            colour: true,
            changed_on: true,
            order_id: true,
            user_id: true,
            user: {
                select: {
                    first_name: true,
                    last_name: true,
                    id: true
                }
            }
        },
    }
}

export default Include;