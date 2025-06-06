
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Calendar, Clock, DollarSign, Plus, Trash2 } from 'lucide-react';

interface WorkReport {
  id: string;
  date: string;
  jobType: string;
  hours: number;
  eventName: string;
  paymentType: 'hourly' | 'event';
  rate: number;
  description: string;
  total: number;
}

const jobTypes = [
  { value: 'dj', label: 'DJ', hourlyRate: 300, eventRate: 2500 },
  { value: 'promotor', label: 'Promotor', hourlyRate: 150, eventRate: 1200 },
  { value: 'pinta-caritas', label: 'Pinta Caritas', hourlyRate: 200, eventRate: 800 },
  { value: 'fotografo', label: 'Fotógrafo', hourlyRate: 400, eventRate: 3000 },
  { value: 'animador', label: 'Animador', hourlyRate: 250, eventRate: 1500 },
  { value: 'mesero', label: 'Mesero', hourlyRate: 120, eventRate: 600 }
];

export const EmployeeForm = () => {
  const [reports, setReports] = useState<WorkReport[]>([]);
  const [currentReport, setCurrentReport] = useState({
    date: '',
    jobType: '',
    hours: 0,
    eventName: '',
    paymentType: 'hourly' as 'hourly' | 'event',
    description: ''
  });

  const addReport = () => {
    if (!currentReport.date || !currentReport.jobType || !currentReport.eventName) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    const jobTypeData = jobTypes.find(jt => jt.value === currentReport.jobType);
    if (!jobTypeData) return;

    const rate = currentReport.paymentType === 'hourly' ? jobTypeData.hourlyRate : jobTypeData.eventRate;
    const total = currentReport.paymentType === 'hourly' 
      ? rate * currentReport.hours 
      : rate;

    const newReport: WorkReport = {
      id: Date.now().toString(),
      ...currentReport,
      rate,
      total
    };

    setReports([...reports, newReport]);
    setCurrentReport({
      date: '',
      jobType: '',
      hours: 0,
      eventName: '',
      paymentType: 'hourly',
      description: ''
    });

    toast({
      title: "Trabajo agregado",
      description: "El reporte de trabajo ha sido agregado exitosamente",
    });
  };

  const removeReport = (id: string) => {
    setReports(reports.filter(r => r.id !== id));
  };

  const submitWeeklyReport = () => {
    if (reports.length === 0) {
      toast({
        title: "Error",
        description: "Debes agregar al menos un trabajo para enviar el reporte",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Reporte enviado",
      description: `Se han enviado ${reports.length} trabajos para aprobación`,
    });
    
    setReports([]);
  };

  const totalEarnings = reports.reduce((sum, report) => sum + report.total, 0);

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Reportar Nuevo Trabajo
          </CardTitle>
          <CardDescription className="text-blue-100">
            Completa la información del trabajo realizado
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha del Evento</Label>
              <Input
                id="date"
                type="date"
                value={currentReport.date}
                onChange={(e) => setCurrentReport({...currentReport, date: e.target.value})}
                className="border-gray-300 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobType">Tipo de Trabajo</Label>
              <Select 
                value={currentReport.jobType} 
                onValueChange={(value) => setCurrentReport({...currentReport, jobType: value})}
              >
                <SelectTrigger className="border-gray-300 focus:border-blue-500">
                  <SelectValue placeholder="Selecciona el tipo de trabajo" />
                </SelectTrigger>
                <SelectContent>
                  {jobTypes.map((job) => (
                    <SelectItem key={job.value} value={job.value}>
                      {job.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventName">Nombre del Evento</Label>
              <Input
                id="eventName"
                placeholder="Ej: Boda de Maria y Juan"
                value={currentReport.eventName}
                onChange={(e) => setCurrentReport({...currentReport, eventName: e.target.value})}
                className="border-gray-300 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentType">Tipo de Pago</Label>
              <Select 
                value={currentReport.paymentType} 
                onValueChange={(value: 'hourly' | 'event') => setCurrentReport({...currentReport, paymentType: value})}
              >
                <SelectTrigger className="border-gray-300 focus:border-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Por Hora</SelectItem>
                  <SelectItem value="event">Por Evento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {currentReport.paymentType === 'hourly' && (
              <div className="space-y-2">
                <Label htmlFor="hours">Horas Trabajadas</Label>
                <Input
                  id="hours"
                  type="number"
                  min="0"
                  step="0.5"
                  value={currentReport.hours}
                  onChange={(e) => setCurrentReport({...currentReport, hours: parseFloat(e.target.value) || 0})}
                  className="border-gray-300 focus:border-blue-500"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción (Opcional)</Label>
            <Textarea
              id="description"
              placeholder="Detalles adicionales del trabajo realizado..."
              value={currentReport.description}
              onChange={(e) => setCurrentReport({...currentReport, description: e.target.value})}
              className="border-gray-300 focus:border-blue-500"
            />
          </div>

          <Button onClick={addReport} className="w-full bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Trabajo
          </Button>
        </CardContent>
      </Card>

      {reports.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
            <CardTitle>Trabajos de Esta Semana</CardTitle>
            <CardDescription className="text-green-100">
              {reports.length} trabajo{reports.length !== 1 ? 's' : ''} reportado{reports.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{jobTypes.find(jt => jt.value === report.jobType)?.label}</Badge>
                        <Badge variant={report.paymentType === 'hourly' ? 'default' : 'outline'}>
                          {report.paymentType === 'hourly' ? 'Por Hora' : 'Por Evento'}
                        </Badge>
                      </div>
                      <h4 className="font-medium text-gray-900">{report.eventName}</h4>
                      <p className="text-sm text-gray-600">
                        {report.date} • {report.paymentType === 'hourly' ? `${report.hours} horas` : 'Evento completo'}
                      </p>
                      {report.description && (
                        <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-green-600">${report.total.toLocaleString()}</div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeReport(report.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium">Total de la Semana:</span>
                <span className="text-2xl font-bold text-green-600">${totalEarnings.toLocaleString()}</span>
              </div>
              <Button onClick={submitWeeklyReport} className="w-full bg-green-600 hover:bg-green-700">
                <DollarSign className="w-4 h-4 mr-2" />
                Enviar Reporte Semanal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
