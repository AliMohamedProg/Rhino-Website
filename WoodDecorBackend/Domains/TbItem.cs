using System;
using System.Collections.Generic;

namespace Domains;

public partial class TbItem : BaseTable
{

    public string MainImage { get; set; } = null!;
    public string NameAr { get; set; } = null!;

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

    public virtual TbCategory Category { get; set; } = null!;

    public virtual ICollection<TbImage> TbImages { get; set; } = new List<TbImage>();

    public virtual ICollection<TbOrderItem> TbOrderItems { get; set; } = new List<TbOrderItem>();
}
