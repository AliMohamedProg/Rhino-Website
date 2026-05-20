using System;
using System.Collections.Generic;
using System.Text;

namespace Bl.DTOs
{
    public class ReviewDto : BaseDto
    {
        public string Review { get; set; } = null!;

        public int Rating { get; set; }

        public Guid UserId { get; set; }
        public string? UserEmail { get; set; }
        public Guid ProductId { get; set; }
        public string? ProductName { get; set; }

    }
}
