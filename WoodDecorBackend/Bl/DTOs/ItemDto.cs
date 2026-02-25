using System;
using System.Collections.Generic;
using System.Text;

namespace Bl.DTOs
{
    public class ItemDto : BaseDto
    {
        public string NameAr { get; set; } = null!;

        public string MainImage { get; set; } = null!;
        public string NameEn { get; set; } = null!;

        public string DescriptionAr { get; set; } = null!;

        public string DescriptionEn { get; set; } = null!;

        public decimal Price { get; set; }

        public int? DiscountAmount { get; set; }

        public Guid CategoryId { get; set; }

        public int? OverallRating { get; set; }

        public int StockNumber { get; set; }

        public string? ColorsEn { get; set; }
        public string? ColorsAr { get; set; }
        public string? MaterialEn { get; set; }
        public string? MaterialAr { get; set; }

        public List<ImageDto> Images { get; set; } = new List<ImageDto>();

    }
}
