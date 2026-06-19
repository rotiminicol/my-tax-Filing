
import AdminShell from "@/components/layout/AdminShell";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const SIGNUPS = Array.from({ length: 14 }, (_, i) => ({ d: `D${i+1}`, v: 40 + Math.round(Math.sin(i/2) * 20 + Math.random() * 30) }));
const REVENUE = Array.from({ length: 12 }, (_, i) => ({ m: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i], v: 8 + i * 0.9 + Math.random() * 2 }));
const RECEIPTS_BY_DAY = Array.from({ length: 7 }, (_, i) => ({ d: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i], v: 120 + Math.round(Math.random() * 200) }));
const PLANS = [
  { name: "Free", value: 7240, color: "#9ca3af" },
  { name: "Pro", value: 4120, color: "#f59e0b" },
  { name: "Enterprise", value: 487, color: "#a855f7" },
];

function AdminAnalytics() {
  return (
    <AdminShell title="Platform Analytics">
      <div className="flex flex-col gap-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <Card title="Signups · last 14 days">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={SIGNUPS}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#111" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#111" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="d" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip />
                <Area type="monotone" dataKey="v" stroke="#111" strokeWidth={2} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card title="MRR trend">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={REVENUE}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="m" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip />
                <Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card title="Receipts by day" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={RECEIPTS_BY_DAY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="d" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="v" fill="#111" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Plan distribution">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={PLANS} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {PLANS.map((e) => <Cell key={e.name} fill={e.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 grid grid-cols-3 gap-2 text-center">
              {PLANS.map(p => (
                <div key={p.name}>
                  <span className="inline-block w-2 h-2 rounded-full" style={{ background: p.color }} />
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-1">{p.name}</p>
                  <p className="text-sm font-black tabular-nums">{p.value.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}

function Card({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-gray-100 rounded-2xl p-5 lg:p-6 ${className}`}>
      <h3 className="text-sm font-black uppercase tracking-widest mb-4">{title}</h3>
      {children}
    </div>
  );
}

export default AdminAnalytics;
