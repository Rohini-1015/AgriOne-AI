import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Store,
  Package,
  DollarSign,
  Stethoscope,
  Activity,
  Layers,
  Search,
  CheckCircle2,
  AlertCircle,
  Truck,
  TrendingUp,
  SlidersHorizontal,
  Server
} from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();

  const [metrics, setMetrics] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [searchUser, setSearchUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, [selectedRole]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [metricRes, usersRes] = await Promise.all([
        api.get('/admin/metrics'),
        api.get(`/admin/users?role=${selectedRole}`),
      ]);
      if (metricRes.data.success) setMetrics(metricRes.data.data.metrics);
      if (usersRes.data.success) setUsersList(usersRes.data.data.users || []);
    } catch (err) {
      console.warn('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      alert(`User role updated to ${newRole}`);
      await fetchAdminData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error updating role.');
    }
  };

  const filteredUsers = usersList.filter(u =>
    u.fullName.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.mobileNumber.includes(searchUser)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
            <span>Platform Administrator Operations Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            AgriOne Platform Administration & Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Monitor ecosystem transaction volume, user role permissions, active farm listings, and agronomic scans.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Cluster Node Healthy
          </span>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <LoadingSpinner message="Calculating real-time platform metrics and telemetry..." />
        </div>
      ) : metrics ? (
        <div className="space-y-8">
          {/* Top Metric Cards (6 Cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <div className="agri-card p-4 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Total Users</span>
                <Users className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-2xl font-black text-slate-900">{metrics.totalUsers}</div>
              <div className="text-[10px] text-slate-500">{metrics.totalFarmers} registered farmers</div>
            </div>

            <div className="agri-card p-4 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Listings</span>
                <Store className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-700">{metrics.activeListings}</div>
              <div className="text-[10px] text-slate-500">Live produce lots</div>
            </div>

            <div className="agri-card p-4 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Total Orders</span>
                <Package className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-black text-purple-700">{metrics.totalOrders}</div>
              <div className="text-[10px] text-slate-500">Marketplace deals</div>
            </div>

            <div className="agri-card p-4 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Gross GMV</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-700 truncate">
                ₹{metrics.totalRevenue.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500">Settled via PhonePe</div>
            </div>

            <div className="agri-card p-4 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">AI Scans</span>
                <Activity className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-blue-700">{metrics.totalDiseaseScans}</div>
              <div className="text-[10px] text-slate-500">Pathology diagnoses</div>
            </div>

            <div className="agri-card p-4 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Services</span>
                <Truck className="w-4 h-4 text-harvest-600" />
              </div>
              <div className="text-2xl font-black text-harvest-600">
                {metrics.totalServiceRequests}
              </div>
              <div className="text-[10px] text-slate-500">Tractor & freight</div>
            </div>
          </div>

          {/* User Management Section */}
          <div className="agri-card p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="font-extrabold text-base text-slate-900 flex items-center space-x-2">
                  <Users className="w-5 h-5 text-emerald-700" />
                  <span>User Role Management & Verification</span>
                </h2>
                <p className="text-xs text-slate-500">Assign role access levels and regulate system permissions</p>
              </div>

              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchUser}
                    onChange={e => setSearchUser(e.target.value)}
                    placeholder="Search name, phone, email..."
                    className="text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <select
                  value={selectedRole}
                  onChange={e => setSelectedRole(e.target.value)}
                  className="agri-select text-xs py-2 px-3"
                >
                  <option value="All">All Roles</option>
                  <option value="FARMER">Farmers Only</option>
                  <option value="BUYER">Buyers Only</option>
                  <option value="ADMIN">Admins Only</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider bg-slate-50">
                    <th className="py-3 px-3">User Profile</th>
                    <th className="py-3 px-3">Contact</th>
                    <th className="py-3 px-3">Geographic Circle</th>
                    <th className="py-3 px-3">Current Role</th>
                    <th className="py-3 px-3 text-right">Role Assignment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={u.avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100'}
                            alt={u.fullName}
                            className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block leading-tight">{u.fullName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">UID: {u.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600">
                        <span className="block font-medium text-slate-800">{u.email}</span>
                        <span className="text-[11px] text-slate-500">+91 {u.mobileNumber}</span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600">
                        {u.village}, {u.district}, {u.state}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            u.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : u.role === 'FARMER'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <select
                          value={u.role}
                          onChange={e => handleRoleChange(u.id, e.target.value)}
                          className="text-xs p-1.5 rounded-lg border border-slate-300 bg-white font-semibold text-slate-700 focus:ring-1 focus:ring-emerald-500"
                        >
                          <option value="FARMER">Set FARMER</option>
                          <option value="BUYER">Set BUYER</option>
                          <option value="ADMIN">Set ADMIN</option>
                          <option value="AGRICULTURAL_EXPERT">Set EXPERT</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
