'use client'

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"

const data = [
    { name: "1月", expense: 200000 },
    { name: "2月", expense: 185000 },
    { name: "3月", expense: 1000 },
    { name: "4月", expense: 90000 },
    { name: "5月", expense: 400000 },
    { name: "6月", expense: 185000 },
    // { name: "7月", expense: 185000 },
    // { name: "8月", expense: 185000 },
    // { name: "9月", expense: 185000 },
    // { name: "10月", expense: 185000 },
    // { name: "11月", expense: 185000 },
    // { name: "12月", expense: 185000 },
]

export function ExpenseChart() {
    return (
        <Card className="bg-black border-gray-800">
        <CardHeader>
                <CardTitle className="text-lg font-medium">月間支出推移</CardTitle>
        </CardHeader>
        <CardContent>
            <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
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
                tickFormatter={(value) => `¥${value}`}
                />
                <Tooltip
                content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                    return (
                        <div className="bg-black border border-gray-800 p-2 rounded-md">
                        <p className="text-white">{`¥${payload[0].value}`}</p>
                        </div>
                    )
                    }
                    return null
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
    )
}

