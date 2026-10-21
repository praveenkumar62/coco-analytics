import axios from "axios";
import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import { useNotyBlock } from "../context/NotyContext";
import { useUserInfo } from "../context/UserContext";
import LineChartV1 from "../components/line-chart";
import StackedBarChartV1 from "../components/stacked-bar-chart";
// import { roundingOff } from "../components/utils";

export default function Dashboard() {
  const { handleNoty } = useNotyBlock();
  const { userInfo } = useUserInfo();

  const [revenueChart, setRevenueChart] = useState([]);
  const [stackedChart, setStackedChart] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/product/view/${userInfo.id}`)
      .then((res) => {
        const revenue = (res.data.data || []).map((item) => (
          {
            date: DateTime.fromISO(item.coco_taken).toFormat('yyyy-MM-dd'),
            coconut: item.old_coco + item.new_coco,
            revenue: (item.old_coco * item.old_coco_cost) + (item.new_coco * item.new_coco_cost)
          }
        ));
        setRevenueChart(revenue);
      })
      .catch((err) => handleNoty(err.message || 'Error in fetching charts', 'error'))

    axios.get(`${import.meta.env.VITE_API_URL}/api/product/${userInfo.id}/list/charts?groupBy=year`)
      .then((res) => {
        setStackedChart(res?.data?.data || []);
      })
      .catch((err) => handleNoty(err.message || 'Error in fetching charts', 'error'))
  }, []);

  return (
    <div className="p-4">
      <h1 className="font-bold text-xl mb-4">Dashboard Overview</h1>
      <div className="shadow-md border-1 border-gray-100 rounded-sm p-4 mb-4">
        <LineChartV1
          data={revenueChart}
          keys={['revenue']}
          colorCode={['#155DFC']}
        />
      </div>

      <div className="flex gap-4">
        <div className="shadow-md border-1 border-gray-100 rounded-sm p-4 mb-4 w-1/2">
          <StackedBarChartV1 
            data={stackedChart}
            xAxisKey="year"
            enableKeyTotal
            keys={['total_old_coco_cost', 'total_new_coco_cost']}
            colorCode={['#e2928f', '#e8aa79']}
          />
        </div>
        <div className="shadow-md border-1 border-gray-100 rounded-sm p-4 mb-4 w-1/2">
          <StackedBarChartV1 
            data={stackedChart}
            keys={['total_old_coco', 'total_new_coco']}
            xAxisKey="year"
            enableKeyTotal
            colorCode={['#a48bc2', '#a5d7d8']}
          />
        </div>
      </div>
      
    </div>
  )
}