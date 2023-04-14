"use client";
import "client-only";
import { type FC } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

interface InflationTableViewProps {
  // TODO fix the type here, it should related to decade stats
  // return from postgres - storage
  decadeStats: any[];
}

const InflationTableView: FC<InflationTableViewProps> = ({ decadeStats }) => {
  return (
    <DataTable value={decadeStats}>
      <Column field="countryName" header="Country Name" />
      <Column field="countryCode" header="Country Code" />
      <Column field="decade" header="Decade" />
      <Column field="count" header="Count" />
      <Column field="average" header="Average" />
      <Column field="max" header="Max" />
      <Column field="min" header="Min" />
      <Column field="median" header="Median" />
      <Column field="range" header="Range" />
      <Column field="stdDev" header="St. Deviation" />
      <Column field="variance" header="Variance" />
    </DataTable>
  );
};

export default InflationTableView;
