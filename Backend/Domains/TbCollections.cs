namespace Domains;

public class TbCollections: BaseTable
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

  public int? OverallRating { get; set; }

  public int StockNumber { get; set; }
  
  public int ItemsCount { get; set; }

  public string? Colors { get; set; }
  public string? Material { get; set; }

  public virtual TbCategory Category { get; set; } = null!;

  public virtual ICollection<TbChanges> TbChanges { get; set; } = new List<TbChanges>();
  public virtual ICollection<TbCollectionImages> TbCollectionImages { get; set; } = new List<TbCollectionImages>();
  public virtual ICollection<TbCollectionItems> TbCollectionItems { get; set; } = new List<TbCollectionItems>();
  public virtual ICollection<TbCollectionFabrics> TbCollectionFabrics { get; set; } = new List<TbCollectionFabrics>();

  public virtual ICollection<TbOrderCollection> TbOrderCollections { get; set; } = new List<TbOrderCollection>();
}