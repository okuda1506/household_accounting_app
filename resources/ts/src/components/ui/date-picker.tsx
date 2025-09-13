"use client";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "../../../lib/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface DatePickerProps {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    className?: string;
}

export function DatePicker({ date, setDate, className }: DatePickerProps) {
    const [open, setOpen] = useState(false);

    return (
        <Popover modal={true} open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal bg-gray-800 border-gray-700 hover:bg-gray-700",
                        !date && "text-muted-foreground",
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date
                        ? format(date, "yyyy年MM月dd日", { locale: ja })
                        : "日付を選択"}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate: Date | undefined) => {
                        if (selectedDate) {
                            setDate(selectedDate);
                        }
                        setOpen(false);
                    }}
                    initialFocus
                    className="text-white"
                />
            </PopoverContent>
        </Popover>
    );
}
