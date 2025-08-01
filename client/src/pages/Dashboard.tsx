import axios from "axios";
import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import { useNotyBlock } from "../context/NotyContext";
import { useUserInfo } from "../context/UserContext";
import LineChartV1 from "../components/line-chart";

export default function Dashboard() {
  const { handleNoty } = useNotyBlock();
  const { userInfo } = useUserInfo();

  const [mainData, setMainData] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/product/view/${userInfo.id}`)
      .then((res) => {
        const result = (res.data.data || []).map((item) => (
          {
            date: DateTime.fromISO(item.coco_taken).toFormat('yyyy-MM-dd'),
            coconut: item.old_coco + item.new_coco,
            revenue: (item.old_coco * item.old_coco_cost) + (item.new_coco * item.new_coco_cost)
          }
        ));
        setMainData(result);
      })
      .catch((err) => handleNoty(err.message || 'Error in fetching charts', 'error'))
  }, []);

  return (
    <div className="p-4">
      <h1 className="font-bold text-xl mb-4">Dashboard Overview</h1>
      <div className="shadow-md border-1 border-gray-100 rounded-sm p-4">
        <LineChartV1
          data={mainData}
          keys={['coconut', 'revenue']}
          colorCode={['#155DFC', '#E7180B']}
        />
      </div>
    </div>
  )
}