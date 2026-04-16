using System;
using System.Collections.Generic;
using System.Text;

namespace Bl.DTOs
{
    public class MonthlySalesDto
    {
        public int Month { get; set; }
        public string MonthName { get; set; }
        public decimal Total { get; set; }
    }
}
