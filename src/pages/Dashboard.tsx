import { useEffect, useState } from "react";
import { API_BASE_URL, API_URL } from "@/config/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet, Users, ArrowRightLeft, AlertCircle, FileText, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { io } from "socket.io-client";

type InventoryItem = {
  blood_type: string;
  units: number;
};

type BloodTypeInventory = {
  "A+": number;
  "A-": number;
  "B+": number;
  "B-": number;
  "AB+": number;
  "AB-": number;
  "O+": number;
  "O-": number;
};

type DashboardData = {
  stats: {
    totalUnits: number;
    totalVolume: number;
    donorCount: number;
    pendingTransfers: number;
    urgentRequests: number;
    pendingRequests: number;
  };
  bloodTypeInventory: BloodTypeInventory;
};

type ExpiringBlood = {
  bloodId: string;
  bloodType: string;
  componentType: string;
  volumeMl: number;
  expiryDate: string;
  collectionDate: string;
  storageLocation: string;
  daysUntilExpiry: number;
  donorName: string | null;
};

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const hospitalId = user?.hospital_id;

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    stats: {
      totalUnits: 0,
      totalVolume: 0,
      donorCount: 0,
      pendingTransfers: 0,
      urgentRequests: 0,
      pendingRequests: 0,
    },
    bloodTypeInventory: {
      "A+": 0,
      "A-": 0,
      "B+": 0,
      "B-": 0,
      "AB+": 0,
      "AB-": 0,
      "O+": 0,
      "O-": 0,
    },
  });
  const [expiringBlood, setExpiringBlood] = useState<ExpiringBlood[]>([]);
  const [loadingExpiring, setLoadingExpiring] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async (forceRefresh = false) => {
      if (!hospitalId || !isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const refreshParam = forceRefresh ? '&force_refresh=true' : '';
        const response = await fetch(
          `${API_BASE_URL}/dashboard/stats?hospital_id=${hospitalId}${refreshParam}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const result = await response.json();
        console.log('Dashboard stats loaded:', result.cached ? 'from cache' : 'from SQL', result.data);
        setDashboardData(result.data);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData(); // Initial load from Firebase cache (fast)
    fetchExpiringBlood(); // Fetch expiring blood units

    // Setup Socket.IO for real-time updates
    if (!hospitalId || !isAuthenticated) return;

    const socket = io(API_URL);

    socket.on('connect', () => {
      console.log('✓ Socket.IO connected for dashboard updates');
      socket.emit('join-hospital', hospitalId);
    });

    // Listen for new request notifications
    socket.on('new-request', (data) => {
      console.log('New request notification:', data);
      // Refresh dashboard data (from cache - Firebase already incremented by webhook)
      fetchDashboardData();
    });

    // Listen for request status updates
    socket.on('request-removed', (data) => {
      console.log('Request removed notification:', data);
      // Refresh dashboard data (from cache)
      fetchDashboardData();
    });

    return () => {
      socket.disconnect();
    };
  }, [hospitalId, isAuthenticated]);

  const fetchExpiringBlood = async () => {
    if (!hospitalId || !isAuthenticated) {
      setLoadingExpiring(false);
      return;
    }

    try {
      setLoadingExpiring(true);
      const response = await fetch(
        `${API_BASE_URL}/hospital/expiring-blood?hospital_id=${hospitalId}&days=7`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch expiring blood data");
      }

      const result = await response.json();
      setExpiringBlood(result.data || []);
    } catch (error) {
      console.error("Expiring blood fetch error:", error);
    } finally {
      setLoadingExpiring(false);
    }
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            Dashboard
            <span className="text-sm font-normal text-muted-foreground ml-2 bg-secondary/50 px-3 py-1 rounded-full">
              Overview
            </span>
          </h1>
          <p className="text-muted-foreground mt-1">Real-time overview of your blood bank inventory and activities</p>
        </div>
        <div className="text-sm text-muted-foreground/80 hidden md:block bg-white/50 backdrop-blur px-4 py-2 rounded-lg border border-white/40">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[
          {
            title: "Total Blood Units",
            value: dashboardData.stats.totalUnits,
            desc: "Units in inventory",
            icon: Droplet,
            color: "text-red-500",
            bg: "bg-red-500/10",
            border: "border-l-red-500",
            valColor: "text-gray-900"
          },
          {
            title: "Registered Donors",
            value: dashboardData.stats.donorCount,
            desc: "Active donors",
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            border: "border-l-blue-500",
            valColor: "text-gray-900"
          },
          {
            title: "Pending Requests",
            value: dashboardData.stats.pendingRequests,
            desc: "Awaiting approval",
            icon: FileText,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            border: "border-l-amber-500",
            valColor: "text-gray-900"
          },
          {
            title: "Pending Transfers",
            value: dashboardData.stats.pendingTransfers,
            desc: "In transit",
            icon: ArrowRightLeft,
            color: "text-indigo-500",
            bg: "bg-indigo-500/10",
            border: "border-l-indigo-500",
            valColor: "text-gray-900"
          },
          {
            title: "Urgent Requests",
            value: dashboardData.stats.urgentRequests,
            desc: "Critical attention",
            icon: AlertCircle,
            color: "text-rose-600",
            bg: "bg-rose-600/10",
            border: "border-l-rose-500",
            valColor: "text-rose-600"
          },
          {
            title: "Expiring Soon",
            value: expiringBlood.length,
            desc: "Within 7 days",
            icon: Clock,
            color: "text-orange-600",
            bg: "bg-orange-500/10",
            border: "border-l-orange-500",
            valColor: "text-orange-600"
          },
        ].map((stat, i) => (
          <Card key={i} className={`glass-panel border-l-4 ${stat.border} shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 overflow-hidden relative group`}>
            {/* Background decorative blob */}
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${stat.bg} blur-2xl group-hover:scale-125 transition-transform duration-500`}></div>

            <CardHeader className="flex flex-row items-center justify-between pb-2 border-none relative z-10 space-y-0">
              <CardTitle className="text-sm font-semibold text-muted-foreground/80 tracking-tight">{stat.title}</CardTitle>
              <div className={`p-2.5 rounded-xl ${stat.bg} shadow-sm group-hover:rotate-12 transition-transform duration-300`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} strokeWidth={2.5} />
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-start justify-start pt-1 pb-5 relative z-10 text-left w-full pl-6">
              <div className={`text-4xl font-black tracking-tight ${stat.valColor}`}>
                {stat.value}
              </div>
              <p className="text-xs font-semibold text-muted-foreground/70 mt-1 uppercase tracking-wider">{stat.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Expiring Blood Alert Section */}
      {expiringBlood.length > 0 && (
        <Card className="glass-panel shadow-xl border-orange-200 border-2 bg-gradient-to-r from-orange-50/50 to-red-50/50">
          <CardHeader className="border-b border-orange-200/50 bg-orange-100/30">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-orange-700">
              <Clock className="h-5 w-5" />
              ⚠️ Blood Units Expiring Soon - Action Required
            </CardTitle>
            <p className="text-sm text-orange-600 mt-1">The following units will expire within 7 days. Please prioritize for urgent requests or transfers.</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {expiringBlood.slice(0, 12).map((blood) => {
                const daysLeft = blood.daysUntilExpiry;
                const urgencyColor = daysLeft <= 2 ? 'red' : daysLeft <= 5 ? 'orange' : 'yellow';
                const bgColor = daysLeft <= 2 ? 'bg-red-100/80' : daysLeft <= 5 ? 'bg-orange-100/80' : 'bg-yellow-100/80';
                const borderColor = daysLeft <= 2 ? 'border-red-300' : daysLeft <= 5 ? 'border-orange-300' : 'border-yellow-300';
                const textColor = daysLeft <= 2 ? 'text-red-700' : daysLeft <= 5 ? 'text-orange-700' : 'text-yellow-700';

                return (
                  <div
                    key={blood.bloodId}
                    className={`flex flex-col p-4 ${bgColor} rounded-xl border-2 ${borderColor} shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden`}
                  >
                    {daysLeft <= 2 && (
                      <div className="absolute top-2 right-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-red-600 text-white animate-pulse">
                          URGENT
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-12 h-12 rounded-full bg-white flex items-center justify-center font-bold shadow-md ${textColor}`}>
                        {blood.bloodType}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{blood.componentType}</div>
                        <div className="text-xs text-gray-600">{blood.volumeMl} ml</div>
                      </div>
                    </div>
                    <div className={`text-center py-2 px-3 rounded-lg bg-white/60 border ${borderColor} mt-2`}>
                      <div className={`text-2xl font-bold ${textColor}`}>{daysLeft}</div>
                      <div className="text-xs text-gray-600 font-medium">day{daysLeft !== 1 ? 's' : ''} left</div>
                    </div>
                    <div className="text-xs text-gray-600 mt-2">
                      <div>ID: {blood.bloodId}</div>
                      <div>Expires: {new Date(blood.expiryDate).toLocaleDateString()}</div>
                      {blood.storageLocation && <div>Location: {blood.storageLocation}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
            {expiringBlood.length > 12 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-orange-700 font-medium">
                  + {expiringBlood.length - 12} more units expiring soon. View all in Inventory page.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="glass-panel shadow-xl overflow-hidden relative border-0 bg-white/60 dark:bg-black/20 backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <CardHeader className="border-b border-border/50 bg-white/40 dark:bg-black/20 relative z-10 py-5">
          <CardTitle className="text-lg font-bold flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Droplet className="h-5 w-5 text-primary" />
            </div>
            Blood Type Inventory Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 relative z-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-5">
            {Object.entries(dashboardData.bloodTypeInventory).map(([bloodType, units]) => {
              // Calculate percentage relative to a "full" target (e.g., 5000ml) for visual fill
              const target = 5000;
              const percentage = Math.min((units / target) * 100, 100);
              const isLow = percentage < 20;

              return (
                <div
                  key={bloodType}
                  className={`flex flex-col items-center justify-center p-5 rounded-2xl bg-white/80 dark:bg-gray-800/80 border-2 ${isLow ? 'border-red-200' : 'border-white/50 dark:border-gray-700'} shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.12)] hover:-translate-y-1.5 transition-all duration-300 group relative h-36 overflow-hidden`}
                >
                  <div
                    className={`absolute bottom-0 left-0 w-full ${isLow ? 'bg-red-400/15 group-hover:bg-red-500/20' : 'bg-primary/5 group-hover:bg-primary/10'} transition-all duration-500 z-0 origin-bottom`}
                    style={{ height: `${percentage}%` }}
                  ></div>

                  <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-center space-y-1.5">
                    <div className="relative">
                      <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-br from-gray-800 to-gray-500 dark:from-white dark:to-gray-400 group-hover:from-primary group-hover:to-primary/70 transition-all">
                        {bloodType}
                      </span>
                      {isLow && (
                        <span className="absolute -top-1 -right-4 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col items-center mt-2">
                      <span className={`text-xl font-bold ${isLow ? 'text-red-600' : 'text-primary'}`}>
                        {units}
                      </span>
                      <span className="text-[10px] uppercase text-muted-foreground/80 font-bold tracking-widest mt-0.5">ml</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
