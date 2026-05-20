using System;
using System.Collections.Generic;

namespace Domains;

public partial class TbItem : BaseTable
{
    public string MainImage { get; set; } = null!;
    public string Name { get; set; } = null!;
    public Guid? FabricId { get; set; }
    public string Description { get; set; } = null!;
    public decimal? OldPrice { get; set; }
    public decimal Price { get; set; }
    public Guid? StyleId { get; set; }
    public string Dimensions { get; set; }
    public string SKU { get; set; }
    public int? DiscountAmount { get; set; }

    public Guid CategoryId { get; set; }
    public Guid? TypeId { get; set; }

    public int? OverallRating { get; set; }

    public int StockNumber { get; set; }
 
    public string? Colors { get; set; }
    public string? Material { get; set; }

    public virtual TbCategory Category { get; set; } = null!;
    public virtual TbTypes Type { get; set; } = null!;

    public virtual ICollection<TbImage> TbImages { get; set; } = new List<TbImage>();
    public virtual ICollection<TbItemFabrics> TbItemFabrics { get; set; } = new List<TbItemFabrics>();

    public virtual ICollection<TbOrderItem> TbOrderItems { get; set; } = new List<TbOrderItem>();
}