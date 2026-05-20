using System;
using System.Collections.Generic;
using System.Text;

namespace Bl.DTOs
{
    public class CategoryDto : BaseDto
    {
        public string Name { get; set; } = null!;

        public string ImageUrl { get; set; } = null!;
        public int ProductsCount { get; set; }
    }
}
