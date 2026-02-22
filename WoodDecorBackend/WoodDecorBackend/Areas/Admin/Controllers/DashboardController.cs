using Bl.Contracts;
using Bl.DTOs;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/admin/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet]
    public async Task<IActionResult> GetDashboard()
    {
        var result = new DashboardDto
        {
            TotalRevenue =  _dashboardService.GetDashboardAsync().Result.TotalRevenue,
            TotalOrders = _dashboardService.GetDashboardAsync().Result.TotalOrders,
            TotalProducts = _dashboardService.GetDashboardAsync().Result.TotalProducts,
            TotalUsers = _dashboardService.GetDashboardAsync().Result.TotalUsers,
            MonthlySales = _dashboardService.GetDashboardAsync().Result.MonthlySales,
            MonthlyOrders = _dashboardService.GetDashboardAsync().Result.MonthlyOrders,
            TopCategories = _dashboardService.GetDashboardAsync().Result.TopCategories,
            RecentOrders = _dashboardService.GetDashboardAsync().Result.RecentOrders,
            TopProducts = _dashboardService.GetDashboardAsync().Result.TopProducts
        };

        return Ok(result);
    }
}