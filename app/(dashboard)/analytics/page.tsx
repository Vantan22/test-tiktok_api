import { getChannels } from "@/app/actions/channels"; // To get list for dropdown
import { compareChannels } from "@/app/actions/analytics";
import { ComparisonChart } from "@/components/analytics/comparison-chart";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AnalyticsClient from "./analytics-client";

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
    const allChannels = await getChannels({ sortOrder: "asc" });

    return <AnalyticsClient allChannels={allChannels} />;
}
