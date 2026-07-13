import apiClient from "@/apis/client";
import { ReimburseFormData } from "@/hooks/useReimburseForm";

export const reimbursementService = {
    submitReimbursement: async (formData: ReimburseFormData) => {
        const data = new FormData();
        data.append("amount", formData.amount);
        data.append("reason", formData.reason.trim());
        data.append("expenseDate", formData.date.toISOString());

        if (formData.imageUri) {
            const uriParts = formData.imageUri.split(".");
            const fileType = uriParts[uriParts.length - 1];

            data.append("proof", {
                uri: formData.imageUri,
                name: `receipt_${Date.now()}.${fileType}`,
                type: `image/${fileType}`,
            } as any);
        }

        const response = await apiClient.post("/api/app/reimbursement/apply", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    getReimbursementHistory: async () => {
        const response = await apiClient.get("/api/app/reimbursement/history");
        return response.data;
    },

    // Add this inside the reimbursementService object
    cancelReimbursement: async (id: string) => {
        const response = await apiClient.delete(`/api/app/reimbursement/${id}`);
        return response.data;
    },
};