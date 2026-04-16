using System;
using System.Collections.Generic;
using System.Text;

namespace Bl.DTOs
{
    public class DashboardDto
    {
        public decimal TotalRevenue { get; set; }
        public int TotalOrders { get; set; }
        public int TotalProducts { get; set; }
        public int TotalUsers { get; set; }

        public List<MonthlySalesDto> MonthlySales { get; set; } = new();
        public List<MonthlyOrdersDto> MonthlyOrders { get; set; } = new();
        public List<CategorySalesDto> TopCategories { get; set; } = new();
        public List<RecentOrderDto> RecentOrders { get; set; } = new();
        public List<TopProductDto> TopProducts { get; set; } = new();
    }
}
