using System;
using System.Collections.Generic;
using System.Text;

namespace Bl.DTOs
{
    public class OrderItemDto : BaseDto
    {
        public Guid ItemId { get; set; }

        public Guid OrderId { get; set; }

        public string OrderNumber { get; set; }

        public string NameEn { get; set; }
        public string NameAr { get; set; }
        public string Image { get; set; }

        public int Qty { get; set; }

        public decimal UnitPrice { get; set; }
    }
}
