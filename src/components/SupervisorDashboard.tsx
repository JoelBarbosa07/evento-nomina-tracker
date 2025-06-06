
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarInitials } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Clock, User, DollarSign, Eye } from 'lucide-react';

interface PendingReport {
  id: string;
  employeeName: string;
  employeeId: string;
  weekOf: string;
  totalJobs: number;
  totalEarnings: number;
  totalHours: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  jobs: Array<{
    date: string;
    jobType: string;
    eventName: string;
    hours?: number;
    paymentType: 'hourly' | 'event';
    amount: number;
  }>;
}

const mockReports: PendingReport[] = [
  {
    id: '1',
    employeeName: 'Carlos Rodríguez',
    employeeId: 'EMP001',
    weekOf: '2024-01-15',
    totalJobs: 3,
    totalEarnings: 4200,
    totalHours: 14,
    status: 'pending',
    submittedDate: '2024-01-21',
    jobs: [
      { date: '2024-01-15', jobType: 'DJ', eventName: 'Boda López', paymentType: 'event', amount: 2500 },
      { date: '2024-01-17', jobType: 'DJ', eventName: 'Fiesta Corporativa', hours: 4, paymentType: 'hourly', amount: 1200 },
      { date: '2024-01-19', jobType: 'DJ', eventName: 'Cumpleaños Ana', hours: 3, paymentType: 'hourly', amount: 900 }
    ]
  },
  {
    id: '2',
    employeeName: 'María González',
    employeeId: 'EMP002',
    weekOf: '2024-01-15',
    totalJobs: 5,
    totalEarnings: 3100,
    totalHours: 20,
    status: 'pending',
    submittedDate: '2024-01-20',
    jobs: [
      { date: '2024-01-15', jobType: 'Pinta Caritas', eventName: 'Fiesta Infantil', paymentType: 'event', amount: 800 },
      { date: '2024-01-16', jobType: 'Promotor', eventName: 'Centro Comercial', hours: 6, paymentType: 'hourly', amount: 900 },
      { date: '2024-01-17', jobType: 'Pinta Caritas', eventName: 'Cumpleaños Sofia', paymentType: 'event', amount: 800 },
      { date: '2024-01-18', jobType: 'Promotor', eventName: 'Lanzamiento Producto', hours: 4, paymentType: 'hourly', amount: 600 },
      { date: '2024-01-19', jobType: 'Animador', eventName: 'Parque Diversiones', paymentType: 'event', amount: 1500 }
    ]
  },
  {
    id: '3',
    employeeName: 'Juan Pérez',
    employeeId: 'EMP003',
    weekOf: '2024-01-15',
    totalJobs: 2,
    totalEarnings: 2800,
    totalHours: 12,
    status: 'approved',
    submittedDate: '2024-01-19',
    jobs: [
      { date: '2024-01-16', jobType: 'Fotógrafo', eventName: 'Sesión Quinceañera', paymentType: 'event', amount: 3000 },
      { date: '2024-01-18', jobType: 'Mesero', eventName: 'Evento Corporativo', hours: 8, paymentType: 'hourly', amount: 960 }
    ]
  }
];

export const SupervisorDashboard = () => {
  const [reports, setReports] = useState<PendingReport[]>(mockReports);
  const [selectedReport, setSelectedReport] = useState<PendingReport | null>(null);

  const approveReport = (reportId: string) => {
    setReports(reports.map(report => 
      report.id === reportId 
        ? { ...report, status: 'approved' }
        : report
    ));
    
    toast({
      title: "Reporte aprobado",
      description: "El reporte ha sido aprobado exitosamente",
    });
  };

  const rejectReport = (reportId: string) => {
    setReports(reports.map(report => 
      report.id === reportId 
        ? { ...report, status: 'rejected' }
        : report
    ));
    
    toast({
      title: "Reporte rechazado",
      description: "El reporte ha sido rechazado",
      variant: "destructive"
    });
  };

  const pendingReports = reports.filter(r => r.status === 'pending');
  const totalPendingEarnings = pendingReports.reduce((sum, report) => sum + report.totalEarnings, 0);

  return (
    <div className="space-y-6">
      {/* Estadísticas del supervisor */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-orange-100 to-orange-50 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">
              Reportes Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingReports.length}</div>
            <p className="text-xs text-orange-600">Requieren aprobación</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-100 to-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              Total Pendiente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">${totalPendingEarnings.toLocaleString()}</div>
            <p className="text-xs text-blue-600">En aprobación</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-100 to-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Reportes Aprobados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {reports.filter(r => r.status === 'approved').length}
            </div>
            <p className="text-xs text-green-600">Esta semana</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de reportes */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Reportes de Empleados
          </CardTitle>
          <CardDescription className="text-purple-100">
            Revisa y aprueba los reportes semanales
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200">
            {reports.map((report) => (
              <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {report.employeeName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{report.employeeName}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>ID: {report.employeeId}</span>
                        <span>•</span>
                        <span>Semana del {new Date(report.weekOf).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Enviado: {new Date(report.submittedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge 
                      variant={
                        report.status === 'pending' ? 'default' :
                        report.status === 'approved' ? 'secondary' : 'destructive'
                      }
                      className={
                        report.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                        report.status === 'approved' ? 'bg-green-100 text-green-700' : ''
                      }
                    >
                      {report.status === 'pending' ? 'Pendiente' :
                       report.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                    </Badge>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{report.totalJobs} trabajos</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{report.totalHours} horas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">${report.totalEarnings.toLocaleString()}</span>
                  </div>
                </div>

                {/* Detalles de trabajos */}
                <div className="mt-4 space-y-2">
                  {report.jobs.map((job, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded text-sm">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{job.eventName}</span>
                        <span className="font-medium text-green-600">${job.amount.toLocaleString()}</span>
                      </div>
                      <div className="text-gray-500">
                        {job.date} • {job.jobType} • {job.paymentType === 'hourly' ? `${job.hours} hrs` : 'Evento completo'}
                      </div>
                    </div>
                  ))}
                </div>

                {report.status === 'pending' && (
                  <div className="mt-6 flex space-x-3">
                    <Button
                      onClick={() => approveReport(report.id)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Aprobar
                    </Button>
                    <Button
                      onClick={() => rejectReport(report.id)}
                      variant="destructive"
                      size="sm"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Rechazar
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
