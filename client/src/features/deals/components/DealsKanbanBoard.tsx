const KanbanBoard = ({ data }: { data: any }) => {
    
    const groupByStatus = data.deals.reduce((acc: Record<string, any[]>, deal: any) => {
        const status = deal.deal_status
        if (!acc[status]){
            acc[status] = [];
        }
        acc[status].push(deal);
        return acc;
   }, {});

   console.log(groupByStatus);

    return <div>

    </div>
}

export default KanbanBoard