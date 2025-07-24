"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import MapInput from "@/components/DroughtMonitor/MapInput";
import DataInput from "@/components/DroughtMonitor/DataInput";
import UploadKML from "@/components/DroughtMonitor/UploadKML";
import IndicatorsChart from "@/components/DroughtMonitor/IndicatorsChart";
import ClimateDataPanel from "@/components/DroughtMonitor/ClimateDataPanel";
import OverviewDashboard from "@/components/DroughtMonitor/OverviewDashboard";
import HotspotAnalysis from "@/components/DroughtMonitor/HotspotAnalysis";
import CompositeDroughtIndex from "@/components/DroughtMonitor/CompositeDroughtIndex";
import PDFExport from "@/components/DroughtMonitor/PDFExport";

interface LocationData {
  lat: number;
  lng: number;
  name?: string;
  polygon?: Array<[number, number]>;
}

interface DroughtData {
  sndvi: number[];
  spi: number[];
  vhi: number[];
  rainfall: number[];
  temperature: number[];
  humidity: number[];
  windSpeed: number[];
  windDirection: number[];
}

export default function DroughtMonitorPage() {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [droughtData, setDroughtData] = useState<DroughtData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const handleLocationSelect = async (location: LocationData) => {
    setSelectedLocation(location);
    setLoading(true);
    setError(null);

    try {
      // محاكاة جلب البيانات من APIs
      await fetchDroughtData(location);
    } catch (err) {
      setError("حدث خطأ في جلب البيانات. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDroughtData = async (location: LocationData) => {
    // محاكاة البيانات - في التطبيق الحقيقي ستكون من APIs
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockData: DroughtData = {
      sndvi: Array.from({ length: 12 }, () => Math.random() * 2 - 1),
      spi: Array.from({ length: 12 }, () => Math.random() * 3 - 1.5),
      vhi: Array.from({ length: 12 }, () => Math.random() * 100),
      rainfall: Array.from({ length: 12 }, () => Math.random() * 200),
      temperature: Array.from({ length: 12 }, () => Math.random() * 20 + 15),
      humidity: Array.from({ length: 12 }, () => Math.random() * 40 + 40),
      windSpeed: Array.from({ length: 12 }, () => Math.random() * 15 + 5),
      windDirection: Array.from({ length: 12 }, () => Math.random() * 360),
    };

    setDroughtData(mockData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-right">
              <h1 className="text-2xl font-bold text-gray-900">نظام مراقبة الجفاف</h1>
              <p className="text-gray-600">تحليل شامل لمؤشرات الجفاف والبيانات المناخية</p>
            </div>
            <Link href="/">
              <Button variant="outline">العودة للرئيسية</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Location Input Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-right">تحديد الموقع الجغرافي</CardTitle>
            <CardDescription className="text-right">
              اختر الموقع المراد تحليله باستخدام إحدى الطرق التالية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="search" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="search">البحث بالاسم</TabsTrigger>
                <TabsTrigger value="coordinates">الإحداثيات</TabsTrigger>
                <TabsTrigger value="map">النقر على الخريطة</TabsTrigger>
                <TabsTrigger value="upload">رفع ملف KML</TabsTrigger>
              </TabsList>
              
              <TabsContent value="search">
                <DataInput onLocationSelect={handleLocationSelect} />
              </TabsContent>
              
              <TabsContent value="coordinates">
                <DataInput onLocationSelect={handleLocationSelect} coordinatesMode />
              </TabsContent>
              
              <TabsContent value="map">
                <MapInput onLocationSelect={handleLocationSelect} />
              </TabsContent>
              
              <TabsContent value="upload">
                <UploadKML onLocationSelect={handleLocationSelect} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Selected Location Info */}
        {selectedLocation && (
          <Alert className="mb-6">
            <AlertDescription className="text-right">
              الموقع المحدد: {selectedLocation.name || `${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`}
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Card className="mb-6">
            <CardContent className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">جاري تحليل البيانات...</p>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-right text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Results Section */}
        {droughtData && selectedLocation && !loading && (
          <div className="space-y-6">
            {/* Main Indicators */}
            <IndicatorsChart data={droughtData} />

            {/* Climate Data */}
            <ClimateDataPanel data={droughtData} location={selectedLocation} />

            {/* Overview Dashboard */}
            <OverviewDashboard data={droughtData} location={selectedLocation} />

            {/* Advanced Analysis */}
            <div className="grid md:grid-cols-2 gap-6">
              <HotspotAnalysis data={droughtData} location={selectedLocation} />
              <CompositeDroughtIndex data={droughtData} />
            </div>

            {/* Export Section */}
            <PDFExport 
              data={droughtData} 
              location={selectedLocation}
              year={selectedYear}
            />
          </div>
        )}

        {/* Data Source Info */}
        <div className="mt-12 text-center">
          <Link href="/data-sources">
            <Button variant="outline">مصادر البيانات والمعادلات المستخدمة</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
