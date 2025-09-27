"use client";

import {
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/card";

type TrendData = {
    year: number;
    month: number;
    total_expense: number;
};

type ExpenseChartProps = {
    trend: TrendData[];
};

const getMonthLabel = (month: number) => `${month}月`;

export function ExpenseChart({ trend }: ExpenseChartProps) {
    const chartData = trend.map((item) => ({
        name: getMonthLabel(item.month),
        expense: Number(item.total_expense),
    }));

    return (
        <Card className="bg-black border-gray-800">
            <CardHeader>
                <CardTitle className="text-lg font-medium">
                    Monthly Expense Trend
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) =>
                                `¥${Number(value).toLocaleString()}`
                            }
                        />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-black border border-gray-800 p-2 rounded-md">
                                            <p className="text-white">
                                                {`¥${Number(
                                                    payload[0].value
                                                ).toLocaleString()}`}
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="expense"
                            stroke="#ffffff"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
