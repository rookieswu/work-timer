"use client"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import moment from "moment";

export default function Home() {
  const initTime = '--:--:--';
  const [startTime, setStartTime] = useState(initTime);
  const [workHours, setWorkHours] = useState(9);
  const [showTime, setShowTime] = useState(initTime);

  useEffect(() => {
    const storedStartTime = localStorage.getItem('start-time');
    if (storedStartTime) {
      setStartTime(storedStartTime);
    }
  }, [])

  useEffect(() => {
    if (startTime !== initTime) {
      localStorage.setItem('start-time', startTime);
    }
  }, [startTime]);

  useEffect(() => {
    if (startTime === initTime) {
      return;
    }

    const interval = setInterval(() => {
      const offDutyTime = moment(startTime, "HH:mm").add(workHours, "hours");
      const nowTime = moment();
      const timeLeft = offDutyTime.diff(nowTime);

      if (timeLeft <= 0) {
        setShowTime("00:00:00");
        clearInterval(interval);
      } else {
        setShowTime(moment.utc(timeLeft).format("HH:mm:ss"));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, workHours]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <Card className="w-full max-w-md text-center">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold mb-4">倒數計時</h1>
          <div className="mb-4">
            <Label htmlFor="startTime" className="block text-sm font-medium">上班時間</Label>
            <Input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="workHours" className="block text-sm font-medium">工作時數</Label>
            <Input
              id="workHours"
              type="number"
              value={workHours}
              onChange={(e) => setWorkHours(Number(e.target.value))}
              className="mt-1"
            />
          </div>

          <div className="flex mt-6 text-left">
            <h2 className="text-4xl font-bold">剩餘時間</h2>
            <h2 className="text-4xl font-bold">{showTime}</h2>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}
