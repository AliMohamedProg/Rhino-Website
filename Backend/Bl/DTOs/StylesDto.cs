using System;
using System.Collections.Generic;
using System.Text;

namespace Bl.DTOs
{
    public class StylesDto : BaseDto
    {
        public string NameAr { get; set; } = null!;

        public string NameEn { get; set; } = null!;

        public string ImageUrl { get; set; } = null!;
        public int ProductsCount { get; set; }
    }
}
