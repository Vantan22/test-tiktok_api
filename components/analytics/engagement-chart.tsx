"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export function EngagementChart({ data }: { data: any[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Engagement Rate</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis
                            dataKey="snapshotDate"
                            tickFormatter={(val) => formatDate(val)}
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            unit="%"
                        />
                        <Tooltip
                            labelFormatter={(value) => formatDate(value)}
                            contentStyle={{ borderRadius: "8px" }}
                            formatter={(value: number | undefined) => [typeof value === 'number' ? `${value.toFixed(2)}%` : "0%", "Engagement"]}
                        />
                        <Line
                            type="monotone"
                            dataKey="engagementRate"
                            stroke="#00F2EA"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
