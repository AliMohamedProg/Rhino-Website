using System;
using System.Collections.Generic;
using System.Text;

namespace Bl.DTOs
{
    public class RecentOrderDto
    {
        public string OrderNumber { get; set; }
        public string CustomerName { get; set; }
        public decimal Total { get; set; }
        public string Status { get; set; }
        public DateTime? Date { get; set; }
    }
}
