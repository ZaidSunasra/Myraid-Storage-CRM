import type { Drawing } from "zs-crm-common";

export const calculateTotalStorage = (data: Pick<Drawing, "id" | "uploaded_at" | "upload_type" | "file_size" | "title" | "deal_id" | "order_id" | "version">[]) => {

    const totalSize = data.reduce((sum, drawing) => sum + drawing.file_size, 0);
    const inKB = totalSize / 1024;
    const inMB = inKB / 1024;
    const inGB = inMB / 1024;

    if (inGB >= 1) return `${inGB.toFixed(2)} GB`;
    if (inMB >= 1) return `${inMB.toFixed(2)} MB`;
    return `${inKB.toFixed(2)} KB`;

}

