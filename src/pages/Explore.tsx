import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, RefreshCw, Calendar, Loader2, Bell, ArrowLeft, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import ContestCard from "@/components/dashboard/ContestCard";
import PlatformFilter from "@/components/dashboard/PlatformFilter";
import { useContests } from "@/hooks/useContests";

const Explore = () => {
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSubscribedOnly, setShowSubscribedOnly] = useState(false);
  const { contests, loading, error, refetch, toggleSubscription } = useContests();

  const contestCounts = useMemo(() => {
    return contests.reduce((acc, contest) => {
      acc[contest.platform] = (acc[contest.platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [contests]);

  const filteredContests = useMemo(() => {
    let result = contests;

    if (selectedPlatform !== "all") {
      result = result.filter((c) => c.platform === selectedPlatform);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.platform.toLowerCase().includes(query)
      );
    }

    if (showSubscribedOnly) {
      result = result.filter((c) => c.isSubscribed);
    }

    return result;
  }, [contests, selectedPlatform, searchQuery, showSubscribedOnly]);

  return (
    <div className="min-h-screen bg-background dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon" className="shrink-0">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">Contest Explorer</h1>
              <p className="text-sm text-muted-foreground">
                Browse and subscribe to contests from all platforms
              </p>
            </div>
          </div>
          <Button
            variant="glass"
            size="sm"
            onClick={refetch}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contests by name or platform..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary/30 border-white/10"
              />
            </div>
            <Button
              variant={showSubscribedOnly ? "hero" : "glass"}
              onClick={() => setShowSubscribedOnly(!showSubscribedOnly)}
              className="gap-2 shrink-0"
            >
              <Bell className="h-4 w-4" />
              {showSubscribedOnly ? "Subscribed" : "My Subscriptions"}
            </Button>
          </div>

          <PlatformFilter
            selected={selectedPlatform}
            onSelect={setSelectedPlatform}
            contestCounts={contestCounts}
          />
        </motion.div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Filter className="h-4 w-4" />
            {filteredContests.length} contest{filteredContests.length !== 1 ? "s" : ""} found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Contest Grid */}
        {loading && contests.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading contests...</span>
          </div>
        ) : filteredContests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-12 text-center"
          >
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No contests found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? "Try adjusting your search or filters"
                : showSubscribedOnly
                ? "You haven't subscribed to any contests yet"
                : "No upcoming contests available"}
            </p>
            <div className="flex gap-3 justify-center">
              {searchQuery && (
                <Button variant="glass" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              )}
              {selectedPlatform !== "all" && (
                <Button variant="glass" onClick={() => setSelectedPlatform("all")}>
                  Show All Platforms
                </Button>
              )}
              {showSubscribedOnly && (
                <Button variant="glass" onClick={() => setShowSubscribedOnly(false)}>
                  Show All Contests
                </Button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredContests.map((contest, index) => (
              <motion.div
                key={contest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ContestCard
                  {...contest}
                  onToggleSubscription={toggleSubscription}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Explore;
