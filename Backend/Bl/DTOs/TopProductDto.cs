using System;
using System.Collections.Generic;
using System.Text;

namespace Bl.DTOs
{
    public class TopProductDto
    {
        public string NameAr { get; set; }
        public string NameEn { get; set; }
        public int TotalSold { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
    }
}
