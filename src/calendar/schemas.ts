import { z } from "zod";

export const eventSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string(),
    date: z.date({ required_error: "Date is required" }),
    startTime: z.object({ hour: z.number(), minute: z.number() }, { required_error: "Start time is required" }),
    endTime: z.object({ hour: z.number(), minute: z.number() }, { required_error: "End time is required" }),
    color: z.enum(["blue", "green", "red", "yellow", "purple", "orange", "gray"], { required_error: "Color is required" }),
  })
  .refine(
    data => {
      const start = data.startTime.hour * 60 + data.startTime.minute;
      const end = data.endTime.hour * 60 + data.endTime.minute;
      return end > start;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );

export type TEventFormData = z.infer<typeof eventSchema>;
