import { getDashboardData, getResponses, getFilterOptions } from '@/actions/admin';
import { DashboardClient } from './_components/dashboard-client';

export default async function AdminDashboard({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    
    const filters = {
        utmSource: params.utmSource as string | undefined,
        region: params.region as string | undefined,
        city: params.city as string | undefined,
        deviceType: params.deviceType as string | undefined,
        dateFrom: params.dateFrom as string | undefined,
        dateTo: params.dateTo as string | undefined,
    };

    const [dashboardData, recentResponses, filterOptions] = await Promise.all([
        getDashboardData(filters),
        getResponses(),
        getFilterOptions(),
    ]);

    return (
        <DashboardClient 
            data={dashboardData}
            responses={recentResponses}
            filterOptions={filterOptions}
            currentFilters={filters}
        />
    );
}
