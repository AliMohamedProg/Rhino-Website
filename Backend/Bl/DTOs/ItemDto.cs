using System;
using System.Collections.Generic;
using System.Text;

namespace Bl.DTOs
{
    public class ItemDto : BaseDto
    {
        public string Name { get; set; } = null!;

        public string MainImage { get; set; } = null!;

        public string Description { get; set; } = null!;

        public decimal Price { get; set; }
        public decimal? OldPrice { get; set; }

        public int? DiscountAmount { get; set; }
        public string Dimensions { get; set; }
        public string SKU { get; set; }
        public Guid CategoryId { get; set; }
        public Guid? TypeId { get; set; }
        public Guid? StyleId { get; set; }

        public int? OverallRating { get; set; }

        public int StockNumber { get; set; }

        public string? Colors { get; set; }
        public string? Material { get; set; }

        public List<ImageDto> Images { get; set; } = new List<ImageDto>();
        public List<ItemFabricsDto> Fabrics { get; set; } = new List<ItemFabricsDto>();

    }
}
