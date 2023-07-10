import { ChartContent } from "./chart";

async function getData() {
  const res = await fetch(
    "http://api.thunder.softoo.co/vis/api/dashboard/ssu/fixed"
  );
  const data = await res.json();
  return data;
}

export default async function Home() {
  const data = await getData();
  return (
    <div>
      <ChartContent apiData={data} />
    </div>
  );
}
