import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, XAxis, YAxis, Bar } from 'recharts';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    unknownStatusAppointments: 0,
    totalVaccines: 0,
  });
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [analytics, setAnalytics] = useState({
    completionRate: 0,
    averageDaily: 0,
    stockEfficiency: 0,
    appointmentDensity: []
  });

  useEffect(() => {
    const fetchAppointmentsAndVaccines = async () => {
      try {
        // Fetch the appointments data
        const appointmentsResponse = await fetch('http://localhost:8787/api/appointments');
        const appointmentsData = await appointmentsResponse.json();
        
        // Fetch the vaccines data
        const vaccinesResponse = await fetch('http://localhost:8787/api/vaccines');
        const vaccinesData = await vaccinesResponse.json();

        // Set fetched data to state
        setAppointments(appointmentsData);
        setVaccines(vaccinesData);

        // Calculate stats
        const totalAppointments = appointmentsData.length;
        const pendingAppointments = appointmentsData.filter((appointment) => appointment.status === 'Pending').length;
        const completedAppointments = appointmentsData.filter((appointment) => appointment.status === 'Completed').length;
        const unknownStatusAppointments = appointmentsData.filter((appointment) => !appointment.status).length;
        const totalVaccines = vaccinesData.reduce((acc, vaccine) => acc + vaccine.stock, 0);

        setStats({
          totalAppointments,
          pendingAppointments,
          completedAppointments,
          unknownStatusAppointments,
          totalVaccines,
        });

        // Calculer les statistiques mensuelles
        const monthlyData = appointmentsData.reduce((acc, appointment) => {
          if (appointment.appointmentDate && appointment.status === 'Completed') {
            const date = new Date(appointment.appointmentDate);
            const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' });
            
            acc[monthYear] = (acc[monthYear] || 0) + 1;
          }
          return acc;
        }, {});

        const formattedMonthlyStats = Object.entries(monthlyData).map(([month, count]) => ({
          month,
          vaccinations: count
        }));

        setMonthlyStats(formattedMonthlyStats);

        // Calculer les analytics avancés
        const today = new Date();
        const lastMonth = new Date(today.setMonth(today.getMonth() - 1));
        
        // Taux de complétion
        const completionRate = (completedAppointments / totalAppointments * 100).toFixed(1);
        
        // Moyenne quotidienne des rendez-vous
        const dailyAppointments = appointmentsData.reduce((acc, appointment) => {
          const date = new Date(appointment.appointmentDate).toISOString().split('T')[0];
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});
        
        const averageDaily = (Object.values(dailyAppointments).reduce((a, b) => a + b, 0) / 
          Object.keys(dailyAppointments).length).toFixed(1);

        // Efficacité du stock
        const stockEfficiency = ((completedAppointments / totalVaccines) * 100).toFixed(1);

        // Densité des rendez-vous pour le heatmap
        const appointmentDensity = Object.entries(dailyAppointments).map(([date, count]) => ({
          date,
          count
        }));

        setAnalytics({
          completionRate,
          averageDaily,
          stockEfficiency,
          appointmentDensity
        });

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAppointmentsAndVaccines();
  }, []);

  // Upcoming appointments: filter out appointments with no date and sort by date
  const upcomingAppointments = appointments
    .filter((appointment) => appointment.appointmentDate)
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
    .slice(0, 3); // Top 3 upcoming appointments

  // Get the top 3 vaccines by stock
  const topVaccines = vaccines
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 3);

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Stats Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-3xl font-semibold text-gray-900 mb-6">Dashboard Stats</h2>
        <div className="flex flex-wrap gap-4">
          <div className="bg-blue-100 p-4 rounded-xl flex-1 min-w-[200px]">
            <h3 className="text-xl font-medium text-gray-700">Total Appointments</h3>
            <p className="text-3xl font-semibold text-gray-900">{stats.totalAppointments}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-xl flex-1 min-w-[200px]">
            <h3 className="text-xl font-medium text-gray-700">Pending Appointments</h3>
            <p className="text-3xl font-semibold text-gray-900">{stats.pendingAppointments}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-xl flex-1 min-w-[200px]">
            <h3 className="text-xl font-medium text-gray-700">Completed Appointments</h3>
            <p className="text-3xl font-semibold text-gray-900">{stats.completedAppointments}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-xl flex-1 min-w-[200px]">
            <h3 className="text-xl font-medium text-gray-700">Unknown Status</h3>
            <p className="text-3xl font-semibold text-gray-900">{stats.unknownStatusAppointments}</p>
          </div>
          <div className="bg-purple-100 p-4 rounded-xl flex-1 min-w-[200px]">
            <h3 className="text-xl font-medium text-gray-700">Total Vaccines</h3>
            <p className="text-3xl font-semibold text-gray-900">{stats.totalVaccines}</p>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Analytics Avancés</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-indigo-50 p-4 rounded-xl">
            <h3 className="text-lg font-medium text-indigo-700">Taux de Complétion</h3>
            <p className="text-3xl font-bold text-indigo-900">{analytics.completionRate}%</p>
            <p className="text-sm text-indigo-600">des rendez-vous complétés</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-xl">
            <h3 className="text-lg font-medium text-emerald-700">Moyenne Quotidienne</h3>
            <p className="text-3xl font-bold text-emerald-900">{analytics.averageDaily}</p>
            <p className="text-sm text-emerald-600">rendez-vous par jour</p>
          </div>
          <div className="bg-amber-50 p-4 rounded-xl">
            <h3 className="text-lg font-medium text-amber-700">Efficacité du Stock</h3>
            <p className="text-3xl font-bold text-amber-900">{analytics.stockEfficiency}%</p>
            <p className="text-sm text-amber-600">utilisation des vaccins</p>
          </div>
        </div>

        {/* Calendar Heatmap */}
        <div className="mt-8">
          <h3 className="text-xl font-medium text-gray-700 mb-4">Densité des Rendez-vous</h3>
          <div className="bg-white p-4 rounded-xl">
            <CalendarHeatmap
              startDate={new Date('2024-01-01')}
              endDate={new Date('2024-12-31')}
              values={analytics.appointmentDensity}
              classForValue={(value) => {
                if (!value) return 'color-empty';
                return `color-scale-${Math.min(Math.floor(value.count / 2), 4)}`;
              }}
              tooltipDataAttrs={value => {
                if (!value || !value.date) return null;
                return {
                  'data-tip': `${value.date}: ${value.count} rendez-vous`,
                };
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Dashboard Section with Chart, Upcoming Appointments, and Top 3 Vaccines */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h3 className="text-xl font-medium text-gray-700 mb-4">Appointment Status</h3>
          <div className="flex flex-col items-center">
            <PieChart width={300} height={250}>
              <Pie
                data={[
                  { name: 'Pending', value: stats.pendingAppointments },
                  { name: 'Completed', value: stats.completedAppointments },
                  { name: 'Unknown', value: stats.unknownStatusAppointments },
                ]}
                dataKey="value"
                outerRadius={100}
                fill="#8884d8"
              >
                <Cell key="cell-1" fill="#ffbf00" />
                <Cell key="cell-2" fill="#3ccf61" />
                <Cell key="cell-3" fill="#d1d5db" />
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                itemStyle={{ color: '#666' }}
              />
            </PieChart>
            
            {/* Custom Legend */}
            <div className="flex justify-center gap-4 mt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#ffbf00] mr-2"></div>
                <span className="text-sm text-gray-600">Pending ({stats.pendingAppointments})</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#3ccf61] mr-2"></div>
                <span className="text-sm text-gray-600">Completed ({stats.completedAppointments})</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#d1d5db] mr-2"></div>
                <span className="text-sm text-gray-600">Unknown ({stats.unknownStatusAppointments})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top 3 Vaccines */}
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h3 className="text-xl font-medium text-gray-700 mb-4">Top 3 Vaccines by Stock</h3>
          <ul className="space-y-4">
            {topVaccines.map((vaccine) => (
              <div key={vaccine.id} className="bg-green-100 p-4 rounded-xl shadow-md">
                <p className="font-semibold">{vaccine.name}</p>
                <p>Manufacturer: {vaccine.manufacturer}</p>
                <p>Stock: {vaccine.stock}</p>
              </div>
            ))}
          </ul>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h3 className="text-xl font-medium text-gray-700 mb-4">Upcoming Appointments</h3>
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="bg-blue-100 p-4 rounded-xl shadow-md">
                <p className="font-semibold text-gray-900">{appointment.patientName}</p>
                <p className="text-gray-700">Appointment Date: {new Date(appointment.appointmentDate).toLocaleString()}</p>
                <p className="text-gray-700">Status: {appointment.status || 'Not Set'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
