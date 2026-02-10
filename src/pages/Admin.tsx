import { motion } from "framer-motion";
import { Bell, Shield, Star, Trash2, RefreshCw, Calendar, Users, Clock, Send, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import StatCard from "@/components/dashboard/StatCard";

const Admin = () => {
  const { contests, stats, loading, toggleFeatured, deleteContest, refetch } = useAdmin();

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark">
      <div className="max-w-6xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                Admin Panel
              </h1>
              <p className="text-sm text-muted-foreground">Manage contests, users, and reminders</p>
            </div>
          </div>
          <Button variant="glass" size="sm" onClick={refetch} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Contests" value={stats.totalContests} icon={<Calendar className="h-5 w-5" />} />
          <StatCard label="Total Reminders" value={stats.totalReminders} icon={<Bell className="h-5 w-5" />} />
          <StatCard label="Pending" value={stats.pendingReminders} icon={<Clock className="h-5 w-5" />} />
          <StatCard label="Sent" value={stats.sentReminders} icon={<Send className="h-5 w-5" />} />
        </div>

        {/* Contests Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-lg font-semibold">Contest Management</h2>
            <p className="text-sm text-muted-foreground">{contests.length} contests in database</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider border-b border-white/10">
                  <th className="p-4">Contest</th>
                  <th className="p-4">Platform</th>
                  <th className="p-4">Start Time</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      No contests in database. Contests will appear after the fetcher runs.
                    </td>
                  </tr>
                ) : (
                  contests.map((contest) => (
                    <tr key={contest.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-sm line-clamp-1">{contest.name}</div>
                        <a href={contest.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                          View →
                        </a>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="text-xs">{contest.platform}</Badge>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(contest.start_time).toLocaleString()}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {Math.floor(contest.duration / 3600)}h {Math.floor((contest.duration % 3600) / 60)}m
                      </td>
                      <td className="p-4">
                        <Button
                          variant={contest.is_featured ? "default" : "ghost"}
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => toggleFeatured(contest.id, contest.is_featured)}
                        >
                          <Star className={`h-4 w-4 ${contest.is_featured ? "fill-current" : ""}`} />
                        </Button>
                      </td>
                      <td className="p-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => deleteContest(contest.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
