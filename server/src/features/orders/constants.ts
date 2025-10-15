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
    advance: true
}

export default Include;