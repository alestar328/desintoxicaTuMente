import { notFound } from "next/navigation";
import { getActivityById, getCategoryById, getProviderById } from "@/lib/mock-data";
import ActivityDetailClient from "@/components/activities/ActivityDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ActivityDetailPage({ params }: Props) {
  const { id } = await params;
  const activity = getActivityById(id);
  if (!activity) notFound();

  const category = getCategoryById(activity.categoryId);
  const provider = getProviderById(activity.providerId);

  return (
    <ActivityDetailClient
      activity={activity}
      category={category}
      provider={provider}
    />
  );
}
