import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  LayoutDashboard,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  Trophy,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ContestCard from "@/components/dashboard/ContestCard";
import StatCard from "@/components/dashboard/StatCard";
import ReminderSettings from "@/components/dashboard/ReminderSettings";

// Mock data
const upcomingContests = [
  {
    id: "1",
    name: "Codeforces Round #924 (Div. 2)",
    platform: "Codeforces",
    platformColor: "from-blue-500 to-blue-600",
    platformInitial: "CF",
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000 + 30 * 60 * 1000),
    duration: "2 hours",
    link: "https://codeforces.com",
    isSubscribed: true,
  },
  {
    id: "2",
    name: "LeetCode Weekly Contest 385",
    platform: "LeetCode",
    platformColor: "from-amber-500 to-orange-500",
    platformInitial: "LC",
    startTime: new Date(Date.now() + 26 * 60 * 60 * 1000),
    duration: "1.5 hours",
    link: "https://leetcode.com",
    isSubscribed: false,
  },
  {
    id: "3",
    name: "AtCoder Beginner Contest 339",
    platform: "AtCoder",
    platformColor: "from-gray-600 to-gray-700",
    platformInitial: "AC",
    startTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
    duration: "100 minutes",
    link: "https://atcoder.jp",
    isSubscribed: true,
  },
  {
    id: "4",
    name: "CodeChef Starters 119",
    platform: "CodeChef",
    platformColor: "from-amber-600 to-yellow-500",
    platformInitial: "CC",
    startTime: new Date(Date.now() + 72 * 60 * 60 * 1000),
    duration: "3 hours",
    link: "https://codechef.com",
    isSubscribed: false,
  },
];

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: Calendar, label: "Contests", id: "contests" },
  { icon: Settings, label: "Settings", id: "settings" },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background dark">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/5 bg-background/80 backdrop-blur-xl flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="feature-icon h-8 w-8">
            <Bell className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold gradient-text">AlgoBell</span>
        </Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        className="lg:translate-x-0 fixed top-0 left-0 z-40 h-full w-[280px] border-r border-white/5 bg-background/95 backdrop-blur-xl transition-transform lg:transition-none"
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <Link to="/" className="hidden lg:flex items-center gap-2 mb-8">
            <div className="feature-icon h-10 w-10">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">AlgoBell</span>
          </Link>

          {/* Nav Items */}
          <nav className="flex-1 mt-16 lg:mt-0">
            <ul className="space-y-2">
              {sidebarItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeTab === item.id
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Section */}
          <div className="pt-6 border-t border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                J
              </div>
              <div>
                <div className="text-sm font-medium">John Doe</div>
                <div className="text-xs text-muted-foreground">Pro Plan</div>
              </div>
            </div>
            <Link to="/">
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </Link>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-[280px] pt-16 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "contests" && "Contest Explorer"}
              {activeTab === "settings" && "Reminder Settings"}
            </h1>
            <p className="text-muted-foreground">
              {activeTab === "dashboard" &&
                "Track your upcoming contests and performance at a glance."}
              {activeTab === "contests" &&
                "Browse and subscribe to contests from all platforms."}
              {activeTab === "settings" &&
                "Customize when and how you receive notifications."}
            </p>
          </motion.div>

          {/* Dashboard View */}
          {activeTab === "dashboard" && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                  label="Contests Attended"
                  value={47}
                  icon={<Trophy className="h-5 w-5" />}
                  trend={{ value: "+12% this month", positive: true }}
                />
                <StatCard
                  label="Upcoming"
                  value={4}
                  icon={<Clock className="h-5 w-5" />}
                />
                <StatCard
                  label="Completed"
                  value={43}
                  icon={<CheckCircle2 className="h-5 w-5" />}
                />
                <StatCard
                  label="Missed"
                  value={2}
                  icon={<XCircle className="h-5 w-5" />}
                  trend={{ value: "-50% vs last month", positive: true }}
                />
              </div>

              {/* Upcoming Contests */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Upcoming Contests</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {upcomingContests.map((contest) => (
                    <ContestCard key={contest.id} {...contest} />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Contests View */}
          {activeTab === "contests" && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...upcomingContests, ...upcomingContests].map((contest, i) => (
                <ContestCard key={`${contest.id}-${i}`} {...contest} id={`${contest.id}-${i}`} />
              ))}
            </div>
          )}

          {/* Settings View */}
          {activeTab === "settings" && (
            <div className="max-w-2xl">
              <ReminderSettings />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
