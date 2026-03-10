"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ConfirmDeleteButton } from "@/components/ui/confirm-delete-button";

import { useDisclosure } from "@/hooks/use-disclosure";
import { useRoutine } from "@/routine/context";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormLabel, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogHeader,
  DialogClose,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import type { IRoutineBlock, TRoutineColor, TWeekDay } from "@/routine/types";

const DAY_LABELS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const COLOR_OPTIONS: { value: TRoutineColor; label: string; bg: string }[] = [
  { value: "blue", label: "Blue", bg: "bg-blue-500" },
  { value: "green", label: "Green", bg: "bg-green-500" },
  { value: "red", label: "Red", bg: "bg-red-500" },
  { value: "yellow", label: "Yellow", bg: "bg-yellow-500" },
  { value: "purple", label: "Purple", bg: "bg-purple-500" },
  { value: "orange", label: "Orange", bg: "bg-orange-500" },
  { value: "gray", label: "Gray", bg: "bg-neutral-500" },
];

const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 6am - 11pm
const MINUTES = [0, 30];

const blockSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string(),
    location: z.string(),
    color: z.enum(["blue", "green", "red", "yellow", "purple", "orange", "gray"]),
    dayOfWeek: z.coerce.number().min(0).max(6),
    startHour: z.coerce.number().min(6).max(23),
    startMinute: z.coerce.number(),
    endHour: z.coerce.number().min(6).max(23),
    endMinute: z.coerce.number(),
  })
  .refine(
    data => {
      const start = data.startHour * 60 + data.startMinute;
      const end = data.endHour * 60 + data.endMinute;
      return end > start;
    },
    { message: "End time must be after start time", path: ["endHour"] }
  );

type TBlockFormData = z.infer<typeof blockSchema>;

interface IProps {
  children: React.ReactNode;
  defaultDay?: TWeekDay;
  defaultHour?: number;
  existingBlock?: IRoutineBlock;
}

export function RoutineBlockDialog({ children, defaultDay = 0, defaultHour = 9, existingBlock }: IProps) {
  const { addBlock, updateBlock, deleteBlock } = useRoutine();
  const { isOpen, onClose, onToggle } = useDisclosure();

  const isEdit = !!existingBlock;

  const form = useForm<TBlockFormData>({
    resolver: zodResolver(blockSchema),
    defaultValues: existingBlock
      ? {
          title: existingBlock.title,
          description: existingBlock.description,
          location: existingBlock.location,
          color: existingBlock.color,
          dayOfWeek: existingBlock.dayOfWeek,
          startHour: existingBlock.startHour,
          startMinute: existingBlock.startMinute,
          endHour: existingBlock.endHour,
          endMinute: existingBlock.endMinute,
        }
      : {
          title: "",
          description: "",
          location: "",
          color: "blue",
          dayOfWeek: defaultDay,
          startHour: defaultHour,
          startMinute: 0,
          endHour: defaultHour + 1,
          endMinute: 0,
        },
  });

  useEffect(() => {
    if (!isEdit) {
      form.reset({
        title: "",
        description: "",
        location: "",
        color: "blue",
        dayOfWeek: defaultDay,
        startHour: defaultHour,
        startMinute: 0,
        endHour: defaultHour + 1 > 23 ? 23 : defaultHour + 1,
        endMinute: 0,
      });
    }
  }, [defaultDay, defaultHour, isEdit, form]);

  const onSubmit = async (values: TBlockFormData) => {
    if (isEdit && existingBlock) {
      await updateBlock({ ...existingBlock, ...values, dayOfWeek: values.dayOfWeek as TWeekDay });
    } else {
      await addBlock({ ...values, dayOfWeek: values.dayOfWeek as TWeekDay });
      form.reset();
    }
    onClose();
  };

  const handleDelete = async () => {
    if (existingBlock) await deleteBlock(existingBlock.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onToggle}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit block" : "New block"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form id="routine-block-form" onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3 py-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Algorithms, Gym..." data-invalid={fieldState.invalid} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Room, gym..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger data-invalid={fieldState.invalid}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {COLOR_OPTIONS.map(c => (
                            <SelectItem key={c.value} value={c.value}>
                              <div className="flex items-center gap-2">
                                <div className={`size-3 rounded-full ${c.bg}`} />
                                {c.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description <span className="text-muted-foreground text-xs">(optional)</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Additional notes..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dayOfWeek"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Day of the week</FormLabel>
                  <FormControl>
                    <Select value={String(field.value)} onValueChange={v => field.onChange(Number(v))}>
                      <SelectTrigger data-invalid={fieldState.invalid}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DAY_LABELS.map((label, i) => (
                          <SelectItem key={i} value={String(i)}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              {/* Start time */}
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="startHour"
                  render={({ field, fieldState }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Start</FormLabel>
                      <FormControl>
                        <Select value={String(field.value)} onValueChange={v => field.onChange(Number(v))}>
                          <SelectTrigger data-invalid={fieldState.invalid} className="text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {HOURS.map(h => (
                              <SelectItem key={h} value={String(h)}>
                                {String(h).padStart(2, "0")}:00
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startMinute"
                  render={({ field }) => (
                    <FormItem className="w-20 self-end">
                      <FormControl>
                        <Select value={String(field.value)} onValueChange={v => field.onChange(Number(v))}>
                          <SelectTrigger className="text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {MINUTES.map(m => (
                              <SelectItem key={m} value={String(m)}>
                                :{m === 0 ? "00" : "30"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* End time */}
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="endHour"
                  render={({ field, fieldState }) => (
                    <FormItem className="flex-1">
                      <FormLabel>End</FormLabel>
                      <FormControl>
                        <Select value={String(field.value)} onValueChange={v => field.onChange(Number(v))}>
                          <SelectTrigger data-invalid={fieldState.invalid} className="text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {HOURS.map(h => (
                              <SelectItem key={h} value={String(h)}>
                                {String(h).padStart(2, "0")}:00
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endMinute"
                  render={({ field }) => (
                    <FormItem className="w-20 self-end">
                      <FormControl>
                        <Select value={String(field.value)} onValueChange={v => field.onChange(Number(v))}>
                          <SelectTrigger className="text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {MINUTES.map(m => (
                              <SelectItem key={m} value={String(m)}>
                                :{m === 0 ? "00" : "30"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>

        <DialogFooter className="flex-row items-center">
          {isEdit && (
            <div className="mr-auto">
              <ConfirmDeleteButton variant="icon" onConfirm={handleDelete} className="opacity-100" />
            </div>
          )}
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button form="routine-block-form" type="submit">
            {isEdit ? "Save" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
