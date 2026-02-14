import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Contest } from "@/hooks/useContests";

const ITEMS_PER_PAGE = 10;

interface UpcomingContestItemProps {
  contest: Contest;
  onSubscribe: (id: string) => void;
}

const UpcomingContestItem = ({ contest, onSubscribe }: UpcomingContestItemProps) => {
  const getTimeUntilStart = () => {
    const now = new Date();
    const diff = contest.startTime.getTime() - now.getTime();
    if (diff < 0) return "Live Now";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${contest.platformColor} flex items-center justify-center text-white text-sm font-bold shadow-lg`}
        >
          {contest.platformInitial}
        </div>
        <div>
          <h4 className="font-medium text-sm line-clamp-1">{contest.name}</h4>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              Starts in {getTimeUntilStart()}
            </span>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
              {contest.platform}
            </Badge>
          </div>
        </div>
      </div>
      <Button
        variant={contest.isSubscribed ? "success" : "outline"}
        size="sm"
        onClick={() => onSubscribe(contest.id)}
        className="shrink-0 text-xs h-8"
      >
        {contest.isSubscribed ? "Subscribed" : "Subscribe"}
      </Button>
    </div>
  );
};

interface UpcomingContestsListProps {
  contests: Contest[];
  onSubscribe: (id: string) => void;
  onViewAll: () => void;
  loading?: boolean;
}

const UpcomingContestsList = ({
  contests,
  onSubscribe,
  onViewAll,
  loading = false,
}: UpcomingContestsListProps) => {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(contests.length / ITEMS_PER_PAGE);
  const paged = contests.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <h3 className="font-semibold">Upcoming Contests</h3>
          <Badge variant="secondary" className="text-[10px] ml-1">{contests.length}</Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewAll}
          className="text-xs gap-1 h-7 px-2"
        >
          View All
          <ChevronRight className="h-3 w-3" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Live data from Codeforces & other platforms
      </p>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 animate-pulse">
              <div className="w-10 h-10 rounded-lg bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
            {paged.map((contest) => (
              <UpcomingContestItem
                key={contest.id}
                contest={contest}
                onSubscribe={onSubscribe}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
              <Button
                variant="ghost"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="gap-1 text-xs h-7"
              >
                <ChevronLeft className="h-3 w-3" /> Prev
              </Button>
              <span className="text-xs text-muted-foreground">
                Page {page + 1} of {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="gap-1 text-xs h-7"
              >
                Next <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default UpcomingContestsList;
