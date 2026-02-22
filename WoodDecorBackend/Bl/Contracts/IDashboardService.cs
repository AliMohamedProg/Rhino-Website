using System;
using System.Collections.Generic;
using System.Text;
using Bl.DTOs;

namespace Bl.Contracts
{
    public interface IDashboardService
    {
        Task<DashboardDto> GetDashboardAsync();
    }
}
