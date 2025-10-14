import { useRejectDrawing } from "@/api/uploads/upload.mutation";
import { Button } from "@/shared/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Textarea } from "@/shared/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { rejectDrawingSchema, type RejectDrawingForm } from "zs-crm-common";

const RejectDrawingDialog = ({ dialog, id }: { id: string, dialog: React.Dispatch<React.SetStateAction<{ open: boolean; data: number | null; action: "disapprove" | "approve" | null }>> }) => {

  const rejectDrawing = useRejectDrawing()

  const form = useForm({
    resolver: zodResolver(rejectDrawingSchema),
    defaultValues: {
      note: ""
    }
  });

  const onSubmit = (data: RejectDrawingForm) => {
    rejectDrawing.mutate({ note: data.note, id });
    dialog({ open: false, data: null, action: null })
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