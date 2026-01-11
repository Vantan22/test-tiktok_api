"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

const COLORS = ["#FF0050", "#00F2EA", "#82ca9d", "#ffc658", "#8884d8"];

export function ComparisonChart({ title, data, metric }: { title: string, data: any[], metric: string }) {
    // Data structure needs to be merged by date? 
    // Should accept array where each item has date and [channelId]: value

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(val) => formatDate(val)}
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            labelFormatter={(value) => formatDate(value)}
                            contentStyle={{ borderRadius: "8px" }}
                        />
                        <Legend />
                        {/* Generate lines dynamically based on keys excluding date */}
                        {data.length > 0 && Object.keys(data[0]).filter(k => k !== "date" && k !== "timestamp").map((key, index) => (
                            <Line
                                key={key}
                                type="monotone"
                                dataKey={key}
                                stroke={COLORS[index % COLORS.length]}
                                strokeWidth={2}
                                dot={false}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
