using System;
using System.Collections.Generic;
using System.Text;

namespace Bl.DTOs
{
    public class FabricsDto : BaseDto
    {
        public string Name { get; set; }

        public string ImageUrl { get; set; } = null!;

        public Guid ProductId { get; set; }
    }
}