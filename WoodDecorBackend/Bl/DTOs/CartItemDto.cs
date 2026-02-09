using System;
using System.Collections.Generic;
using System.Text;

namespace Bl.DTOs
{
    public class CartItemDto : BaseDto
    {
        public Guid ItemId { get; set; }
        public string NameAr { get; set; }
        public string NameEn { get; set; }
        public string Image { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public decimal Total { get; set; }

    }
}
