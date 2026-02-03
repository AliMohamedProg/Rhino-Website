using System;
using System.Collections.Generic;
using System.Text;

namespace Bl.DTOs
{
    public class ImageDto : BaseDto
    {
        public string ImageUrl { get; set; } = null!;

        public Guid ProductId { get; set; }
    }
}
