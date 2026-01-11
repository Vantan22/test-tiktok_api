import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    trend?: string;
    trendUp?: boolean;
}

export function StatsCard({ title, value, icon: Icon, description, trend, trendUp }: StatsCardProps) {
    return (
        <Card>
            <CardContent className="p-6 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <h3 className="text-2xl font-bold mt-2">{value}</h3>
                    {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
                </div>
                <div className={cn("p-3 rounded-full bg-primary/10")}>
                    <Icon className="h-6 w-6 text-primary" />
                </div>
            </CardContent>
        </Card>
    );
}
