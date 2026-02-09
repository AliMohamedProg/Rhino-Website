using System;
using System.Collections.Generic;
using System.Text;

namespace Bl.DTOs
{
    public class CartDto : BaseDto
    {
        public List<CartItemDto> Items { get; set; }
        public decimal CartTotal { get; set; }

    }
}
