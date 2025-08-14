import { useRejectDrawing } from "@/api/deals/deal.mutation";
import { Button } from "@/shared/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Textarea } from "@/shared/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";

const RejectDrawingDialog = ({ dialog, id}: { id: string, dialog: React.Dispatch<React.SetStateAction<{ open: boolean; data: any; action: "disapprove" | "approve" | null }>> }) => {

  const rejectDrawing = useRejectDrawing()
  const schema = z.object({
    note: z.string().optional()
  })

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      note: ""
    }
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    rejectDrawing.mutate({note: data.note, id});
    dialog({open: false, data: null, action: null})
  }

  return <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex flex-col space-y-4">
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <div className="space-y-2">
                <FormLabel>Note</FormLabel>
                <FormControl>
                  <Textarea id="note" placeholder="Enter note for rejecting drawing" {...field} />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </div>
      <Button type="submit" variant="destructive">Confirm</Button>
    </form>
  </Form>
}

export default RejectDrawingDialog