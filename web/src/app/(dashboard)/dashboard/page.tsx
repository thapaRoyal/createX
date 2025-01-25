"use client";

import { useUser } from "@/providers/user.context-provider";

const Dashboard = () => {
  const { user } = useUser();

  console.log(user);

  return <div>Dashboard</div>;
};

export default Dashboard;
