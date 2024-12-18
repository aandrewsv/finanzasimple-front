"use client";
import { motion } from "framer-motion";
import { DollarSign, LineChart, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function Features() {
  const features = [
    {
      icon: DollarSign,
      title: "Control de gastos",
      description: "Registra y categoriza tus ingresos y egresos de forma sencilla.",
    },
    {
      icon: LineChart,
      title: "Reportes visuales",
      description: "Visualiza tus finanzas con gráficos claros y detallados.",
    },
    {
      icon: Lock,
      title: "Seguridad garantizada",
      description: "Tus datos están protegidos con los más altos estándares de seguridad.",
    },
  ];

  return (
    <div className="py-12 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Características principales
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={index} whileHover={{ scale: 1.05 }}>
                <Card>
                  <CardContent className="p-6">
                    <div className="absolute top-6 left-6">
                      <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="mt-8 text-lg font-medium text-gray-900 dark:text-white">
                      {feature.title}
                    </div>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
