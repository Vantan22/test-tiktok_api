import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber, formatDate } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function HistoryTable({ history }: { history: any[] }) {
    const sortedHistory = [...history].reverse();

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Followers</TableHead>
                        <TableHead>Engagement</TableHead>
                        <TableHead>Change</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedHistory.map((snap, i) => {
                        const prev = sortedHistory[i + 1];
                        const change = prev ? snap.followerCount - prev.followerCount : 0;

                        return (
                            <TableRow key={snap._id}>
                                <TableCell>{formatDate(snap.snapshotDate)}</TableCell>
                                <TableCell>{formatNumber(snap.followerCount)}</TableCell>
                                <TableCell>{snap.engagementRate.toFixed(2)}%</TableCell>
                                <TableCell>
                                    {change > 0 ? (
                                        <span className="text-green-600 flex items-center text-xs"><TrendingUp className="h-3 w-3 mr-1" /> +{formatNumber(change)}</span>
                                    ) : change < 0 ? (
                                        <span className="text-red-600 flex items-center text-xs"><TrendingDown className="h-3 w-3 mr-1" /> {formatNumber(change)}</span>
                                    ) : (
                                        <span className="text-gray-400 flex items-center text-xs"><Minus className="h-3 w-3 mr-1" /> 0</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
