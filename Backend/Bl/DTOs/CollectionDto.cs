namespace Bl.DTOs;

public class CollectionDto :BaseDto
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
    public int ItemsCount { get; set; }

    public Guid CategoryId { get; set; }

    public int? OverallRating { get; set; }

    public int StockNumber { get; set; }

    public string? Colors { get; set; }
    public string? Material { get; set; }

    public virtual List<CollectionImagesDto> CollectionImages { get; set; } = new List<CollectionImagesDto>();
    public List<ChangeDto> Changes { get; set; } = new List<ChangeDto>();
    ///////////////////// public virtual List<ItemDto> Items { get; set; } = new List<ItemDto>();
    public virtual List<CollectionFabricsDto> CollectionFabrics { get; set; } = new List<CollectionFabricsDto>();
    public virtual List<CollectionItemsDto> CollectionItems { get; set; } = new List<CollectionItemsDto>();
}