
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, DollarSign, Clock, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { EmployeeForm } from '@/components/EmployeeForm';
import { SupervisorDashboard } from '@/components/SupervisorDashboard';
import { WeeklyReports } from '@/components/WeeklyReports';

const Index = () => {
  const [activeTab, setActiveTab] = useState("employee");

  // Datos simulados para la demo
  const weeklyStats = {
    totalReports: 24,
    pendingApproval: 8,
    totalEarnings: 12500,
    hoursWorked: 156
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Sistema de Nómina Variable
          </h1>
          <p className="text-xl text-gray-600">
            Gestión eficiente de reportes para trabajadores de eventos
          </p>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Reportes Totales
              </CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{weeklyStats.totalReports}</div>
              <p className="text-xs text-gray-500">Esta semana</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pendientes
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{weeklyStats.pendingApproval}</div>
              <p className="text-xs text-gray-500">Por aprobar</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Ganancias
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${weeklyStats.totalEarnings.toLocaleString()}</div>
              <p className="text-xs text-gray-500">Esta semana</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Horas Trabajadas
              </CardTitle>
              <Clock className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{weeklyStats.hoursWorked}</div>
              <p className="text-xs text-gray-500">Total semanal</p>
            </CardContent>
          </Card>
        </div>

        {/* Pestañas principales */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto bg-white shadow-md">
            <TabsTrigger 
              value="employee" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Users className="w-4 h-4 mr-2" />
              Empleado
            </TabsTrigger>
            <TabsTrigger 
              value="supervisor"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Supervisor
            </TabsTrigger>
            <TabsTrigger 
              value="reports"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Reportes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="employee" className="space-y-6">
            <EmployeeForm />
          </TabsContent>

          <TabsContent value="supervisor" className="space-y-6">
            <SupervisorDashboard />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <WeeklyReports />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
