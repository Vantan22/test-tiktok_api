"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { compareChannels } from "@/app/actions/analytics";
import { ComparisonChart } from "@/components/analytics/comparison-chart";
import { Channel } from "@/types/channel";
import { Loader2, X } from "lucide-react";
import { getChannelHistory } from "@/app/actions/analytics";

export default function AnalyticsClient({ allChannels }: { allChannels: any[] }) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [comparisonData, setComparisonData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleSelect = (id: string) => {
        if (selectedIds.includes(id)) return;
        if (selectedIds.length >= 5) return;
        setSelectedIds([...selectedIds, id]);
    };

    const removeId = (id: string) => {
        setSelectedIds(selectedIds.filter(x => x !== id));
    };

    const handleCompare = async () => {
        if (selectedIds.length === 0) return;
        setLoading(true);
        try {
            // Fetch history for all selected channels
            const histories = await Promise.all(
                selectedIds.map(id => getChannelHistory(id, 30))
            );

            // Transform data for charts
            // Need to merge by date.
            // Create a map of date -> object { date, [channel1]: val, [channel2]: val }
            const dataMap = new Map();

            histories.forEach((history, index) => {
                const channel = allChannels.find(c => c._id === selectedIds[index]);
                const name = channel?.displayName || channel?.username || `Channel ${index}`;

                history.forEach((snap: any) => {
                    const dateKey = new Date(snap.snapshotDate).toISOString().split('T')[0];
                    if (!dataMap.has(dateKey)) {
                        dataMap.set(dateKey, { date: snap.snapshotDate, timestamp: new Date(snap.snapshotDate).getTime() });
                    }
                    const entry = dataMap.get(dateKey);
                    entry[name] = snap.followerCount;
                    // We could do separate charts for engagement, etc.
                });
            });

            const followerData = Array.from(dataMap.values()).sort((a, b) => a.timestamp - b.timestamp);

            setComparisonData({ followerData });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Analytics & Comparison</h2>
                <p className="text-muted-foreground">Compare performance of up to 5 channels</p>
            </div>

            <Card>
                <CardContent className="p-6 space-y-4">
                    <div className="flex gap-4 items-end">
                        <div className="flex-1 space-y-2">
                            <label className="text-sm font-medium">Add Channel to Compare</label>
                            <Select onValueChange={handleSelect}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a channel..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {allChannels.map(c => (
                                        <SelectItem key={c._id} value={c._id} disabled={selectedIds.includes(c._id)}>
                                            {c.displayName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleCompare} disabled={loading || selectedIds.length === 0}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Compare
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {selectedIds.map(id => {
                            const c = allChannels.find(ch => ch._id === id);
                            return (
                                <Badge key={id} variant="secondary" className="pl-2 pr-1 py-1">
                                    {c?.displayName}
                                    <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 hover:bg-transparent" onClick={() => removeId(id)}>
                                        <X className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {comparisonData && (
                <div className="space-y-6">
                    <ComparisonChart
                        title="Follower Growth Comparison"
                        data={comparisonData.followerData}
                        metric="followerCount"
                    />
                    {/* Add more comparison charts if needed */}
                </div>
            )}
        </div>
    );
}
