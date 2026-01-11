"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { searchTikTok } from "@/app/actions/tiktok";
import { SearchResults } from "@/components/search/search-results";
import { TikTokUserData } from "@/lib/tiktok-api";
import { toast } from "sonner";

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<TikTokUserData[]>([]);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setSearched(false);
        setResults([]);

        try {
            const res = await searchTikTok(query);
            if (res.success && res.data) {
                setResults(res.data);
            } else {
                toast.error(res.error || "Search failed");
            }
        } catch (e) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
            setSearched(true);
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Search TikTok Channels</h2>
                <p className="text-muted-foreground">Find and add new channels to your tracking dashboard</p>
            </div>

            <div className="max-w-xl mx-auto">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Enter username (e.g. tiktok)"
                            className="pl-8"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    <Button type="submit" disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                    </Button>
                </form>
            </div>

            <div className="space-y-4">
                {searched && results.length === 0 && (
                    <div className="text-center text-muted-foreground py-10">
                        No channels found matching "{query}"
                    </div>
                )}

                <SearchResults results={results} />
            </div>
        </div>
    );
}
